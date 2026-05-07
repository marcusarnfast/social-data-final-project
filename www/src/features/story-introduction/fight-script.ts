import { CHAPTERS } from './chapters'

export type FighterStats = {
  health: number
  mood: number
}

export type FightSnapshot = {
  greta: FighterStats
  trump: FighterStats
}

export type FightSpeaker = 'greta' | 'trump'

export type FightAudioCue = {
  id: string
  src: string
  volume?: number
}

export type FightBeat = {
  id: string
  range: [number, number]
  round: 1 | 2 | 3
  label: 'round-banner' | 'dialogue' | 'map-checkpoint' | 'missile-barrage' | 'post-fight' | 'finish'
  speaker?: FightSpeaker
  bubble?: string
  subtitle?: string
  audioCues: ReadonlyArray<FightAudioCue>
  snapshot: FightSnapshot
  mapChapterId?: string
  focusY: number
}

export const INITIAL_SNAPSHOT: FightSnapshot = {
  greta: { health: 100, mood: 100 },
  trump: { health: 100, mood: 0 },
}

export const FIGHT_BEATS: ReadonlyArray<FightBeat> = [
  {
    id: 'round-1-banner',
    range: [0, 0.08],
    round: 1,
    label: 'round-banner',
    subtitle: 'The drop begins. Oil drips down the timeline.',
    audioCues: [
      { id: 'round', src: '/fight/round.mp3', volume: 0.75 },
      { id: 'one', src: '/fight/1.mp3', volume: 0.75 },
      { id: 'fight', src: '/fight/fight.mp3', volume: 0.8 },
    ],
    snapshot: INITIAL_SNAPSHOT,
    focusY: 10,
  },
  {
    id: 'round-1-greta',
    range: [0.08, 0.16],
    round: 1,
    label: 'dialogue',
    speaker: 'greta',
    bubble: 'How dare you!',
    subtitle: 'Greta opens with outrage.',
    audioCues: [{ id: 'how-dare-you', src: '/fight/how-dare-you.mp3', volume: 1 }],
    snapshot: INITIAL_SNAPSHOT,
    focusY: 12,
  },
  {
    id: 'round-1-trump-huh',
    range: [0.16, 0.24],
    round: 1,
    label: 'dialogue',
    speaker: 'trump',
    bubble: 'Huh.',
    subtitle: 'Trump shrugs and winds up.',
    audioCues: [],
    snapshot: INITIAL_SNAPSHOT,
    focusY: 14,
  },
  {
    id: 'round-1-trump-swing',
    range: [0.24, 0.34],
    round: 1,
    label: 'dialogue',
    speaker: 'trump',
    bubble:
      "The Ukraine thing? Easy. I told Vladimir, 'Do what you want, just keep the gas flowing to my friends.'",
    subtitle: 'First punch lands with an energy shock.',
    audioCues: [
      { id: 'huh-throw', src: '/fight/huh-throw.mp3', volume: 1 },
      { id: 'genius', src: '/fight/putin-called-me-a-genius.mp3', volume: 0.95 },
    ],
    snapshot: {
      greta: { health: 85, mood: 76 },
      trump: { health: 100, mood: 22 },
    },
    focusY: 16,
  },
  {
    id: 'round-1-map-ukraine',
    range: [0.34, 0.44],
    round: 1,
    label: 'map-checkpoint',
    subtitle: 'Checkpoint 1: Zoom to Ukraine and track impact.',
    audioCues: [],
    snapshot: {
      greta: { health: 62, mood: 42 },
      trump: { health: 100, mood: 45 },
    },
    mapChapterId: 'russia-ukraine-war',
    focusY: 18,
  },
  {
    id: 'round-2-banner',
    range: [0.44, 0.52],
    round: 2,
    label: 'round-banner',
    subtitle: 'Round 2 starts as the drip gets heavier.',
    audioCues: [
      { id: 'round', src: '/fight/round.mp3', volume: 0.75 },
      { id: 'two', src: '/fight/two.mp3', volume: 0.75 },
      { id: 'fight', src: '/fight/fight.mp3', volume: 0.8 },
    ],
    snapshot: {
      greta: { health: 62, mood: 42 },
      trump: { health: 100, mood: 45 },
    },
    focusY: 20,
  },
  {
    id: 'round-2-greta',
    range: [0.52, 0.6],
    round: 2,
    label: 'dialogue',
    speaker: 'greta',
    bubble: 'Why not use solar panels and make free energy, Trump?',
    subtitle: 'Greta asks for renewable choices.',
    audioCues: [{ id: 'chun-li-grunt', src: '/fight/chun-li-grunt.mp3', volume: 0.8 }],
    snapshot: {
      greta: { health: 62, mood: 42 },
      trump: { health: 100, mood: 45 },
    },
    focusY: 21,
  },
  {
    id: 'round-2-trump',
    range: [0.6, 0.68],
    round: 2,
    label: 'dialogue',
    speaker: 'trump',
    bubble:
      "The Middle East? I made the best deals. Abraham Accords, very shiny. Now the Red Sea is a mess? Shipping is expensive? That's called leverage, folks. I love leverage.",
    subtitle: 'Trade pressure rises across shipping lanes.',
    audioCues: [{ id: 'huh-throw', src: '/fight/huh-throw.mp3', volume: 0.9 }],
    snapshot: {
      greta: { health: 46, mood: 28 },
      trump: { health: 100, mood: 64 },
    },
    focusY: 22,
  },
  {
    id: 'round-2-map-red-sea',
    range: [0.68, 0.76],
    round: 2,
    label: 'map-checkpoint',
    subtitle: 'Checkpoint 2: Red Sea rumble and expensive shipping.',
    audioCues: [],
    snapshot: {
      greta: { health: 32, mood: 16 },
      trump: { health: 100, mood: 75 },
    },
    mapChapterId: 'middle-east-escalation',
    focusY: 24,
  },
  {
    id: 'round-3-banner',
    range: [0.76, 0.84],
    round: 3,
    label: 'round-banner',
    subtitle: 'Final round. The world hangs on one pipeline.',
    audioCues: [
      { id: 'round', src: '/fight/round.mp3', volume: 0.75 },
      { id: 'three', src: '/fight/3.mp3', volume: 0.75 },
      { id: 'fight', src: '/fight/fight.mp3', volume: 0.8 },
    ],
    snapshot: {
      greta: { health: 32, mood: 16 },
      trump: { health: 100, mood: 75 },
    },
    focusY: 26,
  },
  {
    id: 'round-3-greta',
    range: [0.84, 0.89],
    round: 3,
    label: 'dialogue',
    speaker: 'greta',
    bubble: 'Please, give us peace and a greener world.',
    subtitle: 'Greta asks for peace before the last strike.',
    audioCues: [],
    snapshot: {
      greta: { health: 21, mood: 8 },
      trump: { health: 100, mood: 75 },
    },
    focusY: 28,
  },
  {
    id: 'round-3-trump',
    range: [0.89, 0.94],
    round: 3,
    label: 'dialogue',
    speaker: 'trump',
    bubble:
      "Iran? We had to do it. Biggest missiles you've ever seen. We closed the Strait of Hormuz. No oil for anyone! It's beautiful. Totally closed. I'm the King of Energy!",
    subtitle: 'Strait closure shocks global supply.',
    audioCues: [{ id: 'genius', src: '/fight/putin-called-me-a-genius.mp3', volume: 0.9 }],
    snapshot: {
      greta: { health: 12, mood: 3 },
      trump: { health: 100, mood: 88 },
    },
    focusY: 30,
  },
  {
    id: 'round-3-missile-drop',
    range: [0.94, 0.97],
    round: 3,
    label: 'missile-barrage',
    subtitle: 'Final strike: missiles fly as the oil drop stretches.',
    audioCues: [{ id: 'missile', src: '/fight/Missile.mp3', volume: 1 }],
    snapshot: {
      greta: { health: 5, mood: 0 },
      trump: { health: 100, mood: 100 },
    },
    focusY: 36,
  },
  {
    id: 'post-fight-oil-drop',
    range: [0.97, 0.995],
    round: 3,
    label: 'post-fight',
    subtitle: 'Fight done. Keep scrolling past the oil drops.',
    audioCues: [],
    snapshot: {
      greta: { health: 5, mood: 0 },
      trump: { health: 100, mood: 100 },
    },
    focusY: 52,
  },
  {
    id: 'finish-drop-green',
    range: [0.995, 1],
    round: 3,
    label: 'finish',
    subtitle: 'Green transition unlocked. Scroll down to continue.',
    audioCues: [],
    snapshot: {
      greta: { health: 5, mood: 0 },
      trump: { health: 100, mood: 100 },
    },
    focusY: 70,
  },
]

export const FIGHT_BEAT_BY_ID = new Map(FIGHT_BEATS.map((beat) => [beat.id, beat]))

export function getFightBeatByProgress(progress: number): FightBeat {
  const clamped = Math.min(1, Math.max(0, progress))
  return (
    FIGHT_BEATS.find((beat) => clamped >= beat.range[0] && clamped <= beat.range[1]) ??
    FIGHT_BEATS[FIGHT_BEATS.length - 1]
  )
}

export function getChapterById(chapterId: string | undefined) {
  if (!chapterId) return null
  return CHAPTERS.find((chapter) => chapter.id === chapterId) ?? null
}
