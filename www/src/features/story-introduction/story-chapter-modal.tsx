'use client'

import { AnimatePresence, motion } from 'motion/react'

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
    ? 'mb-3 text-[8px] uppercase tracking-[0.22em] text-amber-300'
    : 'mb-2 text-[10px] uppercase tracking-[0.2em] text-amber-400/80'
  const titleClass = isRetro
    ? 'mb-3 text-[14px] leading-[1.4] text-amber-200'
    : 'mb-2 font-heading text-lg leading-tight text-amber-200'
  const bodyClass = isRetro
    ? 'text-[10px] leading-[1.7] tracking-[0.04em] text-amber-100'
    : 'text-[12px] leading-relaxed text-amber-100/85'

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
            {chapter.time.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              timeZone: 'UTC',
            })}
          </div>
          <h3 id={`chapter-title-${chapter.id}`} className={titleClass}>
            {chapter.title}
          </h3>
          <img
            src={chapter.imageSrc}
            alt={chapter.title}
            className="mb-4 w-full max-h-40 object-contain object-left pixelated"
          />
          <p className={bodyClass}>
            {chapter.description}
          </p>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
