import { FeedLeftColumn } from "./components/feed-left-column"
import { FeedMessagingDock } from "./components/feed-messaging-dock"
import { FeedPostCard } from "./components/feed-post-card"
import { FeedRightColumn } from "./components/feed-right-column"
import { FeedStartPost } from "./components/feed-start-post"
import { FeedTopNav } from "./components/feed-top-nav"
import { FeedLayout } from "@/components/layouts/feed-layout"
import { feedPosts } from "@/data/feed-mock"

export function FeedPage() {
  return (
    <FeedLayout header={<FeedTopNav />}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex min-h-0 w-full max-w-[1128px] flex-1 flex-col gap-4 overflow-hidden px-3 sm:gap-6 sm:px-4 lg:flex-row lg:items-stretch">
          <aside
            className="hidden min-h-0 w-full shrink-0 overflow-y-auto lg:block lg:w-[225px] lg:max-h-full lg:px-1 lg:pt-4"
            aria-label="Profile and shortcuts"
          >
            <FeedLeftColumn />
          </aside>
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-2 py-4 [scrollbar-gutter:stable] sm:px-3">
            <h1 className="sr-only">Home feed</h1>
            <div className="space-y-3 pb-2 sm:space-y-4 sm:pb-3">
              <FeedStartPost />
              {feedPosts.map((post) => (
                <FeedPostCard
                  key={post.id}
                  promoted={post.promoted}
                  author={post.author}
                  body={post.body}
                  reactionSummary={post.reactionSummary}
                  extraImages={post.extraImages}
                  hashtags={post.hashtags}
                  postedFrom={
                    "postedFrom" in post ? post.postedFrom : undefined
                  }
                  media={"media" in post ? post.media : undefined}
                />
              ))}

            </div>
          </main>
          <aside
            className="hidden min-h-0 w-full shrink-0 overflow-y-auto lg:block lg:w-[300px] lg:max-h-full lg:px-1 lg:pt-4"
            aria-label="News and recommendations"
          >
            <FeedRightColumn />
          </aside>
        </div>
        <FeedMessagingDock />
      </div>
    </FeedLayout>
  )
}
