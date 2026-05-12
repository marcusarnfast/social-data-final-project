'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

import {
  getActiveBackgroundTrackId,
  playTrack,
  setBackgroundMusicMuted,
  stopBackgroundMusic,
} from '~/features/audio/background-music'
import { playFightCue, stopAllFightSfx, stopFightSfx } from '~/features/audio/fight-sfx'

import { useFight } from './fight-context'
import { FIGHT_SCENE_STORE, type FightFrameDefinition } from './fight-scene-store'

export function FightAudioController() {
  const { frameIndex } = useFight()
  const lastMusicRef = useRef<string | null | undefined>(undefined)
  const cueRunIdRef = useRef(0)

  useLayoutEffect(() => {
    // Cut terminal / menu loop so it cannot bleed into the fight — but keep western
    // continuous from the loading screen onto the VS intro (same track, no replay gap).
    if (getActiveBackgroundTrackId() === 'western') return
    stopBackgroundMusic()
  }, [])

  useEffect(() => {
    const scene = (FIGHT_SCENE_STORE.frames[frameIndex] ??
      FIGHT_SCENE_STORE.frames[0]) as FightFrameDefinition

    // Frame 0 (VS intro): always (re)start western. A scroll readback race can bump
    // `frameIndex` before the first effect run so `scene.music` was never applied;
    // `lastMusicRef` can also block when returning to frame 0. Priming may leave BGM muted.
    if (frameIndex === 0) {
      setBackgroundMusicMuted(false)
      lastMusicRef.current = 'western'
      void playTrack('western')
    } else {
      const music = scene.music
      if (music !== undefined && music !== lastMusicRef.current) {
        lastMusicRef.current = music
        if (music === null) {
          stopBackgroundMusic()
        } else {
          void playTrack(music)
        }
      }
    }

    const cues = scene.cues ?? []
    const timers: Array<number> = []
    const runId = ++cueRunIdRef.current
    for (const cue of cues) {
      const delay = Math.max(0, cue.delayMs ?? 0)
      const id = window.setTimeout(() => {
        if (runId !== cueRunIdRef.current) return
        void playFightCue(cue.src, {
          volume: cue.volume ?? 1,
          continuePastFrame: cue.continuePastFrame === true,
        })
      }, delay)
      timers.push(id)
    }

    return () => {
      for (const id of timers) window.clearTimeout(id)
      stopFightSfx()
    }
  }, [frameIndex])

  useEffect(() => {
    return () => {
      stopAllFightSfx()
      stopBackgroundMusic()
    }
  }, [])

  return null
}
