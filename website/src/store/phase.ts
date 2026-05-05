export type AppPhase = "welcome" | "story" | "feed"

export const APP_PHASES: ReadonlyArray<AppPhase> = [
  "welcome",
  "story",
  "feed",
]

export function pathnameToPhase(pathname: string): AppPhase {
  if (pathname.startsWith("/feed")) return "feed"
  if (pathname === "/story" || pathname.startsWith("/story/")) return "story"
  return "welcome"
}
