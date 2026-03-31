"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import {
  colors,
  motion,
  sizes,
  spacing,
  typography,
  zIndex,
} from "@/config/design-system"
import ScrollButton from "@/app/companent/Buttons-funksia/button-scroll"
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider"
import { selectHeroViewModel } from "@/lib/backend/selectors"

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const snapshot = usePublicSiteContent()
  const hero = selectHeroViewModel(snapshot)
  const [firstTitleLine = "Azizam", secondTitleLine = "Market"] = hero.titleLines

  const azizamRef = useRef<HTMLHeadingElement | null>(null)
  const marketRef = useRef<HTMLHeadingElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(azizamRef.current, { x: 0, opacity: 1 })
      gsap.set(marketRef.current, { x: 0, opacity: 1 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${motion.hero.scrollDistance}`,
          scrub: 1,
          pin: true,
          toggleActions: "play reverse play reverse",
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(
        bgRef.current,
        {
          scale: motion.scale.backgroundZoom,
          ease: motion.ease.none,
        },
        0,
      )

      tl.to(
        azizamRef.current,
        {
          x: `-${motion.hero.titleX}`,
          opacity: 0,
          ease: motion.ease.none,
        },
        0,
      )

      tl.to(
        marketRef.current,
        {
          x: motion.hero.titleX,
          opacity: 0,
          ease: motion.ease.none,
        },
        0,
      )

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center overflow-hidden"
      style={{
        height: sizes.hero.sectionHeight,
        color: colors.text.white,
      }}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 overflow-hidden"
        style={
          hero.backgroundMedia?.kind === "image"
            ? {
                backgroundImage: `url('${hero.backgroundMedia.url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {hero.backgroundMedia?.kind === "video" ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={hero.backgroundMedia.url} />
          </video>
        ) : null}
      </div>

      <div
        className="absolute inset-0"
        style={{ backgroundColor: hero.overlayColor }}
      />

      <div
        className="relative mx-auto flex h-full w-full flex-col justify-center"
        style={{
          zIndex: zIndex.content,
          maxWidth: sizes.layout.desktopWide,
          paddingInline: sizes.layout.gutter,
        }}
      >
        <div className="flex flex-1 flex-col justify-center">
          <h1
            ref={azizamRef}
            className="font-bold"
            style={{
              fontSize: `clamp(${typography.fontSize.heroSm}, 10vw, ${typography.fontSize.heroXl})`,
              lineHeight: typography.lineHeight.none,
              letterSpacing: typography.letterSpacing.tighter,
              paddingLeft: spacing[4],
            }}
          >
            {firstTitleLine}
          </h1>

          <h1
            ref={marketRef}
            className="text-right font-bold"
            style={{
              fontSize: `clamp(${typography.fontSize.heroSm}, 10vw, ${typography.fontSize.heroXl})`,
              lineHeight: typography.lineHeight.none,
              letterSpacing: typography.letterSpacing.tighter,
              marginTop: spacing[4],
              paddingRight: spacing[4],
            }}
          >
            {secondTitleLine}
          </h1>
        </div>

        <div
          className="flex justify-center"
          style={{ paddingBottom: spacing[12] }}
        >
          <ScrollButton />
        </div>
      </div>
    </section>
  )
}
