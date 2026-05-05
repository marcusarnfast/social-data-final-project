import { cn } from "@/lib/utils"

export function FeedLayout({
  header,
  children,
  className,
}: {
  header: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "theme-crimein flex h-svh min-h-0 flex-col overflow-hidden bg-background font-sans text-foreground",
        className,
      )}
    >
      {header}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
        {children}
      </div>
    </div>
  )
}
