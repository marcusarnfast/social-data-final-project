import { create } from "zustand"

import type { AppPhase } from "./phase"

type PhaseState = {
  phase: AppPhase
  setPhase: (phase: AppPhase) => void
}

export const usePhaseStore = create<PhaseState>((set) => ({
  phase: "welcome",
  setPhase: (phase) => set({ phase }),
}))
