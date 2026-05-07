export type ChapterChartPoint = { label: string; value: number }

export type Chapter = {
  id: string
  time: Date
  windowDays: number
  mapView: { center: [number, number]; zoom: number; pitch?: number; bearing?: number }
  title: string
  description: string
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
    id: 'arab-spring-syrian-civil-war',
    time: new Date('2011-03-15T00:00:00Z'),
    windowDays: 180,
    mapView: { center: [30.0, 25.0], zoom: 3.4, pitch: 20, bearing: 0 },
    title: 'Arab Spring & Syrian Civil War',
    description:
      '2011 and 2012. The Arab Spring spreads across North Africa and the Middle East while Syria descends into civil war. Oil markets price in instability across the region, with pressure returning during the 2017/2018 peaks.',
    chart: {
      type: 'bar',
      yLabel: 'Average oil price ($ / barrel)',
      xLabel: 'Year',
      data: [
        { label: '2011', value: 111 },
        { label: '2012', value: 112 },
        { label: '2017', value: 54 },
        { label: '2018', value: 71 },
        { label: 'impact', value: 100 },
      ],
    },
  },
  {
    id: 'russia-ukraine-war',
    time: new Date('2022-02-24T00:00:00Z'),
    windowDays: 150,
    mapView: { center: [33.0, 48.5], zoom: 4.2, pitch: 35, bearing: -10 },
    title: 'Russia / Ukraine war',
    description:
      'The conflict starts in 2014 with Russia annexing Crimea, then escalates into a full-scale invasion in February 2022. European energy security breaks open and oil spikes sharply.',
    chart: {
      type: 'bar',
      yLabel: 'Oil price ($ / barrel)',
      xLabel: 'Event',
      data: [
        { label: '2014', value: 99 },
        { label: '2021', value: 71 },
        { label: '2022 avg', value: 101 },
        { label: '2022 peak', value: 128 },
      ],
    },
  },
  {
    id: 'middle-east-escalation',
    time: new Date('2023-10-07T00:00:00Z'),
    windowDays: 150,
    mapView: { center: [34.4, 31.4], zoom: 5.0, pitch: 35, bearing: 8 },
    title: 'Middle East escalation',
    description:
      'October 7th, 2023. The Israel and Palestine conflict escalates, Red Sea shipping is impacted, and oil prices carry an added risk premium through 2024 and 2025.',
    chart: {
      type: 'line',
      yLabel: 'Oil price ($ / barrel)',
      xLabel: 'Event window',
      data: [
        { label: '2023 avg', value: 83 },
        { label: 'Oct 2023', value: 88 },
        { label: '2024 risk', value: 90 },
        { label: 'peak', value: 93 },
      ],
    },
  },
  {
    id: 'us-iran-war',
    time: new Date('2026-04-01T00:00:00Z'),
    windowDays: 90,
    mapView: { center: [53.0, 28.0], zoom: 4.6, pitch: 42, bearing: 18 },
    title: 'US war with Iran',
    description:
      '2026. The United States enters a formal war with Iran and strikes with missiles. The Strait of Hormuz closes, forcing a major shock into oil prices and the global economy.',
    chart: {
      type: 'line',
      yLabel: 'Oil price ($ / barrel)',
      xLabel: 'Projected path',
      data: [
        { label: 'baseline', value: 83 },
        { label: 'projected avg', value: 96 },
        { label: 'recent jump', value: 100 },
        { label: 'stress case', value: 110 },
      ],
    },
  },
] as const
