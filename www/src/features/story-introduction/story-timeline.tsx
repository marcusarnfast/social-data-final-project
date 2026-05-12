'use client'

import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import '~/components/ui/8bit/styles/retro.css'

import { CHAPTERS, STORY_END, STORY_START } from './chapters'
import { getPropellantPrices } from './preload-story-assets'

type RawPriceRow = { date: string; petrol: number; diesel: number; electric: number }
type PriceRow = { ts: number; petrol: number; diesel: number }

/** Russia’s full-scale invasion of Ukraine — vertical marker on the fuel chart. */
const UKRAINE_FULL_INVASION_START_MS = Date.UTC(2022, 1, 24)

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
          DK fuel price (DKK / liter)
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
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          style={{ overflow: 'visible' }}
        >
        <LineChart
          data={data}
          margin={{ top: 26, right: 28, bottom: 36, left: 4 }}
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
          />
          <YAxis
            domain={[8, 'dataMax + 1']}
            stroke="#a16207"
            tick={{ fill: '#fcd34d', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#a16207' }}
            width={44}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #a16207',
              fontFamily: 'monospace',
              fontSize: 11,
            }}
            labelStyle={{ color: '#fcd34d' }}
            labelFormatter={(label) => formatMonthYear(label as number)}
            formatter={(value, name) => [
              typeof value === 'number' ? `${value.toFixed(2)} DKK` : String(value),
              name === 'petrol' ? 'Petrol' : 'Diesel',
            ]}
          />
          <Line
            type="monotone"
            dataKey="petrol"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="petrol"
          />
          <Line
            type="monotone"
            dataKey="diesel"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="diesel"
          />

          <ReferenceLine
            x={UKRAINE_FULL_INVASION_START_MS}
            stroke="#fb7185"
            strokeDasharray="5 4"
            strokeWidth={1.5}
            ifOverflow="visible"
            label={{
              value: '24 Feb 2022 — invasion',
              position: 'top',
              fill: '#fda4af',
              fontSize: isRetro ? 7 : 10,
              fontFamily: 'monospace',
            }}
          />

          {isRetro
            ? null
            : CHAPTERS.map((chapter) => (
                <ReferenceDot
                  key={chapter.id}
                  x={chapter.time.getTime()}
                  y={9}
                  r={4}
                  fill="#ef4444"
                  stroke="#fef3c7"
                  strokeWidth={1}
                  ifOverflow="visible"
                />
              ))}

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
