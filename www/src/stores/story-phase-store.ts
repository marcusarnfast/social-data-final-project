import { create } from 'zustand'

export const STORY_PHASES = ['terminal', 'start-screen', 'loading', 'story'] as const

export type StoryPhase = (typeof STORY_PHASES)[number]

export const STORY_MODES = ['fight-intro', 'narrative-scroll', 'map-panel', 'vehicle-panel'] as const

export type StoryMode = (typeof STORY_MODES)[number]

type StoryPhaseStore = {
  phase: StoryPhase
  storyMode: StoryMode
  mapCompleted: boolean
  vehicleCompleted: boolean
  setPhase: (phase: StoryPhase) => void
  goToStartScreen: () => void
  goToLoading: () => void
  goToStory: () => void
  completeFightIntro: () => void
  enterMapPanel: () => void
  enterVehiclePanel: () => void
  returnFromMapPanel: () => void
  returnFromVehiclePanel: () => void
}

export const useStoryPhaseStore = create<StoryPhaseStore>((set) => ({
  phase: 'terminal',
  storyMode: 'fight-intro',
  mapCompleted: false,
  vehicleCompleted: false,
  setPhase: (phase) => set(() => ({ phase })),
  goToStartScreen: () => set(() => ({ phase: 'start-screen' })),
  goToLoading: () => set(() => ({ phase: 'loading' })),
  goToStory: () =>
    set(() => ({
      phase: 'story',
      storyMode: 'fight-intro',
      mapCompleted: false,
      vehicleCompleted: false,
    })),
  completeFightIntro: () => set(() => ({ storyMode: 'narrative-scroll' })),
  enterMapPanel: () => set(() => ({ storyMode: 'map-panel' })),
  enterVehiclePanel: () => set(() => ({ storyMode: 'vehicle-panel' })),
  returnFromMapPanel: () =>
    set(() => ({
      storyMode: 'narrative-scroll',
      mapCompleted: true,
    })),
  returnFromVehiclePanel: () =>
    set(() => ({
      storyMode: 'narrative-scroll',
      vehicleCompleted: true,
    })),
}))
