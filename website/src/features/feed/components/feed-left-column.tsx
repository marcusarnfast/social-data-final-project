import {
  Bookmark,
  Calendar,
  ChevronRight,
  Newspaper,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  feedPageFooterLinks,
  feedPages,
  feedProfile,
  feedShortcuts,
} from "@/data/feed-mock"

const shortcutIcons = [Bookmark, Users, Newspaper, Calendar] as const

export function FeedLeftColumn() {
  return (
    <div className="flex flex-col gap-2">
      <Card size="sm" className="border border-border shadow-none ring-0 !pt-0 overflow-hidden">
        <div className="relative h-20 overflow-hidden bg-muted sm:h-24">
          <img
            src={feedProfile.coverSrc}
            alt="San Francisco City Hall at dusk"
            className="size-full object-cover object-center"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-card/50 to-transparent"
            aria-hidden
          />
        </div>
        <CardContent className="-mt-9 flex flex-col items-center pb-3 text-center ">
          <Avatar className="size-[4.25rem] ring-4 ring-card">
            <AvatarImage src={feedProfile.avatarSrc} alt={feedProfile.name} />
            <AvatarFallback className="text-sm font-medium">
              {feedProfile.initials}
            </AvatarFallback>
          </Avatar>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {feedProfile.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {feedProfile.headline}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {feedProfile.location}
          </p>
          <Separator className="my-3" />
          <div className="flex w-full items-center gap-2 text-left text-xs">
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white p-0.5 ring-1 ring-border dark:bg-white/95">
              <img
                src={feedProfile.orgLogoSrc}
                alt="Official seal, City and County of San Francisco"
                className="size-full object-contain"
                decoding="async"
              />
            </div>
            <span className="font-medium text-foreground">
              {feedProfile.org}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card size="sm" className="border border-border shadow-none ring-0 !p-0">
        <CardContent className="flex flex-col gap-0 !px-0">
          {feedProfile.stats.map((row, i) => (
            <div key={row.label}>
              {i > 0 ? <Separator /> : null}
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs transition-colors hover:bg-muted/60"
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold text-primary">{row.value}</span>
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card size="sm" className="border border-border shadow-none ring-0">
        <CardContent className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">
            Your pages
          </p>
          <ul className="space-y-2">
            {feedPages.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md py-0.5 text-left text-xs hover:bg-muted/60"
                >
                  {"logoSrc" in p && p.logoSrc ? (
                    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                      <img
                        src={p.logoSrc}
                        alt={p.name}
                        className="size-full object-contain"
                        decoding="async"
                      />
                    </span>
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-bold text-muted-foreground">
                      {"abbr" in p
                        ? (p as { abbr: string }).abbr
                        : ""}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">
                      {p.name}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      {p.activity}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
          <Separator />
          <ul className="space-y-2">
            {feedPageFooterLinks.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="w-full rounded-md py-1 text-left hover:bg-muted/60"
                >
                  <span className="text-xs font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
                    {item.sub}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card size="sm" className="border border-border shadow-none ring-0">
        <CardContent className="space-y-1">
          <ul>
            {feedShortcuts.map((label, i) => {
              const Icon = shortcutIcons[i] ?? Bookmark
              return (
                <li key={label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    <Icon className="size-4 shrink-0 opacity-70" />
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
