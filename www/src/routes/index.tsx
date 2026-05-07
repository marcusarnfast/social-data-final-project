import { createFileRoute } from '@tanstack/react-router'

import { LoadingFrame } from '../features/introduction/loading-frame'
import { StartScreenFrame } from '../features/introduction/introduction-frame'
import { StoryIntroductionFrame } from '../features/story-introduction/story-introduction-frame'
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

  if (phase === 'story') return <StoryIntroductionFrame />
  if (phase === 'loading') return <LoadingFrame onComplete={goToStory} />
  if (phase === 'start-screen') return <StartScreenFrame onStart={goToLoading} />
  return <TerminalFrame onContinue={goToStartScreen} />
}
