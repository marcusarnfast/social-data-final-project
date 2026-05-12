'use client'

import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/8bit/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/8bit/dialog'
import { cn } from '~/lib/utils'

import { useFight } from './fight-context'

/** Zero-based fight scroll frame — `FIGHT_SCENE_STORE.frames[20]` (“Epilogue I”). */
export const FIGHT_DENMARK_GREEN_SHARE_FRAME_INDEX = 20

/**
 * Fullscreen chart dialog that opens automatically on the epilogue beat before the
 * final mural drift, so the player can read EV/PHEV share by municipality, then close
 * and keep scrolling for the rest of the story (including who really wins).
 */
export function FightDenmarkChoroplethDialog() {
  const { frameIndex, registerGestureDelegate } = useFight()
  const [dismissedForFrame20, setDismissedForFrame20] = useState(false)

  useEffect(() => {
    if (frameIndex !== FIGHT_DENMARK_GREEN_SHARE_FRAME_INDEX) {
      setDismissedForFrame20(false)
    }
  }, [frameIndex])

  const open = frameIndex === FIGHT_DENMARK_GREEN_SHARE_FRAME_INDEX && !dismissedForFrame20

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
        if (!next) setDismissedForFrame20(true)
      }}
    >
      <DialogContent
        showCloseButton
        font="retro"
        className={cn(
          'left-0 top-0 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-3 rounded-none border-0 p-3 sm:gap-4 sm:p-5',
          'sm:max-w-none',
          'overflow-hidden bg-black text-amber-100',
        )}
      >
        <DialogHeader className="shrink-0 space-y-2 text-left sm:space-y-3">
          <DialogTitle font="retro" className="text-balance text-amber-200">
            <span className="text-[10px] uppercase tracking-[0.12em] sm:text-[11px]">
              Denmark: EV &amp; PHEV share
            </span>
          </DialogTitle>
          <DialogDescription asChild>
            <div
              className={cn(
                'text-left text-amber-100/90',
                'text-[8px] leading-[1.75] tracking-[0.04em]',
              )}
            >
              <p className="mb-2">
                Municipal choropleth: share of registrations that are electric (EV) or plug-in hybrid (PHEV).
              </p>
              <p className="border-l-4 border-amber-400/80 pl-3 text-amber-200">
                <strong className="text-amber-100">Keep scrolling after you close this.</strong> The fight already
                flashed “Trump won” — the story keeps going so you can see{' '}
                <strong className="text-amber-100">who actually wins</strong> in the data and the epilogue.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-sm border-2 border-amber-700/45 bg-[#0f0f1a] shadow-[inset_0_0_0_1px_rgba(251,191,36,0.12)]">
          <iframe
            title="EV and PHEV share of registrations by municipality"
            src="/charts/denmark-green-share-choropleth.html"
            className="block h-full min-h-[min(75vh,720px)] w-full min-w-0 max-w-full border-0"
            loading="lazy"
          />
        </div>

        <DialogFooter className="shrink-0 flex-col gap-2 sm:flex-row sm:justify-end">
          <p className="w-full text-center text-[7px] uppercase tracking-[0.16em] text-amber-200/80 sm:text-left">
            Close to continue scrolling the fight
          </p>
          <DialogClose asChild>
            <Button type="button" variant="outline" font="retro" className="text-[8px] uppercase tracking-[0.2em]">
              Close &amp; scroll on
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
