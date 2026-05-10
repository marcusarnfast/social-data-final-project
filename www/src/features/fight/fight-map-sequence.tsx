'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import '~/components/ui/8bit/styles/retro.css'

import { CHAPTERS, type Chapter } from '~/features/story-introduction/chapters'
import { StoryChapterModal } from '~/features/story-introduction/story-chapter-modal'
import { StoryMap } from '~/features/story-introduction/story-map'
import { StoryTimeline } from '~/features/story-introduction/story-timeline'

import { useFight, type FightGestureDelegate } from './fight-context'

const WHEEL_SENSITIVITY = 1 / 1500
const TOUCH_SENSITIVITY = 1 / 500
const PASSTHROUGH_EPSILON = 0.001
const INTRO_DISMISS_PROGRESS = 0.06
/** Progress at which the chapter info card appears + map flies to the pin. */
const CHAPTER_REVEAL_PROGRESS = 0.45

type MapExtras = {
  fightMode: 'map-explore'
  mapChapterId: string
  startDate: string
  endDate: string
}

type IntroCopy = {
  eyebrow: string
  title: string
  body: string
}

const INTRO_COPY: Record<string, IntroCopy> = {
  'russia-ukraine-war': {
    eyebrow: 'Round 1 — Replay',
    title: 'Follow the fuel',
    body: 'Trump bragged about Ukraine. Now watch what conflict does to Danish pumps. Scroll forward to walk through the years.',
  },
  'middle-east-escalation': {
    eyebrow: 'Round 2 — Replay',
    title: 'Red Sea pressure',
    body: 'Trump calls it leverage. The Middle East lights up — shipping snarls, risk premiums climb, and pumps feel it again. Scroll forward.',
  },
}

function readMapExtras(extras: Record<string, unknown> | undefined): MapExtras | null {
  if (!extras || extras.fightMode !== 'map-explore') return null
  const mapChapterId = extras.mapChapterId
  const startDate = extras.startDate
  const endDate = extras.endDate
  if (
    typeof mapChapterId !== 'string' ||
    typeof startDate !== 'string' ||
    typeof endDate !== 'string'
  ) {
    return null
  }
  return { fightMode: 'map-explore', mapChapterId, startDate, endDate }
}

function interpolateState(
  progress: number,
  startTs: number,
  endTs: number,
  chapter: Chapter | null,
): { date: Date; chapter: Chapter | null } {
  const p = Math.min(1, Math.max(0, progress))
  const ts = startTs + (endTs - startTs) * p
  const activeChapter = p + 1e-9 >= CHAPTER_REVEAL_PROGRESS ? chapter : null
  return { date: new Date(ts), chapter: activeChapter }
}

export function FightMapSequence() {
  const { scene, frameIndex, previousFrameIndex, registerGestureDelegate } = useFight()
  const mapExtras = readMapExtras(scene.extras)
  const isActive = mapExtras !== null

  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)

  const setProgressClamped = useCallback((next: number) => {
    const clamped = Math.min(1, Math.max(0, next))
    progressRef.current = clamped
    setProgress(clamped)
  }, [])

  // Forward entry → progress 0 (intro). Backward entry from later frame → 1 (end).
  // Re-runs per frame so transitioning between two map frames also resets correctly.
  useEffect(() => {
    if (!isActive) return
    if (previousFrameIndex > frameIndex) {
      setProgressClamped(1)
    } else {
      setProgressClamped(0)
    }
  }, [isActive, previousFrameIndex, frameIndex, setProgressClamped])

  useEffect(() => {
    if (!isActive) {
      registerGestureDelegate(null)
      return
    }
    const delegate: FightGestureDelegate = {
      onWheel: (deltaY) => {
        const current = progressRef.current
        const next = current + deltaY * WHEEL_SENSITIVITY
        if (next < -PASSTHROUGH_EPSILON && current <= 0) return 'pass'
        if (next > 1 + PASSTHROUGH_EPSILON && current >= 1) return 'pass'
        setProgressClamped(next)
        return 'consume'
      },
      onTouchDelta: (deltaY) => {
        const current = progressRef.current
        const next = current + deltaY * TOUCH_SENSITIVITY
        if (next < -PASSTHROUGH_EPSILON && current <= 0) return 'pass'
        if (next > 1 + PASSTHROUGH_EPSILON && current >= 1) return 'pass'
        setProgressClamped(next)
        return 'consume'
      },
      onStep: (direction) => {
        const current = progressRef.current
        if (direction === 1 && current >= 1) return 'pass'
        if (direction === -1 && current <= 0) return 'pass'
        setProgressClamped(current + direction * 0.2)
        return 'consume'
      },
    }
    registerGestureDelegate(delegate)
    return () => registerGestureDelegate(null)
  }, [isActive, registerGestureDelegate, setProgressClamped])

  const chapter = useMemo<Chapter | null>(() => {
    if (!mapExtras) return null
    return CHAPTERS.find((c) => c.id === mapExtras.mapChapterId) ?? null
  }, [mapExtras])

  const startTs = useMemo(
    () => (mapExtras ? new Date(`${mapExtras.startDate}T00:00:00Z`).getTime() : 0),
    [mapExtras],
  )
  const endTs = useMemo(
    () => (mapExtras ? new Date(`${mapExtras.endDate}T00:00:00Z`).getTime() : 0),
    [mapExtras],
  )

  const { date, chapter: activeChapter } = useMemo(
    () => interpolateState(progress, startTs, endTs, chapter),
    [progress, startTs, endTs, chapter],
  )

  const intro = mapExtras ? INTRO_COPY[mapExtras.mapChapterId] ?? null : null
  const showIntro = isActive && progress < INTRO_DISMISS_PROGRESS && intro !== null

  if (!isActive || !mapExtras) return null

  return (
    <div className="absolute inset-0 z-30">
      <div className="absolute inset-0 grid grid-rows-[1fr_minmax(120px,30%)] overflow-hidden bg-black">
        <div className="relative min-h-0">
          <StoryMap currentDate={date} activeChapter={activeChapter} />
          <StoryChapterModal chapter={activeChapter} variant="retro" />
          <ProgressBar progress={progress} />
        </div>
        <div className="min-h-0 border-t-[6px] border-amber-200">
          <StoryTimeline currentDate={date} variant="retro" />
        </div>
      </div>

      <AnimatePresence>{showIntro && intro ? <IntroOverlay {...intro} /> : null}</AnimatePresence>
    </div>
  )
}

function IntroOverlay({ eyebrow, title, body }: IntroCopy) {
  return (
    <motion.div
      key="fight-map-intro"
      className="pointer-events-none absolute inset-0 z-40 grid place-items-center bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 6, transition: { duration: 0.2 } }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="retro relative w-[min(34rem,86cqw)] border-[6px] border-amber-200 bg-emerald-950/95 px-6 py-6 text-amber-100 shadow-[8px_8px_0_0_rgba(0,0,0,0.9)]"
      >
        <p className="mb-3 text-[8px] uppercase tracking-[0.28em] text-emerald-300">{eyebrow}</p>
        <h2 className="mb-3 text-[14px] leading-normal text-amber-200">{title}</h2>
        <p className="text-[10px] leading-[1.7] tracking-[0.04em] text-amber-100">{body}</p>
        <p className="mt-5 animate-pulse text-[8px] uppercase tracking-[0.28em] text-emerald-300">
          Scroll to continue ▾
        </p>
      </motion.div>
    </motion.div>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="retro pointer-events-none absolute left-5 bottom-4 z-20 flex items-center gap-[6px]">
      <span className="text-[8px] uppercase tracking-[0.22em] text-amber-200">
        {(progress * 100).toFixed(0)}%
      </span>
      <div className="relative h-[10px] w-[140px] border-2 border-amber-200 bg-black">
        <div
          className="absolute inset-y-0 left-0 bg-amber-300 transition-[width] duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
