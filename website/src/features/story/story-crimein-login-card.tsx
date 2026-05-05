import { Link } from "@tanstack/react-router"
import { useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { CrimedinLogo } from "@/components/logos/crimedin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { LogInIcon } from "lucide-react"

const MOCK_EMAIL = "sune.lehmann@sf.gov"
/** Visible “password” — plain text field, DS in-joke. */
const MOCK_PASSWORD = "pValueOrItDidntHappen12!"

const CHAR_MS_EMAIL = 100
const CHAR_MS_PASSWORD = 100
const PAUSE_BEFORE_PASSWORD_MS = 400

function useSequentialTypewriter(
  active: boolean,
  prefersReducedMotion: boolean | null,
) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phase, setPhase] = useState<"idle" | "email" | "password" | "done">(
    "idle",
  )

  useEffect(() => {
    if (!active) return

    const reduce = prefersReducedMotion ?? false
    if (reduce) {
      setEmail(MOCK_EMAIL)
      setPassword(MOCK_PASSWORD)
      setPhase("done")
      return
    }

    let cancelled = false
    const timeouts: number[] = []

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
      timeouts.push(id)
    }

    setPhase("email")
    setEmail("")
    setPassword("")

    let i = 0
    const typeEmail = () => {
      if (cancelled) return
      i += 1
      setEmail(MOCK_EMAIL.slice(0, i))
      if (i < MOCK_EMAIL.length) {
        schedule(typeEmail, CHAR_MS_EMAIL)
      } else {
        setPhase("password")
        schedule(() => {
          if (cancelled) return
          let j = 0
          const typePassword = () => {
            if (cancelled) return
            j += 1
            setPassword(MOCK_PASSWORD.slice(0, j))
            if (j < MOCK_PASSWORD.length) {
              schedule(typePassword, CHAR_MS_PASSWORD)
            } else {
              setPhase("done")
            }
          }
          typePassword()
        }, PAUSE_BEFORE_PASSWORD_MS)
      }
    }

    typeEmail()

    return () => {
      cancelled = true
      for (const id of timeouts) window.clearTimeout(id)
    }
  }, [active, prefersReducedMotion])

  return { email, password, phase }
}

export function StoryCrimeInLoginCard({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true)
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const { email, password, phase } = useSequentialTypewriter(
    active,
    prefersReducedMotion,
  )

  const showEmailCaret = phase === "email"
  const showPasswordCaret = phase === "password"

  /** Matches `FeedLayout` + feed canvas; card matches `FeedStartPost` / feed posts. */
  return (
    <div
      ref={containerRef}
      className={cn(
        "theme-crimein w-full max-w-sm font-sans text-foreground",
        "shadow-[0_1px_0_oklch(0_0_0/0.06)]",
        className,
      )}
    >
      <Card
        size="sm"
        className="border border-border bg-card text-card-foreground shadow-none ring-0"
      >
        <CardHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <CrimedinLogo className="size-[34px] shrink-0" />
            <div className="min-w-0">
              <p className="text-lg font-semibold tracking-tight text-primary">
                CrimeIn
              </p>
              <p className="text-xs text-muted-foreground">
                Sign in to your professional network
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pb-2">
          <div className="grid gap-2">
            <Label htmlFor="story-crimein-email">Email</Label>
            <div className="relative">
              <Input
                id="story-crimein-email"
                readOnly
                autoComplete="off"
                tabIndex={-1}
                value={email}
                placeholder=""
                className="h-9 border-border bg-secondary/80 pr-8 font-mono text-xs text-foreground md:text-xs/relaxed"
                aria-label="Email (demonstration)"
              />
              {showEmailCaret ? (
                <span
                  className="pointer-events-none absolute top-1/2 right-2 h-4 w-px -translate-y-1/2 animate-pulse bg-primary"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="story-crimein-password">Password</Label>
            <div className="relative">
              <Input
                id="story-crimein-password"
                readOnly
                type="text"
                autoComplete="off"
                tabIndex={-1}
                value={password}
                placeholder=""
                className="h-9 border-border bg-secondary/80 pr-8 font-mono text-xs text-foreground md:text-xs/relaxed"
                aria-label="Password (demonstration, shown for effect)"
              />
              {showPasswordCaret ? (
                <span
                  className="pointer-events-none absolute top-1/2 right-2 h-4 w-px -translate-y-1/2 animate-pulse bg-primary"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t border-border pt-4">
          <Button asChild className="h-10 w-full rounded-full font-semibold">
            <Link to="/feed">Continue <LogInIcon /></Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
