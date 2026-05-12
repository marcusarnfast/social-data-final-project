export type ChapterChartPoint = { label: string; value: number }

export type ChapterMapCamera = {
  center: [number, number]
  zoom: number
  pitch?: number
  bearing?: number
}

export type Chapter = {
  id: string
  time: Date
  windowDays: number
  mapView: ChapterMapCamera
  /** Wide shot at fight map explore progress 0; lerps to `mapView` as progress → 1. */
  mapExploreFromView?: ChapterMapCamera
  title: string
  description: string
  /** Trump illustration for the chapter card (public path). */
  imageSrc: string
  chart: {
    type: 'line' | 'bar'
    data: Array<ChapterChartPoint>
    yLabel: string
    xLabel?: string
  }
}

export const STORY_START = new Date('2010-01-01T00:00:00Z')
export const STORY_END = new Date('2026-05-01T00:00:00Z')

export const CHAPTERS: ReadonlyArray<Chapter> = [
  {
    id: 'russia-ukraine-war',
    time: new Date('2022-02-24T00:00:00Z'),
    windowDays: 150,
    mapExploreFromView: { center: [22, 32], zoom: 1.65, pitch: 0, bearing: 0 },
    mapView: { center: [32.8, 48.2], zoom: 5.4, pitch: 38, bearing: -12 },
    title: 'Russia/Ukraine invasion',
    description:
      'Russia’s full-scale invasion shocks European energy. Denmark feels it at the pump as diesel and petrol spike — a long tail of price pressure tied to the war.',
    imageSrc: '/images/trump-putin-ukraine-war.png',
    chart: {
      type: 'bar',
      yLabel: 'Oil price ($ / barrel)',
      xLabel: 'Phase',
      data: [
        { label: 'Pre-2022', value: 71 },
        { label: '2022 avg', value: 101 },
        { label: '2022 peak', value: 128 },
        { label: 'Shock', value: 100 },
      ],
    },
  },
  {
    id: 'middle-east-escalation',
    time: new Date('2023-10-27T00:00:00Z'),
    windowDays: 150,
    mapExploreFromView: { center: [32, 28], zoom: 2.4, pitch: 0, bearing: 0 },
    mapView: { center: [34.85, 31.22], zoom: 7.4, pitch: 42, bearing: 10 },
    title: 'Middle East escalation',
    description:
      'Early 2023: tensions and flare-ups across the region add risk to oil flows. Shipping and insurance costs creep up, and that pressure shows up in Danish pump prices through the year.',
    imageSrc: '/images/trump-middle-east.png',
    chart: {
      type: 'line',
      yLabel: 'Oil price ($ / barrel)',
      xLabel: 'Window',
      data: [
        { label: '2023 avg', value: 83 },
        { label: 'Feb 2023', value: 88 },
        { label: '2024', value: 90 },
        { label: 'Peak', value: 93 },
      ],
    },
  },
  {
    id: 'us-iran-war',
    time: new Date('2026-02-28T00:00:00Z'),
    windowDays: 90,
    mapExploreFromView: { center: [52, 24], zoom: 2.35, pitch: 0, bearing: 14 },
    mapView: { center: [56.45, 26.15], zoom: 7.0, pitch: 48, bearing: 20 },
    title: 'US/Iran war',
    description:
      'Open US–Iran hostilities threaten the Strait of Hormuz. Markets price a severe supply shock — the scenario hits global oil and Danish pump prices hardest here.',
    imageSrc: '/images/trump-iran-war.png',
    chart: {
      type: 'line',
      yLabel: 'Oil price ($ / barrel)',
      xLabel: 'Stress path',
      data: [
        { label: 'Baseline', value: 83 },
        { label: 'Avg', value: 96 },
        { label: 'Jump', value: 100 },
        { label: 'Stress', value: 110 },
      ],
    },
  },
] as const
