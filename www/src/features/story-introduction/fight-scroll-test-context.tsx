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
  FIGHT_SCROLL_TEST_SCENE_STORE,
  type FightScrollTestFrameDefinition,
  type FightScrollTestSceneBackground,
  type FightScrollTestSceneStore,
} from './fight-scroll-test-scene-store'

/** Total frames — always matches `FIGHT_SCROLL_TEST_SCENE_STORE.frames.length`. */
export const FIGHT_SCROLL_TEST_FRAME_COUNT = FIGHT_SCROLL_TEST_SCENE_STORE.frames.length

export type FightScrollTestSlice = FightScrollTestSceneStore & Readonly<{ frameIndex: number }>

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

/** Jump to frame inside the internal snap scroller. */
export function programmaticFightScrollToFrame(scroller: HTMLElement, frameIndex: number) {
  scrollScrollerToFrame(scroller, frameIndex, FIGHT_SCROLL_TEST_SCENE_STORE.frames.length)
}

const KEYBOARD_NAV_BLOCK_SELECTOR =
  'input:not([type=hidden]), textarea, select, [contenteditable="true"], [contenteditable="plaintext-only"], [role="combobox"], [role="searchbox"], [role="slider"]'

function isKeyboardBlockedTarget(target: EventTarget | null): boolean {
  return Boolean(target instanceof Element && target.closest(KEYBOARD_NAV_BLOCK_SELECTOR))
}

export type FightScrollTestContextValue = {
  /** Mounted on the overflow snap scroller (`h-dvh`, `snap-y mandatory`). */
  sectionRef: RefObject<HTMLElement | null>
  store: FightScrollTestSceneStore
  frameIndex: number
  activeStep: number
  frameCount: number
  scene: FightScrollTestFrameDefinition
  background: FightScrollTestSceneBackground
  sceneSlice: FightScrollTestSlice
  captions: ReadonlyArray<string>

  normalizedFrameProgress: number
  /** @deprecated Prefer `scene.caption`; kept for gradual refactors */
  actionLabel: string
  /** @deprecated Prefer `captions` / store */
  actions: ReadonlyArray<string>
}

const FightScrollTestContext = createContext<FightScrollTestContextValue | null>(null)

export function FightScrollTestProvider({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [frameIndex, setFrameIndex] = useState(0)
  const frameCount = FIGHT_SCROLL_TEST_SCENE_STORE.frames.length
  // Internal target ("intent") — the canonical frame index. Public `frameIndex` mirrors this.
  // Scroll-position readback is suppressed while a programmatic smooth-scroll is in flight,
  // so the readback can't overwrite the target with intermediate values during animation.
  const targetFrameRef = useRef(0)
  const programmaticLockUntilRef = useRef(0)

  const commitFrame = useCallback(
    (nextFrameIndex: number) => {
      const scroller = sectionRef.current
      if (!scroller) return
      const clamped = clampFrameIndex(nextFrameIndex, frameCount)
      if (clamped === targetFrameRef.current) return
      targetFrameRef.current = clamped
      setFrameIndex(clamped)
      programmaticLockUntilRef.current = performance.now() + PROGRAMMATIC_SCROLL_LOCK_MS
      scrollScrollerToFrame(scroller, clamped, frameCount, 'smooth')
    },
    [frameCount],
  )

  const stepFrame = useCallback(
    (delta: -1 | 1) => commitFrame(targetFrameRef.current + delta),
    [commitFrame],
  )

  // Sync scroller to target on mount + on resize. Readback only updates state when no
  // programmatic scroll is in flight (so flick/drag scrolls still settle the frame index).
  useLayoutEffect(() => {
    const scroller = sectionRef.current
    if (!scroller) return

    scrollScrollerToFrame(scroller, targetFrameRef.current, frameCount, 'auto')

    const onScroll = () => {
      if (performance.now() < programmaticLockUntilRef.current) return
      const next = readScrollerFrameIndex(scroller, frameCount)
      if (next === targetFrameRef.current) return
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

  // Wheel: gesture-locked one-step-per-gesture. Prevents native scroll so a single tick
  // (or trackpad gesture) advances exactly one frame regardless of deltaY magnitude.
  useEffect(() => {
    const scroller = sectionRef.current
    if (!scroller) return

    let gestureLocked = false
    let idleTimer: number | null = null

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented) return
      if (Math.abs(e.deltaY) < WHEEL_DELTA_THRESHOLD) {
        e.preventDefault()
        return
      }
      e.preventDefault()

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

  // Touch: one swipe = one frame.
  useEffect(() => {
    const scroller = sectionRef.current
    if (!scroller) return

    let startY: number | null = null
    let consumed = false

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startY = e.touches[0].clientY
      consumed = false
    }

    const onTouchMove = (e: TouchEvent) => {
      if (startY === null || consumed) return
      const dy = e.touches[0].clientY - startY
      if (Math.abs(dy) < TOUCH_SWIPE_THRESHOLD_PX) return
      consumed = true
      stepFrame(dy < 0 ? 1 : -1)
    }

    const onTouchEnd = () => {
      startY = null
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
      if (isKeyboardBlockedTarget(e.target)) return
      if (e.altKey || e.ctrlKey || e.metaKey) return

      const key = e.key
      if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'PageDown' && key !== 'PageUp') return

      e.preventDefault()

      if (key === 'ArrowDown' || key === 'PageDown') stepFrame(1)
      else stepFrame(-1)
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [stepFrame])

  const value = useMemo<FightScrollTestContextValue>(() => {
    const captions = FIGHT_SCROLL_TEST_SCENE_STORE.frames.map((f) => f.caption)
    const scene = FIGHT_SCROLL_TEST_SCENE_STORE.frames[frameIndex] ?? FIGHT_SCROLL_TEST_SCENE_STORE.frames[0]
    const last = Math.max(0, frameCount - 1)
    const normalizedFrameProgress = last === 0 ? 0 : frameIndex / last

    return {
      sectionRef,
      store: FIGHT_SCROLL_TEST_SCENE_STORE,
      frameIndex,
      activeStep: frameIndex + 1,
      frameCount,
      scene,
      background: FIGHT_SCROLL_TEST_SCENE_STORE.background,
      sceneSlice: { ...FIGHT_SCROLL_TEST_SCENE_STORE, frameIndex },
      captions,

      normalizedFrameProgress,
      actionLabel: scene.caption,
      actions: captions,
    }
  }, [frameCount, frameIndex])

  return <FightScrollTestContext.Provider value={value}>{children}</FightScrollTestContext.Provider>
}

export function useFightScrollTest(): FightScrollTestContextValue {
  const ctx = useContext(FightScrollTestContext)
  if (!ctx) {
    throw new Error('useFightScrollTest must be used within FightScrollTestProvider')
  }
  return ctx
}
