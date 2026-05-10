import { FULL_NARRATIVE_IMAGE_URL } from './preload-story-assets'

/**
 * One scroll “frame”: copy + vertical focus on the mural (`object-position` Y %).
 * Add optional `extras` for future fields without changing call sites that only read core props.
 */
export type FightScrollTestFrameDefinition = {
  title: string
  caption: string
  /** Vertical anchor with `object-fit: cover`: **0** = crop from the **top** of the artwork; larger % pans down */
  backgroundFocusYPercent: number
  extras?: Record<string, unknown>
}

export type FightScrollTestSceneBackground = Readonly<{
  /** Public URL (`/images/...`) */
  imageSrc: string
  horizontalFocusPercent?: number
  transitionMs?: number
  /** Tailwind-ish class appended on the foreground scrim over the mural */
  scrimClassName?: string
}>

export type FightScrollTestSceneStore = Readonly<{
  meta?: Readonly<{ id?: string; note?: string }>
  background: FightScrollTestSceneBackground
  frames: ReadonlyArray<FightScrollTestFrameDefinition>
}>

/**
 * Single source of truth for the fight-scroll lab scene: frame copy, mural pan, timings.
 * `frameCount` is always `store.frames.length` — extend `frames`, `extras`, or `background` from here.
 */
export const FIGHT_SCROLL_TEST_SCENE_STORE = {
  meta: {
    id: 'fight-scroll-test-lab',
    note:
      'First frames keep the same focusY to hold the mural at the top; later frames bump % to pan downward. Tune as needed.',
  },
  background: {
    imageSrc: FULL_NARRATIVE_IMAGE_URL,
    horizontalFocusPercent: 50,
    transitionMs: 700,
    scrimClassName: 'bg-linear-to-b from-black/55 via-black/40 to-black/70',
  },
  frames: [
    {
      title: 'Warm horizon',
      caption: 'Sun, ridge line, skeletal trees.',
      backgroundFocusYPercent: 0,
    },
    {
      title: 'City under fire',
      caption: 'Skyline, flames, descending streaks.',
      backgroundFocusYPercent: 0,
    },
    {
      title: 'Oil hand',
      caption: 'Tips of the dripping hand shape.',
      backgroundFocusYPercent: 0,
    },
    {
      title: 'Drops fall',
      caption: 'Pale green sky — drips descend.',
      backgroundFocusYPercent: 8,
    },
    {
      title: 'Hills & clouds',
      caption: 'Rise over treeline and vapor.',
      backgroundFocusYPercent: 15,
    },
    {
      title: 'Field of blooms',
      caption: 'Yellow meadow fill.',
      backgroundFocusYPercent: 24,
    },
    {
      title: 'Grass to void',
      caption: 'Flower line meets star-field.',
      backgroundFocusYPercent: 36,
    },
    {
      title: 'Pale blue marble',
      caption: 'Earth hangs in frame.',
      backgroundFocusYPercent: 49,
    },
    {
      title: 'Strings up',
      caption: 'Hands, lines to the globe.',
      backgroundFocusYPercent: 61,
    },
    {
      title: 'Controller',
      caption: 'Grounded stance, lower mural.',
      backgroundFocusYPercent: 74,
    },
  ],
} as const satisfies FightScrollTestSceneStore

export type FightScrollTestKnownSceneStore = typeof FIGHT_SCROLL_TEST_SCENE_STORE
