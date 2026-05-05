import { ChevronDown } from "lucide-react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { useCallback, useRef, useState } from "react"

import { StoryLayout } from "@/components/layouts/story-layout"
import { StoryCrimeInLoginCard } from "@/features/story/story-crimein-login-card"
import { cn } from "@/lib/utils"

/** Hide the scroll cue after the user moves past the first snap. */
const SCROLL_HINT_DISMISS_PX = 40

const STORY_PARAGRAPHS = [
  "We often think of crime as an alien force that disrupts our cities. We perceive it as something purely destructive, an illogical chaotic side hustle, a shadow world that operates without the structures or ambitions of the professional life we recognize.",

  "But the data tells a completely different story.",

  "CrimedIn is the world's largest professional criminal networking platform with over 1 million members, designed for career development, job searching, and business networking.",

  "The data presented on Crimedin is from the San Francisco crime database from 2003 to 2026. When you log in to CrimedIn, you aren't just looking at traditional statistics or heat maps. You are presented with the criminals’ point of view, reconstructed in the way we normally see legit businesses and professionals. With Crimedin you can now see the city through the eyes of its most unrecognized entrepreneurs.",
] as const

const bodyClassName =
  "w-full max-w-2xl text-balance text-left font-serif text-xl leading-relaxed text-white md:text-2xl"


function StoryScrollSection({ children }: { children: string }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const prefersReducedMotion = useReducedMotion()
  const show = prefersReducedMotion || inView

  return (
    <section
      ref={ref}
      className="flex min-h-dvh snap-start snap-always flex-col items-center justify-center px-6 py-16"
    >
      {prefersReducedMotion ? (
        <p className={bodyClassName}>{children}</p>
      ) : (
        <motion.p
          className={bodyClassName}
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={
            show
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(12px)" }
          }
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.p>
      )}
    </section>
  )
}

export function StoryPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop > SCROLL_HINT_DISMISS_PX) {
      setShowScrollHint(false)
    }
  }, [])

  return (
    <StoryLayout className="h-dvh max-h-dvh overflow-hidden bg-black text-white">
      <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain",
            "snap-y snap-mandatory scroll-smooth",
          )}
        >
          {STORY_PARAGRAPHS.map((paragraph) => (
            <StoryScrollSection key={paragraph}>{paragraph}</StoryScrollSection>
          ))}
          <div className="flex min-h-dvh snap-start snap-always flex-col items-center justify-center px-6 pb-16">
            <StoryCrimeInLoginCard />
          </div>
        </div>
        {showScrollHint ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 pb-10 text-center"
            role="status"
          >
            <p className="text-sm font-medium text-white/80">
              Scroll to read more
            </p>
            <ChevronDown
              className={cn(
                "size-6 text-white/80",
                !prefersReducedMotion && "animate-bounce",
              )}
              aria-hidden
            />
          </div>
        ) : null}
      </div>
    </StoryLayout>
  )
}
