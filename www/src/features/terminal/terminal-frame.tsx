'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import {
  markBackgroundMusicInteracted,
  playTrack,
  setBackgroundMusicMuted,
} from '~/features/audio/background-music'

const NARRATIVE_SEQUENCE = [
  { text: 'C:\\>CD social_data_final_project', delay: 180, mode: 'instant' },
  { text: '', delay: 140, mode: 'blank' },
  { text: 'C:\\social_data_final_project>story_intro.exe', delay: 220, mode: 'instant' },
  {
    text: 'Loading geopolitical briefing',
    delay: 260,
    mode: 'loading',
    loadingTicks: 8,
    loadingSuffix: '',
  },
  {
    text: 'Initializing market signal feed',
    delay: 180,
    mode: 'loading',
    loadingTicks: 6,
    loadingSuffix: ' OK',
  },
  { text: '', delay: 260, mode: 'blank' },
  { text: '', delay: 320, mode: 'clear' },
  {
    text: "Since 2016, Donald Trump's agenda has rocked the global economy creating massive price shocks, all of which can be seen in the Global Conflict Index. From the first Trade Tariffs to the total withdrawal from the Paris Climate Agreement, the world's markets have constantly been on a knife-edge.",
    delay: 300,
    mode: 'typing',
  },
  { text: '', delay: 350, mode: 'blank' },
  {
    text: 'Now, with the blockade of the Strait of Hormuz and the Persian Gulf on the brink of war, the global oil supply has hit a breaking point.',
    delay: 200,
    mode: 'typing',
  },
  { text: '', delay: 300, mode: 'blank' },
  {
    text: "As the fuel prices are skyrocketing, becoming a financial nightmare for Danes, Trump's actions have inadvertently accelerated the green transition in Denmark. The Danish Motor Register shows a country in revolt, where people have largely transitioned from gas to EV.",
    delay: 200,
    mode: 'typing',
  },
  { text: '', delay: 320, mode: 'blank' },
  {
    text: 'This is the story of how the 45th (and 47th) President of the United States accidentally became the greatest environmentalist in history.',
    delay: 220,
    mode: 'typing',
  },
  { text: '', delay: 300, mode: 'blank' },
  { text: 'Remember to turn up your volume.', delay: 240, mode: 'typing' },
] as const

const ENTER_PROMPT = '>> press enter <<'

type TerminalLine = {
  id: number
  text: string
  mode: 'instant' | 'blank' | 'typing' | 'loading' | 'prompt'
  isPrompt?: boolean
  loadingTicks?: number
  loadingSuffix?: string
}

function BlinkingCursor() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((value) => !value)
    }, 530)

    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="ml-px inline-block h-[1em] w-[0.5em] align-middle bg-phosphor-green"
      style={{ opacity: visible ? 1 : 0 }}
    />
  )
}

function TypewriterLine({
  text,
  onComplete,
}: {
  text: string
  onComplete: () => void
}) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (displayedText.length < text.length) {
      const nextChar = text[displayedText.length]
      const previousChar = displayedText[displayedText.length - 1] ?? ''
      const isPausePunctuation = /[.,:;!?]/.test(previousChar)
      const isWhitespace = nextChar === ' '
      const isStutter = Math.random() < 0.12
      const cadenceBucket = Math.random()

      let typingDelay = 0
      if (cadenceBucket < 0.2) typingDelay = 6 + Math.random() * 8
      else if (cadenceBucket < 0.75) typingDelay = 12 + Math.random() * 14
      else typingDelay = 22 + Math.random() * 22

      if (isWhitespace) typingDelay += 3 + Math.random() * 5
      if (isPausePunctuation) typingDelay += 16 + Math.random() * 30
      if (isStutter) typingDelay += 18 + Math.random() * 34

      const nextSliceLength = Math.min(
        text.length,
        displayedText.length + (isWhitespace || isPausePunctuation ? 1 : 2),
      )

      const timeout = window.setTimeout(() => {
        setDisplayedText(text.slice(0, nextSliceLength))
      }, typingDelay)

      return () => window.clearTimeout(timeout)
    }

    onComplete()
  }, [displayedText, onComplete, text])

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length ? <BlinkingCursor /> : null}
    </span>
  )
}

function LoadingDotsLine({
  text,
  loadingTicks = 6,
  loadingSuffix = '',
  onComplete,
}: {
  text: string
  loadingTicks?: number
  loadingSuffix?: string
  onComplete: () => void
}) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (tick >= loadingTicks) {
      onComplete()
      return
    }

    const timeout = window.setTimeout(() => {
      setTick((prev) => prev + 1)
    }, 180 + Math.random() * 110)

    return () => window.clearTimeout(timeout)
  }, [loadingTicks, onComplete, tick])

  const dotCount = tick >= loadingTicks ? 3 : (tick % 3) + 1
  const dots = '.'.repeat(dotCount)
  const suffix = tick >= loadingTicks ? loadingSuffix : ''

  return (
    <span>
      {text}
      {dots}
      {suffix}
    </span>
  )
}

export function TerminalFrame({ onContinue }: { onContinue: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)

  const handleLineComplete = useCallback(() => {
    setCurrentIndex((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (currentIndex > NARRATIVE_SEQUENCE.length) return

    if (currentIndex === NARRATIVE_SEQUENCE.length) {
      setLines((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), text: ENTER_PROMPT, mode: 'prompt', isPrompt: true },
      ])
      setIsComplete(true)
      setCurrentIndex((prev) => prev + 1)
      return
    }

    const current = NARRATIVE_SEQUENCE[currentIndex]

    const timer = window.setTimeout(() => {
      if (current.mode === 'blank') {
        setLines((prev) => [...prev, { id: Date.now() + Math.random(), text: '', mode: 'blank' }])
        setCurrentIndex((prev) => prev + 1)
        return
      }

      if (current.mode === 'clear') {
        setLines([])
        setCurrentIndex((prev) => prev + 1)
        return
      }

      if (current.mode === 'instant') {
        setLines((prev) => [...prev, { id: Date.now() + Math.random(), text: current.text, mode: 'instant' }])
        setCurrentIndex((prev) => prev + 1)
        return
      }

      if (current.mode === 'loading') {
        setLines((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            text: current.text,
            mode: 'loading',
            loadingTicks: current.loadingTicks,
            loadingSuffix: current.loadingSuffix,
          },
        ])
        return
      }

      setLines((prev) => [...prev, { id: Date.now() + Math.random(), text: current.text, mode: 'typing' }])
    }, current.delay)

    return () => window.clearTimeout(timer)
  }, [currentIndex])

  useEffect(() => {
    if (!viewportRef.current) return
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    if (!isComplete) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return

      event.preventDefault()
      markBackgroundMusicInteracted()
      setBackgroundMusicMuted(false)
      void playTrack('street-fighter')
      onContinue()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isComplete, onContinue])

  return (
    <section
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-black p-8"
      style={{ cursor: 'url("/cursor/ketamine.PNG") 12 12, auto' }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="h-[760px] w-[1200px]"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at center, rgba(51, 255, 51, 0.12) 0%, rgba(51, 255, 51, 0.06) 24%, rgba(51, 255, 51, 0.02) 48%, transparent 72%)',
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="h-[480px] w-[760px]"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at center, rgba(51, 255, 51, 0.09) 0%, rgba(51, 255, 51, 0.04) 35%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 h-[450px] w-full max-w-[640px] overflow-hidden">
        <div
          className="pointer-events-none absolute -inset-12 z-20 opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.7) 1px, rgba(0,0,0,0.7) 2px)',
            backgroundSize: '100% 2px',
          }}
        />

        <div
          className="pointer-events-none absolute -inset-12 z-20 opacity-[0.04]"
          style={{
            background:
              'linear-gradient(transparent 0%, rgba(51, 255, 51, 0.15) 50%, transparent 100%)',
            backgroundSize: '100% 8px',
            animation: 'scanline 8s linear infinite',
            willChange: 'transform',
          }}
        />

        <div
          className="pointer-events-none absolute -inset-12 z-20 opacity-[0.03]"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.03) 100%)',
          }}
        />

        <div
          className="pointer-events-none absolute -inset-12 z-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(51, 255, 51, 0.04) 0%, transparent 60%)',
          }}
        />

        <div
          className="relative z-10 h-full py-8 overflow-hidden"
          style={{
            paddingLeft: '80px',
            paddingRight: '80px',
            marginLeft: '-80px',
            marginRight: '-80px',
            width: 'calc(100% + 160px)',
          }}
        >
          <div
            ref={viewportRef}
            className="scrollbar-hide h-full overflow-y-auto pr-4 font-mono text-xs leading-relaxed"
            style={{
              textShadow: '0 0 6px rgba(51, 255, 51, 0.45)',
              contain: 'content',
              willChange: 'scroll-position',
            }}
          >
            {lines.map((line) => (
              <div key={line.id} className="min-h-[1.4em] text-phosphor-green">
                {line.mode === 'blank' ? (
                  <br />
                ) : line.isPrompt ? (
                  <span>
                    {line.text}
                    <BlinkingCursor />
                  </span>
                ) : line.mode === 'instant' ? (
                  <span>{line.text}</span>
                ) : line.mode === 'loading' ? (
                  <LoadingDotsLine
                    text={line.text}
                    loadingTicks={line.loadingTicks}
                    loadingSuffix={line.loadingSuffix}
                    onComplete={handleLineComplete}
                  />
                ) : (
                  <TypewriterLine text={line.text} onComplete={handleLineComplete} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .text-phosphor-green {
          color: #33ff33;
        }
        .bg-phosphor-green {
          background-color: #33ff33;
        }
      `}</style>
    </section>
  )
}
