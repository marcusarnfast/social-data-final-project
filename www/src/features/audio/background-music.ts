'use client'

const BACKGROUND_MUSIC_PATH = '/music/super-street-fighter-ii-turbo-arcade-music-ryu-stage-cps2.mp3'

let backgroundMusic: HTMLAudioElement | null = null
let backgroundMusicMuted = false
let hasPrimedAutoplay = false

function ensureBackgroundMusic() {
  if (!backgroundMusic) {
    backgroundMusic = new Audio(BACKGROUND_MUSIC_PATH)
    backgroundMusic.loop = true
    backgroundMusic.volume = 0.35
  }

  backgroundMusic.muted = backgroundMusicMuted
  return backgroundMusic
}

export function startBackgroundMusic() {
  const audio = ensureBackgroundMusic()
  void audio.play().catch(() => {
    // Ignore playback errors from restrictive browser policies.
  })
}

export function primeBackgroundMusicForAutoplay() {
  const audio = ensureBackgroundMusic()

  if (!hasPrimedAutoplay) {
    // Browsers generally allow autoplay only when media is muted.
    backgroundMusicMuted = true
    audio.muted = true
    hasPrimedAutoplay = true
  }

  void audio.play().catch(() => {
    // Ignore playback errors from restrictive browser policies.
  })
}

export function toggleBackgroundMusicMuted() {
  backgroundMusicMuted = !backgroundMusicMuted
  if (backgroundMusic) {
    backgroundMusic.muted = backgroundMusicMuted
  }

  return backgroundMusicMuted
}

export function getBackgroundMusicMuted() {
  return backgroundMusicMuted
}
