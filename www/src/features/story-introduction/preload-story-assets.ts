const STORY_JSON_URLS = {
  conflictEvents: '/data/conflict-events.json',
  propellantPrices: '/data/propellant-prices.json',
  monthlyIconsGeojson: '/map-geojsons/conflict_monthly_map_icons.geojson',
} as const

const MAP_ICON_URLS = [
  '/map-icons/battles.png',
  '/map-icons/explosions_remote_violence.png',
  '/map-icons/protests.png',
  '/map-icons/riots.png',
  '/map-icons/strategic_developments.png',
  '/map-icons/violence_against_civilians.png',
] as const

const FULL_NARRATIVE_IMAGE_URL = '/images/full-narrative.png'

type Cache = Map<string, Promise<unknown>>
const cache: Cache = new Map()

function loadJson<T>(url: string): Promise<T> {
  const existing = cache.get(url)
  if (existing) return existing as Promise<T>

  const promise = fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch ${url}`)
    return res.json() as Promise<T>
  })
  cache.set(url, promise)
  return promise
}

function loadImage(url: string): Promise<HTMLImageElement> {
  const existing = cache.get(url)
  if (existing) return existing as Promise<HTMLImageElement>

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image ${url}`))
    img.src = url
  })
  cache.set(url, promise)
  return promise
}

export type StoryAssets = {
  conflictEvents: unknown
  propellantPrices: unknown
  monthlyIconsGeojson: unknown
}

let storyAssetsPromise: Promise<StoryAssets> | null = null

export async function preloadStoryAssets(
  onProgress?: (progressPercent: number, label: string) => void,
): Promise<StoryAssets> {
  if (storyAssetsPromise) return storyAssetsPromise

  const tasks: Array<{ label: string; run: () => Promise<unknown> }> = [
    { label: 'Conflict events', run: () => loadJson(STORY_JSON_URLS.conflictEvents) },
    { label: 'Fuel prices', run: () => loadJson(STORY_JSON_URLS.propellantPrices) },
    { label: 'Monthly icon geojson', run: () => loadJson(STORY_JSON_URLS.monthlyIconsGeojson) },
    ...MAP_ICON_URLS.map((url) => ({
      label: `Icon ${url.split('/').pop() ?? url}`,
      run: () => loadImage(url),
    })),
    { label: 'Narrative artwork', run: () => loadImage(FULL_NARRATIVE_IMAGE_URL) },
  ]

  storyAssetsPromise = (async () => {
    let done = 0
    const total = tasks.length
    onProgress?.(0, 'Preparing assets')

    const results = await Promise.all(
      tasks.map(async (task) => {
        const result = await task.run()
        done += 1
        onProgress?.(Math.round((done / total) * 100), task.label)
        return result
      }),
    )

    return {
      conflictEvents: results[0],
      propellantPrices: results[1],
      monthlyIconsGeojson: results[2],
    }
  })()

  return storyAssetsPromise
}

export async function getConflictEvents<T>(): Promise<T> {
  return loadJson<T>(STORY_JSON_URLS.conflictEvents)
}

export async function getPropellantPrices<T>(): Promise<T> {
  return loadJson<T>(STORY_JSON_URLS.propellantPrices)
}

export async function getMonthlyIconGeoJson<T>(): Promise<T> {
  return loadJson<T>(STORY_JSON_URLS.monthlyIconsGeojson)
}

export { FULL_NARRATIVE_IMAGE_URL }
