'use client'

import { FightScrollTestBackground } from './fight-scroll-test-background'
import {
  FightScrollTestProvider,
  FIGHT_SCROLL_TEST_FRAME_COUNT,
  useFightScrollTest,
} from './fight-scroll-test-context'
import { FightScrollTestHud } from './fight-scroll-test-hud'

export function FightScrollTest() {
  return (
    <FightScrollTestProvider>
      <FightScrollTestView />
    </FightScrollTestProvider>
  )
}

function FightScrollTestView() {
  const { sectionRef } = useFightScrollTest()

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Visible 16:9 stage — centered, letterboxed by black bars on whichever axis overflows */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          className="relative overflow-hidden bg-zinc-950"
          style={{
            width: 'min(100vw, calc(100dvh * 16 / 9))',
            height: 'min(100dvh, calc(100vw * 9 / 16))',
          }}
        >
          <FightScrollTestBackground />
          {/* Future layers (characters, FX, etc.) mount here, all `absolute inset-0` */}
          <FightScrollTestHud />
        </div>
      </div>

      {/* Invisible full-viewport scroll driver — native continuous scroll, snaps to each frame */}
      <section
        ref={sectionRef}
        data-fight-scroll-scroller
        className="absolute inset-0 z-10 snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-y-contain bg-transparent [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: FIGHT_SCROLL_TEST_FRAME_COUNT }, (_, i) => (
          <div
            key={i}
            aria-hidden
            data-fight-scroll-rail
            className="h-dvh w-full shrink-0 snap-start"
          />
        ))}
      </section>
    </div>
  )
}
