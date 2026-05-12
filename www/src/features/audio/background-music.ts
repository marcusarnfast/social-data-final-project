'use client'

const TRACKS = {
  'street-fighter': '/music/super-street-fighter-ii-turbo-arcade-music-ryu-stage-cps2.mp3',
  western: '/music/western.mp3',
  happy: '/music/happy.mp3',
  elon: '/music/elon.mp3',
} as const

type TrackId = keyof typeof TRACKS
type TrackState = { id: TrackId; audio: HTMLAudioElement }

const BASE_VOLUME = 0.35
let backgroundMusicGain = 1

let backgroundMusicMuted = false
let hasPrimedAutoplay = false
let hasUserInteracted = false
let activeTrack: TrackState | null = null
let transitionToken = 0
/** Incoming track during `transitionToTrack` — not yet assigned to `activeTrack`; must be silenced on interrupt. */
let crossfadeIncoming: HTMLAudioElement | null = null

function silenceCrossfadeIncoming() {
  if (!crossfadeIncoming) return
  crossfadeIncoming.pause()
  crossfadeIncoming.currentTime = 0
  crossfadeIncoming = null
}

function getEffectiveVolume() {
  return BASE_VOLUME * backgroundMusicGain
}

function ensureTrack(id: TrackId): TrackState {
  if (activeTrack?.id === id) {
    activeTrack.audio.muted = backgroundMusicMuted
    return activeTrack
  }

  const audio = new Audio(TRACKS[id])
  audio.loop = true
  audio.volume = getEffectiveVolume()
  audio.muted = backgroundMusicMuted
  return { id, audio }
}

export async function playTrack(id: TrackId) {
  if (activeTrack?.id === id) {
    activeTrack.audio.muted = backgroundMusicMuted
    activeTrack.audio.volume = getEffectiveVolume()
    await activeTrack.audio.play().catch(() => {
      // Ignore playback errors from restrictive browser policies.
    })
    return
  }

  transitionToken += 1
  silenceCrossfadeIncoming()
  if (activeTrack) {
    activeTrack.audio.pause()
    activeTrack.audio.currentTime = 0
  }
  activeTrack = null

  const track = ensureTrack(id)
  activeTrack = track
  track.audio.volume = getEffectiveVolume()

  await track.audio.play().catch(() => {
    // Ignore playback errors from restrictive browser policies.
  })
}

export function stopBackgroundMusic() {
  transitionToken += 1
  silenceCrossfadeIncoming()
  if (!activeTrack) return
  activeTrack.audio.pause()
  activeTrack.audio.currentTime = 0
  activeTrack = null
}

/** Used to avoid cutting the western handoff when entering the fight VS intro. */
export function getActiveBackgroundTrackId(): TrackId | null {
  return activeTrack?.id ?? null
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

  transitionToken += 1
  silenceCrossfadeIncoming()

  const next = ensureTrack(id)
  crossfadeIncoming = next.audio
  next.audio.volume = 0
  next.audio.currentTime = 0
  next.audio.muted = backgroundMusicMuted

  await next.audio.play().catch(() => {
    // Ignore playback errors from restrictive browser policies.
  })

  const token = ++transitionToken
  const startedAt = Date.now()

  const tick = () => {
    if (token !== transitionToken) {
      next.audio.pause()
      next.audio.currentTime = 0
      if (crossfadeIncoming === next.audio) {
        crossfadeIncoming = null
      }
      return
    }

    const elapsed = Date.now() - startedAt
    const progress = Math.min(1, elapsed / durationMs)

    const effectiveVolume = getEffectiveVolume()
    current.audio.volume = effectiveVolume * (1 - progress)
    next.audio.volume = effectiveVolume * progress

    if (progress < 1) {
      window.requestAnimationFrame(tick)
      return
    }

    current.audio.pause()
    current.audio.currentTime = 0
    activeTrack = next
    if (crossfadeIncoming === next.audio) {
      crossfadeIncoming = null
    }
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

export function setBackgroundMusicGain(nextGain: number) {
  backgroundMusicGain = Math.min(1, Math.max(0, nextGain))
  if (activeTrack) {
    activeTrack.audio.volume = getEffectiveVolume()
  }
}
