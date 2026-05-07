export function VehiclePanel({ progress }: { progress: number }) {
  return (
    <section
      className="relative min-h-[360vh] w-full bg-black text-amber-100"
      aria-label="Vehicle transition panel"
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden border-b border-amber-500/30 bg-linear-to-b from-black via-zinc-900 to-black px-6 text-center">
        <div className="max-w-2xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-300/80">
            Vehicle transition module
          </p>
          <h2 className="font-heading text-3xl text-amber-100">Mobility Shock</h2>
          <p className="font-mono text-sm leading-relaxed text-amber-100/85">
            Fuel instability pushes consumers to rethink transport choices. Scroll through this module
            to return to the narrative timeline.
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200/80">
            Progress {(progress * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </section>
  )
}
