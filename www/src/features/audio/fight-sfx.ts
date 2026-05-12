'use client'

import { setBackgroundMusicGain } from './background-music'

type CueOptions = {
  volume?: number
  duckMusicTo?: number
  /** When true, clip is not stopped by `stopFightSfx()` (frame changes); stops on end or `stopAllFightSfx()`. */
  continuePastFrame?: boolean
}

const activeSfx = new Set<HTMLAudioElement>()
const persistingSfx = new Set<HTMLAudioElement>()
let duckToken = 0

export function stopFightSfx() {
  for (const audio of activeSfx) {
    audio.pause()
    audio.currentTime = 0
  }
  activeSfx.clear()
}

/** Stops one-shot and persisting fight clips (e.g. fight scene teardown). */
export function stopAllFightSfx() {
  stopFightSfx()
  for (const audio of persistingSfx) {
    audio.pause()
    audio.currentTime = 0
  }
  persistingSfx.clear()
}

export async function playFightCue(src: string, options: CueOptions = {}) {
  const { volume = 1, duckMusicTo, continuePastFrame } = options
  const clip = new Audio(src)
  clip.volume = Math.min(1, Math.max(0, volume))
  clip.preload = 'auto'

  const token = ++duckToken
  if (typeof duckMusicTo === 'number') {
    setBackgroundMusicGain(Math.min(1, Math.max(0, duckMusicTo)))
  }

  const bucket = continuePastFrame ? persistingSfx : activeSfx
  bucket.add(clip)
  const clear = () => {
    bucket.delete(clip)
    if (typeof duckMusicTo === 'number' && token === duckToken) {
      setBackgroundMusicGain(1)
    }
  }

  clip.addEventListener('ended', clear, { once: true })
  clip.addEventListener('error', clear, { once: true })

  await clip.play().catch(() => {
    clear()
  })

  return clip
}
