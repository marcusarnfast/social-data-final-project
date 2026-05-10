'use client'

import { useEffect, useState } from 'react'

import '~/components/ui/8bit/styles/retro.css'

import {
  getBackgroundMusicMuted,
  toggleBackgroundMusicMuted,
} from '~/features/audio/background-music'

export function FightMusicToggle() {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    setMuted(getBackgroundMusicMuted())
  }, [])

  return (
    <button
      type="button"
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      aria-pressed={muted}
      onClick={() => setMuted(toggleBackgroundMusicMuted())}
      className="retro pointer-events-auto absolute right-3 top-3 z-50 inline-flex size-9 items-center justify-center border-2 border-amber-400/85 bg-black/75 text-amber-200 shadow-[2px_2px_0_0_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:right-4 sm:top-4"
    >
      <span aria-hidden className="text-base leading-none">
        {muted ? '🔇' : '🔊'}
      </span>
    </button>
  )
}
