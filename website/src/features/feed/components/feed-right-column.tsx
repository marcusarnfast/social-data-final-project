import { ChevronDown, Info, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FeedAdRedeemSection } from "@/features/feed/components/feed-ad-redeem-section"
import {
  feedFooterLinks,
  feedGroundingNote,
  feedNews,
} from "@/data/feed-mock"

export function FeedRightColumn() {
  return (
    <div className="flex flex-col gap-2">
      <Card size="sm" className="border border-border shadow-none ring-0">
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              CrimeIn news
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              aria-label="About CrimeIn news"
            >
              <Info className="size-4" />
            </Button>
          </div>
          <ul className="space-y-3">
            {feedNews.map((item) => (
              <li key={item.headline}>
                <button type="button" className="w-full text-left">
                  <span className="flex gap-2">
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/40"
                      aria-hidden
                    />
                    <span>
                      <span className="line-clamp-2 text-xs font-semibold text-foreground">
                        {item.headline}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        {item.sub}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Show more
            <ChevronDown className="size-3.5 opacity-70" />
          </Button>
        </CardContent>
      </Card>

      <Card size="sm" className="border border-border shadow-none ring-0">
        <CardContent className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Play className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground">
              Guess the precinct
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Three heatmaps walk into a bar chart. Only one leaves on-brand.
            </p>
          </div>
        </CardContent>
      </Card>

      <FeedAdRedeemSection />

      <footer className="px-1 pt-1">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {feedFooterLinks.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                {i > 0 ? (
                  <span className="text-muted-foreground/40" aria-hidden>
                    ·
                  </span>
                ) : null}
                <button
                  type="button"
                  className="text-[11px] text-muted-foreground hover:text-primary"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground/70">CrimeIn</span>
          <span>Corporation © {new Date().getFullYear()}</span>
        </p>
        <p className="mt-3 border-t border-border/80 pt-3 text-[10px] leading-snug text-muted-foreground">
          {feedGroundingNote}
        </p>
      </footer>
    </div>
  )
}
