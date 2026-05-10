import { FULL_NARRATIVE_IMAGE_URL } from '~/features/story-introduction/preload-story-assets'

/**
 * One scroll "frame": copy + vertical focus on the mural (`object-position` Y %).
 * Add optional `extras` for future fields without changing call sites that only read core props.
 */
/** Background music key — matches a track id in `background-music.ts`. `null` means stop music on this frame. */
export type FightFrameMusic = 'western' | 'street-fighter' | null

/** A one-shot voice / sfx cue fired when this frame becomes active (including on re-entry). */
export type FightFrameCue = Readonly<{
  /** Public URL (`/fight/...`) */
  src: string
  /** Delay in ms after frame becomes active before the cue fires. */
  delayMs?: number
  volume?: number
}>

export type FightSpeaker = 'greta' | 'trump'

export type FighterPose = 'idle' | 'attack' | 'hit'

export type FighterStats = Readonly<{ health: number; mood: number }>

export type FightSnapshot = Readonly<{
  greta: FighterStats
  trump: FighterStats
}>

export type FighterOverride = Readonly<{
  src?: string
  pose?: FighterPose
}>

export type FightFrameDefinition = {
  title: string
  caption: string
  /** Vertical anchor with `object-fit: cover`: **0** = crop from the **top** of the artwork; larger % pans down */
  backgroundFocusYPercent: number
  /** Background music to be active while this frame is the current frame. `null` stops music. `undefined` keeps whatever is currently playing. */
  music?: FightFrameMusic
  /** One-shot cues fired each time this frame becomes active. */
  cues?: ReadonlyArray<FightFrameCue>
  /** Round number. When omitted carries over from previous frames. */
  round?: 1 | 2 | 3
  /** Per-fighter snapshot. When omitted, carries over from earlier frames. */
  snapshot?: FightSnapshot
  /** Speech bubble shown above the speaker. */
  dialogue?: Readonly<{ speaker: FightSpeaker; text: string }>
  /** Per-fighter sprite + pose overrides. Falls back to the configured idle sprite. */
  fighters?: Readonly<{ greta?: FighterOverride; trump?: FighterOverride }>
  /** When true, render the big ROUND/FIGHT banner on this frame. */
  showRoundBanner?: boolean
  extras?: Record<string, unknown>
}

export type FightSceneBackground = Readonly<{
  /** Public URL (`/images/...`) */
  imageSrc: string
  horizontalFocusPercent?: number
  transitionMs?: number
  /** Tailwind-ish class appended on the foreground scrim over the mural */
  scrimClassName?: string
}>

export type FightFighterDefaults = Readonly<{
  /** Idle sprite path used when a frame doesn't override `fighters.<name>.src`. Swap these later for facing PNGs. */
  greta: { idleSrc: string }
  trump: { idleSrc: string }
}>

export type FightSceneStore = Readonly<{
  meta?: Readonly<{ id?: string; note?: string }>
  background: FightSceneBackground
  fighters: FightFighterDefaults
  initialSnapshot: FightSnapshot
  frames: ReadonlyArray<FightFrameDefinition>
}>

/**
 * Single source of truth for the fight scene: frame copy, mural pan, timings.
 * `frameCount` is always `store.frames.length` — extend `frames`, `extras`, or `background` from here.
 */
export const FIGHT_SCENE_STORE = {
  meta: {
    id: 'fight-scene',
    note:
      'First frames keep the same focusY to hold the mural at the top; later frames bump % to pan downward. Tune as needed.',
  },
  background: {
    imageSrc: FULL_NARRATIVE_IMAGE_URL,
    horizontalFocusPercent: 50,
    transitionMs: 700,
    scrimClassName: 'bg-linear-to-b from-black/55 via-black/40 to-black/70',
  },
  fighters: {
    greta: { idleSrc: '/fight/greta-idle.png' },
    trump: { idleSrc: '/fight/trump-idle.png' },
  },
  initialSnapshot: {
    greta: { health: 100, mood: 100 },
    trump: { health: 100, mood: 0 },
  },
  frames: [
    {
      title: 'Warm horizon',
      caption: 'Sun, ridge line, skeletal trees.',
      backgroundFocusYPercent: 0,
      music: 'western',
      round: 1,
      cues: [
        { src: '/fight/Greta Thunberg.mp3', delayMs: 350 },
        { src: '/fight/Donald Trump.mp3', delayMs: 1400 },
      ],
    },
    {
      title: 'Round 1',
      caption: 'Round 1 banner.',
      backgroundFocusYPercent: 0,
      round: 1,
      showRoundBanner: true,
      cues: [
        { src: '/fight/round.mp3', delayMs: 0, volume: 0.85 },
        { src: '/fight/1.mp3', delayMs: 700, volume: 0.85 },
        { src: '/fight/fight.mp3', delayMs: 1500, volume: 0.9 },
      ],
    },
    {
      title: 'How dare you',
      caption: 'Greta opens with outrage.',
      backgroundFocusYPercent: 0,
      round: 1,
      dialogue: { speaker: 'greta', text: 'How dare you!' },
      fighters: {
        greta: { src: '/fight/r1/R1 - Frame 1.png', pose: 'attack' },
      },
      cues: [{ src: '/fight/how-dare-you.mp3' }],
    },
    {
      title: 'Huh',
      caption: 'Trump shrugs.',
      backgroundFocusYPercent: 0,
      round: 1,
      dialogue: { speaker: 'trump', text: 'Huh.' },
      fighters: {
        trump: { src: '/fight/r1/R1 - Frame 2.png', pose: 'idle' },
      },
      cues: [{ src: '/fight/huh-throw.mp3', volume: 0.85 }],
    },
    {
      title: 'Trump strikes',
      caption: 'First swing about Ukraine.',
      backgroundFocusYPercent: 0,
      round: 1,
      dialogue: {
        speaker: 'trump',
        text: "The Ukraine thing? Easy. I told Vladimir, 'Do what you want, just keep the gas flowing to my friends.'",
      },
      fighters: {
        trump: { src: '/fight/r1/R1 - frame 3.gif', pose: 'attack' },
      },
      cues: [{ src: '/fight/putin-called-me-a-genius.mp3' }],
    },
    {
      title: 'Greta hit',
      caption: 'Greta takes damage.',
      backgroundFocusYPercent: 0,
      round: 1,
      snapshot: {
        greta: { health: 85, mood: 76 },
        trump: { health: 100, mood: 22 },
      },
      fighters: {
        greta: { src: '/fight/r1/R1 - frame 4.gif', pose: 'hit' },
      },
    },
    {
      title: 'Map: Russia / Ukraine',
      caption: 'Map + DK fuel timeline; ends on Russia/Ukraine.',
      backgroundFocusYPercent: 0,
      extras: {
        fightMode: 'map-explore',
        mapChapterId: 'russia-ukraine-war',
        startDate: '2010-01-01',
        endDate: '2022-12-01',
      },
    },
    {
      title: 'Round 2',
      caption: 'Round 2 banner.',
      backgroundFocusYPercent: 10,
      round: 2,
      showRoundBanner: true,
      cues: [
        { src: '/fight/round.mp3', delayMs: 0, volume: 0.85 },
        { src: '/fight/two.mp3', delayMs: 700, volume: 0.85 },
        { src: '/fight/fight.mp3', delayMs: 1500, volume: 0.9 },
      ],
    },
    {
      title: 'Greta solar attack',
      caption: 'Greta calls for solar; sunbeam fires.',
      backgroundFocusYPercent: 10,
      round: 2,
      dialogue: {
        speaker: 'greta',
        text: 'Why not use solar panels and make free energy, Trump?',
      },
      fighters: {
        greta: { src: '/fight/r2/R2 - Frame 2.gif', pose: 'attack' },
      },
      cues: [{ src: '/fight/chun-li-grunt.mp3', volume: 0.85 }],
      extras: { effect: 'sunbeam' },
    },
    {
      title: 'Trump Middle East',
      caption: 'Trump brags about leverage in the Middle East.',
      backgroundFocusYPercent: 10,
      round: 2,
      dialogue: {
        speaker: 'trump',
        text: "The Middle East? I made the best deals. Abraham Accords, very shiny. Now the Red Sea is a mess? Shipping is expensive? That's called leverage, folks. I love leverage.",
      },
      fighters: {
        trump: { src: '/fight/r2/R2 - Frame 3.gif', pose: 'idle' },
      },
      cues: [{ src: '/fight/huh-throw.mp3', volume: 0.85 }],
    },
    {
      title: 'Greta damaged',
      caption: 'Greta takes damage from the Red Sea pressure.',
      backgroundFocusYPercent: 10,
      round: 2,
      snapshot: {
        greta: { health: 46, mood: 28 },
        trump: { health: 100, mood: 64 },
      },
      fighters: {
        greta: { src: '/fight/r2/R2 - Frame 4.gif', pose: 'hit' },
      },
    },
    {
      title: 'Map: Middle East',
      caption: 'Middle East escalation map checkpoint.',
      backgroundFocusYPercent: 10,
      round: 2,
      extras: {
        fightMode: 'map-explore',
        mapChapterId: 'middle-east-escalation',
        startDate: '2023-01-01',
        endDate: '2024-12-01',
      },
    },
    {
      title: 'Round 3',
      caption: 'Round 3 banner.',
      backgroundFocusYPercent: 20,
      round: 3,
      showRoundBanner: true,
      cues: [
        { src: '/fight/round.mp3', delayMs: 0, volume: 0.85 },
        { src: '/fight/3.mp3', delayMs: 700, volume: 0.85 },
        { src: '/fight/fight.mp3', delayMs: 1500, volume: 0.9 },
      ],
    },
    {
      title: 'Greta begs',
      caption: 'Greta asks for peace and a greener world.',
      backgroundFocusYPercent: 20,
      round: 3,
      dialogue: {
        speaker: 'greta',
        text: 'Please, give us peace and a greener world.',
      },
      fighters: {
        greta: { src: '/fight/r3/R3 - Frame 1.gif', pose: 'idle' },
      },
    },
    {
      title: 'Trump Iran',
      caption: 'Trump brags about Iran; missiles fly.',
      backgroundFocusYPercent: 20,
      round: 3,
      dialogue: {
        speaker: 'trump',
        text: "Iran? We had to do it. Biggest missiles you've ever seen. We closed the Strait of Hormuz. No oil for anyone! It's beautiful. Totally closed. I'm the King of Energy!",
      },
      fighters: {
        trump: { src: '/fight/r3/R3 - Frame 2.gif', pose: 'attack' },
      },
      cues: [{ src: '/fight/Missile.mp3', volume: 0.9 }],
      extras: { effect: 'missiles' },
    },
    {
      title: 'Greta wrecked',
      caption: 'Greta takes the worst hit yet.',
      backgroundFocusYPercent: 20,
      round: 3,
      snapshot: {
        greta: { health: 12, mood: 5 },
        trump: { health: 100, mood: 88 },
      },
      fighters: {
        greta: { src: '/fight/r3/R3 - Frame 3.gif', pose: 'hit' },
      },
    },
    {
      title: 'Map: US / Iran',
      caption: 'US war with Iran map checkpoint.',
      backgroundFocusYPercent: 20,
      round: 3,
      extras: {
        fightMode: 'map-explore',
        mapChapterId: 'us-iran-war',
        startDate: '2025-01-01',
        endDate: '2026-05-01',
      },
    },
    {
      title: 'Trump won',
      caption: 'Trump stands victorious — but did he win?',
      backgroundFocusYPercent: 20,
      round: 3,
      snapshot: {
        greta: { health: 0, mood: 0 },
        trump: { health: 100, mood: 100 },
      },
      extras: {
        effect: 'trump-won',
        hideFighters: true,
        hideHud: true,
      },
    },
    {
      title: 'After (background pan)',
      caption: 'Quiet — background only.',
      backgroundFocusYPercent: 25,
      round: 3,
      extras: { hideFighters: true, hideHud: true },
    },
    {
      title: 'After (background end)',
      caption: 'Quiet — background only.',
      backgroundFocusYPercent: 35,
      round: 3,
      extras: { hideFighters: true, hideHud: true },
    },
  ],
} as const satisfies FightSceneStore

export type FightKnownSceneStore = typeof FIGHT_SCENE_STORE

/** Walk backwards from `frameIndex` to find the most recently declared snapshot. */
export function getActiveSnapshot(
  store: FightSceneStore,
  frameIndex: number,
): FightSnapshot {
  for (let i = Math.min(frameIndex, store.frames.length - 1); i >= 0; i--) {
    const snapshot = store.frames[i]?.snapshot
    if (snapshot) return snapshot
  }
  return store.initialSnapshot
}

/** Walk backwards from `frameIndex` to find the most recently declared round number. */
export function getActiveRound(
  store: FightSceneStore,
  frameIndex: number,
): 1 | 2 | 3 {
  for (let i = Math.min(frameIndex, store.frames.length - 1); i >= 0; i--) {
    const round = store.frames[i]?.round
    if (round) return round
  }
  return 1
}
