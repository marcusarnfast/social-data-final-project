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
          'max-h-[85vh] max-w-lg overflow-y-auto border-[6px] border-amber-200 bg-black text-amber-100',
          isRetro ? 'gap-4' : 'gap-3',
        )}
      >
        <DialogHeader>
          <DialogTitle
            font={isRetro ? 'retro' : 'normal'}
            className={cn('text-balance text-amber-200', !isRetro && 'font-mono')}
          >
            {isRetro ? (
              <span className="text-[10px] uppercase tracking-[0.12em]">Map data coverage</span>
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
                Conflict markers come from event datasets that are <strong className="text-amber-200">incomplete by
                nature</strong>: not every incident is coded, coverage shifts by source and year, and quieter
                regions can look “clean” on the map even when risk or prices move for other reasons.
              </p>
              <p>
                The section below is reserved for a <strong className="text-amber-200">coverage chart</strong> and
                a short methodology note — drop your figure in here when it is ready.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div
          role="status"
          aria-label="Placeholder for upcoming coverage visualization"
          className={cn(
            'flex min-h-[140px] items-center justify-center border-2 border-dashed border-amber-600/55 bg-emerald-950/40 text-amber-400/90',
            isRetro ? 'text-[8px] uppercase tracking-[0.2em]' : 'font-mono text-xs',
          )}
        >
          Chart + explanation placeholder
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
