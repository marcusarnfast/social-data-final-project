'use client'

import { useEffect, useRef, useState } from 'react'

import { Progress } from '~/components/ui/8bit/progress'
import { Spinner } from '~/components/ui/8bit/spinner'
import {
  setBackgroundMusicMuted,
  transitionToTrack,
} from '~/features/audio/background-music'
import { preloadStoryAssets } from '~/features/story-introduction/preload-story-assets'
import '~/components/ui/8bit/styles/retro.css'

const MIN_LOADING_MS = 10000
const HINT_ROTATE_MS = 3200
const PROGRESS_TICK_MS = 80

const RETRO_HINTS = [
  'Tip: Horizontal bar charts are easier to read with many categories.',
  'Tip: Sort bars by frequency so the biggest patterns stand out.',
  'Tip: Always label your axes. Unlabeled charts are chaos.',
  'Tip: It is okay to show top N categories instead of everything.',
  'Tip: Try logarithmic axes if a few categories dominate the counts.',
  'Tip: Remove uninformative buckets like "Other Miscellaneous".',
  'Tip: A good chart title tells the player exactly what they are seeing.',
] as const

export function LoadingFrame({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState('Preparing assets')
  const [hintIndex, setHintIndex] = useState(0)
  const assetsProgressRef = useRef(0)
  const bootStartRef = useRef(0)
  const hasFinishedAssetsRef = useRef(false)
  const isCancelledRef = useRef(false)

  useEffect(() => {
    isCancelledRef.current = false
    bootStartRef.current = Date.now()
    assetsProgressRef.current = 0
    hasFinishedAssetsRef.current = false
    setProgress(0)

    const run = async () => {
      const startedAt = Date.now()

      await preloadStoryAssets((value, nextLabel) => {
        if (isCancelledRef.current) return
        assetsProgressRef.current = value
        setLabel(nextLabel)
      }).catch((err) => {
        console.error('Failed to preload story assets', err)
      })

      if (isCancelledRef.current) return
      hasFinishedAssetsRef.current = true

      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
      if (remaining > 0) {
        setLabel('Finalizing systems')
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, remaining)
        })
      }
      setProgress(100)

      // Western is the mission bed; ensure it is not left muted by start-screen priming.
      setBackgroundMusicMuted(false)
      await transitionToTrack('western', { durationMs: 1500 })

      if (isCancelledRef.current) return
      setLabel('Launching mission')
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 450)
      })
      if (isCancelledRef.current) return
      onComplete()
    }

    const progressTimer = window.setInterval(() => {
      if (isCancelledRef.current) return

      const elapsed = Date.now() - bootStartRef.current
      const minGateProgress = Math.min(95, (elapsed / MIN_LOADING_MS) * 95)
      const assetsGateProgress = Math.min(95, assetsProgressRef.current * 0.95)
      const target = hasFinishedAssetsRef.current ? 100 : Math.max(minGateProgress, assetsGateProgress)
      setProgress((prev) => {
        if (target <= prev) return prev
        return Math.min(target, prev + 1.8)
      })
    }, PROGRESS_TICK_MS)

    const hintTimer = window.setInterval(() => {
      setHintIndex((prev) => (prev + 1) % RETRO_HINTS.length)
    }, HINT_ROTATE_MS)

    void run()

    return () => {
      isCancelledRef.current = true
      window.clearInterval(progressTimer)
      window.clearInterval(hintTimer)
    }
  }, [onComplete])

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-black px-6 text-amber-100">
      <img
        src="/images/green-earth.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover blur-md scale-110"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute right-4 top-4 z-20 text-amber-200">
        <Spinner variant="diamond" className="size-6" />
      </div>
      <div className="relative z-10 w-full max-w-xl space-y-4 px-4">
        <h2 className="retro text-center text-sm uppercase tracking-[0.22em] text-amber-300">
          Loading Mission Data
        </h2>
        <Progress value={progress} variant="retro" />
        <p className="retro text-center text-xs uppercase tracking-[0.12em] text-amber-200/90">
          {Math.round(progress)}% - {label}
        </p>
      </div>
      <p className="retro absolute bottom-4 left-4 z-20  text-xs uppercase leading-relaxed tracking-[0.12em] text-amber-100/95">
        <span className="mr-2 inline-block animate-pulse">{'>'}</span>
        {RETRO_HINTS[hintIndex]}
      </p>
    </section>
  )
}
