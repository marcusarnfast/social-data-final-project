'use client'

import { motion } from 'motion/react'

import '~/components/ui/8bit/styles/retro.css'

import { useFight } from './fight-context'

const MARQUEE_TEXT =
  'BUT DID HE WIN?  SCROLL FURTHER TO SEE WHO THE REAL WINNER IS.  '

/**
 * Final scene for the "Trump won" frame: full-stage gif with a bold "TRUMP WON"
 * stamp and a horizontally scrolling 8-bit marquee teasing the next reveal.
 * Mounts when `scene.extras.effect === 'trump-won'`.
 */
export function FightTrumpWon() {
  const { scene } = useFight()
  if (scene.extras?.effect !== 'trump-won') return null

  const looped = MARQUEE_TEXT.repeat(4)

  return (
    <div className="pointer-events-none absolute inset-0 z-25" aria-hidden>
      <motion.img
        src="/fight/final/Final - Trump won.gif"
        alt=""
        draggable={false}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="pixelated absolute inset-0 h-full w-full select-none object-contain object-right drop-shadow-[8px_8px_0_rgba(0,0,0,0.85)]"
      />

      <TrumpWonStamp />
      <Marquee text={looped} />
    </div>
  )
}

function TrumpWonStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
      animate={{
        opacity: [0, 1, 1, 1, 1],
        scale: [0.4, 1.25, 0.95, 1.08, 1],
        rotate: [-8, -8, -8, -8, -8],
      }}
      transition={{ duration: 0.7, times: [0, 0.4, 0.6, 0.85, 1], ease: 'easeOut' }}
      className="absolute left-[5%] top-[28%] z-30 max-w-[44cqw]"
    >
      <div className="retro relative animate-[trumpWonBlink_1.4s_steps(2,end)_infinite] border-[10px] border-amber-300 bg-red-700 px-[4cqw] py-[3cqh] shadow-[10px_10px_0_0_rgba(0,0,0,0.9)]">
        <span
          aria-hidden
          className="retro absolute inset-0 grid place-items-center translate-x-[6px] translate-y-[6px] text-[8cqh] uppercase leading-none tracking-[0.18em] text-black"
        >
          TRUMP WON
        </span>
        <span className="retro relative grid place-items-center text-[8cqh] uppercase leading-none tracking-[0.18em] text-amber-100 drop-shadow-[3px_3px_0_rgba(0,0,0,0.9)]">
          TRUMP WON
        </span>
      </div>
      <style>{TRUMP_WON_KEYFRAMES}</style>
    </motion.div>
  )
}

function Marquee({ text }: { text: string }) {
  return (
    <div className="absolute bottom-[6%] inset-x-0 overflow-hidden border-y-[6px] border-amber-200 bg-black/85">
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: '-50%' }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        className="retro flex w-max whitespace-nowrap py-[1.6cqh] text-[2.6cqh] uppercase tracking-[0.18em] text-amber-200"
      >
        <span className="px-[2cqw]">{text}</span>
        <span className="px-[2cqw]">{text}</span>
      </motion.div>
    </div>
  )
}

const TRUMP_WON_KEYFRAMES = `
@keyframes trumpWonBlink {
  0%, 60% { filter: none; }
  61%, 100% { filter: hue-rotate(20deg) brightness(1.25); }
}
@media (prefers-reduced-motion: reduce) {
  [class*="trumpWonBlink"] { animation: none !important; }
}
`
