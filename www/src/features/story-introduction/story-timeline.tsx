'use client'

import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import '~/components/ui/8bit/styles/retro.css'

import { STORY_END, STORY_START } from './chapters'
import { getPropellantPrices } from './preload-story-assets'

type RawPriceRow = { date: string; petrol: number; diesel: number; electric: number }
type PriceRow = { ts: number; petrol: number; diesel: number }

const RUSSIA_UKRAINE_INVASION_MS = Date.UTC(2022, 1, 24)
const MIDDLE_EAST_ESCALATION_MS = Date.UTC(2023, 10, 27)
const US_IRAN_WAR_MARKER_MS = Date.UTC(2026, 1, 28)

const YEAR_TICKS: Array<number> = Array.from(
  { length: STORY_END.getUTCFullYear() - STORY_START.getUTCFullYear() + 1 },
  (_, i) => Date.UTC(STORY_START.getUTCFullYear() + i, 0, 1),
)

function formatYearTick(ts: number): string {
  return new Date(ts).getUTCFullYear().toString()
}

function formatMonthYear(ts: number): string {
  const d = new Date(ts)
  return `${d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${d.getUTCFullYear()}`
}

type TooltipPayloadItem = {
  name?: string
  value?: number | string
  color?: string
  dataKey?: string | number
}

function FuelPriceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: number
}) {
  if (!active || !payload?.length || label == null) return null

  return (
    <div
      className="rounded border border-amber-600 bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] text-amber-100 shadow-[4px_4px_0_0_rgba(0,0,0,0.75)]"
      style={{ pointerEvents: 'none' }}
    >
      <p className="mb-1.5 border-b border-amber-700/80 pb-1 text-[10px] uppercase tracking-[0.14em] text-amber-300">
        {formatMonthYear(label)}
      </p>
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex min-w-40 justify-between gap-6">
            <span style={{ color: p.color }}>{p.name ?? String(p.dataKey)}</span>
            <span className="tabular-nums text-amber-50">
              {typeof p.value === 'number' ? `${p.value.toFixed(2)} Kr./l` : String(p.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StoryTimeline({
  currentDate,
  variant = 'default',
}: {
  currentDate: Date
  variant?: 'default' | 'retro'
}) {
  const isRetro = variant === 'retro'
  const [data, setData] = useState<ReadonlyArray<PriceRow>>([])

  useEffect(() => {
    let cancelled = false
    getPropellantPrices<Array<RawPriceRow>>()
      .then((rows) => {
        if (cancelled) return
        const mapped: Array<PriceRow> = rows
          .map((r) => ({
            ts: new Date(`${r.date}T00:00:00Z`).getTime(),
            petrol: r.petrol,
            diesel: r.diesel,
          }))
          .filter((r) => r.ts >= STORY_START.getTime() && r.ts <= STORY_END.getTime())
        setData(mapped)
      })
      .catch((err) => console.error('Failed to load propellant prices', err))
    return () => {
      cancelled = true
    }
  }, [])

  const currentTs = currentDate.getTime()

  const axisLabelStyle = {
    fill: '#fcd34d',
    fontSize: 10,
    fontFamily: 'monospace',
  } as const

  return (
    <div
      className={
        isRetro
          ? 'retro flex h-full min-h-0 w-full flex-col overflow-visible border-t-[6px] border-amber-200 bg-black px-4 py-2 text-amber-200 sm:px-5'
          : 'flex h-full min-h-0 w-full flex-col overflow-visible bg-black px-4 py-2 text-amber-200 sm:px-5'
      }
    >
      <div className="mb-1 flex shrink-0 items-baseline justify-between">
        <h2
          className={
            isRetro
              ? 'text-[8px] uppercase tracking-[0.22em] text-amber-300'
              : 'font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400/80'
          }
        >
          Danish fuel prices
        </h2>
        <span
          className={
            isRetro
              ? 'text-[10px] uppercase tracking-[0.18em] text-amber-200'
              : 'font-mono text-xs text-amber-200'
          }
        >
          {formatMonthYear(currentTs)}
        </span>
      </div>
      <div className="relative min-h-0 w-full flex-1 basis-0 overflow-visible py-0.5">
        <div className="relative min-h-0 h-full w-full">
          <div
            className="pointer-events-none absolute left-2 top-2 z-10 inline-flex w-max max-w-[calc(100%-1rem)] flex-col gap-1 border-2 border-amber-600 bg-[#0a0a0a] px-2 py-1.5 font-mono text-[9px] leading-tight text-amber-200 shadow-[3px_3px_0_0_rgba(0,0,0,0.65)] sm:flex-row sm:items-center sm:gap-x-3 sm:gap-y-0 sm:text-[10px]"
            aria-label="Legend: petrol and diesel series"
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="inline-block h-0.5 w-3 shrink-0 rounded-[1px] bg-[#fbbf24]" aria-hidden />
              Petrol (blyfri 95)
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="inline-block h-0.5 w-3 shrink-0 rounded-[1px] bg-[#f97316]" aria-hidden />
              Diesel
            </span>
          </div>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            style={{ overflow: 'visible' }}
          >
            <LineChart
              data={data}
              margin={{ top: 44, right: 28, bottom: 52, left: 12 }}
            >
              <CartesianGrid stroke="#3f2d18" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="ts"
                type="number"
                scale="time"
                domain={[STORY_START.getTime(), STORY_END.getTime()]}
                ticks={YEAR_TICKS}
                tickFormatter={formatYearTick}
                stroke="#a16207"
                tick={{ fill: '#fcd34d', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#a16207' }}
                label={{
                  value: 'Date',
                  position: 'bottom',
                  offset: 42,
                  style: axisLabelStyle,
                }}
              />
              <YAxis
                domain={[8, 'dataMax + 1']}
                stroke="#a16207"
                tick={{ fill: '#fcd34d', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#a16207' }}
                width={48}
                label={{
                  value: 'Price (Kr. per liter)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { ...axisLabelStyle, textAnchor: 'middle' },
                }}
              />
              <Tooltip
                cursor={{ stroke: '#a16207', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={<FuelPriceTooltip />}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="petrol"
                name="Petrol (blyfri 95)"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="diesel"
                name="Diesel"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />

              <ReferenceLine
                x={RUSSIA_UKRAINE_INVASION_MS}
                stroke="#fb7185"
                strokeDasharray="5 4"
                strokeWidth={1.5}
                ifOverflow="visible"
                label={{
                  value: 'Russia/Ukraine invasion',
                  position: 'top',
                  fill: '#fda4af',
                  fontSize: isRetro ? 7 : 9,
                  fontFamily: 'monospace',
                }}
              />

              <ReferenceLine
                x={MIDDLE_EAST_ESCALATION_MS}
                stroke="#38bdf8"
                strokeDasharray="5 4"
                strokeWidth={1.5}
                ifOverflow="visible"
                label={{
                  value: 'Middle East escalation',
                  position: 'top',
                  fill: '#7dd3fc',
                  fontSize: isRetro ? 7 : 9,
                  fontFamily: 'monospace',
                }}
              />

              <ReferenceLine
                x={US_IRAN_WAR_MARKER_MS}
                stroke="#c084fc"
                strokeDasharray="5 4"
                strokeWidth={1.5}
                ifOverflow="visible"
                label={{
                  value: 'US/Iran war',
                  position: 'top',
                  fill: '#e9d5ff',
                  fontSize: isRetro ? 7 : 9,
                  fontFamily: 'monospace',
                }}
              />

              <ReferenceLine
                x={currentTs}
                stroke="#fef3c7"
                strokeWidth={2}
                ifOverflow="visible"
                label={{
                  value: '\u25BC',
                  position: 'top',
                  fill: '#fef3c7',
                  fontSize: 10,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
