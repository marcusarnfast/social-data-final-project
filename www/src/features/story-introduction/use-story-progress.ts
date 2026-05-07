import { useScroll, useMotionValueEvent } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'

import { CHAPTERS, STORY_END, STORY_START, type Chapter } from './chapters'

const TOTAL_MS = STORY_END.getTime() - STORY_START.getTime()
const DAY_MS = 24 * 60 * 60 * 1000

function progressToDate(progress: number): Date {
  const clamped = Math.min(1, Math.max(0, progress))
  return new Date(STORY_START.getTime() + clamped * TOTAL_MS)
}

export function dateToProgress(date: Date): number {
  return (date.getTime() - STORY_START.getTime()) / TOTAL_MS
}

function findActiveChapter(date: Date): Chapter | null {
  for (const chapter of CHAPTERS) {
    const halfWindow = chapter.windowDays * DAY_MS
    const start = chapter.time.getTime() - halfWindow
    const end = chapter.time.getTime() + halfWindow
    const t = date.getTime()
    if (t >= start && t <= end) return chapter
  }
  return null
}

export type StoryProgress = {
  containerRef: RefObject<HTMLDivElement | null>
  progress: number
  currentDate: Date
  activeChapter: Chapter | null
}

type UseStoryProgressOptions = {
  containerRef?: RefObject<HTMLDivElement | null>
  enabled?: boolean
}

export function useStoryProgress(options?: UseStoryProgressOptions): StoryProgress {
  const fallbackRef = useRef<HTMLDivElement | null>(null)
  const enabled = options?.enabled ?? true
  const containerRef = options?.containerRef ?? fallbackRef
  const [hasHydratedTarget, setHasHydratedTarget] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setHasHydratedTarget(false)
      return
    }

    const raf = window.requestAnimationFrame(() => {
      setHasHydratedTarget(Boolean(containerRef.current))
    })
    return () => window.cancelAnimationFrame(raf)
  }, [containerRef, enabled])

  const scrollOptions =
    enabled && hasHydratedTarget
      ? {
          target: containerRef,
          offset: ['start start', 'end end'] as Array<'start start' | 'end end'>,
        }
      : undefined

  const { scrollYProgress } = useScroll(scrollOptions)

  const [progress, setProgress] = useState(0)
  const [currentDate, setCurrentDate] = useState<Date>(STORY_START)
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!enabled) return
    setProgress(value)
    const next = progressToDate(value)
    setCurrentDate(next)
    const chapter = findActiveChapter(next)
    setActiveChapterId((prev) => (prev === (chapter?.id ?? null) ? prev : (chapter?.id ?? null)))
  })

  const activeChapter = useMemo(
    () => CHAPTERS.find((c) => c.id === activeChapterId) ?? null,
    [activeChapterId],
  )

  return { containerRef, progress, currentDate, activeChapter }
}
