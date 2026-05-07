import { create } from 'zustand'

export const STORY_PHASES = ['terminal', 'start-screen'] as const

export type StoryPhase = (typeof STORY_PHASES)[number]

const PHASE_QUERY_KEY = 'phase'

function isStoryPhase(value: string | null): value is StoryPhase {
  return value !== null && STORY_PHASES.includes(value as StoryPhase)
}

function getPhaseFromUrl(): StoryPhase | null {
  if (typeof window === 'undefined') return null

  const queryPhase = new URLSearchParams(window.location.search).get(PHASE_QUERY_KEY)
  return isStoryPhase(queryPhase) ? queryPhase : null
}

function syncPhaseToUrl(phase: StoryPhase) {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  url.searchParams.set(PHASE_QUERY_KEY, phase)
  window.history.replaceState(null, '', url)
}

type StoryPhaseStore = {
  phase: StoryPhase
  nextPhase: () => void
  setPhase: (phase: StoryPhase) => void
}

export const useStoryPhaseStore = create<StoryPhaseStore>((set) => ({
  phase: getPhaseFromUrl() ?? 'terminal',
  nextPhase: () =>
    set((state) => {
      const currentIndex = STORY_PHASES.indexOf(state.phase)
      const nextIndex = currentIndex + 1

      if (nextIndex >= STORY_PHASES.length) {
        return state
      }

      const phase = STORY_PHASES[nextIndex]
      syncPhaseToUrl(phase)

      return { phase }
    }),
  setPhase: (phase) =>
    set(() => {
      syncPhaseToUrl(phase)
      return { phase }
    }),
}))
