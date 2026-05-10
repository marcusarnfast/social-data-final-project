'use client'

import { AnimatePresence, motion } from 'motion/react'

import { useFight } from './fight-context'

/**
 * Pixel-art missile barrage launched from Trump's side, arcing across the
 * stage. Mounts when `scene.extras.effect === 'missiles'`.
 */
export function FightMissiles() {
  const { scene, frameIndex } = useFight()
  const visible = scene.extras?.effect === 'missiles'

  return (
    <AnimatePresence>
      {visible ? (
        <div
          key={`missiles-${frameIndex}`}
          className="pointer-events-none absolute inset-0 z-15 overflow-hidden"
          aria-hidden
        >
          {MISSILES.map((m, i) => (
            <Missile key={i} {...m} />
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  )
}

type MissileSpec = {
  delay: number
  startX: string
  startY: string
  endX: string
  endY: string
  size: string
  rotateFrom: number
  rotateTo: number
  duration: number
}

const MISSILES: ReadonlyArray<MissileSpec> = [
  { delay: 0.0, startX: '110%', startY: '20%', endX: '5%', endY: '70%', size: '12cqh', rotateFrom: 235, rotateTo: 245, duration: 1.1 },
  { delay: 0.25, startX: '120%', startY: '5%', endX: '20%', endY: '60%', size: '9cqh', rotateFrom: 230, rotateTo: 240, duration: 1.0 },
  { delay: 0.55, startX: '105%', startY: '40%', endX: '-5%', endY: '85%', size: '14cqh', rotateFrom: 240, rotateTo: 250, duration: 1.2 },
  { delay: 0.85, startX: '115%', startY: '12%', endX: '15%', endY: '78%', size: '10cqh', rotateFrom: 225, rotateTo: 235, duration: 1.0 },
  { delay: 1.2, startX: '108%', startY: '30%', endX: '0%', endY: '65%', size: '11cqh', rotateFrom: 245, rotateTo: 255, duration: 1.1 },
]

function Missile({
  delay,
  startX,
  startY,
  endX,
  endY,
  size,
  rotateFrom,
  rotateTo,
  duration,
}: MissileSpec) {
  return (
    <motion.img
      src="/fight/r3/missile.png"
      alt=""
      draggable={false}
      initial={{ left: startX, top: startY, opacity: 0, rotate: rotateFrom, scale: 0.7 }}
      animate={{
        left: [startX, startX, endX],
        top: [startY, startY, endY],
        opacity: [0, 1, 1, 0],
        rotate: [rotateFrom, rotateFrom, rotateTo],
        scale: [0.7, 1, 1],
      }}
      transition={{
        duration,
        delay,
        times: [0, 0.05, 0.95, 1],
        ease: 'linear',
      }}
      style={{ height: size, width: 'auto' }}
      className="pixelated absolute select-none drop-shadow-[4px_4px_0_rgba(0,0,0,0.85)]"
    />
  )
}
