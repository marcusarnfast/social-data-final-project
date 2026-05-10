'use client'

import { useEffect, useRef } from 'react'

import {
  playTrack,
  stopBackgroundMusic,
} from '~/features/audio/background-music'
import { playFightCue, stopFightSfx } from '~/features/audio/fight-sfx'

import { useFight } from './fight-context'

export function FightAudioController() {
  const { scene, frameIndex } = useFight()
  const lastMusicRef = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    const music = scene.music
    if (music !== undefined && music !== lastMusicRef.current) {
      lastMusicRef.current = music
      if (music === null) {
        stopBackgroundMusic()
      } else {
        void playTrack(music)
      }
    }

    const cues = scene.cues ?? []
    const timers: Array<number> = []
    for (const cue of cues) {
      const delay = Math.max(0, cue.delayMs ?? 0)
      const id = window.setTimeout(() => {
        void playFightCue(cue.src, { volume: cue.volume ?? 1 })
      }, delay)
      timers.push(id)
    }

    return () => {
      for (const id of timers) window.clearTimeout(id)
      stopFightSfx()
    }
  }, [scene, frameIndex])

  useEffect(() => {
    return () => {
      stopFightSfx()
      stopBackgroundMusic()
    }
  }, [])

  return null
}
