import { createFileRoute } from '@tanstack/react-router'

import { FightScrollTest } from '~/features/story-introduction/fight-scroll-test'

export const Route = createFileRoute('/test')({
  component: TestFightScroll,
})

function TestFightScroll() {
  return <FightScrollTest />
}
