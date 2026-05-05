import { cn } from "@/lib/utils"

export function StoryLayout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col bg-background text-foreground",
        className,
      )}
    >
      {/* <header className="shrink-0 border-b border-border px-6 py-4">
        <span className="font-heading text-lg tracking-wide uppercase">
          SF Crimes
        </span>
      </header> */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
    </div>
  )
}
