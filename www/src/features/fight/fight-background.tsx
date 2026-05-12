'use client'

import { useFight } from './fight-context'

/** One full-stage mural; `object-position` follows `frameIndex` from context. */
export function FightBackground() {
  const { scene, background, frameIndex } = useFight()
  const focusX = background.horizontalFocusPercent ?? 50
  const ms = background.transitionMs ?? 500
  /** Intro uses separate Greta/Trump gifs; hiding the mural on frame 0 avoids doubling the same silhouettes. */
  const hideMuralForIntro = frameIndex === 0

  return (
    <>
      <img
        src={background.imageSrc}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        style={{
          objectPosition: `${focusX}% ${scene.backgroundFocusYPercent}%`,
          transition: `object-position ${ms}ms cubic-bezier(0.33, 1, 0.68, 1), opacity 280ms ease-out`,
          opacity: hideMuralForIntro ? 0 : 1,
        }}
      />
      {background.scrimClassName ? (
        <div aria-hidden className={`pointer-events-none absolute inset-0 ${background.scrimClassName}`} />
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />
      )}
    </>
  )
}
