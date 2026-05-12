'use client'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef, useState } from 'react'

import type { Chapter, ChapterMapCamera } from './chapters'
import { MAP_MONTHLY_EVENT_ICONS } from './map-monthly-event-icons'
import { getMonthlyIconGeoJson } from './preload-story-assets'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
const MONTHLY_EVENTS_SOURCE_ID = 'monthly-conflict-events'
const MONTHLY_EVENTS_LAYER = 'monthly-conflict-event-icons'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type MonthlyFeature = GeoJSON.Feature<GeoJSON.Point, {
  icon: string
  month: string
  month_start_ts: number
  month_end_ts: number
}>

const EMPTY_FC: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: 'FeatureCollection',
  features: [],
}

function isGeoJsonSource(
  source: mapboxgl.AnySourceImpl | undefined,
): source is mapboxgl.GeoJSONSource {
  return Boolean(source) && 'setData' in source
}

function getMonthKey(date: Date): string {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + 1
  return `${y.toString().padStart(4, '0')}-${m.toString().padStart(2, '0')}`
}

async function fetchAndIndexMonthly(
  map: mapboxgl.Map,
  monthIndexRef: { current: Map<string, Array<MonthlyFeature>> },
  monthDataReadyRef: { current: boolean },
  onReady: () => void,
) {
  if (monthDataReadyRef.current) {
    onReady()
    return
  }

  try {
    const data = await getMonthlyIconGeoJson<
      GeoJSON.FeatureCollection<
      GeoJSON.Point,
      MonthlyFeature['properties']
      >
    >()

    const byMonth = new Map<string, Array<MonthlyFeature>>()
    for (const feature of data.features) {
      const month = feature.properties.month
      const arr = byMonth.get(month)
      if (arr) {
        arr.push(feature)
      } else {
        byMonth.set(month, [feature])
      }
    }

    monthIndexRef.current = byMonth
    monthDataReadyRef.current = true

    if (map.getSource(MONTHLY_EVENTS_SOURCE_ID)) {
      onReady()
    }
  } catch (err) {
    console.error('Failed to load monthly conflict events', err)
  }
}

function applyMonthlyData(
  map: mapboxgl.Map,
  monthIndex: Map<string, Array<MonthlyFeature>>,
  currentDate: Date,
  lastAppliedMonthRef: { current: string | null },
) {
  const monthKey = getMonthKey(currentDate)
  if (lastAppliedMonthRef.current === monthKey) return
  lastAppliedMonthRef.current = monthKey

  const source = map.getSource(MONTHLY_EVENTS_SOURCE_ID)
  if (!isGeoJsonSource(source)) return

  const features = monthIndex.get(monthKey) ?? []
  source.setData({
    type: 'FeatureCollection',
    features,
  })
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function resolveExploreFromView(chapter: Chapter): ChapterMapCamera {
  if (chapter.mapExploreFromView) return chapter.mapExploreFromView
  const v = chapter.mapView
  return {
    center: v.center,
    zoom: Math.max(1.45, v.zoom - 2.4),
    pitch: 0,
    bearing: 0,
  }
}

function interpolateExploreCamera(from: ChapterMapCamera, to: ChapterMapCamera, progress: number): ChapterMapCamera {
  const t = Math.min(1, Math.max(0, progress))
  return {
    center: [lerp(from.center[0], to.center[0], t), lerp(from.center[1], to.center[1], t)],
    zoom: lerp(from.zoom, to.zoom, t),
    pitch: lerp(from.pitch ?? 0, to.pitch ?? 0, t),
    bearing: lerp(from.bearing ?? 0, to.bearing ?? 0, t),
  }
}

function loadMapImage(map: mapboxgl.Map, id: string, url: string) {
  return new Promise<void>((resolve, reject) => {
    if (map.hasImage(id)) {
      resolve()
      return
    }

    map.loadImage(url, (error, image) => {
      if (error) {
        reject(error)
        return
      }

      if (!image) {
        reject(new Error(`Map icon not found: ${url}`))
        return
      }

      map.addImage(id, image)
      resolve()
    })
  })
}

export function StoryMap({
  currentDate,
  activeChapter,
  exploreCameraProgress,
  exploreCameraAnchor,
}: {
  currentDate: Date
  activeChapter: Chapter | null
  /** When set with `exploreCameraAnchor`, map camera lerps from chapter intro view → `mapView` with scroll (bidirectional). */
  exploreCameraProgress?: number
  exploreCameraAnchor?: Chapter
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const lastChapterRef = useRef<string | null>(null)
  const styleReadyRef = useRef(false)
  const currentDateRef = useRef<Date>(currentDate)
  currentDateRef.current = currentDate
  const monthIndexRef = useRef<Map<string, Array<MonthlyFeature>>>(new Map())
  const monthDataReadyRef = useRef(false)
  const lastAppliedMonthRef = useRef<string | null>(null)
  const [mapReadyToken, setMapReadyToken] = useState(0)

  useEffect(() => {
    if (!MAPBOX_TOKEN) return
    if (!containerRef.current) return
    if (mapRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/marcusarnfast/cmovf5g0300a301r880hbdtet',
      center: [43, 27],
      zoom: 2.15,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      cooperativeGestures: false,
    })

    map.scrollZoom.disable()
    map.boxZoom.disable()
    map.doubleClickZoom.disable()
    map.touchZoomRotate.disable()
    map.dragPan.disable()
    map.dragRotate.disable()
    map.keyboard.disable()

    map.on('load', async () => {
      styleReadyRef.current = true

      try {
        await Promise.all(MAP_MONTHLY_EVENT_ICONS.map((icon) => loadMapImage(map, icon.id, icon.url)))

        if (!map.getSource(MONTHLY_EVENTS_SOURCE_ID)) {
          map.addSource(MONTHLY_EVENTS_SOURCE_ID, {
            type: 'geojson',
            data: EMPTY_FC,
          })
        }

        if (!map.getLayer(MONTHLY_EVENTS_LAYER)) {
          map.addLayer({
            id: MONTHLY_EVENTS_LAYER,
            type: 'symbol',
            source: MONTHLY_EVENTS_SOURCE_ID,
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.08, 4, 0.14, 7, 0.22],
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
            },
            paint: {
              'icon-opacity': 0.9,
            },
          })
        }

        void fetchAndIndexMonthly(map, monthIndexRef, monthDataReadyRef, () => {
          applyMonthlyData(
            map,
            monthIndexRef.current,
            currentDateRef.current,
            lastAppliedMonthRef,
          )
        })
      } catch (err) {
        console.error('Failed to load map layers or monthly GeoJSON', err)
      } finally {
        setMapReadyToken((n) => n + 1)
      }
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      styleReadyRef.current = false
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !styleReadyRef.current) return
    if (!map.getSource(MONTHLY_EVENTS_SOURCE_ID)) return

    if (monthDataReadyRef.current) {
      applyMonthlyData(map, monthIndexRef.current, currentDate, lastAppliedMonthRef)
    }
  }, [currentDate])

  useEffect(() => {
    const map = mapRef.current
    if (!map || mapReadyToken === 0) return
    if (exploreCameraAnchor == null || exploreCameraProgress === undefined) return

    const from = resolveExploreFromView(exploreCameraAnchor)
    const to = exploreCameraAnchor.mapView
    const cam = interpolateExploreCamera(from, to, exploreCameraProgress)
    map.jumpTo({
      center: cam.center,
      zoom: cam.zoom,
      pitch: cam.pitch ?? 0,
      bearing: cam.bearing ?? 0,
    })
  }, [mapReadyToken, exploreCameraAnchor, exploreCameraProgress])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!activeChapter) return

    const exploreLocksChapterFly =
      exploreCameraAnchor != null &&
      exploreCameraProgress !== undefined &&
      activeChapter.id === exploreCameraAnchor.id

    if (exploreLocksChapterFly) {
      lastChapterRef.current = activeChapter.id
      return
    }

    if (lastChapterRef.current === activeChapter.id) return
    lastChapterRef.current = activeChapter.id

    const view = activeChapter.mapView
    if (prefersReducedMotion()) {
      map.jumpTo({
        center: view.center,
        zoom: view.zoom,
        pitch: view.pitch ?? 0,
        bearing: view.bearing ?? 0,
      })
      return
    }

    map.flyTo({
      center: view.center,
      zoom: view.zoom,
      pitch: view.pitch ?? 0,
      bearing: view.bearing ?? 0,
      duration: 1800,
      essential: true,
    })
  }, [activeChapter, exploreCameraAnchor, exploreCameraProgress])

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-center text-xs text-amber-400">
        <span className="font-mono">
          Missing VITE_MAPBOX_TOKEN — add it to www/.env to render the map.
        </span>
      </div>
    )
  }

  return <div ref={containerRef} className="h-full w-full" aria-hidden />
}
