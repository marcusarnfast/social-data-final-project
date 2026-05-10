'use client'

import { motion } from 'motion/react'

import { useFight } from './fight-context'
import type { FighterOverride, FighterPose } from './fight-scene-store'

const STEP_TIMES = [0, 0.25, 0.5, 0.75, 1]

export function FightArena() {
  const { frameIndex, scene, store } = useFight()
  if (frameIndex < 1) return null
  if (scene.extras?.fightMode === 'map-explore') return null
  if (scene.extras?.hideFighters) return null

  const greta = scene.fighters?.greta
  const trump = scene.fighters?.trump

  const gretaSrc = greta?.src ?? store.fighters.greta.idleSrc
  const trumpSrc = trump?.src ?? store.fighters.trump.idleSrc
  const gretaPose: FighterPose = greta?.pose ?? 'idle'
  const trumpPose: FighterPose = trump?.pose ?? 'idle'

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute inset-x-0 bottom-[5%] flex items-end justify-between px-[6%]">
        <FighterSprite
          key={`greta-${gretaSrc}-${frameIndex}`}
          src={gretaSrc}
          alt="Greta Thunberg fighter"
          pose={gretaPose}
          side="left"
        />
        <FighterSprite
          key={`trump-${trumpSrc}-${frameIndex}`}
          src={trumpSrc}
          alt="Donald Trump fighter"
          pose={trumpPose}
          side="right"
        />
      </div>
    </div>
  )
}

function FighterSprite({
  src,
  alt,
  pose,
  side,
}: {
  src: string
  alt: string
  pose: FighterPose
  side: 'left' | 'right'
}) {
  const lungeDirection = side === 'left' ? 1 : -1

  const animate = (() => {
    if (pose === 'attack') {
      return {
        opacity: [0, 1, 1, 1, 1],
        x: [
          `0%`,
          `${lungeDirection * 4}%`,
          `${lungeDirection * 12}%`,
          `${lungeDirection * 6}%`,
          `0%`,
        ],
      }
    }
    if (pose === 'hit') {
      return {
        opacity: [0, 1, 0.3, 1, 0.5, 1],
        x: [
          `0%`,
          `${-lungeDirection * 6}%`,
          `${-lungeDirection * 10}%`,
          `${-lungeDirection * 4}%`,
          `${-lungeDirection * 2}%`,
          `0%`,
        ],
      }
    }
    return { opacity: [0, 1, 1, 1, 1], x: ['0%', '0%', '0%', '0%', '0%'] }
  })()

  const duration = pose === 'idle' ? 0.25 : 0.6
  const times = pose === 'hit' ? [0, 0.15, 0.35, 0.55, 0.8, 1] : STEP_TIMES

  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      initial={false}
      animate={animate}
      transition={{ duration, times, ease: 'linear' }}
      className="pixelated h-[55cqh] w-auto max-w-[40cqw] select-none object-contain drop-shadow-[6px_6px_0_rgba(0,0,0,0.85)]"
    />
  )
}

export type { FighterOverride }
