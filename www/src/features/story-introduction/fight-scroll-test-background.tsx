'use client'

import { useFightScrollTest } from './fight-scroll-test-context'

/** One full-viewport mural; `object-position` follows `frameIndex` from context (animated per store). */
export function FightScrollTestBackground() {
  const { scene, background } = useFightScrollTest()
  const focusX = background.horizontalFocusPercent ?? 50
  const ms = background.transitionMs ?? 500

  return (
    <>
      <img
        src={background.imageSrc}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        style={{
          objectPosition: `${focusX}% ${scene.backgroundFocusYPercent}%`,
          transition: `object-position ${ms}ms cubic-bezier(0.33, 1, 0.68, 1)`,
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
