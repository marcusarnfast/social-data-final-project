'use client'

import { AnimatePresence, motion } from 'motion/react'

import { useFight } from './fight-context'

/**
 * Pixel-art beam fired from Greta toward Trump on the solar-attack frame.
 * Mounts when `scene.extras.effect === 'sunbeam'`. The beam stretches
 * horizontally across the gap between fighters and fades out.
 */
export function FightSunbeam() {
  const { scene, frameIndex } = useFight()
  const visible = scene.extras?.effect === 'sunbeam'

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key={`sunbeam-${frameIndex}`}
          className="pointer-events-none absolute inset-y-0 left-[18%] right-[18%] z-15 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0.8, 0] }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 1.1, times: [0, 0.15, 0.55, 0.8, 1], ease: 'linear' }}
        >
          <motion.img
            src="/fight/r2/Sunbeam.png"
            alt=""
            draggable={false}
            initial={{ scaleX: 0.05, x: '-30%' }}
            animate={{ scaleX: [0.05, 1, 1.05, 1], x: ['-30%', '0%', '2%', '0%'] }}
            transition={{ duration: 0.55, times: [0, 0.5, 0.8, 1], ease: 'easeOut' }}
            style={{ transformOrigin: 'left center' }}
            className="pixelated h-[40cqh] w-full select-none object-contain drop-shadow-[6px_6px_0_rgba(0,0,0,0.85)]"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
