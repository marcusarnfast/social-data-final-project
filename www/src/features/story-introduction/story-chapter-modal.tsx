'use client'

import { AnimatePresence, motion } from 'motion/react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import '~/components/ui/8bit/styles/retro.css'

import type { Chapter } from './chapters'

const ENTER = { opacity: 1, x: 0, scale: 1 }
const EXIT = { opacity: 0, x: 32, scale: 0.98 }
const INITIAL = { opacity: 0, x: 32, scale: 0.98 }
const TRANSITION = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }

export function StoryChapterModal({
  chapter,
  variant = 'default',
}: {
  chapter: Chapter | null
  variant?: 'default' | 'retro'
}) {
  const isRetro = variant === 'retro'
  const shellClass = isRetro
    ? 'retro pointer-events-auto absolute right-6 top-6 z-30 w-[min(28rem,90vw)] border-[6px] border-amber-200 bg-black/95 p-5 text-amber-100 shadow-[8px_8px_0_0_rgba(0,0,0,0.9)]'
    : 'pointer-events-auto absolute right-6 top-6 z-30 w-[min(28rem,90vw)] border-2 border-amber-500/70 bg-black/85 p-5 font-mono text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.25)] backdrop-blur-sm'
  const metaClass = isRetro
    ? 'mb-3 flex items-center justify-between text-[8px] uppercase tracking-[0.22em] text-amber-300'
    : 'mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-amber-400/80'
  const titleClass = isRetro
    ? 'mb-3 text-[14px] leading-[1.4] text-amber-200'
    : 'mb-2 font-heading text-lg leading-tight text-amber-200'
  const bodyClass = isRetro
    ? 'mb-4 text-[10px] leading-[1.7] tracking-[0.04em] text-amber-100'
    : 'mb-4 text-[12px] leading-relaxed text-amber-100/85'

  return (
    <AnimatePresence mode="wait">
      {chapter ? (
        <motion.aside
          key={chapter.id}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`chapter-title-${chapter.id}`}
          initial={INITIAL}
          animate={ENTER}
          exit={EXIT}
          transition={TRANSITION}
          className={shellClass}
        >
          <div className={metaClass}>
            <span>{chapter.time.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              timeZone: 'UTC',
            })}</span>
            <span>chapter</span>
          </div>
          <h3 id={`chapter-title-${chapter.id}`} className={titleClass}>
            {chapter.title}
          </h3>
          <p className={bodyClass}>
            {chapter.description}
          </p>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chapter.chart.type === 'line' ? (
                <LineChart
                  data={chapter.chart.data as Array<{ label: string; value: number }>}
                  margin={{ top: 6, right: 6, bottom: 0, left: -16 }}
                >
                  <CartesianGrid stroke="#3f2d18" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#a16207"
                    tick={{ fill: '#fcd34d', fontSize: 9, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: '#a16207' }}
                  />
                  <YAxis
                    stroke="#a16207"
                    tick={{ fill: '#fcd34d', fontSize: 9, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: '#a16207' }}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #a16207',
                      fontFamily: 'monospace',
                      fontSize: 10,
                    }}
                    labelStyle={{ color: '#fcd34d' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    dot={{ fill: '#fbbf24', r: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={chapter.chart.data as Array<{ label: string; value: number }>}
                  margin={{ top: 6, right: 6, bottom: 0, left: -16 }}
                >
                  <CartesianGrid stroke="#3f2d18" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#a16207"
                    tick={{ fill: '#fcd34d', fontSize: 9, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: '#a16207' }}
                  />
                  <YAxis
                    stroke="#a16207"
                    tick={{ fill: '#fcd34d', fontSize: 9, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: '#a16207' }}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #a16207',
                      fontFamily: 'monospace',
                      fontSize: 10,
                    }}
                    labelStyle={{ color: '#fcd34d' }}
                  />
                  <Bar dataKey="value" fill="#fbbf24" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <div
            className={
              isRetro
                ? 'mt-2 text-[8px] uppercase tracking-[0.22em] text-amber-300'
                : 'mt-1 text-[9px] uppercase tracking-[0.18em] text-amber-400/60'
            }
          >
            {chapter.chart.yLabel}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
