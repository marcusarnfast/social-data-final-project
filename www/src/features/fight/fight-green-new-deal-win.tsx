'use client'

import { motion } from 'motion/react'

import '~/components/ui/8bit/styles/retro.css'

import { useFight } from './fight-context'

const ART_SRC = '/fight/final/Art%20of%20the%20green%20new%20deal.png'

const MARQUEE_TEXT =
  'THE ART OF THE GREEN NEW DEAL. BUT WHO IS THEN BEHIND ALL THIS? SCROLL ON TO FIND OUT...'

/**
 * Epilogue beat: full-stage “Art of the Green New Deal” with a bold
 * “GRETA & TRUMP WIN” stamp and marquee — mirrors `FightTrumpWon` styling.
 */
export function FightGreenNewDealWin() {
  const { scene } = useFight()
  if (scene.extras?.effect !== 'green-new-deal-win') return null

  const looped = MARQUEE_TEXT.repeat(4)

  return (
    <div className="pointer-events-none absolute inset-0 z-25" aria-hidden>
      <motion.img
        src={ART_SRC}
        alt=""
        draggable={false}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="pixelated absolute inset-0 h-full w-full select-none object-contain object-center drop-shadow-[8px_8px_0_rgba(0,0,0,0.85)]"
      />

      <GretaTrumpWinStamp />
      <Marquee text={looped} />
    </div>
  )
}

function GretaTrumpWinStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
      animate={{
        opacity: [0, 1, 1, 1, 1],
        scale: [0.4, 1.25, 0.95, 1.08, 1],
        rotate: [-8, -8, -8, -8, -8],
      }}
      transition={{ duration: 0.7, times: [0, 0.4, 0.6, 0.85, 1], ease: 'easeOut' }}
      className="absolute left-[15%] top-[50%] z-30 max-w-[52cqw]"
    >
      <div className="retro scale-50 relative animate-[gretaTrumpWinBlink_1.2s_steps(2,end)_infinite] border-10 border-emerald-300 bg-emerald-800 px-[3cqw] py-[2.5cqh] shadow-[10px_10px_0_0_rgba(0,0,0,0.9)]">
        {/* <span
          aria-hidden
          className="retro absolute inset-0 grid place-items-center translate-x-[6px] translate-y-[6px] text-[5.2cqh] uppercase leading-tight tracking-[0.14em] text-black"
        >
          {'GRETA & TRUMP WIN'}
        </span> */}
        <span className="retro relative grid place-items-center text-center text-[5.2cqh] uppercase leading-tight tracking-[0.14em] text-emerald-50 drop-shadow-[3px_3px_0_rgba(0,0,0,0.9)]">
          {'GRETA & TRUMP WINS'}
        </span>
      </div>
      <style>{GRETA_TRUMP_WIN_KEYFRAMES}</style>
    </motion.div>
  )
}

function Marquee({ text }: { text: string }) {
  return (
    <div className="absolute bottom-[6%] inset-x-0 overflow-hidden border-y-[6px] border-emerald-200 bg-black/85">
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: '-50%' }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        className="retro flex w-max whitespace-nowrap py-[1.6cqh] text-[2.6cqh] uppercase tracking-[0.18em] text-emerald-200"
      >
        <span className="px-[2cqw]">{text}</span>
        <span className="px-[2cqw]">{text}</span>
      </motion.div>
    </div>
  )
}

const GRETA_TRUMP_WIN_KEYFRAMES = `
@keyframes gretaTrumpWinBlink {
  0%, 55% { filter: none; opacity: 1; }
  56%, 100% { filter: brightness(1.35) saturate(1.15); opacity: 0.92; }
}
@media (prefers-reduced-motion: reduce) {
  [class*="gretaTrumpWinBlink"] { animation: none !important; }
}
`
