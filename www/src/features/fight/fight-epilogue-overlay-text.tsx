'use client'

import { useEffect, useState } from 'react'

import { createPortal } from 'react-dom'

import { motion } from 'motion/react'

import '~/components/ui/8bit/styles/retro.css'

import { useFight } from './fight-context'

/** Renders `extras.epilogueOverlayText` when set (e.g. final-frame punchline). */
export function FightEpilogueOverlayText() {
  const { scene, frameIndex } = useFight()
  const raw = scene.extras?.epilogueOverlayText
  const text = typeof raw === 'string' && raw.trim() ? raw.trim() : null
  if (!text) return null

  return (
    <motion.div
      key={`epilogue-overlay-${frameIndex}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-x-0 top-[10%] z-35 flex justify-center px-[5%]"
      aria-live="polite"
    >
      <p className="retro max-w-[90cqw] text-balance text-center text-[clamp(9px,3.4cqh,20px)] uppercase leading-snug tracking-[0.16em] text-amber-200 drop-shadow-[4px_4px_0_rgba(0,0,0,0.92)]">
        {text}
      </p>
    </motion.div>
  )
}

/** Portaled CTA above the fight scroll scroller so the link stays clickable. */
function FightEpilogueNotebookLinkPortal({ href }: { href: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-60 flex items-end justify-center pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="pointer-events-auto w-[min(94vw,28rem)] px-3 pb-6"
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="retro retro-pixel-blink flex min-h-[56px] w-full items-center justify-center border-4 border-amber-200 bg-amber-400 px-4 py-4 text-center text-[clamp(11px,3.2vw,15px)] font-normal uppercase leading-tight tracking-[0.14em] text-black shadow-[8px_8px_0_0_rgba(0,0,0,0.88)] hover:bg-amber-300"
        >
          LINK TO NOTEBOOK
        </a>
      </motion.div>
    </div>,
    document.body,
  )
}

/** Epilogue copy on the stage plus optional portaled notebook CTA on the last frame. */
export function FightEpilogueChrome() {
  const { scene } = useFight()
  const rawUrl = scene.extras?.notebookLinkUrl
  const notebookUrl =
    typeof rawUrl === 'string' && rawUrl.trim().length > 0 ? rawUrl.trim() : null

  return (
    <>
      <FightEpilogueOverlayText />
      {notebookUrl ? <FightEpilogueNotebookLinkPortal href={notebookUrl} /> : null}
    </>
  )
}
