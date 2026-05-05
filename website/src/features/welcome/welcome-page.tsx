import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { BananaCursor } from "./banana-cursor"
import { FocusCrimesSection } from "./focus-crimes-section"
import { Button } from "@/components/ui/button"

export function WelcomePage() {
  return (
    <div className="relative flex flex-col bg-stone-50 text-stone-900 antialiased">
      <BananaCursor />
      <main className="flex flex-col">
        <div className="flex flex-col">
          <nav className="sticky top-0 z-40 flex h-16 shrink-0 items-center bg-stone-50/80 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
              <Link
                to="/"
                className="font-heading text-2xl font-bold text-stone-950 transition-colors hover:text-stone-700"
              >
                We ❤️ SF Crimes
              </Link>
            </div>
          </nav>

        </div>
        <div className="flex flex-col justify-center items-center max-w-7xl mx-auto gap-24 pb-24">
          <div className="flex flex-1 flex-col items-center justify-center px-6 pt-[20vh]">
            <h1 className="font-heading max-w-4xl text-center text-balance text-4xl leading-tight md:text-6xl md:leading-tight">
              We are all about crime, love, and harmony.
            </h1>
            <div className="mt-12 flex flex-col items-center justify-center gap-6">
              <p className="max-w-2xl text-center text-balance text-xl leading-relaxed text-stone-600">
                This is a short data story on SF Crimes made in the course Social
                Data Analysis at DTU.
              </p>

            </div>
          </div>
          <Button asChild size="lg" className="w-full max-w-40 text-xl py-6">
            <Link to="/story">
              Start story
              <ArrowRightIcon />
            </Link>
          </Button>
          <FocusCrimesSection />

        </div>

      </main>
    </div>
  )
}
