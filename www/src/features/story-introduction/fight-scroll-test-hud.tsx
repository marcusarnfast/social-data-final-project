'use client'

import { useEffect, useState } from 'react'

import '~/components/ui/8bit/styles/retro.css'

import { useFightScrollTest } from './fight-scroll-test-context'

const SCROLL_HINT_DWELL_MS = 5000

export function FightScrollTestHud() {
  const { activeStep, frameCount, frameIndex } = useFightScrollTest()
  const isLast = activeStep >= frameCount
  const [showScrollHint, setShowScrollHint] = useState(frameIndex === 0)

  useEffect(() => {
    if (isLast) {
      setShowScrollHint(false)
      return
    }

    if (frameIndex === 0) {
      setShowScrollHint(true)
      return
    }

    setShowScrollHint(false)
    const id = window.setTimeout(() => setShowScrollHint(true), SCROLL_HINT_DWELL_MS)
    return () => window.clearTimeout(id)
  }, [frameIndex, isLast])

  return (
    <>
      <div
        className="pointer-events-none absolute bottom-4 right-4 z-40 sm:bottom-5 sm:right-5"
        aria-live="polite"
      >
        <div className="retro border-2 border-amber-500/85 bg-black/75 px-2 py-1.5 text-amber-100 shadow-[2px_2px_0_0_rgba(0,0,0,0.45)]">
          <p className="text-[10px] tabular-nums leading-none tracking-[0.12em] text-amber-200">
            {activeStep} / {frameCount}
          </p>
        </div>
      </div>

      {showScrollHint ? (
        <div
          className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2 sm:bottom-5"
          aria-hidden
        >
          <div className="retro flex items-center gap-1 text-[8px] uppercase leading-none tracking-[0.2em] text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <span className="inline-block translate-y-px motion-safe:animate-bounce">↓</span>
            <span className="motion-safe:animate-pulse">scroll</span>
          </div>
        </div>
      ) : null}
    </>
  )
}
