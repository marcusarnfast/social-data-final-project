import { createFileRoute } from '@tanstack/react-router'

import { Fight } from '~/features/fight/fight'

export const Route = createFileRoute('/fight')({
  component: FightRoute,
})

function FightRoute() {
  return <Fight />
}
