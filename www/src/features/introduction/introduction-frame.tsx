'use client'

import { useCallback, useEffect, useState } from 'react'

import { Button } from '~/components/ui/8bit/button'
import {
  getBackgroundMusicMuted,
  primeBackgroundMusicForAutoplay,
  toggleBackgroundMusicMuted,
} from '~/features/audio/background-music'
import { useStoryPhaseStore } from '~/stores/story-phase-store'

export function StartScreenFrame() {
  const nextPhase = useStoryPhaseStore((state) => state.nextPhase)
  const [isMuted, setIsMuted] = useState(() => getBackgroundMusicMuted())

  const handleStart = useCallback(() => {
    nextPhase()
  }, [nextPhase])

  useEffect(() => {
    primeBackgroundMusicForAutoplay()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return
      event.preventDefault()
      handleStart()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleStart])

  return (
    <section
      className="intro-scene relative min-h-svh w-full overflow-hidden bg-black"
      aria-label="Start screen section"
    >
      <img
        src="/start-screen/background.PNG"
        alt=""
        aria-hidden
        className="pixelated absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      <img
        src="/start-screen/trump.png"
        alt="Trump character"
        className="intro-character intro-character-left pixelated absolute bottom-0 left-0 z-10 w-[50vw] max-w-[900px] min-w-[440px]"
      />

      <img
        src="/start-screen/greta.png"
        alt="Greta character"
        className="intro-character intro-character-right pixelated absolute bottom-0 right-0 z-10 w-[50vw] max-w-[900px] min-w-[440px]"
      />

      <div className="pointer-events-none absolute inset-x-0 top-[3vh] z-20 flex items-center justify-center px-6">
        <img
          src="/start-screen/new-game.png"
          alt="New game"
          className="pixelated intro-new-game w-[min(68vw,560px)]"
        />
      </div>

      <div className="absolute right-4 top-4 z-40">
        <Button
          type="button"
          font="retro"
          variant="secondary"
          onClick={() => setIsMuted(toggleBackgroundMusicMuted())}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      </div>

      <div className="absolute inset-x-0 bottom-[14vh] z-30 flex items-center justify-center px-6">
        <Button type="button" font="retro" onClick={handleStart} aria-label="Start">
          Start
        </Button>
      </div>
    </section>
  )
}
