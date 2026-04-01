"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  colors,
  radius,
  shadows,
  sizes,
  spacing,
  zIndex,
} from "@/config/design-system"
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider"
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders"
import { selectAchievementsViewModel } from "@/lib/backend/selectors"

gsap.registerPlugin(ScrollTrigger)

export default function AchievementsSection() {
  const snapshot = usePublicSiteContent()
  const achievements = selectAchievementsViewModel(snapshot)
  const sectionRef = useRef<HTMLElement | null>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const introTitleRef = useRef<HTMLHeadingElement | null>(null)
  const introSubtitleRef = useRef<HTMLParagraphElement | null>(null)
  const finalIntroRef = useRef<HTMLDivElement | null>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const validSlides = slidesRef.current.filter(Boolean) as HTMLDivElement[]

        const intro = introRef.current
        const introTitle = introTitleRef.current
        const introSubtitle = introSubtitleRef.current
        const finalIntro = finalIntroRef.current

        if (!intro || !introTitle || !introSubtitle || !finalIntro) return

        gsap.set(introTitle, {
          opacity: 0,
          y: 60,
        })

        gsap.set(introSubtitle, {
          opacity: 0,
          y: 40,
        })

        gsap.set(intro, {
          transformPerspective: 2000,
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
        })

        gsap.set(finalIntro, {
          opacity: 0,
          scale: 0.92,
        })

        validSlides.forEach((slide, index) => {
          const imageWrap = slide.querySelector(".achievement-image-wrap")
          const image = slide.querySelector(".achievement-image")
          const content = slide.querySelector(".achievement-content")

          gsap.set(slide, {
            opacity: index === 0 ? 1 : 0,
            zIndex: achievements.length - index,
            transformPerspective: 2000,
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            rotateY: 0,
            xPercent: 0,
          })

          gsap.set(imageWrap, {
            opacity: 0,
            scale: 0.86,
            y: 50,
          })

          gsap.set(image, {
            y: 0,
            scale: 1,
          })

          gsap.set(content, {
            opacity: 0,
            y: 50,
          })
        })

        const totalScroll = achievements.length * 2200 + 2600

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalScroll}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.to(introTitle, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        })

        tl.to(introSubtitle, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        })

        tl.to(intro, {
          rotateY: -82,
          xPercent: -18,
          opacity: 0.15,
          duration: 1.35,
          ease: "power2.inOut",
        })

        validSlides.forEach((slide, index) => {
          const imageWrap = slide.querySelector(".achievement-image-wrap")
          const image = slide.querySelector(".achievement-image")
          const content = slide.querySelector(".achievement-content")

          if (!imageWrap || !image || !content) return

          tl.set(
            slide,
            {
              opacity: 1,
            },
            ">-0.1",
          )

          tl.to(
            imageWrap,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
            },
            ">",
          )

          tl.to(image, {
            y: -110,
            scale: 0.94,
            duration: 1.05,
            ease: "power2.inOut",
          })

          tl.to(
            content,
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
            },
            "<+0.15",
          )

          if (index !== validSlides.length - 1) {
            const nextSlide = validSlides[index + 1]
            const nextImageWrap = nextSlide.querySelector(".achievement-image-wrap")

            tl.to(slide, {
              rotateY: -84,
              xPercent: -20,
              opacity: 0.14,
              duration: 1.1,
              ease: "power2.inOut",
            })

            tl.set(
              nextSlide,
              {
                opacity: 1,
              },
              "<+0.12",
            )

            if (nextImageWrap) {
              tl.fromTo(
                nextImageWrap,
                {
                  opacity: 0,
                  scale: 0.88,
                  y: 55,
                },
                {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: 1,
                  ease: "power3.out",
                },
                "<+0.1",
              )
            }
          }
        })

        const closedSlides = [...validSlides].reverse()

        tl.to(
          closedSlides,
          {
            rotateY: 84,
            xPercent: 16,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power2.inOut",
          },
          ">",
        )

        tl.to(
          finalIntro,
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          },
          "<+0.25",
        )

        tl.to(finalIntro, {
          opacity: 0,
          y: -40,
          duration: 1,
          ease: "power2.out",
        })
      }, sectionRef)

      return () => ctx.revert()
    })

    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(".achievement-mobile-card")

        gsap.from(".achievement-mobile-intro", {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        })

        items.forEach((item) => {
          gsap.from(item, {
            opacity: 0,
            y: 60,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
          })
        })
      }, sectionRef)

      return () => ctx.revert()
    })

      return () => mm.revert()
  }, [achievements.length])

  if (achievements.length === 0) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: colors.background.achievements }}
    >
      <div className="hidden md:block">
        <div className="relative h-screen w-full [perspective:2000px]">
          <div
            ref={introRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{
              zIndex: zIndex.intro,
              maxWidth: sizes.layout.desktopContainer,
              marginInline: "auto",
              paddingInline: sizes.layout.gutter,
            }}
          >
            <h2
              ref={introTitleRef}
              className="max-w-5xl text-5xl font-semibold tracking-tight lg:text-7xl"
              style={{ color: colors.text.primary }}
            >
              Kompaniya Yutuqlari
            </h2>

            <p
              ref={introSubtitleRef}
              className="mt-6 max-w-2xl text-lg leading-relaxed lg:text-2xl"
              style={{ color: colors.text.secondary }}
            >
              Ishonch, tajriba va estetik yondashuv birlashgan yo‘limizdan
              lavhalar.
            </p>
          </div>

          <div
            className="absolute inset-0 mx-auto w-full"
            style={{ maxWidth: sizes.layout.desktopWide }}
          >
            {achievements.map((item, index) => (
              <div
                key={item.item.id}
                ref={(el) => {
                  slidesRef.current[index] = el
                }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ paddingInline: sizes.layout.gutter }}
              >
                <div className="relative flex h-full w-full max-w-7xl items-center justify-center">
                  <div
                    className="achievement-image-wrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      minWidth: "360px",
                      maxWidth: "620px",
                      width: "38vw",
                    }}
                  >
                    <div
                      className="overflow-hidden bg-white"
                      style={{
                        borderRadius: radius["2xl"],
                        boxShadow: shadows.achievement,
                      }}
                    >
                      <img
                        src={
                          item.image?.url ??
                          createContentPlaceholderDataUri({
                            title: item.item.title,
                            subtitle: item.item.eyebrow ?? String(index + 1).padStart(2, "0"),
                            background: item.theme.frame,
                            foreground: item.theme.text,
                            accent: item.theme.ribbon,
                          })
                        }
                        alt={item.image?.alt ?? item.item.title}
                        className="achievement-image w-full object-cover"
                        style={{ height: sizes.achievements.desktopImageHeight }}
                      />
                    </div>
                  </div>

                  <div className="achievement-content absolute left-1/2 top-[68%] w-full max-w-3xl -translate-x-1/2 text-center">
                    <div
                      className="mx-auto max-w-2xl backdrop-blur-md"
                      style={{
                        borderRadius: radius["2xl"],
                        backgroundColor: colors.surface.glass,
                        boxShadow: shadows.glass,
                        paddingInline: spacing[8],
                        paddingBlock: spacing[6],
                      }}
                    >
                      <div
                        className="mb-3 text-sm font-medium uppercase tracking-[0.28em]"
                        style={{ color: colors.text.muted }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <h3
                        className="text-3xl font-semibold tracking-tight lg:text-5xl"
                        style={{ color: colors.text.primary }}
                      >
                        {item.item.title}
                      </h3>

                      <p
                        className="mt-4 text-base leading-8 lg:text-lg"
                        style={{ color: colors.text.secondary }}
                      >
                        {item.item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            ref={finalIntroRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{
              zIndex: zIndex.finalIntro,
              maxWidth: sizes.layout.desktopContainer,
              marginInline: "auto",
              paddingInline: sizes.layout.gutter,
            }}
          >
            <h2
              className="max-w-5xl text-5xl font-semibold tracking-tight lg:text-7xl"
              style={{ color: colors.text.primary }}
            >
              Kompaniya Yutuqlari
            </h2>

            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed lg:text-2xl"
              style={{ color: colors.text.secondary }}
            >
              Har bir bosqich ortida tajriba, did va ishonch turadi.
            </p>
          </div>
        </div>
      </div>

      <div
        className="md:hidden"
        style={{
          paddingInline: spacing[5],
          paddingBlock: spacing[20],
        }}
      >
        <div className="achievement-mobile-intro mx-auto max-w-xl text-center">
          <h2
            className="text-4xl font-semibold tracking-tight"
            style={{ color: colors.text.primary }}
          >
            Kompaniya Yutuqlari
          </h2>

          <p
            className="mt-4 text-base leading-7"
            style={{ color: colors.text.secondary }}
          >
            Ishonch, tajriba va estetik yondashuv birlashgan yo‘limizdan
            lavhalar.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {achievements.map((item) => (
            <div
              key={item.item.id}
              className="achievement-mobile-card overflow-hidden bg-white"
              style={{
                borderRadius: radius["2xl"],
                boxShadow: shadows.soft,
              }}
            >
              <Image
                src={
                  item.image?.url ??
                  createContentPlaceholderDataUri({
                    title: item.item.title,
                    subtitle: item.item.eyebrow ?? String(item.item.sortOrder).padStart(2, "0"),
                    background: item.theme.frame,
                    foreground: item.theme.text,
                    accent: item.theme.ribbon,
                  })
                }
                alt={item.image?.alt ?? item.item.title}
                width={500}
                height={500}
                unoptimized
              />

              <div
                style={{
                  padding: spacing[6],
                }}
              >
                <div
                  className="text-xs font-medium uppercase tracking-[0.28em]"
                  style={{ color: colors.text.muted }}
                >
                  {String(item.item.sortOrder).padStart(2, "0")}
                </div>

                <h3
                  className="mt-3 text-2xl font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {item.item.title}
                </h3>

                <p
                  className="mt-3 text-sm leading-7"
                  style={{ color: colors.text.secondary }}
                >
                  {item.item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
