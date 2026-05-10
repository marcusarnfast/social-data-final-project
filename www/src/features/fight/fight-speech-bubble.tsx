'use client'

import { AnimatePresence, motion } from 'motion/react'

import '~/components/ui/8bit/styles/retro.css'

import { useFight } from './fight-context'

const POP_TIMES = [0, 0.4, 0.7, 1]

export function FightSpeechBubble() {
  const { scene, frameIndex } = useFight()
  const dialogue = scene.dialogue

  return (
    <AnimatePresence mode="wait">
      {dialogue ? (
        <motion.div
          key={`bubble-${frameIndex}`}
          className={`pointer-events-none absolute bottom-[4%] z-30 max-w-[44cqw] ${
            dialogue.speaker === 'greta' ? 'left-[4%]' : 'right-[4%]'
          }`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 1, 1], scale: [0.4, 1.15, 0.95, 1] }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.18 } }}
          transition={{ duration: 0.32, times: POP_TIMES, ease: 'linear' }}
        >
          <SpeechBubbleBox speaker={dialogue.speaker} text={dialogue.text} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function SpeechBubbleBox({
  speaker,
  text,
}: {
  speaker: 'greta' | 'trump'
  text: string
}) {
  const palette =
    speaker === 'greta'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
      : 'border-red-200 bg-red-50 text-red-950'
  const speakerLabel = speaker === 'greta' ? 'GRETA' : 'TRUMP'

  return (
    <div
      className={`retro relative border-[0.6cqh] px-[1.6cqw] py-[1.2cqh] shadow-[5px_5px_0_0_rgba(0,0,0,0.85)] ${palette}`}
    >
      <span className="block text-[1.4cqh] uppercase leading-none tracking-[0.18em] opacity-80">
        {speakerLabel}
      </span>
      <p className="mt-[0.8cqh] text-[1.8cqh] leading-[1.5] text-balance">
        {text}
      </p>
      <BubbleTail speaker={speaker} />
    </div>
  )
}

function BubbleTail({ speaker }: { speaker: 'greta' | 'trump' }) {
  const isGreta = speaker === 'greta'
  const positionClass = isGreta ? 'left-[14%]' : 'right-[14%]'
  const borderClass = isGreta ? 'border-emerald-200' : 'border-red-200'
  const bgClass = isGreta ? 'bg-emerald-50' : 'bg-red-50'

  return (
    <div className={`pointer-events-none absolute -top-[1.2cqh] ${positionClass}`}>
      <div className="relative">
        <div
          className={`size-[1.6cqh] rotate-45 border-l-[0.6cqh] border-t-[0.6cqh] ${borderClass} ${bgClass}`}
        />
      </div>
    </div>
  )
}
