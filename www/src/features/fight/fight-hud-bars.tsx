'use client'

import { useMemo } from 'react'

import '~/components/ui/8bit/styles/retro.css'

import { useFight } from './fight-context'
import {
  getActiveRound,
  getActiveSnapshot,
  type FighterStats,
} from './fight-scene-store'

export function FightHudBars() {
  const { store, frameIndex, scene } = useFight()
  const snapshot = useMemo(
    () => getActiveSnapshot(store, frameIndex),
    [store, frameIndex],
  )
  const round = useMemo(
    () => getActiveRound(store, frameIndex),
    [store, frameIndex],
  )

  if (frameIndex < 1) return null
  if (scene.extras?.fightMode === 'map-explore') return null
  if (scene.extras?.hideHud) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[2%] z-30 px-[2%]">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-[2%]">
        <FighterBars
          name="GRETA"
          stats={snapshot.greta}
          align="left"
        />
        <KoPlate round={round} />
        <FighterBars
          name="TRUMP"
          stats={snapshot.trump}
          align="right"
        />
      </div>
    </div>
  )
}

function FighterBars({
  name,
  stats,
  align,
}: {
  name: string
  stats: FighterStats
  align: 'left' | 'right'
}) {
  const isRight = align === 'right'

  return (
    <div className={`flex flex-col gap-[0.6cqh] ${isRight ? 'items-end' : 'items-start'}`}>
      <span className="retro text-[1.5cqh] uppercase leading-none tracking-[0.18em] text-amber-100 drop-shadow-[2px_2px_0_rgba(0,0,0,0.85)]">
        {name}
      </span>
      <SegmentedBar
        label="HP"
        value={stats.health}
        fillClass="bg-red-500"
        align={align}
      />
      <SegmentedBar
        label="MD"
        value={stats.mood}
        fillClass="bg-emerald-400"
        align={align}
      />
    </div>
  )
}

function SegmentedBar({
  label,
  value,
  fillClass,
  align,
}: {
  label: string
  value: number
  fillClass: string
  align: 'left' | 'right'
}) {
  const segments = 20
  const filled = Math.max(0, Math.min(segments, Math.round((value / 100) * segments)))
  const cells = Array.from({ length: segments })
  const ordered = align === 'right' ? cells.slice().reverse() : cells

  return (
    <div className={`flex w-full items-center gap-[1cqw] ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      <span className="retro w-[3cqw] shrink-0 text-[1.2cqh] uppercase leading-none tracking-[0.12em] text-amber-200">
        {label}
      </span>
      <div className="relative h-[2.4cqh] w-full border-[0.4cqh] border-amber-100 bg-black/80 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)]">
        <div className="flex h-full w-full">
          {ordered.map((_, i) => {
            const indexFromFill = align === 'right' ? segments - 1 - i : i
            const on = indexFromFill < filled
            return (
              <div
                key={i}
                className={`mx-[0.5px] h-full flex-1 transition-[background-color] duration-300 ${
                  on ? fillClass : 'bg-transparent'
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function KoPlate({ round }: { round: 1 | 2 | 3 }) {
  return (
    <div className="flex flex-col items-center gap-[0.4cqh]">
      <div className="relative border-[0.5cqh] border-amber-300 bg-red-700 px-[1.2cqw] py-[0.4cqh] shadow-[3px_3px_0_0_rgba(0,0,0,0.85)]">
        <span className="retro block text-[2.6cqh] uppercase leading-none tracking-[0.18em] text-amber-100 drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]">
          K.O.
        </span>
      </div>
      <span className="retro text-[1.2cqh] uppercase leading-none tracking-[0.2em] text-amber-200">
        ROUND {round}
      </span>
    </div>
  )
}
