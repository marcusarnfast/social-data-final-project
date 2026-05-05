import { createFileRoute } from "@tanstack/react-router"

import { StoryPage } from "@/features/story/story-page"

export const Route = createFileRoute("/story")({
  component: StoryRoute,
})

function StoryRoute() {
  return <StoryPage />
}
