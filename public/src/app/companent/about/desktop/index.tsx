"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { colors, radius, shadows, sizes } from "@/config/design-system"
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider"
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders"
import { selectAboutViewModel } from "@/lib/backend/selectors"

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const snapshot = usePublicSiteContent()
  const about = selectAboutViewModel(snapshot)
  const sectionRef = useRef<HTMLElement | null>(null)
  const bigTitleRef = useRef<HTMLHeadingElement | null>(null)
  const imageRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const textsRef = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(bigTitleRef.current, {
        scale: 1.3,
        opacity: 0,
      })

      gsap.set(imageRef.current, {
        scale: 0.6,
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
      })

      gsap.set([titleRef.current, ...textsRef.current], {
        opacity: 0,
        y: 40,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4500",
          scrub: true,
          pin: true,
        },
      })

      tl.to(bigTitleRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
      })

      tl.to(bigTitleRef.current, {
        y: -200,
        opacity: 0,
        duration: 1.2,
      })

      tl.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
      })

      tl.to(imageRef.current, {
        x: "-35vw",
        duration: 1.5,
      })

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
      })

      tl.to(titleRef.current, {
        opacity: 0,
        y: -40,
        duration: 1,
      })

      textsRef.current.forEach((el) => {
        tl.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
        })

        tl.to(el, {
          opacity: 0,
          y: -40,
          duration: 1,
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="h-screen w-full overflow-hidden"
      style={{ backgroundColor: colors.background.about }}
    >
      <div
        className="relative mx-auto h-full w-full"
        style={{
          maxWidth: sizes.layout.desktopWide,
          paddingInline: sizes.layout.gutter,
        }}
      >
        <h2
          ref={bigTitleRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold"
          style={{
            color: colors.brand.primaryStrong,
            fontSize: "clamp(72px, 8vw, 120px)",
          }}
        >
          {about.section.sectionLabel.toUpperCase()}
        </h2>

        <div
          ref={imageRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          style={{
            width: sizes.about.imageWidth,
            height: sizes.about.imageHeight,
            borderRadius: radius.xl,
            border: `2px solid ${colors.brand.primary}`,
            boxShadow: shadows.card,
          }}
        >
          <Image
            src={
              about.image?.url ??
              createContentPlaceholderDataUri({
                title: about.section.brandTitle,
                subtitle: about.section.sectionLabel,
              })
            }
            alt={about.image?.alt ?? about.section.brandTitle}
            width={520}
            height={650}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>

        <div
          className="absolute right-0 top-1/2 -translate-y-1/2"
          style={{ width: sizes.about.textWidth }}
        >
          <h3
            ref={titleRef}
            className="absolute font-semibold"
            style={{
              color: colors.brand.primaryStrong,
              fontSize: "clamp(40px, 3.6vw, 56px)",
            }}
          >
            {about.section.brandTitle}
          </h3>

          {about.textItems.map((item, index) => (
            <p
              key={item.id}
              ref={(el) => {
                textsRef.current[index] = el
              }}
              className="absolute"
              style={{
                color: colors.brand.secondary,
                fontSize: "clamp(24px, 1.8vw, 32px)",
              }}
            >
              {item.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
