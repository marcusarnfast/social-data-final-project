/** Mapbox symbol `icon-image` ids + assets for monthly conflict markers (matches GeoJSON `icon` property). */
export const MAP_MONTHLY_EVENT_ICONS = [
  { id: 'battles', url: '/map-icons/battles.png', label: 'Battles' },
  {
    id: 'explosions-remote-violence',
    url: '/map-icons/explosions_remote_violence.png',
    label: 'Explosions/Remote violence',
  },
  { id: 'protest', url: '/map-icons/protests.png', label: 'Protests' },
  { id: 'riots', url: '/map-icons/riots.png', label: 'Riots' },
  {
    id: 'strategic-developments',
    url: '/map-icons/strategic_developments.png',
    label: 'Strategic developments',
  },
  {
    id: 'violence-against-civilians',
    url: '/map-icons/violence_against_civilians.png',
    label: 'Violence against civilians',
  },
] as const

/** Icons shown in the map UI legend (subset of types emphasized in the story). */
export const MAP_MONTHLY_EVENT_LEGEND_IDS = [
  'battles',
  'explosions-remote-violence',
  'riots',
  'violence-against-civilians',
] as const

export const MAP_MONTHLY_EVENT_LEGEND_ROWS = MAP_MONTHLY_EVENT_ICONS.filter((row) =>
  (MAP_MONTHLY_EVENT_LEGEND_IDS as readonly string[]).includes(row.id),
)
