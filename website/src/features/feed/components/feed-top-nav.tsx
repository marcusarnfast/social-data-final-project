import { Link } from "@tanstack/react-router"
import {
  Bell,
  Briefcase,
  ChevronDown,
  Home,
  LayoutGrid,
  MessageSquare,
  Search,
  Sparkles,
  Users,
} from "lucide-react"

import { CrimedinLogo } from "@/components/logos/crimedin"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { feedProfile } from "@/data/feed-mock"
import { cn } from "@/lib/utils"

const navItemClass =
  "relative flex h-[52px] min-w-[52px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-none px-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground sm:min-w-[64px] sm:px-2 sm:text-[11px]"

function NavIconButton({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: typeof Home
  label: string
  active?: boolean
  badge?: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(navItemClass, active && "text-foreground")}
    >
      <span className="relative">
        <Icon
          className={cn(
            "size-5 sm:size-[22px]",
            active ? "text-foreground" : "text-muted-foreground",
          )}
          aria-hidden
        />
        {badge ? (
          <span className="absolute -top-1 -right-2 flex min-w-4 justify-center rounded-full bg-red-600 px-0.5 text-[8px] leading-4 font-bold text-white">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="max-w-18 truncate">{label}</span>
      {active ? (
        <span
          className="absolute bottom-0 left-1/2 h-0.5 w-[calc(100%-8px)] max-w-14 -translate-x-1/2 rounded-full bg-foreground"
          aria-hidden
        />
      ) : null}
    </Button>
  )
}

export function FeedTopNav() {
  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-border bg-card shadow-[0_1px_0_oklch(0_0_0/0.06)]">
      <div className="mx-auto flex h-[52px] max-w-[1128px] items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <Link
          to="/feed"
          aria-label="CrimeIn home"
          className="flex shrink-0 items-center gap-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CrimedinLogo />
          <span className="text-lg font-semibold tracking-tight text-primary">
            CrimeIn
          </span>
        </Link>
        <div className="relative hidden min-w-0 max-w-[280px] flex-1 md:block">
          <label htmlFor="feed-search" className="sr-only">
            Search CrimeIn
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="feed-search"
            type="search"
            placeholder="Search people, charges, vibes…"
            className="h-9 rounded-full border-border bg-secondary/80 py-0 pr-3 pl-9"
          />
        </div>
        <nav
          aria-label="Primary"
          className="ml-auto flex min-w-0 items-stretch justify-end"
        >
          <ul className="flex items-stretch">
            <li className="flex">
              <NavIconButton icon={Home} label="Home" active />
            </li>
            <li className="flex">
              <NavIconButton icon={Users} label="My Network" />
            </li>
            <li className="hidden sm:flex">
              <NavIconButton icon={Briefcase} label="Jobs" />
            </li>
            <li className="flex">
              <NavIconButton icon={MessageSquare} label="Messaging" />
            </li>
            <li className="flex">
              <NavIconButton icon={Bell} label="Notifications" badge="3" />
            </li>
            <li className="flex">
              <Button
                type="button"
                variant="ghost"
                className={cn(navItemClass, "gap-0")}
              >
                <Avatar size="sm" className="size-6 sm:size-7">
                  <AvatarImage src={feedProfile.avatarSrc} alt={feedProfile.name} />
                  <AvatarFallback className="text-[10px]">
                    {feedProfile.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="flex items-center gap-0.5">
                  <span className="max-w-12 truncate sm:max-w-16">
                    {feedProfile.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="size-3 opacity-70" aria-hidden />
                </span>
              </Button>
            </li>
          </ul>
        </nav>
        <div className="hidden shrink-0 items-center gap-1 border-l border-border pl-2 md:flex lg:pl-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto gap-1 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <LayoutGrid className="size-4" aria-hidden />
            <span className="hidden lg:inline">For business</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto gap-1 px-2 py-1 text-[11px] text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
          >
            <Sparkles className="size-4" aria-hidden />
            <span className="hidden xl:inline">Try Pro free</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
