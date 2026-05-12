'use client'

import { FightArena } from './fight-arena'
import { FightAudioController } from './fight-audio-controller'
import { FightBackground } from './fight-background'
import { FIGHT_FRAME_COUNT, FightProvider, useFight } from './fight-context'
import { FightHud } from './fight-hud'
import { FightHudBars } from './fight-hud-bars'
import { FightIntroFrame } from './fight-intro-frame'
import { FightMapSequence } from './fight-map-sequence'
import { FightMissiles } from './fight-missiles'
import { FightRoundBanner } from './fight-round-banner'
import { FightSpeechBubble } from './fight-speech-bubble'
import { FightSunbeam } from './fight-sunbeam'
import { FightDenmarkChoroplethDialog } from './fight-denmark-choropleth-dialog'
import { FightEpilogueChrome } from './fight-epilogue-overlay-text'
import { FightGreenNewDealWin } from './fight-green-new-deal-win'
import { FightTrumpWon } from './fight-trump-won'

export function Fight({ onComplete }: { onComplete?: () => void }) {
  return (
    <FightProvider onComplete={onComplete}>
      <FightView />
    </FightProvider>
  )
}

function FightView() {
  const { sectionRef } = useFight()

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Visible 16:9 stage — centered, letterboxed by black bars on whichever axis overflows */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          className="@container relative overflow-hidden bg-zinc-950"
          style={{
            width: 'min(100vw, calc(100dvh * 16 / 9))',
            height: 'min(100dvh, calc(100vw * 9 / 16))',
          }}
        >
          <FightBackground />
          <FightArena />
          <FightSunbeam />
          <FightMissiles />
          <FightTrumpWon />
          <FightGreenNewDealWin />
          <FightIntroFrame />
          <FightSpeechBubble />
          <FightEpilogueChrome />
          <FightRoundBanner />
          <FightMapSequence />
          <FightHudBars />
          <FightHud />
          <FightAudioController />
          <FightDenmarkChoroplethDialog />
        </div>
      </div>

      {/* Invisible full-viewport scroll driver — wheel / touch / keys advance one frame at a time */}
      <section
        ref={sectionRef}
        data-fight-scroll-scroller
        className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-transparent [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: FIGHT_FRAME_COUNT }, (_, i) => (
          <div
            key={i}
            aria-hidden
            data-fight-scroll-rail
            className="h-dvh w-full shrink-0"
          />
        ))}
      </section>
    </div>
  )
}
