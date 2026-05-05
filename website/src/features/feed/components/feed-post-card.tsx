import { useEffect, useState } from "react"
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  PartyPopper,
  Send,
  Share2,
  ThumbsUp,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type FeedPostAuthor = {
  name: string
  meta: string
  initials: string
  logoAbbr?: string
  avatarSrc?: string
}

export type FeedPostMediaItem = {
  src?: string
  iframeSrc?: string
  alt?: string
  dataTeaser?: string
  ctaOverlay?: string
}

export type FeedPostCardProps = {
  promoted: boolean
  author: FeedPostAuthor
  body: string
  reactionSummary: string
  extraImages: number
  hashtags?: string
  postedFrom?: string
  includeMedia?: boolean
  media?: ReadonlyArray<FeedPostMediaItem>
}

export function FeedPostCard({
  promoted,
  author,
  body,
  reactionSummary,
  extraImages,
  hashtags = "",
  postedFrom,
  includeMedia = true,
  media,
}: FeedPostCardProps) {
  const paragraphs = body.split("\n\n").filter(Boolean)

  const mediaList = media?.length ? [...media] : []
  const overlayCount =
    mediaList.length > 3
      ? mediaList.length - 3
      : !mediaList.length && includeMedia
        ? extraImages
        : 0

  return (
    <Card
      size="sm"
      className="border border-border shadow-none ring-0"
      role="article"
      aria-label={`Post by ${author.name}`}
    >
      <CardContent className="space-y-3">
        <header className="flex gap-2">
          {author.logoAbbr ? (
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground"
              aria-hidden
            >
              {author.logoAbbr}
            </div>
          ) : (
            <Avatar className="size-10 shrink-0">
              {author.avatarSrc ? (
                <AvatarImage src={author.avatarSrc} alt={author.name} />
              ) : null}
              <AvatarFallback>{author.initials}</AvatarFallback>
            </Avatar>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {author.name}
                </p>
                <p className="text-xs text-muted-foreground">{author.meta}</p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full px-3 text-xs font-semibold"
                >
                  Follow
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground"
                  aria-label="Post options"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
                {promoted ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground"
                    aria-label="Dismiss sponsored post"
                  >
                    <X className="size-4" />
                  </Button>
                ) : null}
              </div>
            </div>
            {promoted ? (
              <Badge
                variant="secondary"
                className="text-[10px] font-normal text-muted-foreground"
              >
                Promoted
              </Badge>
            ) : null}
            {postedFrom ? (
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin
                  className="size-3 shrink-0 opacity-80"
                  aria-hidden
                />
                <span className="text-pretty">{postedFrom}</span>
              </p>
            ) : null}
          </div>
        </header>
        <div className="space-y-2 text-sm text-foreground">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-pretty whitespace-pre-wrap">
              {p}
            </p>
          ))}
          {hashtags ? (
            <p className="text-pretty text-xs text-primary">{hashtags}</p>
          ) : null}
        </div>
        {includeMedia ? (
          <PostMediaGrid
            mediaList={mediaList}
            overlayCount={overlayCount}
          />
        ) : (
          <p className="rounded-md border border-dashed border-border/80 bg-muted/20 px-3 py-2 text-center text-xs italic text-muted-foreground">
            No carousel. Conserving pixels for Q4 runway.
          </p>
        )}
        <div className="flex items-center gap-2">
          <span
            className="flex shrink-0 items-center pl-0.5"
            aria-hidden
          >
            <span className="flex size-[18px] items-center justify-center rounded-full bg-[#378fe9] ring-2 ring-card">
              <ThumbsUp className="size-2.5 text-white" strokeWidth={2.5} />
            </span>
            <span className="-ml-1.5 flex size-[18px] items-center justify-center rounded-full bg-amber-500 ring-2 ring-card">
              <Lightbulb className="size-2.5 text-white" strokeWidth={2.5} />
            </span>
            <span className="-ml-1.5 flex size-[18px] items-center justify-center rounded-full bg-emerald-600 ring-2 ring-card">
              <PartyPopper className="size-2.5 text-white" strokeWidth={2.5} />
            </span>
          </span>
          <p className="min-w-0 text-xs text-muted-foreground">
            {reactionSummary}
          </p>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-1 sm:justify-between">
          <PostAction icon={ThumbsUp} label="Like" />
          <PostAction icon={MessageCircle} label="Comment" />
          <PostAction icon={Share2} label="Share" />
          <PostAction icon={Send} label="Send" />
        </div>
      </CardContent>
    </Card>
  )
}

function PostMediaGrid({
  mediaList,
  overlayCount,
}: {
  mediaList: Array<FeedPostMediaItem>
  overlayCount: number
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const count = mediaList.length
  const activeItem = mediaList[lightboxIndex]

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  function showPrev() {
    setLightboxIndex((i) => (i - 1 + count) % count)
  }

  function showNext() {
    setLightboxIndex((i) => (i + 1) % count)
  }

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLightboxOpen(false)
        return
      }
      if (count <= 1) return
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setLightboxIndex((i) => (i - 1 + count) % count)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setLightboxIndex((i) => (i + 1) % count)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxOpen, count])

  const gridShell =
    "overflow-hidden rounded-md ring-1 ring-border sm:h-[220px] h-[180px]"

  return (
    <>
      {count === 0 && overlayCount > 0 ? (
        <div
          className={cn(
            gridShell,
            "grid grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] grid-rows-2 gap-0.5 bg-muted",
          )}
          aria-label="Post images"
        >
          <div className="row-span-2 min-h-0 bg-linear-to-br from-muted to-muted/40" />
          <div className="min-h-0 bg-muted/90" />
          <div className="relative min-h-0 bg-muted/70">
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-semibold text-white">
              +{overlayCount}
            </span>
          </div>
        </div>
      ) : count === 0 ? (
        <div
          className={cn(gridShell, "bg-muted")}
          aria-label="Post images"
        >
          <div className="size-full bg-linear-to-br from-muted to-muted/40" />
        </div>
      ) : count === 1 ? (
        <div className={gridShell} aria-label="Post images">
          <MediaGridItem
            item={mediaList[0]}
            onOpen={() => openLightbox(0)}
            className="size-full"
          />
        </div>
      ) : count === 2 ? (
        <div
          className={cn(gridShell, "grid grid-cols-2 gap-0.5")}
          aria-label="Post images"
        >
          <MediaGridItem
            item={mediaList[0]}
            onOpen={() => openLightbox(0)}
            className="min-h-0 min-w-0"
          />
          <MediaGridItem
            item={mediaList[1]}
            onOpen={() => openLightbox(1)}
            className="min-h-0 min-w-0"
          />
        </div>
      ) : (
        <div
          className={cn(
            gridShell,
            "grid grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] grid-rows-2 gap-0.5",
          )}
          aria-label="Post images"
        >
          <div className="relative row-span-2 min-h-0 min-w-0">
            <MediaGridItem
              item={mediaList[0]}
              onOpen={() => openLightbox(0)}
              className="size-full"
            />
          </div>
          <MediaGridItem
            item={mediaList[1]}
            onOpen={() => openLightbox(1)}
            className="min-h-0 min-w-0"
          />
          <div className="relative min-h-0 min-w-0">
            {mediaList[2] ? (
              <MediaGridItem
                item={mediaList[2]}
                onOpen={() => openLightbox(2)}
                className="size-full"
              />
            ) : (
              <div className="size-full bg-muted/50" />
            )}
            {overlayCount > 0 ? (
              <span
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-semibold text-white"
                aria-hidden
              >
                +{overlayCount}
              </span>
            ) : null}
          </div>
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton
          className={cn(
            "fixed top-1/2 left-1/2 z-50 max-h-dvh max-w-screen h-dvh w-screen -translate-x-1/2 -translate-y-1/2 gap-0 rounded-none border-0 bg-transparent p-0 shadow-none ring-0 duration-100 sm:max-w-screen",
            "[&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:right-3",
            "[&_[data-slot=dialog-close]]:z-20 [&_[data-slot=dialog-close]]:size-12",
            "[&_[data-slot=dialog-close]_svg]:!size-8 [&_[data-slot=dialog-close]_svg]:!shrink-0",
            "[&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:bg-white/10",
          )}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 z-0 bg-transparent"
            onPointerDown={() => setLightboxOpen(false)}
          />
          <div className="pointer-events-none relative z-10 flex size-full flex-col items-center justify-center gap-0">
            <DialogTitle className="sr-only">
              {activeItem.alt ?? "Post media, full screen"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {count > 1
                ? `Image ${lightboxIndex + 1} of ${count}. Use the arrow keys to move between images, Escape to close, or click outside the media.`
                : "Press Escape to close, or click outside the media."}
            </DialogDescription>
            {activeItem.iframeSrc ? (
              <div className="pointer-events-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/15 bg-card shadow-xl ring-1 ring-black/20">
                <div className="border-b border-border/80 bg-muted/40 px-3 py-2 text-center text-[11px] font-medium text-muted-foreground">
                  Open data · drag to pan, scroll to zoom
                </div>
                <iframe
                  src={activeItem.iframeSrc}
                  title={activeItem.alt ?? "Embedded visualization"}
                  className="min-h-[50dvh] w-full flex-1 border-0 bg-background sm:min-h-[560px]"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : activeItem.src ? (
              <img
                src={activeItem.src}
                alt={activeItem.alt ?? "Post image"}
                className="pointer-events-auto max-h-[72dvh] w-auto max-w-[90vw] object-contain sm:max-w-3xl"
              />
            ) : null}
            {count > 1 ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="pointer-events-auto absolute top-1/2 left-2 z-10 size-10 -translate-y-1/2 text-white hover:bg-white/10"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation()
                    showPrev()
                  }}
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="pointer-events-auto absolute top-1/2 right-14 z-10 size-10 -translate-y-1/2 text-white hover:bg-white/10 sm:right-16"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation()
                    showNext()
                  }}
                >
                  <ChevronRight className="size-6" />
                </Button>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/90 tabular-nums">
                  {lightboxIndex + 1} / {count}
                </p>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function MediaGridItem({
  item,
  onOpen,
  className,
}: {
  item: FeedPostMediaItem
  onOpen: () => void
  className?: string
}) {
  if (item.iframeSrc && item.src) {
    const openLabel = item.alt
      ? `Open data: ${item.alt}`
      : "Open interactive chart full screen"
    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "group relative block min-h-0 min-w-0 cursor-zoom-in overflow-hidden bg-muted outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        aria-label={openLabel}
      >
        <img
          src={item.src}
          alt={item.alt ?? "Post image"}
          className="size-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
          loading="lazy"
        />
        {item.ctaOverlay ? (
          <span className="absolute inset-x-0 top-0 z-1 bg-primary px-2 py-2 text-center text-[11px] font-bold leading-tight tracking-wide text-primary-foreground shadow-sm sm:text-xs">
            {item.ctaOverlay}
          </span>
        ) : null}
        <span
          className="pointer-events-none absolute inset-0 bg-black/0 transition-opacity duration-200 ease-out group-hover:bg-black/15 group-focus-visible:bg-black/15"
          aria-hidden
        />
      </button>
    )
  }

  if (item.iframeSrc) {
    const openLabel = item.alt
      ? `Open data: ${item.alt}`
      : "Open data visualization"
    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "relative flex min-h-0 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden bg-muted/70 px-2 py-3 text-center outline-none ring-1 ring-border/70 transition-[box-shadow,ring-color,background-color] duration-200 ease-out",
          "hover:bg-muted hover:ring-primary/35 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring",
          item.ctaOverlay ? "pt-10" : "",
          className,
        )}
        aria-label={openLabel}
      >
        {item.ctaOverlay ? (
          <span className="absolute inset-x-0 top-0 z-1 bg-primary px-2 py-2 text-center text-[11px] font-bold leading-tight tracking-wide text-primary-foreground shadow-sm sm:text-xs">
            {item.ctaOverlay}
          </span>
        ) : null}
        <BarChart3
          className="size-7 shrink-0 text-primary opacity-90"
          aria-hidden
        />
        <span className="text-[11px] font-semibold leading-tight text-foreground">
          Open data
        </span>
        <span className="line-clamp-2 text-[10px] leading-snug text-muted-foreground">
          {item.dataTeaser ?? "Visualization opens full screen"}
        </span>
      </button>
    )
  }

  if (!item.src) {
    return (
      <div
        className={cn(
          "min-h-0 min-w-0 bg-muted",
          className,
        )}
      />
    )
  }

  const label = item.alt
    ? `Open image full screen: ${item.alt}`
    : "Open image full screen"

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative block min-h-0 min-w-0 cursor-zoom-in overflow-hidden bg-muted outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label={label}
    >
      <img
        src={item.src}
        alt={item.alt ?? "Post image"}
        className="size-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        loading="lazy"
      />
      <span
        className="pointer-events-none absolute inset-0 bg-black/0 transition-opacity duration-200 ease-out group-hover:bg-black/15 group-focus-visible:bg-black/15"
        aria-hidden
      />
    </button>
  )
}

function PostAction({
  icon: Icon,
  label,
}: {
  icon: typeof ThumbsUp
  label: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="flex-1 text-muted-foreground hover:text-foreground"
    >
      <Icon className="size-4" />
      {label}
    </Button>
  )
}
