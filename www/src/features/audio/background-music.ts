'use client'

const TRACKS = {
  'street-fighter': '/music/super-street-fighter-ii-turbo-arcade-music-ryu-stage-cps2.mp3',
  western: '/music/western.mp3',
} as const

type TrackId = keyof typeof TRACKS
type TrackState = { id: TrackId; audio: HTMLAudioElement }

const BASE_VOLUME = 0.35

let backgroundMusicMuted = false
let hasPrimedAutoplay = false
let hasUserInteracted = false
let activeTrack: TrackState | null = null
let transitionToken = 0

function ensureTrack(id: TrackId): TrackState {
  if (activeTrack?.id === id) {
    activeTrack.audio.muted = backgroundMusicMuted
    return activeTrack
  }

  const audio = new Audio(TRACKS[id])
  audio.loop = true
  audio.volume = BASE_VOLUME
  audio.muted = backgroundMusicMuted
  return { id, audio }
}

export async function playTrack(id: TrackId) {
  const track = ensureTrack(id)
  activeTrack = track
  track.audio.volume = BASE_VOLUME

  await track.audio.play().catch(() => {
    // Ignore playback errors from restrictive browser policies.
  })
}

export async function transitionToTrack(
  id: TrackId,
  options: {
    durationMs?: number
  } = {},
) {
  const durationMs = options.durationMs ?? 1500
  const current = activeTrack

  if (!current) {
    await playTrack(id)
    return
  }

  if (current.id === id) {
    return
  }

  const next = ensureTrack(id)
  next.audio.volume = 0
  next.audio.currentTime = 0
  next.audio.muted = backgroundMusicMuted

  await next.audio.play().catch(() => {
    // Ignore playback errors from restrictive browser policies.
  })

  const token = ++transitionToken
  const startedAt = Date.now()

  const tick = () => {
    if (token !== transitionToken) return

    const elapsed = Date.now() - startedAt
    const progress = Math.min(1, elapsed / durationMs)

    current.audio.volume = BASE_VOLUME * (1 - progress)
    next.audio.volume = BASE_VOLUME * progress

    if (progress < 1) {
      window.requestAnimationFrame(tick)
      return
    }

    current.audio.pause()
    current.audio.currentTime = 0
    activeTrack = next
  }

  window.requestAnimationFrame(tick)
}

export async function primeCurrentTrackForAutoplay() {
  if (hasUserInteracted) return

  const target = activeTrack ?? ensureTrack('street-fighter')
  activeTrack = target

  if (!hasPrimedAutoplay) {
    // Browsers generally allow autoplay only when media is muted.
    backgroundMusicMuted = true
    target.audio.muted = true
    hasPrimedAutoplay = true
  }

  await target.audio.play().catch(() => {
    // Ignore playback errors from restrictive browser policies.
  })
}

export function toggleBackgroundMusicMuted() {
  backgroundMusicMuted = !backgroundMusicMuted
  if (activeTrack) {
    activeTrack.audio.muted = backgroundMusicMuted
  }

  return backgroundMusicMuted
}

export function getBackgroundMusicMuted() {
  return backgroundMusicMuted
}

export function markBackgroundMusicInteracted() {
  hasUserInteracted = true
}

export function getBackgroundMusicInteracted() {
  return hasUserInteracted
}

export function setBackgroundMusicMuted(nextMuted: boolean) {
  backgroundMusicMuted = nextMuted
  if (activeTrack) {
    activeTrack.audio.muted = nextMuted
  }
}
