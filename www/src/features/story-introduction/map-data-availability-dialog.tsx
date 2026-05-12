'use client'

import { Button } from '~/components/ui/8bit/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/8bit/dialog'
import { cn } from '~/lib/utils'

type MapDataAvailabilityDialogProps = {
  variant?: 'retro' | 'default'
  className?: string
}

export function MapDataAvailabilityDialog({
  variant = 'default',
  className,
}: MapDataAvailabilityDialogProps) {
  const isRetro = variant === 'retro'

  return (
    <Dialog>
      <div
        className={cn(
          'pointer-events-auto absolute bottom-4 left-4 z-[35]',
          className,
        )}
      >
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            font="retro"
            className="retro-pixel-blink border-2 border-amber-200 bg-amber-400 px-3 py-2 text-[7px] font-normal uppercase tracking-[0.18em] text-black shadow-[3px_3px_0_0_rgba(0,0,0,0.85)] hover:bg-amber-300"
          >
            View data availability
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent
        showCloseButton
        font={isRetro ? 'retro' : 'normal'}
        className={cn(
          'w-full max-w-[calc(100vw-1.25rem)] min-w-0 sm:max-w-[min(1400px,calc(100vw-2rem))]',
          'max-h-[92vh] overflow-x-hidden overflow-y-auto border-[6px] border-amber-200 bg-black text-amber-100',
          isRetro ? 'gap-4' : 'gap-3',
        )}
      >
        <DialogHeader>
          <DialogTitle
            font={isRetro ? 'retro' : 'normal'}
            className={cn('text-balance text-amber-200', !isRetro && 'font-mono')}
          >
            {isRetro ? (
              <span className="text-[10px] uppercase tracking-[0.12em]">Number of conflicts per year by continent</span>
            ) : (
              <span className="text-sm uppercase tracking-[0.14em]">Map data coverage</span>
            )}
          </DialogTitle>
          <DialogDescription
            className={cn(
              'text-left text-amber-100/90',
              isRetro ? 'text-[8px] leading-[1.75] tracking-[0.04em]' : 'font-mono text-xs leading-relaxed',
            )}
            asChild
          >
            <div>
              <p className="mb-3">
                The chart below shows the summed annual conflict events by continent.

              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 min-w-0 w-full max-w-full overflow-hidden rounded-sm border-2 border-amber-700/45 bg-[#0f0f1a] shadow-[inset_0_0_0_1px_rgba(251,191,36,0.12)]">
          <iframe
            title="Annual conflict events by continent"
            src="/charts/continent-events-by-year-nes.html"
            className="block h-[min(75vh,720px)] w-full min-w-0 max-w-full border-0"
            loading="lazy"
          />
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" font="retro" className="text-[8px] uppercase tracking-[0.2em]">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
