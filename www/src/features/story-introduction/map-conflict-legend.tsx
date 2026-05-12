'use client'

import '~/components/ui/8bit/styles/retro.css'

import { MAP_MONTHLY_EVENT_ICONS } from './map-monthly-event-icons'

export function MapConflictLegend() {
  return (
    <section
      aria-label="Map symbols for monthly conflict events"
      className="retro border-2 border-amber-200 bg-black/92 px-2.5 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.88)]"
    >
      <p className="mb-1.5 text-[6px] uppercase tracking-[0.22em] text-amber-300">Event icons</p>
      <ul className="flex flex-col gap-1.5">
        {MAP_MONTHLY_EVENT_ICONS.map((row) => (
          <li key={row.id} className="flex items-center gap-2">
            <img
              src={row.url}
              alt=""
              width={18}
              height={18}
              className="pixelated size-[18px] shrink-0"
              aria-hidden
            />
            <span className="text-left text-[6px] leading-snug tracking-[0.04em] text-amber-100/92">
              {row.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
