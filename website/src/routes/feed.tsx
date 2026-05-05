import { createFileRoute } from "@tanstack/react-router"

import { FeedPage } from "@/features/feed/feed-page"

export const Route = createFileRoute("/feed")({
  component: FeedRoute,
})

function FeedRoute() {
  return <FeedPage />
}
