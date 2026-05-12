'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

import { CHAPTERS, STORY_END, STORY_START } from './chapters'
import type { Chapter } from './chapters'
import { Fight } from '~/features/fight/fight'
import { FULL_NARRATIVE_IMAGE_URL } from './preload-story-assets'
import { StoryChapterModal } from './story-chapter-modal'
import { MapDataAvailabilityDialog } from './map-data-availability-dialog'
import { StoryMap } from './story-map'
import { StoryTimeline } from './story-timeline'
import { VehiclePanel } from './vehicle-panel'
import {
  MAP_ENTER_PROGRESS,
  MAP_PANEL_EXIT_PROGRESS,
  MAP_REENTER_PROGRESS,
  MAP_RETURN_SCROLL_PROGRESS,
  VEHICLE_ENTER_PROGRESS,
  VEHICLE_PANEL_EXIT_PROGRESS,
  VEHICLE_REENTER_PROGRESS,
  VEHICLE_RETURN_SCROLL_PROGRESS,
} from './story-thresholds'
import { useStoryPhaseStore } from '~/stores/story-phase-store'

const TOTAL_STORY_MS = STORY_END.getTime() - STORY_START.getTime()

function progressToDate(progress: number): Date {
  const clamped = Math.min(1, Math.max(0, progress))
  return new Date(STORY_START.getTime() + clamped * TOTAL_STORY_MS)
}

function findActiveChapter(date: Date): Chapter | null {
  const dayMs = 24 * 60 * 60 * 1000
  for (const chapter of CHAPTERS) {
    const halfWindow = chapter.windowDays * dayMs
    const start = chapter.time.getTime() - halfWindow
    const end = chapter.time.getTime() + halfWindow
    const t = date.getTime()
    if (t >= start && t <= end) return chapter
  }
  return null
}

function getScrollProgress(node: HTMLElement): number {
  const max = Math.max(1, node.scrollHeight - node.clientHeight)
  return Math.min(1, Math.max(0, node.scrollTop / max))
}

export function StoryIntroductionFrame() {
  const storyMode = useStoryPhaseStore((state) => state.storyMode)
  const mapCompleted = useStoryPhaseStore((state) => state.mapCompleted)
  const vehicleCompleted = useStoryPhaseStore((state) => state.vehicleCompleted)
  const completeFightIntro = useStoryPhaseStore((state) => state.completeFightIntro)
  const enterMapPanel = useStoryPhaseStore((state) => state.enterMapPanel)
  const enterVehiclePanel = useStoryPhaseStore((state) => state.enterVehiclePanel)
  const returnFromMapPanel = useStoryPhaseStore((state) => state.returnFromMapPanel)
  const returnFromVehiclePanel = useStoryPhaseStore((state) => state.returnFromVehiclePanel)

  const narrativeRef = useRef<HTMLElement | null>(null)
  const mapGateRef = useRef<HTMLDivElement | null>(null)
  const vehicleGateRef = useRef<HTMLDivElement | null>(null)
  const mapScrollRef = useRef<HTMLDivElement | null>(null)
  const vehicleScrollRef = useRef<HTMLDivElement | null>(null)
  const [mapProgress, setMapProgress] = useState(0)
  const [mapCurrentDate, setMapCurrentDate] = useState(STORY_START)
  const [mapActiveChapter, setMapActiveChapter] = useState<Chapter | null>(null)
  const [vehicleProgress, setVehicleProgress] = useState(0)
  const mapDidCompleteRef = useRef(false)
  const vehicleDidCompleteRef = useRef(false)
  const handleFightComplete = useCallback(() => {
    completeFightIntro()
  }, [completeFightIntro])

  const scrollNarrativeToProgress = useCallback((progress: number) => {
    const section = narrativeRef.current
    if (!section) return

    const clamped = Math.min(1, Math.max(0, progress))
    const sectionTop = section.offsetTop
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
    window.scrollTo({
      top: sectionTop + scrollable * clamped,
      behavior: 'auto',
    })
  }, [])

  const handleMapComplete = useCallback(() => {
    if (mapDidCompleteRef.current) return
    mapDidCompleteRef.current = true
    returnFromMapPanel()
    window.requestAnimationFrame(() => {
      scrollNarrativeToProgress(MAP_RETURN_SCROLL_PROGRESS)
    })
  }, [returnFromMapPanel, scrollNarrativeToProgress])

  const handleVehicleComplete = useCallback(() => {
    if (vehicleDidCompleteRef.current) return
    vehicleDidCompleteRef.current = true
    returnFromVehiclePanel()
    window.requestAnimationFrame(() => {
      scrollNarrativeToProgress(VEHICLE_RETURN_SCROLL_PROGRESS)
    })
  }, [returnFromVehiclePanel, scrollNarrativeToProgress])

  useEffect(() => {
    if (storyMode !== 'map-panel') return
    mapDidCompleteRef.current = false
    const node = mapScrollRef.current
    if (!node) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const progress = getScrollProgress(node)
        setMapProgress(progress)

        const nextDate = progressToDate(progress)
        setMapCurrentDate(nextDate)
        setMapActiveChapter(findActiveChapter(nextDate))

        if (progress >= MAP_PANEL_EXIT_PROGRESS) {
          handleMapComplete()
        }
      })
    }

    onScroll()
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      node.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [handleMapComplete, storyMode])

  useEffect(() => {
    if (storyMode !== 'vehicle-panel') return
    vehicleDidCompleteRef.current = false
    const node = vehicleScrollRef.current
    if (!node) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const progress = getScrollProgress(node)
        setVehicleProgress(progress)
        if (progress >= VEHICLE_PANEL_EXIT_PROGRESS) {
          handleVehicleComplete()
        }
      })
    }

    onScroll()
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      node.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [handleVehicleComplete, storyMode])

  useEffect(() => {
    const shouldLockRootScroll = storyMode === 'map-panel' || storyMode === 'vehicle-panel'
    const previousOverflow = document.body.style.overflow
    const previousOverscroll = document.body.style.overscrollBehaviorY
    document.body.style.overflow = shouldLockRootScroll ? 'hidden' : ''
    document.body.style.overscrollBehaviorY = shouldLockRootScroll ? 'none' : ''

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.overscrollBehaviorY = previousOverscroll
    }
  }, [storyMode])

  useEffect(() => {
    const readNarrativeProgress = () => {
      const section = narrativeRef.current
      if (!section) return 0

      const sectionTop = section.offsetTop
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
      const raw = (window.scrollY - sectionTop) / scrollable
      return Math.min(1, Math.max(0, raw))
    }

    const hasCrossed = (ref: HTMLDivElement | null): boolean => {
      if (!ref) return false
      return ref.getBoundingClientRect().top <= window.innerHeight * 0.5
    }

    const handleScroll = () => {
      const progress = readNarrativeProgress()

      if (storyMode !== 'narrative-scroll') return

      const mapGateCrossed = hasCrossed(mapGateRef.current)
      const vehicleGateCrossed = hasCrossed(vehicleGateRef.current)

      if ((!mapCompleted && progress >= MAP_ENTER_PROGRESS && mapGateCrossed) || (mapCompleted && progress <= MAP_REENTER_PROGRESS)) {
        enterMapPanel()
        return
      }

      if (
        (!vehicleCompleted && progress >= VEHICLE_ENTER_PROGRESS && vehicleGateCrossed) ||
        (vehicleCompleted && progress <= VEHICLE_REENTER_PROGRESS)
      ) {
        enterVehiclePanel()
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [enterMapPanel, enterVehiclePanel, mapCompleted, storyMode, vehicleCompleted])

  if (storyMode === 'fight-intro') {
    return <Fight onComplete={handleFightComplete} />
  }

  return (
    <main className="relative w-full bg-black text-amber-100">
      <section ref={narrativeRef} className="relative w-full">
        <img
          src={FULL_NARRATIVE_IMAGE_URL}
          alt="Narrative artwork showing geopolitical conflict and climate transition"
          className="block w-full h-auto"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200/90">
            Scroll to advance narrative
          </p>
        </div>
        <div
          ref={mapGateRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{ top: `${MAP_ENTER_PROGRESS * 100}%` }}
        />
        <div
          ref={vehicleGateRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{ top: `${VEHICLE_ENTER_PROGRESS * 100}%` }}
        />
      </section>

      {storyMode === 'map-panel' ? (
        <MapPanelOverlay
          containerRef={mapScrollRef}
          progress={mapProgress}
          currentDate={mapCurrentDate}
          activeChapter={mapActiveChapter}
        />
      ) : null}

      {storyMode === 'vehicle-panel' ? (
        <VehiclePanelOverlay containerRef={vehicleScrollRef} progress={vehicleProgress} />
      ) : null}
    </main>
  )
}

function MapPanelOverlay({
  containerRef,
  progress,
  currentDate,
  activeChapter,
}: {
  containerRef: RefObject<HTMLDivElement | null>
  progress: number
  currentDate: Date
  activeChapter: Chapter | null
}) {
  return (
    <section className="fixed inset-0 z-40 bg-black text-amber-100">
      <div ref={containerRef} className="h-full overflow-y-auto overscroll-contain">
        <section
          className="relative w-full bg-black text-amber-100"
          style={{ minHeight: '800vh' }}
          aria-label="Map panel: scroll to finish and return to story"
        >
          <div className="sticky top-0 grid h-svh w-full grid-rows-[1fr_minmax(180px,28%)] bg-black text-amber-100">
            <div className="relative min-h-0 overflow-hidden">
              <StoryMap currentDate={currentDate} activeChapter={activeChapter} />
              <StoryChapterModal chapter={activeChapter} />
              <MapDataAvailabilityDialog variant="default" />
              <ScrollHint />
              <ChapterRail activeChapterId={activeChapter?.id ?? null} />
              <div className="absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300/80">
                map {(progress * 100).toFixed(0)}%
              </div>
            </div>
            <div className="relative min-h-0 h-full overflow-visible border-t border-amber-500/40">
              <StoryTimeline currentDate={currentDate} />
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

function VehiclePanelOverlay({
  containerRef,
  progress,
}: {
  containerRef: RefObject<HTMLDivElement | null>
  progress: number
}) {
  return (
    <section className="fixed inset-0 z-40 bg-black text-amber-100">
      <div ref={containerRef} className="h-full overflow-y-auto overscroll-contain">
        <VehiclePanel progress={progress} />
      </div>
    </section>
  )
}

function ScrollHint() {
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/70">
      scroll to advance &darr;
    </div>
  )
}

function ChapterRail({ activeChapterId }: { activeChapterId: string | null }) {
  return (
    <ol className="pointer-events-none absolute left-6 top-6 z-10 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300/70">
      {CHAPTERS.map((chapter, index) => {
        const isActive = chapter.id === activeChapterId
        return (
          <li
            key={chapter.id}
            className={
              isActive
                ? 'flex items-center gap-2 text-amber-200'
                : 'flex items-center gap-2 opacity-50'
            }
          >
            <span className={isActive ? 'text-red-400' : 'text-amber-500/50'}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>
              {chapter.time.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' })}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
