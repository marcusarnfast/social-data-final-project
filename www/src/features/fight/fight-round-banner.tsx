'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import '~/components/ui/8bit/styles/retro.css'

import { useFight } from './fight-context'
import { getActiveRound } from './fight-scene-store'

const BANNER_HOLD_MS = 1900

export function FightRoundBanner() {
  const { scene, store, frameIndex } = useFight()
  const round = getActiveRound(store, frameIndex)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!scene.showRoundBanner) {
      setShow(false)
      return
    }
    setShow(true)
    const id = window.setTimeout(() => setShow(false), BANNER_HOLD_MS)
    return () => window.clearTimeout(id)
  }, [scene.showRoundBanner, frameIndex])

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key={`banner-${frameIndex}`}
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <div className="flex flex-col items-center gap-[1.4cqh]">
            <BannerLine
              text={`ROUND ${round}`}
              delay={0}
              color="text-amber-300"
              shadow="text-red-900"
            />
            <BannerLine
              text="FIGHT!"
              delay={0.55}
              color="text-red-400"
              shadow="text-amber-900"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function BannerLine({
  text,
  delay,
  color,
  shadow,
}: {
  text: string
  delay: number
  color: string
  shadow: string
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 1, 1, 1], scale: [0.2, 1.4, 0.95, 1] }}
      transition={{
        delay,
        duration: 0.55,
        times: [0, 0.4, 0.7, 1],
        ease: 'linear',
      }}
    >
      <span
        aria-hidden
        className={`retro absolute inset-0 translate-x-[-4px] translate-y-[5px] text-[8cqh] leading-none ${shadow}`}
      >
        {text}
      </span>
      <span
        className={`retro relative text-[8cqh] leading-none ${color} drop-shadow-[3px_3px_0_rgba(0,0,0,0.9)]`}
      >
        {text}
      </span>
    </motion.div>
  )
}
