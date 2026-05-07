import { createFileRoute } from '@tanstack/react-router'

import { StartScreenFrame } from '~/features/introduction/introduction-frame'
import { TerminalFrame } from '~/features/terminal/terminal-frame'
import { useStoryPhaseStore } from '~/stores/story-phase-store'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const phase = useStoryPhaseStore((state) => state.phase)

  if (phase === 'start-screen') {
    return <StartScreenFrame />
  }

  return <TerminalFrame />
}
