import { createFileRoute } from '@tanstack/react-router'

import { Fight } from '../features/fight/fight'
import { LoadingFrame } from '../features/introduction/loading-frame'
import { StartScreenFrame } from '../features/introduction/introduction-frame'
import { TerminalFrame } from '../features/terminal/terminal-frame'
import { useStoryPhaseStore } from '../stores/story-phase-store'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const phase = useStoryPhaseStore((state) => state.phase)
  const goToStartScreen = useStoryPhaseStore((state) => state.goToStartScreen)
  const goToLoading = useStoryPhaseStore((state) => state.goToLoading)
  const goToStory = useStoryPhaseStore((state) => state.goToStory)

  if (phase === 'story') return <Fight />
  if (phase === 'loading') return <LoadingFrame onComplete={goToStory} />
  if (phase === 'start-screen') return <StartScreenFrame onStart={goToLoading} />
  return <TerminalFrame onContinue={goToStartScreen} />
}
