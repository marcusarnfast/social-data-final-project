"use client"

import { useEffect, useRef } from "react"

const WALK_FRAMES = ["/mouse-walking-1.png", "/mouse-walking-2.png"] as const
const CAUGHT_IMG = "/mouse-catched.png"
const SPEED = 0.02
const DIRECTION_THRESHOLD = 1.5
const CATCH_DISTANCE = 40
const WALK_INTERVAL_MS = 200

export function BananaCursor() {
  const imgRef = useRef<HTMLImageElement>(null)
  const stateRef = useRef({
    posX: 0,
    posY: 0,
    targetX: 0,
    targetY: 0,
    facingRight: true,
    isCaught: false,
    walkFrame: 0,
    lastFrameTime: 0,
  })

  useEffect(() => {
    const banana = imgRef.current
    if (!banana) return

    const s = stateRef.current
    s.posX = window.innerWidth / 2
    s.posY = window.innerHeight / 2
    s.targetX = s.posX
    s.targetY = s.posY
    s.facingRight = true
    s.isCaught = false
    s.walkFrame = 0
    s.lastFrameTime = 0
    banana.src = WALK_FRAMES[0]

    let rafId = 0

    const onMove = (e: MouseEvent) => {
      s.targetX = e.clientX
      s.targetY = e.clientY

      if (s.isCaught) {
        const dx = s.targetX - s.posX
        const dy = s.targetY - s.posY
        const dist = Math.hypot(dx, dy)
        if (dist > CATCH_DISTANCE * 2) {
          s.isCaught = false
          document.body.classList.remove("cursor-hidden")
        }
      }
    }

    const animate = (timestamp: number) => {
      const dx = s.targetX - s.posX
      const dy = s.targetY - s.posY
      const dist = Math.hypot(dx, dy)

      if (!s.isCaught) {
        s.posX += (s.targetX - s.posX) * SPEED
        s.posY += (s.targetY - s.posY) * SPEED

        if (dx > DIRECTION_THRESHOLD) s.facingRight = true
        else if (dx < -DIRECTION_THRESHOLD) s.facingRight = false

        if (timestamp - s.lastFrameTime > WALK_INTERVAL_MS) {
          s.walkFrame = (s.walkFrame + 1) % WALK_FRAMES.length
          banana.src = WALK_FRAMES[s.walkFrame]
          s.lastFrameTime = timestamp
        }

        if (dist < CATCH_DISTANCE) {
          s.isCaught = true
          banana.src = CAUGHT_IMG
          document.body.classList.add("cursor-hidden")
        }
      }

      banana.style.left = `${s.posX}px`
      banana.style.top = `${s.posY}px`
      banana.style.transform = `translate(-50%, -50%) scaleX(${s.facingRight ? -1 : 1
        })`

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener("mousemove", onMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafId)
      document.body.classList.remove("cursor-hidden")
    }
  }, [])

  return (
    <img
      ref={imgRef}
      src={WALK_FRAMES[0]}
      alt=""
      aria-hidden
      draggable={false}
      className="pointer-events-none fixed bg-transparent  left-1/2 top-1/2 z-9999 w-20 -translate-x-1/2 -translate-y-1/2  select-none"
    />
  )
}
