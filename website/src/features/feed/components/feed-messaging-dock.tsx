import { MessageSquarePlus, MoreHorizontal, PenLine } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { feedProfile } from "@/data/feed-mock"

export function FeedMessagingDock() {
  return (
    <aside
      className="pointer-events-none fixed right-3 bottom-0 z-30 sm:right-4 sm:bottom-0"
      aria-label="Messaging tray"
    >
      <div className="pointer-events-auto flex w-[calc(100vw-1.5rem)] max-w-[280px] items-center gap-2 rounded-t-lg border border-border bg-card px-2 py-1.5 shadow-md ring-1 ring-foreground/5">
        <Avatar className="size-8">
          <AvatarImage src={feedProfile.avatarSrc} alt={feedProfile.name} />
          <AvatarFallback className="text-[10px]">
            {feedProfile.initials}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
          Messaging
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground"
          aria-label="Messaging options"
        >
          <MoreHorizontal className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground"
          aria-label="New message"
        >
          <PenLine className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground"
          aria-label="Open messaging"
        >
          <MessageSquarePlus className="size-4" />
        </Button>
      </div>
    </aside>
  )
}
