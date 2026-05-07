import { Badge } from '~/components/ui/8bit/badge'

export function RoundBanner({ round, subtitle }: { round: 1 | 2 | 3; subtitle?: string }) {
  return (
    <div className="space-y-3 text-center">
      <div className="flex items-center justify-center gap-3">
        <Badge className="bg-red-600 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white" font="retro">
          Round
        </Badge>
        <Badge className="bg-amber-500 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black" font="retro">
          {round}
        </Badge>
        <Badge className="bg-red-600 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white" font="retro">
          Fight
        </Badge>
      </div>
      {subtitle ? (
        <p className="retro text-[10px] uppercase tracking-[0.16em] text-amber-100/85">{subtitle}</p>
      ) : null}
    </div>
  )
}
