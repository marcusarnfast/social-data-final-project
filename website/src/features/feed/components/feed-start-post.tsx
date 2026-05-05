import { ImageIcon, PenLine, Video } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { feedProfile } from "@/data/feed-mock"

export function FeedStartPost() {
  return (
    <Card size="sm" className="border border-border shadow-none ring-0">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar>
            <AvatarImage src={feedProfile.avatarSrc} alt={feedProfile.name} />
            <AvatarFallback>{feedProfile.initials}</AvatarFallback>
          </Avatar>
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 justify-start rounded-full border-border bg-transparent px-4 text-left font-normal text-muted-foreground hover:bg-muted/40"
          >
            Start a post · keep it PG-13 for HR
          </Button>
        </div>
        <Separator />
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-muted/80"
          >
            <Video className="size-5 text-emerald-600 dark:text-emerald-400" />
            Video
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-muted/80"
          >
            <ImageIcon className="size-5 text-primary" />
            Photo
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-muted/80"
          >
            <PenLine className="size-5 text-amber-600 dark:text-amber-400" />
            Write article
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
