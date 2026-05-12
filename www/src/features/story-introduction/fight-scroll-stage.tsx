'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { Card, CardContent } from '~/components/ui/8bit/card'
import { setBackgroundMusicGain } from '~/features/audio/background-music'
import { playFightCue, stopFightSfx } from '~/features/audio/fight-sfx'

import { STORY_END, STORY_START } from './chapters'
import { FIGHT_BEATS, getChapterById, getFightBeatByProgress } from './fight-script'
import { FightHud } from './fight-hud'
import { FULL_NARRATIVE_IMAGE_URL } from './preload-story-assets'
import { RoundBanner } from './round-banner'
import { SpeechBubbleCard } from './speech-bubble-card'
import { StoryChapterModal } from './story-chapter-modal'
import { StoryMap } from './story-map'
import { StoryTimeline } from './story-timeline'

function progressToDate(progress: number): Date {
  const totalMs = STORY_END.getTime() - STORY_START.getTime()
  return new Date(STORY_START.getTime() + Math.max(0, Math.min(1, progress)) * totalMs)
}

function getBeatWindowProgress(progress: number, range: [number, number]) {
  const span = Math.max(0.0001, range[1] - range[0])
  return Math.max(0, Math.min(1, (progress - range[0]) / span))
}

function getEdgeFade(windowProgress: number) {
  if (windowProgress < 0.18) return windowProgress / 0.18
  if (windowProgress > 0.82) return (1 - windowProgress) / 0.18
  return 1
}

const MISSILES = [
  { left: '12%', delay: '0ms', duration: '1400ms' },
  { left: '26%', delay: '220ms', duration: '1700ms' },
  { left: '41%', delay: '80ms', duration: '1300ms' },
  { left: '57%', delay: '300ms', duration: '1600ms' },
  { left: '71%', delay: '140ms', duration: '1450ms' },
  { left: '86%', delay: '360ms', duration: '1750ms' },
] as const

export function FightScrollStage({ onComplete }: { onComplete: () => void }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)
  const beat = getFightBeatByProgress(progress)
  const chapter = getChapterById(beat.mapChapterId)
  const currentDate = chapter?.time ?? progressToDate(progress)
  const lastBeatIdRef = useRef<string | null>(null)
  const didFinishRef = useRef(false)

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtmlSnap = html.style.scrollSnapType
    const prevBodySnap = body.style.scrollSnapType
    const prevHtmlBehavior = html.style.scrollBehavior

    html.style.scrollSnapType = 'y mandatory'
    body.style.scrollSnapType = 'y mandatory'
    html.style.scrollBehavior = 'smooth'

    return () => {
      html.style.scrollSnapType = prevHtmlSnap
      body.style.scrollSnapType = prevBodySnap
      html.style.scrollBehavior = prevHtmlBehavior
    }
  }, [])

  useEffect(() => {
    const readProgress = () => {
      const section = sectionRef.current
      if (!section) return

      const top = section.offsetTop
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
      const raw = (window.scrollY - top) / scrollable
      setProgress(Math.max(0, Math.min(1, raw)))
    }

    readProgress()
    window.addEventListener('scroll', readProgress, { passive: true })
    window.addEventListener('resize', readProgress)
    return () => {
      window.removeEventListener('scroll', readProgress)
      window.removeEventListener('resize', readProgress)
    }
  }, [])

  useEffect(() => {
    if (lastBeatIdRef.current === beat.id) return
    lastBeatIdRef.current = beat.id

    void Promise.all(
      beat.audioCues.map((cue) =>
        playFightCue(cue.src, {
          volume: cue.volume ?? 1,
          duckMusicTo: beat.label === 'dialogue' ? 0.55 : undefined,
        }),
      ),
    )
  }, [beat])

  useEffect(() => {
    if (beat.label !== 'dialogue') {
      setBackgroundMusicGain(1)
    }
  }, [beat.label])

  useEffect(() => {
    if (didFinishRef.current) return
    if (progress < 0.999) return
    didFinishRef.current = true
    stopFightSfx()
    setBackgroundMusicGain(1)
    onComplete()
  }, [onComplete, progress])

  useEffect(() => {
    return () => {
      stopFightSfx()
      setBackgroundMusicGain(1)
    }
  }, [])

  const isMapBeat = beat.label === 'map-checkpoint'
  const showMissiles = beat.label === 'missile-barrage'
  const beatWindowProgress = getBeatWindowProgress(progress, beat.range)
  const mapOpacity = isMapBeat ? 0.1 + getEdgeFade(beatWindowProgress) * 0.9 : 0
  const beatIndex = FIGHT_BEATS.findIndex((item) => item.id === beat.id)
  const nextBeat = beatIndex >= 0 ? FIGHT_BEATS[beatIndex + 1] ?? null : null
  const remainingToNext = nextBeat
    ? Math.max(0, nextBeat.range[0] - progress)
    : Math.max(0, 1 - progress)
  const headerText = useMemo(() => {
    if (beat.label === 'finish') return 'Scroll into the green transition'
    return `Round ${beat.round} storyline`
  }, [beat.label, beat.round])

  return (
    <section ref={sectionRef} className="relative w-full bg-black text-amber-100">
      <div className="sticky top-0 h-svh overflow-hidden">
        <img
          src={FULL_NARRATIVE_IMAGE_URL}
          alt="Storyline artwork from conflict to green transition"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `50% ${beat.focusY}%` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/45 to-black/75" />

        <div className="pointer-events-none absolute inset-y-0 left-2 z-20 hidden items-end pb-28 lg:flex">
          <img
            src="/fight/greta-thunberg.gif"
            alt="Greta Thunberg fighter"
            className="pixelated h-[48vh] w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.7)]"
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-2 z-20 hidden items-end pb-28 lg:flex">
          <img
            src="/fight/donald-trump.gif"
            alt="Donald Trump fighter"
            className="pixelated h-[48vh] w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.7)]"
          />
        </div>

        <FightHud snapshot={beat.snapshot} />

        <div className="absolute left-1/2 top-24 z-30 -translate-x-1/2">
          <Card className="bg-black/80">
            <CardContent className="px-4 py-2 text-center">
              <p className="retro text-[11px] uppercase tracking-[0.22em] text-amber-200">
                Fight {beat.round} / 3
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-none border border-amber-400/70 bg-black/70 p-2 lg:block">
          <ol className="space-y-2">
            {FIGHT_BEATS.map((item, index) => {
              const active = item.id === beat.id
              return (
                <li key={item.id} className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 border ${
                      active ? 'border-amber-100 bg-amber-300' : 'border-amber-500/70 bg-transparent'
                    }`}
                  />
                  <span className={`retro text-[8px] uppercase tracking-[0.14em] ${active ? 'text-amber-100' : 'text-amber-400/75'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="absolute inset-x-6 top-40 z-30 flex justify-center">
          {beat.label === 'round-banner' ? <RoundBanner round={beat.round} subtitle={beat.subtitle} /> : null}
          {beat.speaker && beat.bubble ? <SpeechBubbleCard speaker={beat.speaker} text={beat.bubble} /> : null}
        </div>

        <div className="absolute bottom-6 left-1/2 z-30 w-[min(92vw,980px)] -translate-x-1/2">
          <Card className="bg-black/80">
            <CardContent className="space-y-2 p-3 text-center">
              <p className="retro text-[10px] uppercase tracking-[0.22em] text-amber-300">{headerText}</p>
              <p className="retro text-[10px] uppercase tracking-[0.14em] text-amber-100/85">{beat.subtitle}</p>
              <p className="retro text-[9px] uppercase tracking-[0.16em] text-amber-100/70">
                Scroll {(progress * 100).toFixed(0)}%
              </p>
              <div className="h-2 w-full overflow-hidden border border-amber-500/70 bg-black/60">
                <div className="h-full bg-amber-300 transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
              </div>
              <p className="retro text-[9px] uppercase tracking-[0.16em] text-amber-200/80">
                {nextBeat ? `Next checkpoint in ${(remainingToNext * 100).toFixed(0)}% scroll` : 'Entering green transition'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          className="absolute inset-0 z-15 grid grid-rows-[1fr_32%] transition-opacity duration-500"
          style={{ opacity: mapOpacity }}
          aria-hidden={!isMapBeat}
        >
          <div className="relative min-h-0 overflow-hidden">
            <StoryMap currentDate={currentDate} activeChapter={chapter} />
            <StoryChapterModal chapter={chapter} />
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </div>
          <div className="relative min-h-0 h-full overflow-visible border-t border-amber-500/45 bg-black/65">
            <StoryTimeline currentDate={currentDate} />
          </div>
        </div>

        {showMissiles ? (
          <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
            {MISSILES.map((missile, index) => (
              <span
                key={index}
                className="absolute top-[-10%] text-2xl"
                style={{
                  left: missile.left,
                  animationName: 'missileFall',
                  animationDuration: missile.duration,
                  animationDelay: missile.delay,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                }}
              >
                🚀
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div aria-hidden className="relative z-0">
        {FIGHT_BEATS.slice(1).map((item) => (
          <div key={item.id} className="h-svh snap-start" />
        ))}
      </div>

      <style>{`
        @keyframes missileFall {
          0% {
            transform: translate3d(-20px, -10%, 0) rotate(20deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate3d(40px, 130vh, 0) rotate(20deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
