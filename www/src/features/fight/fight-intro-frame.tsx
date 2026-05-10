'use client'

import { AnimatePresence, motion } from 'motion/react'

import '~/components/ui/8bit/styles/retro.css'

import { useFight } from './fight-context'

const GRETA_DELAY = 0.35
const TRUMP_DELAY = 1.4
const VS_DELAY = 2.1

const STEP_TIMES = [0, 0.2, 0.4, 0.6, 0.8, 1]

export function FightIntroFrame() {
  const { frameIndex } = useFight()
  const visible = frameIndex === 0

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="fight-intro"
          className="pointer-events-none absolute inset-0 z-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
        >
          <style>{INTRO_KEYFRAMES}</style>

          <div className="@container absolute inset-0 grid grid-cols-[1fr_auto_1fr] items-stretch gap-[2%] px-[6%]">
            <motion.div
              className="flex h-full flex-col items-center justify-end pb-[8%]"
              initial={false}
              animate={{
                opacity: [0, 1, 1, 1, 1, 1],
                x: ['-40%', '-32%', '-22%', '-12%', '-4%', '0%'],
              }}
              transition={{ delay: GRETA_DELAY, duration: 0.55, times: STEP_TIMES, ease: 'linear' }}
            >
              <img
                src="/fight/greta-thunberg.gif"
                alt="Greta Thunberg fighter"
                draggable={false}
                className="pixelated h-[62%] w-auto max-w-full select-none object-contain drop-shadow-[6px_6px_0_rgba(0,0,0,0.85)]"
              />
              <div className="mt-[-1%]">
                <FighterNameplate label="GRETA THUNBERG" tone="green" />
              </div>
            </motion.div>

            <motion.div
              className="flex h-full flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: [0.2, 1.25, 0.9, 1.1, 1] }}
              transition={{ delay: VS_DELAY, duration: 0.55, ease: 'easeOut' }}
            >
              <VsBadge />
            </motion.div>

            <motion.div
              className="flex h-full flex-col items-center justify-end pb-[8%]"
              initial={false}
              animate={{
                opacity: [0, 1, 1, 1, 1, 1],
                x: ['40%', '32%', '22%', '12%', '4%', '0%'],
              }}
              transition={{ delay: TRUMP_DELAY, duration: 0.55, times: STEP_TIMES, ease: 'linear' }}
            >
              <div className="mb-[-1%]">
                <FighterNameplate label="DONALD TRUMP" tone="red" />
              </div>
              <img
                src="/fight/donald-trump.gif"
                alt="Donald Trump fighter"
                draggable={false}
                className="pixelated h-[62%] w-auto max-w-full select-none object-contain drop-shadow-[6px_6px_0_rgba(0,0,0,0.85)]"
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function FighterNameplate({
  label,
  tone,
}: {
  label: string
  tone: 'green' | 'red'
}) {
  const palette =
    tone === 'green'
      ? 'border-emerald-300 bg-emerald-900/85 text-emerald-100'
      : 'border-red-300 bg-red-900/85 text-red-100'

  return (
    <div
      className={`retro relative inline-block animate-[fightLabelBlink_1.6s_steps(2,end)_infinite] border-4 px-3 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] ${palette}`}
    >
      <span className="block text-[1.6cqh] uppercase leading-none tracking-[0.18em] text-balance">
        {label}
      </span>
    </div>
  )
}

function VsBadge() {
  return (
    <div className="relative animate-[fightVsBlink_0.9s_steps(2,end)_infinite]">
      <span
        aria-hidden
        className="retro absolute inset-0 translate-x-[-3px] translate-y-[3px] text-[18cqh] leading-none text-black"
      >
        VS
      </span>
      <span
        aria-hidden
        className="retro absolute inset-0 translate-x-[-6px] translate-y-[6px] text-[18cqh] leading-none text-amber-900"
      >
        VS
      </span>
      <span className="retro relative text-[18cqh] leading-none text-amber-300">
        VS
      </span>
    </div>
  )
}

const INTRO_KEYFRAMES = `
@keyframes fightVsBlink {
  0%, 49% { filter: none; opacity: 1; }
  50%, 100% { filter: hue-rotate(35deg) brightness(1.4); opacity: 0.85; }
}
@keyframes fightLabelBlink {
  0%, 60% { opacity: 1; }
  61%, 100% { opacity: 0.55; }
}
@media (prefers-reduced-motion: reduce) {
  [style*="fightVsBlink"], [class*="fightVsBlink"],
  [style*="fightLabelBlink"], [class*="fightLabelBlink"] { animation: none !important; }
}
`
