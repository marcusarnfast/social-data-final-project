import { useLayoutEffect } from "react"
import { useRouterState } from "@tanstack/react-router"

import { pathnameToPhase } from "@/store/phase"
import { usePhaseStore } from "@/store/use-phase-store"

/**
 * Keeps `usePhaseStore.phase` aligned with the current URL.
 */
export function PhaseSync() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  })
  const setPhase = usePhaseStore((s) => s.setPhase)

  useLayoutEffect(() => {
    setPhase(pathnameToPhase(pathname))
  }, [pathname, setPhase])

  useLayoutEffect(() => {
    const onFeed = pathname === "/feed"
    document.body.classList.toggle("theme-crimein-body", onFeed)
    return () => {
      document.body.classList.remove("theme-crimein-body")
    }
  }, [pathname])

  return null
}
