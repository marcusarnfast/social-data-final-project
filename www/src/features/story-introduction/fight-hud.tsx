import { Card, CardContent } from '~/components/ui/8bit/card'
import { Progress } from '~/components/ui/8bit/progress'
import type { FightSnapshot } from './fight-script'

type FighterPanelProps = {
  name: string
  imageSrc: string
  imageAlt: string
  align: 'left' | 'right'
  health: number
  mood: number
}

function FighterPanel({ name, imageSrc, imageAlt, align, health, mood }: FighterPanelProps) {
  return (
    <Card className="bg-black/80 text-amber-100">
      <CardContent className="space-y-3 p-3">
        <div className={`flex items-center gap-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="pixelated h-16 w-16 border border-amber-400/70 bg-black object-cover"
          />
          <div className={`space-y-1 ${align === 'right' ? 'text-right' : ''}`}>
            <p className="retro text-[10px] uppercase tracking-[0.2em] text-amber-300">{name}</p>
            <p className="retro text-[9px] uppercase tracking-[0.16em] text-amber-100/80">fighter status</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="retro text-[9px] uppercase tracking-[0.16em] text-red-200">
            Health {Math.round(health)}%
          </p>
          <Progress value={health} variant="retro" className="h-3" progressBg="bg-red-500" />
        </div>

        <div className="space-y-1.5">
          <p className="retro text-[9px] uppercase tracking-[0.16em] text-sky-200">
            Mood {Math.round(mood)}%
          </p>
          <Progress value={mood} variant="retro" className="h-3" progressBg="bg-sky-500" />
        </div>
      </CardContent>
    </Card>
  )
}

export function FightHud({ snapshot }: { snapshot: FightSnapshot }) {
  return (
    <div className="pointer-events-none absolute inset-x-4 top-4 z-20 grid grid-cols-2 gap-4 lg:inset-x-8">
      <FighterPanel
        name="Greta"
        imageSrc="/fight/greta-thunberg.gif"
        imageAlt="Greta Thunberg fighter"
        align="left"
        health={snapshot.greta.health}
        mood={snapshot.greta.mood}
      />
      <FighterPanel
        name="Trump"
        imageSrc="/fight/donald-trump.gif"
        imageAlt="Donald Trump fighter"
        align="right"
        health={snapshot.trump.health}
        mood={snapshot.trump.mood}
      />
    </div>
  )
}
