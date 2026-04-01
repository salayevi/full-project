"use client"

import { colors, motion } from "@/config/design-system"

export default function ScrollButton() {
  const scrollToFooter = () => {
    const footer = document.getElementById("footer")
    if (!footer) return

    const targetPosition = footer.offsetTop
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition

    const duration = 2000
    let startTime: number | null = null

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)

      window.scrollTo(0, startPosition + distance * easeInOut(progress))

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    const easeInOut = (t: number) => {
      return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2
    }

    requestAnimationFrame(animation)
  }

  return (
    <button
      onClick={scrollToFooter}
      className="group flex flex-col items-center gap-3 text-white/90 transition hover:text-white"
      style={{
        transitionDuration: `${motion.duration.normal}s`,
      }}
    >
      <div className="flex h-14 w-9 items-start justify-center rounded-full border border-white/70 bg-white/5 pt-2 backdrop-blur-sm transition group-hover:scale-[1.04] group-hover:bg-white/10">
        <div className="h-3 w-1.5 rounded-full bg-white animate-bounce" />
      </div>

      <span className="text-[13px] md:text-sm font-medium tracking-[0.18em] uppercase">
        Aylantiring
      </span>
    </button>
  )
}