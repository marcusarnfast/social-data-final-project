'use client'

import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/8bit/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/8bit/dialog'
import { cn } from '~/lib/utils'

import { useFight } from './fight-context'

/** HUD scroll step 20 (`activeStep` / 1-based) → zero-based `frameIndex` 19 (“After (background end)”). */
export const FIGHT_DENMARK_GREEN_SHARE_FRAME_INDEX = 19

/**
 * Fullscreen chart dialog on the Denmark EV-share beat.
 * The CTA closes the overlay and smooth-scrolls to the next fight frame.
 */
export function FightDenmarkChoroplethDialog() {
  const { frameIndex, frameCount, goToFightFrame, registerGestureDelegate } = useFight()
  const [dismissedForEvChart, setDismissedForEvChart] = useState(false)

  useEffect(() => {
    if (frameIndex !== FIGHT_DENMARK_GREEN_SHARE_FRAME_INDEX) {
      setDismissedForEvChart(false)
    }
  }, [frameIndex])

  const open = frameIndex === FIGHT_DENMARK_GREEN_SHARE_FRAME_INDEX && !dismissedForEvChart

  useEffect(() => {
    if (!open) {
      registerGestureDelegate(null)
      return
    }
    registerGestureDelegate({
      onStep: () => 'consume',
      onWheel: () => 'consume',
      onTouchDelta: () => 'consume',
    })
    return () => registerGestureDelegate(null)
  }, [open, registerGestureDelegate])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setDismissedForEvChart(true)
      }}
    >
      <DialogContent
        showCloseButton={false}
        font="retro"
        className={cn(
          // Base dialog uses `grid`; flex column + min-h-0 so the chart region (`flex-1`) gets real height.
          'left-0 top-0 flex h-dvh! max-h-dvh! min-h-0 w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-3 rounded-none border-0 p-3 sm:gap-4 sm:p-5',
          'sm:max-w-none',
          'overflow-hidden bg-black text-amber-100',
        )}
      >
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle font="retro" className="text-balance text-amber-200">
            <span className="text-[10px] uppercase tracking-[0.12em] sm:text-[11px]">Danish Vehicle Registrations</span>
          </DialogTitle>
          <DialogDescription className="text-left text-amber-100/90">
            Use the interactive map to view the monthly vehicle registrations across Danish municipalities, and the percentage of EV’s and PHEV’s registered compared to fossil fuel vehicles.
            Use the slider to see how Denmark gets greener as time passes.

            Use the toggle to filter between All, private or company registrations.

          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-sm border-2 border-amber-700/45 bg-black shadow-[inset_0_0_0_1px_rgba(251,191,36,0.12)]">
          <iframe
            title="EV and PHEV share of registrations by municipality"
            src="/charts/denmark-green-share-choropleth.html"
            className="absolute inset-0 block size-full min-h-0 border-0"
            loading="lazy"
          />
        </div>

        <DialogFooter className="shrink-0 w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            font="retro"
            className={cn(
              ' w-full min-h-[52px] border-4 border-amber-200 bg-amber-400 px-4 py-4 text-[clamp(11px,2.8vw,16px)] font-normal uppercase leading-tight tracking-[0.12em] text-black shadow-[6px_6px_0_0_rgba(0,0,0,0.85)] hover:bg-amber-300',
            )}
            onClick={() => {
              setDismissedForEvChart(true)
              const next = Math.min(frameCount - 1, frameIndex + 1)
              goToFightFrame(next)
            }}
          >
            <p className="text-center retro-pixel-blink">
              Click to see the winner!
            </p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
