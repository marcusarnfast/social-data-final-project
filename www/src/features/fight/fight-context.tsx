'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

import {
  FIGHT_SCENE_STORE,
  type FightFrameDefinition,
  type FightSceneBackground,
  type FightSceneStore,
} from './fight-scene-store'

/** Total frames — always matches `FIGHT_SCENE_STORE.frames.length`. */
export const FIGHT_FRAME_COUNT = FIGHT_SCENE_STORE.frames.length

export type FightSlice = FightSceneStore & Readonly<{ frameIndex: number }>

const WHEEL_GESTURE_IDLE_MS = 180
const WHEEL_DELTA_THRESHOLD = 6
const TOUCH_SWIPE_THRESHOLD_PX = 40
const PROGRAMMATIC_SCROLL_LOCK_MS = 700

function measureStepPx(scroller: HTMLElement): number {
  const h = scroller.clientHeight
  if (h > 0) return Math.max(1, h)
  const rail = scroller.querySelector<HTMLElement>('[data-fight-scroll-rail]')
  return Math.max(1, rail?.offsetHeight ?? 1)
}

function readScrollerFrameIndex(scroller: HTMLElement, frameCount: number): number {
  const step = measureStepPx(scroller)
  const nearest = Math.round(scroller.scrollTop / step)
  return Math.min(frameCount - 1, Math.max(0, nearest))
}

function clampFrameIndex(frameIndex: number, frameCount: number): number {
  return Math.min(frameCount - 1, Math.max(0, frameIndex))
}

function scrollScrollerToFrame(
  scroller: HTMLElement,
  frameIndex: number,
  frameCount: number,
  behavior: ScrollBehavior = 'smooth',
) {
  const step = measureStepPx(scroller)
  const clamped = clampFrameIndex(frameIndex, frameCount)
  scroller.scrollTo({ top: clamped * step, behavior })
}

const KEYBOARD_NAV_BLOCK_SELECTOR =
  'input:not([type=hidden]), textarea, select, [contenteditable="true"], [contenteditable="plaintext-only"], [role="combobox"], [role="searchbox"], [role="slider"]'

function isKeyboardBlockedTarget(target: EventTarget | null): boolean {
  return Boolean(target instanceof Element && target.closest(KEYBOARD_NAV_BLOCK_SELECTOR))
}

/**
 * Frame-level gesture delegate. A child mounted on a given frame can register
 * a delegate to capture wheel/touch/key intent before the outer scroller advances.
 * Returning `'consume'` swallows the gesture; returning `'pass'` lets the outer
 * frame stepper handle it normally.
 *
 * - `onStep` runs for keyboard arrows / completed wheel gestures (one discrete tick).
 * - `onWheel` runs for raw wheel deltas; if defined it bypasses the wheel idle-lock
 *   so the child can implement a smooth scrub. Return `'pass'` to let the outer
 *   frame stepper take over (e.g. when the child has reached its end and wants to
 *   advance to the next frame).
 * - `onTouchDelta` mirrors `onWheel` for finger drags.
 */
export type FightGestureResult = 'consume' | 'pass'
export type FightGestureDelegate = {
  onStep?: (direction: 1 | -1) => FightGestureResult
  onWheel?: (deltaY: number) => FightGestureResult
  onTouchDelta?: (deltaY: number) => FightGestureResult
}

export type FightContextValue = {
  sectionRef: RefObject<HTMLElement | null>
  store: FightSceneStore
  frameIndex: number
  previousFrameIndex: number
  activeStep: number
  frameCount: number
  scene: FightFrameDefinition
  background: FightSceneBackground
  sceneSlice: FightSlice
  captions: ReadonlyArray<string>
  normalizedFrameProgress: number
  registerGestureDelegate: (delegate: FightGestureDelegate | null) => void
}

const FightContext = createContext<FightContextValue | null>(null)

type FightProviderProps = {
  children: ReactNode
  /** Fires once when the player reaches the final fight frame (after background end). */
  onComplete?: () => void
}

export function FightProvider({ children, onComplete }: FightProviderProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const didFireCompleteRef = useRef(false)
  const [frameIndex, setFrameIndex] = useState(0)
  const [previousFrameIndex, setPreviousFrameIndex] = useState(0)
  const frameCount = FIGHT_SCENE_STORE.frames.length
  // Internal target ("intent") — the canonical frame index. Public `frameIndex` mirrors this.
  // Scroll-position readback is suppressed while a programmatic smooth-scroll is in flight,
  // so the readback can't overwrite the target with intermediate values during animation.
  const targetFrameRef = useRef(0)
  const programmaticLockUntilRef = useRef(0)
  const gestureDelegateRef = useRef<FightGestureDelegate | null>(null)

  const registerGestureDelegate = useCallback((delegate: FightGestureDelegate | null) => {
    gestureDelegateRef.current = delegate
  }, [])

  const commitFrame = useCallback(
    (nextFrameIndex: number) => {
      const scroller = sectionRef.current
      if (!scroller) return
      const clamped = clampFrameIndex(nextFrameIndex, frameCount)
      if (clamped === targetFrameRef.current) return
      setPreviousFrameIndex(targetFrameRef.current)
      targetFrameRef.current = clamped
      setFrameIndex(clamped)
      programmaticLockUntilRef.current = performance.now() + PROGRAMMATIC_SCROLL_LOCK_MS
      scrollScrollerToFrame(scroller, clamped, frameCount, 'smooth')
    },
    [frameCount],
  )

  const stepFrame = useCallback(
    (delta: -1 | 1) => {
      const delegate = gestureDelegateRef.current
      if (delegate?.onStep && delegate.onStep(delta) === 'consume') return
      commitFrame(targetFrameRef.current + delta)
    },
    [commitFrame],
  )

  useLayoutEffect(() => {
    const scroller = sectionRef.current
    if (!scroller) return

    scrollScrollerToFrame(scroller, targetFrameRef.current, frameCount, 'auto')

    const onScroll = () => {
      if (performance.now() < programmaticLockUntilRef.current) return
      const step = measureStepPx(scroller)
      const maxScroll = (frameCount - 1) * step
      if (scroller.scrollTop > maxScroll + 0.5) {
        scroller.scrollTop = maxScroll
      }
      const next = readScrollerFrameIndex(scroller, frameCount)
      if (next === targetFrameRef.current) return
      setPreviousFrameIndex(targetFrameRef.current)
      targetFrameRef.current = next
      setFrameIndex(next)
    }

    const onResize = () => {
      programmaticLockUntilRef.current = performance.now() + PROGRAMMATIC_SCROLL_LOCK_MS
      scrollScrollerToFrame(scroller, targetFrameRef.current, frameCount, 'auto')
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })

    let ro: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize)
      ro.observe(scroller)
    }

    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)

    return () => {
      scroller.removeEventListener('scroll', onScroll)
      ro?.disconnect()
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [frameCount])

  useEffect(() => {
    const scroller = sectionRef.current
    if (!scroller) return

    let gestureLocked = false
    let idleTimer: number | null = null

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented) return
      e.preventDefault()

      if (e.deltaY > 0 && targetFrameRef.current >= frameCount - 1) {
        return
      }

      // Smooth-scroll delegate (e.g. map sequence) consumes raw wheel deltas
      // and bypasses the discrete idle-lock used by frame stepping.
      const delegate = gestureDelegateRef.current
      if (delegate?.onWheel) {
        if (delegate.onWheel(e.deltaY) === 'consume') return
      }

      if (Math.abs(e.deltaY) < WHEEL_DELTA_THRESHOLD) return

      if (!gestureLocked) {
        gestureLocked = true
        stepFrame(e.deltaY > 0 ? 1 : -1)
      }

      if (idleTimer !== null) window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        gestureLocked = false
        idleTimer = null
      }, WHEEL_GESTURE_IDLE_MS)
    }

    scroller.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      scroller.removeEventListener('wheel', onWheel)
      if (idleTimer !== null) window.clearTimeout(idleTimer)
    }
  }, [stepFrame])

  useEffect(() => {
    const scroller = sectionRef.current
    if (!scroller) return

    let startY: number | null = null
    let lastY: number | null = null
    let consumed = false

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startY = e.touches[0].clientY
      lastY = startY
      consumed = false
    }

    const onTouchMove = (e: TouchEvent) => {
      if (startY === null) return

      const currentY = e.touches[0].clientY
      const incremental = lastY === null ? 0 : lastY - currentY
      lastY = currentY

      // If a smooth-scroll delegate exists (map sequence), feed it raw deltas.
      const delegate = gestureDelegateRef.current
      if (delegate?.onTouchDelta && incremental !== 0) {
        if (delegate.onTouchDelta(incremental) === 'consume') return
      }

      if (consumed) return
      const dy = currentY - startY
      if (Math.abs(dy) < TOUCH_SWIPE_THRESHOLD_PX) return
      if (dy < 0 && targetFrameRef.current >= frameCount - 1) return
      consumed = true
      stepFrame(dy < 0 ? 1 : -1)
    }

    const onTouchEnd = () => {
      startY = null
      lastY = null
      consumed = false
    }

    scroller.addEventListener('touchstart', onTouchStart, { passive: true })
    scroller.addEventListener('touchmove', onTouchMove, { passive: true })
    scroller.addEventListener('touchend', onTouchEnd, { passive: true })
    scroller.addEventListener('touchcancel', onTouchEnd, { passive: true })
    return () => {
      scroller.removeEventListener('touchstart', onTouchStart)
      scroller.removeEventListener('touchmove', onTouchMove)
      scroller.removeEventListener('touchend', onTouchEnd)
      scroller.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [stepFrame])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented) return
      if (e.target instanceof Element && e.target.closest('[data-slot="dialog-content"]')) return
      if (isKeyboardBlockedTarget(e.target)) return
      if (e.altKey || e.ctrlKey || e.metaKey) return

      const key = e.key
      if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'PageDown' && key !== 'PageUp') return

      e.preventDefault()

      if ((key === 'ArrowDown' || key === 'PageDown') && targetFrameRef.current >= frameCount - 1) {
        return
      }
      if (key === 'ArrowDown' || key === 'PageDown') stepFrame(1)
      else stepFrame(-1)
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [stepFrame])

  const value = useMemo<FightContextValue>(() => {
    const captions = FIGHT_SCENE_STORE.frames.map((f) => f.caption)
    const scene = FIGHT_SCENE_STORE.frames[frameIndex] ?? FIGHT_SCENE_STORE.frames[0]
    const last = Math.max(0, frameCount - 1)
    const normalizedFrameProgress = last === 0 ? 0 : frameIndex / last

    return {
      sectionRef,
      store: FIGHT_SCENE_STORE,
      frameIndex,
      previousFrameIndex,
      activeStep: frameIndex + 1,
      frameCount,
      scene,
      background: FIGHT_SCENE_STORE.background,
      sceneSlice: { ...FIGHT_SCENE_STORE, frameIndex },
      captions,
      normalizedFrameProgress,
      registerGestureDelegate,
    }
  }, [frameCount, frameIndex, previousFrameIndex, registerGestureDelegate])

  useEffect(() => {
    const cb = onCompleteRef.current
    if (!cb) return
    if (frameIndex < frameCount - 1) return
    if (didFireCompleteRef.current) return
    didFireCompleteRef.current = true
    cb()
  }, [frameCount, frameIndex])

  return <FightContext.Provider value={value}>{children}</FightContext.Provider>
}

export function useFight(): FightContextValue {
  const ctx = useContext(FightContext)
  if (!ctx) {
    throw new Error('useFight must be used within FightProvider')
  }
  return ctx
}
