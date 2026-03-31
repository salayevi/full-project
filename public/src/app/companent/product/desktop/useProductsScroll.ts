"use client"

import { RefObject, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { sizes } from "@/config/design-system"

gsap.registerPlugin(ScrollTrigger)

type Params = {
  sectionRef: RefObject<HTMLDivElement | null>
  pinRef: RefObject<HTMLDivElement | null>
  totalSlides: number
}

export function useProductsScroll({ sectionRef, pinRef, totalSlides }: Params) {
  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current

    if (!section || !pin || totalSlides <= 0) return

    const kicker = section.querySelector(
      "[data-products-kicker]",
    ) as HTMLElement | null
    const title = section.querySelector(
      "[data-products-title]",
    ) as HTMLElement | null
    const subtitle = section.querySelector(
      "[data-products-subtitle]",
    ) as HTMLElement | null

    const cardShell = section.querySelector(
      "[data-products-card-shell]",
    ) as HTMLElement | null
    const cardShadow = section.querySelector(
      "[data-products-card-shadow]",
    ) as HTMLElement | null
    const card = section.querySelector(
      "[data-products-card]",
    ) as HTMLElement | null

    const slides = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll("[data-product-slide]"),
    )
    const medias = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll("[data-product-media]"),
    )
    const infos = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll("[data-product-info]"),
    )
    const colorBlocks = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll("[data-product-colors]"),
    )
    const actionBlocks = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll("[data-product-actions]"),
    )
    const guestCallouts = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll("[data-product-guest-callout]"),
    )

    if (
      !kicker ||
      !title ||
      !subtitle ||
      !cardShell ||
      !cardShadow ||
      !card ||
      !slides.length
    ) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.set([kicker, subtitle], {
        autoAlpha: 0,
        y: 14,
      })

      gsap.set(title, {
        autoAlpha: 0,
        y: 22,
        scale: 1.04,
      })

      gsap.set(cardShell, {
        autoAlpha: 0,
        y: 90,
        scale: 0.965,
        transformOrigin: "50% 50%",
      })

      gsap.set(cardShadow, {
        autoAlpha: 0,
        scaleX: 0.7,
        scaleY: 0.7,
        transformOrigin: "50% 50%",
      })

      gsap.set(card, {
        autoAlpha: 1,
      })

      gsap.set(slides, {
        autoAlpha: 0,
        pointerEvents: "none",
      })

      gsap.set(medias, {
        autoAlpha: 0,
        y: 34,
        scale: 0.985,
      })

      gsap.set(infos, {
        autoAlpha: 0,
        y: 20,
      })

      gsap.set(colorBlocks, {
        autoAlpha: 0,
        y: 14,
      })

      gsap.set(actionBlocks, {
        autoAlpha: 0,
        y: 14,
      })

      gsap.set(guestCallouts, {
        autoAlpha: 0,
        y: 14,
      })

      gsap.set(slides[0], {
        autoAlpha: 1,
        pointerEvents: "auto",
      })

      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${(totalSlides + sizes.product.sceneExtraSlides) * window.innerHeight}`,
          scrub: 0.35,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(
        title,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.42,
        },
        0,
      )

      tl.to(
        kicker,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.22,
        },
        0.06,
      )

      tl.to(
        subtitle,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.22,
        },
        0.12,
      )

      tl.to(
        title,
        {
          autoAlpha: 0,
          y: -50,
          scale: 0.97,
          duration: 0.25,
        },
        0.38,
      )

      tl.to(
        kicker,
        {
          autoAlpha: 0,
          x: -30,
          y: -10,
          duration: 0.16,
        },
        0.36,
      )

      tl.to(
        subtitle,
        {
          autoAlpha: 0,
          x: 30,
          y: 12,
          duration: 0.16,
        },
        0.36,
      )

      tl.to(
        cardShell,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
        },
        0.42,
      )

      tl.to(
        cardShadow,
        {
          autoAlpha: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.22,
        },
        0.46,
      )

      tl.to(
        medias[0],
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.18,
        },
        0.5,
      )

      tl.to(
        infos[0],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.14,
        },
        0.53,
      )

      if (colorBlocks[0]) {
        tl.to(
          colorBlocks[0],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.1,
          },
          0.56,
        )
      }

      if (actionBlocks[0]) {
        tl.to(
          actionBlocks[0],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.1,
          },
          0.58,
        )
      }

      if (guestCallouts[0]) {
        tl.to(
          guestCallouts[0],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.12,
          },
          0.58,
        )
      }

      for (let i = 1; i < totalSlides; i++) {
        const base = 1.15 + (i - 1) * 0.8

        const prevSlide = slides[i - 1]
        const nextSlide = slides[i]

        const prevMedia = medias[i - 1]
        const nextMedia = medias[i]

        const prevInfo = infos[i - 1]
        const nextInfo = infos[i]

        const prevColors = colorBlocks[i - 1]
        const nextColors = colorBlocks[i]

        const prevActions = actionBlocks[i - 1]
        const nextActions = actionBlocks[i]

        const prevGuest = guestCallouts[i - 1]
        const nextGuest = guestCallouts[i]

        tl.to(
          [prevMedia, prevInfo, prevColors, prevActions, prevGuest].filter(Boolean),
          {
            autoAlpha: 0,
            y: -18,
            duration: 0.18,
            stagger: 0.02,
          },
          base,
        )

        tl.to(
          prevSlide,
          {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.12,
          },
          base + 0.05,
        )

        tl.to(
          nextSlide,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.12,
          },
          base + 0.07,
        )

        tl.fromTo(
          nextMedia,
          {
            autoAlpha: 0,
            y: 30,
            scale: 0.985,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.24,
          },
          base + 0.11,
        )

        tl.fromTo(
          nextInfo,
          {
            autoAlpha: 0,
            y: 18,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.2,
          },
          base + 0.15,
        )

        if (nextColors) {
          tl.fromTo(
            nextColors,
            {
              autoAlpha: 0,
              y: 12,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.14,
            },
            base + 0.19,
          )
        }

        if (nextActions) {
          tl.fromTo(
            nextActions,
            {
              autoAlpha: 0,
              y: 12,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.14,
            },
            base + 0.22,
          )
        }

        if (nextGuest) {
          tl.fromTo(
            nextGuest,
            {
              autoAlpha: 0,
              y: 12,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.14,
            },
            base + 0.22,
          )
        }
      }

      const lastIndex = totalSlides - 1
      const outroBase = 1.15 + (totalSlides - 1) * 0.8 + 0.55

      tl.to(
        [
          medias[lastIndex],
          infos[lastIndex],
          colorBlocks[lastIndex],
          actionBlocks[lastIndex],
          guestCallouts[lastIndex],
        ].filter(Boolean),
        {
          autoAlpha: 0,
          y: -14,
          duration: 0.16,
          stagger: 0.02,
        },
        outroBase,
      )

      tl.to(
        slides[lastIndex],
        {
          autoAlpha: 0,
          pointerEvents: "none",
          duration: 0.12,
        },
        outroBase + 0.05,
      )

      tl.to(
        cardShadow,
        {
          autoAlpha: 0,
          scaleX: 0.72,
          scaleY: 0.72,
          duration: 0.22,
        },
        outroBase + 0.08,
      )

      tl.to(
        cardShell,
        {
          autoAlpha: 0,
          y: 95,
          scale: 0.965,
          duration: 0.3,
          ease: "power2.in",
        },
        outroBase + 0.08,
      )

      tl.set(
        cardShell,
        {
          autoAlpha: 0,
          pointerEvents: "none",
        },
        outroBase + 0.4,
      )
    }, section)

    const handleRefresh = () => ScrollTrigger.refresh()

    window.addEventListener("load", handleRefresh)
    window.addEventListener("resize", handleRefresh)

    return () => {
      window.removeEventListener("load", handleRefresh)
      window.removeEventListener("resize", handleRefresh)
      ctx.revert()
    }
  }, [sectionRef, pinRef, totalSlides])
}