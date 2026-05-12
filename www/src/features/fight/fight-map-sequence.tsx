'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import '~/components/ui/8bit/styles/retro.css'

import { CHAPTERS } from '~/features/story-introduction/chapters'
import type { Chapter } from '~/features/story-introduction/chapters'
import { MapConflictLegend } from '~/features/story-introduction/map-conflict-legend'
import { MapDataAvailabilityDialog } from '~/features/story-introduction/map-data-availability-dialog'
import { StoryChapterModal } from '~/features/story-introduction/story-chapter-modal'
import { StoryMap } from '~/features/story-introduction/story-map'
import { StoryTimeline } from '~/features/story-introduction/story-timeline'

import { useFight } from './fight-context'
import type { FightGestureDelegate } from './fight-context'

const WHEEL_SENSITIVITY = 1 / 1500
const TOUCH_SENSITIVITY = 1 / 500
const PASSTHROUGH_EPSILON = 0.001
/** Calendar spans longer than this get weaker progress-per-wheel so years don't rush by. */
const MS_PER_DAY = 86_400_000
const MAP_SCROLL_REFERENCE_MS = Math.round(2.5 * 365.25 * MS_PER_DAY)
const INTRO_DISMISS_PROGRESS = 0.06
/** Default: chapter card + map pin when scroll progress crosses this (non–Russia/Ukraine maps). */
const CHAPTER_REVEAL_PROGRESS = 0.45
/** Russia/Ukraine map: chapter dialog when timeline reaches this instant (6 months before full invasion). */
const UKRAINE_CHAPTER_DIALOG_REVEAL_MS = Date.UTC(2021, 7, 24)

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
  'us-iran-war': {
    eyebrow: 'Round 3 — Replay',
    title: 'Strait shock',
    body: 'Missiles, Hormuz, and a brutal squeeze on oil. Scroll forward to see how the timeline prices the risk into Danish fuel.',
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
  mapChapterId: string | null,
): { date: Date; chapter: Chapter | null } {
  const p = Math.min(1, Math.max(0, progress))
  const ts = startTs + (endTs - startTs) * p

  let showChapter = false
  if (chapter) {
    if (mapChapterId === 'russia-ukraine-war') {
      showChapter = ts + 1e-9 >= UKRAINE_CHAPTER_DIALOG_REVEAL_MS
    } else {
      showChapter = p + 1e-9 >= CHAPTER_REVEAL_PROGRESS
    }
  }

  return { date: new Date(ts), chapter: showChapter ? chapter : null }
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

  const spanMs = Math.max(1, endTs - startTs)
  /** Long timelines (e.g. Round 1 map) need more scroll per % progress than short windows. */
  const scrollSpanScale = Math.min(1, MAP_SCROLL_REFERENCE_MS / spanMs)

  useEffect(() => {
    if (!isActive) {
      registerGestureDelegate(null)
      return
    }
    const delegate: FightGestureDelegate = {
      onWheel: (deltaY) => {
        const current = progressRef.current
        const next = current + deltaY * WHEEL_SENSITIVITY * scrollSpanScale
        if (next < -PASSTHROUGH_EPSILON && current <= 0) return 'pass'
        if (next > 1 + PASSTHROUGH_EPSILON && current >= 1) return 'pass'
        setProgressClamped(next)
        return 'consume'
      },
      onTouchDelta: (deltaY) => {
        const current = progressRef.current
        const next = current + deltaY * TOUCH_SENSITIVITY * scrollSpanScale
        if (next < -PASSTHROUGH_EPSILON && current <= 0) return 'pass'
        if (next > 1 + PASSTHROUGH_EPSILON && current >= 1) return 'pass'
        setProgressClamped(next)
        return 'consume'
      },
      onStep: (direction) => {
        const current = progressRef.current
        if (direction === 1 && current >= 1) return 'pass'
        if (direction === -1 && current <= 0) return 'pass'
        setProgressClamped(current + direction * 0.2 * scrollSpanScale)
        return 'consume'
      },
    }
    registerGestureDelegate(delegate)
    return () => registerGestureDelegate(null)
  }, [isActive, registerGestureDelegate, scrollSpanScale, setProgressClamped])

  const { date, chapter: activeChapter } = useMemo(
    () => interpolateState(progress, startTs, endTs, chapter, mapExtras?.mapChapterId ?? null),
    [progress, startTs, endTs, chapter, mapExtras?.mapChapterId],
  )

  const intro = mapExtras ? INTRO_COPY[mapExtras.mapChapterId] ?? null : null
  const showIntro = isActive && progress < INTRO_DISMISS_PROGRESS && intro !== null

  if (!isActive) return null

  return (
    <div className="absolute inset-0 z-30">
      <div className="absolute inset-0 grid grid-rows-[1fr_minmax(120px,30%)] bg-black">
        <div className="relative min-h-0 overflow-hidden">
          <StoryMap
            currentDate={date}
            activeChapter={activeChapter}
            exploreCameraProgress={chapter ? progress : undefined}
            exploreCameraAnchor={chapter ?? undefined}
          />
          <StoryChapterModal chapter={activeChapter} variant="retro" />
          <MapDataAvailabilityDialog variant="retro" />
          <FightMapHud progress={progress} />
        </div>
        <div className="relative min-h-0 h-full overflow-visible border-t-[6px] border-amber-200">
          <StoryTimeline currentDate={date} variant="retro" />
        </div>
      </div>

      <AnimatePresence>{showIntro ? <IntroOverlay {...intro} /> : null}</AnimatePresence>
    </div>
  )
}

function FightMapHud({ progress }: { progress: number }) {
  return (
    <div className="pointer-events-none absolute left-4 top-4 z-20 flex max-h-[min(48vh,calc(100%-5.5rem))] max-w-[min(240px,46vw)] flex-col gap-2 sm:left-5 sm:top-4">
      <div className="retro flex shrink-0 items-center gap-[6px]">
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
      <div className="min-h-0 shrink overflow-y-auto pr-0.5">
        <MapConflictLegend />
      </div>
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

