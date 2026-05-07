import { useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { VEHICLE_PANEL_EXIT_PROGRESS } from './story-thresholds'

export function useVehiclePanelScroll({
  onComplete,
  enabled = true,
}: {
  onComplete: () => void
  enabled?: boolean
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)
  const didCompleteRef = useRef(false)
  const [hasHydratedTarget, setHasHydratedTarget] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setHasHydratedTarget(false)
      return
    }

    const raf = window.requestAnimationFrame(() => {
      setHasHydratedTarget(Boolean(containerRef.current))
    })
    return () => window.cancelAnimationFrame(raf)
  }, [enabled])

  const scrollOptions =
    enabled && hasHydratedTarget
      ? {
          target: containerRef,
          offset: ['start start', 'end end'],
        }
      : undefined

  const { scrollYProgress } = useScroll(scrollOptions)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!enabled) return
    setProgress(value)
    if (didCompleteRef.current) return
    if (value < VEHICLE_PANEL_EXIT_PROGRESS) return

    didCompleteRef.current = true
    onComplete()
  })

  return { containerRef, progress }
}
