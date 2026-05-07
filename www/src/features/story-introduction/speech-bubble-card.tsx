import { Card, CardContent } from '~/components/ui/8bit/card'
import type { FightSpeaker } from './fight-script'

const SPEAKER_STYLE: Record<FightSpeaker, string> = {
  greta: 'border-emerald-500 text-emerald-700',
  trump: 'border-red-500 text-red-700',
}

export function SpeechBubbleCard({
  speaker,
  text,
}: {
  speaker: FightSpeaker
  text: string
}) {
  const speakerLabel = speaker === 'greta' ? 'Greta' : 'Trump'

  return (
    <Card className={`max-w-2xl bg-white ${SPEAKER_STYLE[speaker]}`}>
      <CardContent className="space-y-2 p-4">
        <p className="retro text-[10px] uppercase tracking-[0.18em]">{speakerLabel}</p>
        <p className="retro text-xs leading-relaxed text-zinc-900">"{text}"</p>
      </CardContent>
    </Card>
  )
}
