<!-- Home -->
\\\\\\\\\\\\\\\\\\\\\\

# Papka va filelar Joylashuv arxitekturasi Asosiy va o'zgarmas va bu Arxitektura Desktop dizayn versiaga tegishli 

```
src/
  app/
    page.tsx
    layout.tsx
    globals.css

  components/
    shared/
      auth/
        AuthModal.tsx
        AuthModalProvider.tsx
        AuthTriggerButton.tsx

      responsive/
        ResponsivePage.tsx
        breakpoints.ts
        device-config.ts
        use-device-mode.ts

      ui/
      hooks/
      utils/

    home/
      desktop/
        Hero/
          hero-section.tsx
        Navbar/
          navbar.tsx
        Footer/
          footer.tsx

      mobile/
        index.tsx
        mobile-hero.tsx
        mobile-topbar.tsx
        mobile-bottom-nav.tsx

    about/
      desktop/
        index.tsx
      mobile/
        index.tsx
        mobile-about-story.tsx

    product/
      shared/
        product.types.ts
        products-data.ts

      desktop/
        index.tsx
        product-actions.tsx
        product-colors.tsx
        product-guest-callout.tsx
        product-info.tsx
        product-media.tsx
        product-slide.tsx
        products-scene.tsx
        useProductsScroll.ts

      mobile/
        index.tsx
        mobile-product-shell.tsx
        mobile-product-card.tsx
        mobile-product-media.tsx
        mobile-product-info.tsx
        mobile-product-actions.tsx
        mobile-product-guest-callout.tsx
        useMobileProductsScroll.ts

    achievements/
      desktop/
        AchievementsSection.tsx
      mobile/
        index.tsx
        mobile-achievement-card.tsx
        mobile-achievements-shell.tsx

    sections/
      desktop-page.tsx
      mobile-page.tsx

config/
  design-system/
    colors.ts
    spacing.ts
    typography.ts
    motion.ts

  mobile-system/
    breakpoints.ts
    mobile-layout.ts
    mobile-spacing.ts
    mobile-typography.ts
    mobile-navbar.ts
    mobile-sections.ts
    mobile-motion.ts
```
<!-- Navbar -->

# navbar.tsx

``` 
"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import AuthTriggerButton from "../../auth/AuthTriggerButton"
import { colors, motion, spacing, zIndex } from "@/config/design-system"

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: motion.duration.slower,
      ease: motion.ease.smooth,
    })
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed left-0 top-0 flex w-full items-center justify-between text-white backdrop-blur-md"
      style={{
        paddingInline: spacing[10],
        paddingBlock: spacing[6],
        zIndex: zIndex.navbar,
        backgroundColor: colors.overlay.navbar,
      }}
    >
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Azizam Market" width={40} height={40} />
      </div>

      <div className="flex gap-8 text-sm font-medium">
        <a href="#about">Biz haqimizda</a>
        <a href="#products">Mahsulot</a>
        <AuthTriggerButton mode="login" className="transition hover:opacity-80">
          Kirish yoki Ro&apos;yxatdan o&apos;tish
        </AuthTriggerButton>
      </div>
    </nav>
  )
}
``` 

# Footer/footer.tsx

```
"use client"

import Image from "next/image"
import AuthTriggerButton from "../../auth/AuthTriggerButton"
import { colors, radius, spacing } from "@/config/design-system"

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: colors.background.dark }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Azizam Market" width={44} height={44} />
              <span className="text-xl font-semibold text-white">
                Azizam Market
              </span>
            </div>

            <p
              className="mt-5 text-sm leading-7"
              style={{ color: colors.text.whiteSoft }}
            >
              Premium estetik yondashuv, mehr va qadrlash ruhida qurilgan
              zamonaviy kosmetika tajribasi.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Bo‘limlar
              </h3>

              <div
                className="mt-4 flex flex-col gap-3 text-sm"
                style={{ color: colors.text.whiteSoft }}
              >
                <a href="#about">Biz haqimizda</a>
                <a href="#products">Mahsulotlar</a>
                <a href="#achievements">Yutuqlar</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Aloqa
              </h3>

              <div
                className="mt-4 flex flex-col gap-3 text-sm"
                style={{ color: colors.text.whiteSoft }}
              >
                <span>Instagram</span>
                <span>Telegram</span>
                <span>+998 00 000 00 00</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Hisob
              </h3>

              <div className="mt-4">
                <AuthTriggerButton
                  mode="register"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  style={{
                    borderRadius: radius.full,
                    backgroundColor: colors.brand.primary,
                  }}
                >
                  Ro‘yxatdan o‘tish
                </AuthTriggerButton>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-14 border-t pt-6 text-sm"
          style={{
            borderColor: colors.border.whiteSoft,
            color: colors.text.whiteSoft,
          }}
        >
          © 2026 Azizam Market. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  )
}
```



# hero-section.tsx
<!-- Hero -->

```
"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollButton from "../../Buttons-funksia/button-scroll"
import {
  colors,
  motion,
  sizes,
  spacing,
  typography,
  zIndex,
} from "@/config/design-system"

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
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
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/rose-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        className="absolute inset-0"
        style={{ backgroundColor: colors.overlay.hero }}
      />

      <div
        className="relative mx-auto flex h-full w-full flex-col justify-center"
        style={{
          zIndex: zIndex.content,
          maxWidth: sizes.hero.containerMax,
          paddingInline: spacing[5],
        }}
      >
        <div className="flex flex-1 flex-col justify-center">
          <h1
            ref={azizamRef}
            className="font-bold"
            style={{
              fontSize: `clamp(${typography.fontSize.heroSm}, 12vw, ${typography.fontSize.heroXl})`,
              lineHeight: typography.lineHeight.none,
              letterSpacing: typography.letterSpacing.tighter,
              paddingLeft: spacing[4],
            }}
          >
            Azizam
          </h1>

          <h1
            ref={marketRef}
            className="text-right font-bold"
            style={{
              fontSize: `clamp(${typography.fontSize.heroSm}, 12vw, ${typography.fontSize.heroXl})`,
              lineHeight: typography.lineHeight.none,
              letterSpacing: typography.letterSpacing.tighter,
              marginTop: spacing[4],
              paddingRight: spacing[4],
            }}
          >
            Market
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
``` 




# button-scroll.tsx
<!-- Funksia Button Scroll -->

``` 
"use client"

export default function ScrollButton() {

  const scrollToFooter = () => {

    const footer = document.getElementById("footer")
    if (!footer) return

    const targetPosition = footer.offsetTop
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition

    const duration = 2000 // scroll davomiyligi (millisecond) — 2000 = 2 sekund
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
      className="flex flex-col items-center gap-2 mt-10 text-white opacity-80 hover:opacity-100 transition"
    >
      <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
        <div className="w-1 h-2 bg-white rounded-full mt-1 animate-bounce"></div>
      </div>

      <span className="text-sm tracking-wide">
        Aylantiring
      </span>
    </button>
  )
}
```


# about/index.tsx
<!-- About -->

```
"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { colors, radius, shadows, sizes } from "@/config/design-system"

gsap.registerPlugin(ScrollTrigger)

export default function About() {
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
      className="flex h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background.about }}
    >
      <h2
        ref={bigTitleRef}
        className="absolute text-7xl font-bold md:text-[120px]"
        style={{ color: colors.brand.primaryStrong }}
      >
        BIZ HAQIMIZDA
      </h2>

      <div
        ref={imageRef}
        className="absolute overflow-hidden"
        style={{
          borderRadius: radius.xl,
          border: `2px solid ${colors.brand.primary}`,
          boxShadow: shadows.card,
        }}
      >
        <Image
          src="/grid-img.png"
          alt="Azizam"
          width={520}
          height={650}
          className="object-cover"
        />
      </div>

      <div
        className="absolute right-[10vw]"
        style={{ width: sizes.about.textWidth }}
      >
        <h3
          ref={titleRef}
          className="absolute text-5xl font-semibold"
          style={{ color: colors.brand.primaryStrong }}
        >
          Azizam Market
        </h3>

        {[
          "Azizam Market — bu shunchaki kosmetika do‘koni emas.",
          "Bu — mehr, e’tibor va qadrlash maskani.",
          "“Azizam” so‘zi biz uchun oddiy murojaat emas.",
          "Bu yaqinlikni, samimiyatni va muhabbatni anglatadi.",
          "Biz har bir inson o‘zini aziz his qilishi uchun ishlaymiz.",
          "Har bir sovg‘a — bu munosabat.",
          "Har bir mahsulot — e’tibor belgisi.",
        ].map((text, index) => (
          <p
            key={index}
            ref={(el) => {
              textsRef.current[index] = el
            }}
            className="absolute text-2xl"
            style={{ color: colors.brand.secondary }}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  )
}
```



# product/index.tsx 
<!-- Product -->


```
"use client"

import { productsData } from "./products-data"
import ProductsScene from "./products-scene"

export default function ProductsSection() {
  return (
    <section id="products" className="relative w-full">
      <ProductsScene products={productsData} />
    </section>
  )
}
```
# product/products-scene.tsx

```
"use client"

import { useRef } from "react"
import { Product } from "./product.types"
import { useProductsScroll } from "./useProductsScroll"
import ProductSlide from "./product-slide"
import { colors, radius, shadows, sizes } from "@/config/design-system"

type Props = {
  products: Product[]
}

export default function ProductsScene({ products }: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const pinRef = useRef<HTMLDivElement | null>(null)

  useProductsScroll({
    sectionRef,
    pinRef,
    totalSlides: products.length,
  })

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${(products.length + sizes.product.sceneExtraSlides) * 100}vh` }}
    >
      <div
        ref={pinRef}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ backgroundColor: colors.background.soft }}
      >
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
          <div className="text-center">
            <p
              data-products-kicker
              className="mb-4 text-xs uppercase tracking-[0.45em] sm:text-sm"
              style={{ color: colors.text.secondary }}
            >
              Azizam Market
            </p>

            <h2
              data-products-title
              className="text-6xl font-semibold tracking-tight sm:text-7xl md:text-8xl lg:text-[8rem]"
              style={{ color: colors.brand.primaryStrong }}
            >
              Mahsulotlar
            </h2>

            <p
              data-products-subtitle
              className="mx-auto mt-5 max-w-xl text-sm sm:text-base"
              style={{ color: colors.text.secondary }}
            >
              Har bir mahsulotni batafsil ko‘rib chiqing
            </p>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pointer-events-none sm:px-6 lg:px-10">
          <div
            data-products-card-shell
            className="relative w-full will-change-transform pointer-events-auto"
            style={{ maxWidth: sizes.product.cardMaxWidth }}
          >
            <div
              data-products-card-shadow
              className="pointer-events-none absolute left-1/2 top-[58%] h-24 w-[62%] -translate-x-1/2 rounded-full blur-3xl"
              style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
            />

            <div
              data-products-card
              className="relative mx-auto overflow-hidden border backdrop-blur-sm"
              style={{
                borderRadius: radius["2xl"],
                borderColor: "rgba(255,255,255,0.6)",
                backgroundColor: "rgba(255,255,255,0.9)",
                boxShadow: shadows.floating,
              }}
            >
              <div
                className="relative w-full"
                style={{
                  height: sizes.product.cardHeight,
                  minHeight: sizes.product.cardMinHeight,
                }}
              >
                {products.map((product, index) => (
                  <ProductSlide
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

# product/useProductsScroll.ts

```
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
```

# product/product-slide.ts

```
"use client"

import { Product } from "./product.types"
import ProductMedia from "./product-media"
import ProductInfo from "./product-info"
import ProductColors from "./product-colors"
import ProductActions from "./product-actions"
import ProductGuestCallout from "./product-guest-callout"
import { useAuthModal } from "../auth/AuthModalProvider"
import { colors, sizes } from "@/config/design-system"

type Props = {
  product: Product
  index: number
}

function getMediaPanelBackground(product: Product) {
  const mode = product.mediaPanel.mode

  if (mode === "forceBlack") return colors.background.dark
  if (mode === "forceWhite") return colors.background.lightPanel
  if (mode === "imageTone") return product.mediaPanel.color || "#d8d2cc"

  return colors.background.dark
}

export default function ProductSlide({ product, index }: Props) {
  const mediaPanelBg = getMediaPanelBackground(product)
  const { isAuthenticated } = useAuthModal()

  return (
    <article
      data-product-slide
      data-index={index}
      className="absolute inset-0 grid h-full w-full grid-cols-1 lg:grid-cols-[1.05fr_1fr]"
      style={{
        background: product.theme.bg,
        color: product.theme.text,
      }}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden pointer-events-none"
        style={{
          backgroundColor: mediaPanelBg,
          paddingInline: sizes.product.mediaPanelPaddingX,
          paddingBlock: sizes.product.mediaPanelPaddingY,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_58%)]" />

        <div className="relative z-0 pointer-events-none">
          <ProductMedia product={product} />
        </div>
      </div>

      <div
        className="relative z-20 flex items-center"
        style={{
          paddingInline: sizes.product.contentPanelPaddingX,
          paddingBlock: sizes.product.contentPanelPaddingY,
        }}
      >
        <div
          className="mx-auto w-full"
          style={{ maxWidth: sizes.product.infoMaxWidth }}
        >
          <ProductInfo product={product} isAuthenticated={isAuthenticated} />

          <div className="mt-8">
            <ProductColors
              colors={product.colors}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {isAuthenticated ? (
            <div
              className="mt-8 relative z-20"
              style={{ minHeight: sizes.product.actionMinHeight }}
            >
              <ProductActions
                actions={product.actions}
                accent={product.theme.accent}
                isAuthenticated={isAuthenticated}
              />
            </div>
          ) : (
            <div className="relative z-30">
              <ProductGuestCallout accent={product.theme.accent} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
```

# product/product-media.tsx 

```
"use client"

import { Product } from "./product.types"
import { sizes } from "@/config/design-system"

type Props = {
  product: Product
}

export default function ProductMedia({ product }: Props) {
  const { media, name } = product

  return (
    <div
      data-product-media
      className="relative z-10 flex h-full w-full items-center justify-center will-change-transform"
    >
      {media.type === "image" ? (
        <img
          src={media.src}
          alt={media.alt || name}
          draggable={false}
          className="relative z-10 object-contain"
          style={{
            maxHeight: sizes.product.mediaMax,
            maxWidth: sizes.product.mediaMax,
            filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.18))",
          }}
        />
      ) : (
        <video
          src={media.src}
          poster={media.poster}
          className="h-full w-full object-cover"
          muted
          autoPlay
          loop
          playsInline
        />
      )}
    </div>
  )
}
```

# product/product-info.tsx 

```
import { Product } from "./product.types"
import { radius } from "@/config/design-system"

type Props = {
  product: Product
  isAuthenticated: boolean
}

export default function ProductInfo({ product, isAuthenticated }: Props) {
  return (
    <div data-product-info className="max-w-xl">
      {product.badge && (
        <div
          className="mb-4 inline-flex px-4 py-1 text-sm font-medium"
          style={{
            borderRadius: radius.full,
            backgroundColor: `${product.theme.accent}20`,
            color: product.theme.accent,
          }}
        >
          {product.badge}
        </div>
      )}

      <h3 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
        {product.name}
      </h3>

      {product.subtitle && (
        <p
          className="mt-3 text-base sm:text-lg"
          style={{ color: product.theme.muted || product.theme.text }}
        >
          {product.subtitle}
        </p>
      )}

      <p
        className="mt-6 text-sm leading-7 sm:text-base"
        style={{ color: product.theme.muted || product.theme.text }}
      >
        {product.description}
      </p>

      {isAuthenticated && product.price ? (
        <div className="mt-8">
          <div
            className="text-xs uppercase tracking-[0.22em]"
            style={{ color: product.theme.muted || product.theme.text }}
          >
            Narx
          </div>

          <div className="mt-2 text-2xl font-semibold">
            {product.price}
          </div>
        </div>
      ) : null}
    </div>
  )
}
```

# product/product-colors.tsx 

```
import { ProductColor } from "./product.types"
import { colors as dsColors, radius } from "@/config/design-system"

type Props = {
  colors: ProductColor[]
  isAuthenticated: boolean
}

export default function ProductColors({ colors, isAuthenticated }: Props) {
  return (
    <div
      data-product-colors
      style={{
        opacity: isAuthenticated ? 1 : 0,
        pointerEvents: isAuthenticated ? "auto" : "none",
        height: isAuthenticated ? "auto" : 0,
        overflow: "hidden",
        marginTop: isAuthenticated ? 0 : 0,
      }}
    >
      <p
        className="mb-3 text-sm font-medium uppercase tracking-[0.18em]"
        style={{ color: dsColors.text.secondary }}
      >
        Ranglar
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            aria-label={color.name}
            className="group flex items-center gap-3 px-3 py-2 backdrop-blur-sm transition hover:scale-[1.02]"
            style={{
              borderRadius: radius.full,
              border: `1px solid ${dsColors.border.soft}`,
              backgroundColor: "rgba(255,255,255,0.5)",
            }}
          >
            <span
              className="h-5 w-5"
              style={{
                borderRadius: radius.full,
                border: `1px solid ${dsColors.border.soft}`,
                backgroundColor: color.hex,
              }}
            />
            <span
              className="text-sm"
              style={{ color: dsColors.text.primary }}
            >
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

# product/product-actions.tsx

```
import Link from "next/link"
import { ProductAction } from "./product.types"
import { colors, motion, radius, sizes } from "@/config/design-system"

type Props = {
  actions: ProductAction[]
  accent: string
  isAuthenticated: boolean
}

export default function ProductActions({
  actions,
  accent,
  isAuthenticated,
}: Props) {
  return (
    <div
      data-product-actions
      className="flex flex-wrap gap-4"
      style={{
        minHeight: sizes.product.actionMinHeight,
        opacity: isAuthenticated ? 1 : 0,
        pointerEvents: isAuthenticated ? "auto" : "none",
      }}
    >
      {actions.map((action) => {
        const isPrimary = action.type === "primary"

        return (
          <Link
            key={action.label}
            href={action.href || "#"}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-transform hover:scale-[1.03]"
            style={{
              borderRadius: radius.full,
              backgroundColor: isPrimary ? accent : "transparent",
              color: isPrimary ? colors.text.white : "currentColor",
              border: isPrimary ? "none" : `1px solid ${colors.border.soft}`,
              transitionDuration: `${motion.duration.normal}s`,
            }}
          >
            {action.label}
          </Link>
        )
      })}
    </div>
  )
}
```

# product/products-data.ts 

```
import { Product } from "./product.types"
import { colors } from "@/config/design-system"

export const productsData: Product[] = [
  {
    id: "1",
    slug: "rose-serum",
    name: "Rose Serum",
    subtitle: "Luxury botanical care",
    description:
      "Yengil teksturali premium serum. Teri namligini ushlab turadi, silliqlik va yorqinlik beradi.",
    price: "$48",
    badge: "Best Seller",
    theme: {
      bg: "#f7f2f1",
      text: "#2c2523",
      accent: "#c98f98",
      muted: "#7e7169",
      card: "#fffaf8",
      tone: "light",
    },
    mediaPanel: {
      mode: "forceBlack",
    },
    media: {
      type: "image",
      src: "/products/parfium.jpg",
      alt: "Rose Serum bottle",
      hasTransparentBg: true,
    },
    colors: [
      { name: "Rose Gold", hex: "#c98f98" },
      { name: "Cream", hex: "#ece4dc" },
      { name: "Black", hex: "#2e2927" },
    ],
    actions: [
      { label: "Add to cart", href: "/cart", type: "primary" },
      { label: "Save", href: "/wishlist", type: "secondary" },
    ],
  },
  {
    id: "2",
    slug: "velvet-perfume",
    name: "Velvet Perfume",
    subtitle: "Elegant signature scent",
    description:
      "Nozik va chuqur ifor uyg‘unligi. Premium segment uchun estetik va uzoq saqlanuvchi kompozitsiya.",
    price: "$72",
    badge: "New Drop",
    theme: {
      bg: colors.background.dark,
      text: "#f5f1eb",
      accent: "#d5b16d",
      muted: "#b8ac9d",
      card: "#171717",
      tone: "dark",
    },
    mediaPanel: {
      mode: "forceWhite",
    },
    media: {
      type: "image",
      src: "/products/parfium2.jpg",
      alt: "Velvet Perfume bottle",
      hasTransparentBg: true,
    },
    colors: [
      { name: "Gold", hex: "#d5b16d" },
      { name: "Ivory", hex: "#f2ede6" },
      { name: "Graphite", hex: "#2a2a2a" },
    ],
    actions: [
      { label: "Add to cart", href: "/cart", type: "primary" },
      { label: "Save", href: "/wishlist", type: "secondary" },
    ],
  },
  {
    id: "3",
    slug: "silk-cream",
    name: "Silk Cream",
    subtitle: "Soft texture, premium finish",
    description:
      "Kunlik foydalanish uchun muloyim cream. Teri yuzasini yumshatadi va premium parvarish hissini beradi.",
    price: "$55",
    badge: "Editor’s Pick",
    theme: {
      bg: "#eee4da",
      text: "#251f1b",
      accent: "#8f6b52",
      muted: "#7a6d62",
      card: "#faf5ef",
      tone: "light",
    },
    mediaPanel: {
      mode: "imageTone",
      color: "#cfc5bc",
    },
    media: {
      type: "image",
      src: "/products/parfium3.jpg",
      alt: "Silk Cream jar",
      hasTransparentBg: false,
    },
    colors: [
      { name: "Mocha", hex: "#8f6b52" },
      { name: "Sand", hex: "#d5c1ac" },
      { name: "Ivory", hex: "#f7f1ea" },
    ],
    actions: [
      { label: "Add to cart", href: "/cart", type: "primary" },
      { label: "Save", href: "/wishlist", type: "secondary" },
    ],
  },
]
```


# AchievementsSection.tsx

```
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

gsap.registerPlugin(ScrollTrigger)

type AchievementItem = {
  id: number
  image: string
  title: string
  description: string
}

const achievements: AchievementItem[] = [
  {
    id: 1,
    image: "/gallery/team-1.jpg",
    title: "Premium tajriba",
    description:
      "Har bir mahsulot va xizmat estetik tanlov, sifat va hissiy taassurot mezonlari asosida shakllantiriladi.",
  },
  {
    id: 2,
    image: "/gallery/team-2.jpg",
    title: "Ishonchli jamoa",
    description:
      "Bizning jamoa buyurtmadan tortib taqdimotgacha bo‘lgan har bir bosqichni did va e’tibor bilan boshqaradi.",
  },
  {
    id: 3,
    image: "/gallery/team-3.jpg",
    title: "Yutuq va rivojlanish",
    description:
      "Azizam o‘sib borayotgan brend sifatida tajriba, ishonch va premium yondashuvni bir joyga jamlaydi.",
  },
  {
    id: 4,
    image: "/gallery/team-4.jpg",
    title: "Brend qadriyati",
    description:
      "Har bir detal orqali nafaqat mahsulot, balki unutilmas vizual va emotsional tajriba yaratiladi.",
  },
]

export default function AchievementsSection() {
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
  }, [])

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
              paddingInline: spacing[6],
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

          <div className="absolute inset-0">
            {achievements.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => {
                  slidesRef.current[index] = el
                }}
                className="absolute inset-0 flex items-center justify-center px-8 lg:px-16"
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
                        src={item.image}
                        alt={item.title}
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
                        {String(item.id).padStart(2, "0")}
                      </div>

                      <h3
                        className="text-3xl font-semibold tracking-tight lg:text-5xl"
                        style={{ color: colors.text.primary }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className="mt-4 text-base leading-8 lg:text-lg"
                        style={{ color: colors.text.secondary }}
                      >
                        {item.description}
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
              paddingInline: spacing[6],
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
              key={item.id}
              className="achievement-mobile-card overflow-hidden bg-white"
              style={{
                borderRadius: radius["2xl"],
                boxShadow: shadows.soft,
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={500}
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
                  {String(item.id).padStart(2, "0")}
                </div>

                <h3
                  className="mt-3 text-2xl font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-3 text-sm leading-7"
                  style={{ color: colors.text.secondary }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

<!-- Azizam-Market/src/app/ -->

### layout.tsx ###
```
import "./globals.css";
import { AuthModalProvider } from "./companent/auth/AuthModalProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>
        <AuthModalProvider>{children}</AuthModalProvider>
      </body>
    </html>
  );
}
```

### page.tsx ###
```
import About from "./companent/about";
import ProductsSection from "./companent/product";
import AchievementsSection from "./companent/AchievementsSection";
import HomeSection from "./companent/home";
import Footer from "./companent/home/Footer/footer";
export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white">
      <div>
        <HomeSection />
        <About />
        <ProductsSection />
        <div className="h-[20vh] bg-white" />
        <AchievementsSection />
        <Footer />
      </div>
    </main>
  );
}
```

<!-- Auth --> 

# auth/AuthModal.tsx
```
"use client"

import { useEffect } from "react"
import { useAuthModal } from "./AuthModalProvider"
import { colors, radius, shadows, sizes, zIndex } from "@/config/design-system"

export default function AuthModal() {
  const { isOpen, view, closeModal, setView, loginSuccess } = useAuthModal()

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, closeModal])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: zIndex.modal }}
    >
      <button
        type="button"
        onClick={closeModal}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: colors.overlay.modal }}
        aria-label="Modalni yopish"
      />

      <div
        className="relative z-10 w-full p-5 text-white"
        style={{
          maxWidth: sizes.auth.modalMaxWidth,
          borderRadius: radius["3xl"],
          border: `1px solid ${colors.border.whiteSoft}`,
          backgroundColor: colors.surface.modal,
          boxShadow: shadows.modal,
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {view === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}
          </h2>

          <button
            type="button"
            onClick={closeModal}
            className="px-3 py-1 text-sm transition"
            style={{
              borderRadius: radius.full,
              border: `1px solid ${colors.border.whiteSoft}`,
              color: colors.text.whiteSoft,
            }}
          >
            Yopish
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setView("login")}
            className="px-4 py-3 text-sm font-medium transition"
            style={{
              borderRadius: radius.full,
              backgroundColor:
                view === "login" ? colors.surface.white : "rgba(255,255,255,0.05)",
              color: view === "login" ? "#111111" : colors.text.whiteSoft,
            }}
          >
            Kirish
          </button>

          <button
            type="button"
            onClick={() => setView("register")}
            className="px-4 py-3 text-sm font-medium transition"
            style={{
              borderRadius: radius.full,
              backgroundColor:
                view === "register"
                  ? colors.brand.primary
                  : "rgba(255,255,255,0.05)",
              color: colors.text.white,
            }}
          >
            Ro‘yxatdan o‘tish
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 outline-none placeholder:text-white/30"
            style={{
              borderRadius: radius.xl,
              border: `1px solid ${colors.border.whiteSoft}`,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />

          <input
            type="password"
            placeholder="Parol"
            className="w-full px-4 py-3 outline-none placeholder:text-white/30"
            style={{
              borderRadius: radius.xl,
              border: `1px solid ${colors.border.whiteSoft}`,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />

          <button
            type="button"
            onClick={loginSuccess}
            className="w-full px-4 py-3 font-medium text-black transition hover:scale-[1.01]"
            style={{
              borderRadius: radius.xl,
              backgroundColor: colors.surface.white,
            }}
          >
            {view === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}
          </button>
        </div>
      </div>
    </div>
  )
}
```

# auth/AuthModalProvider.tsx
```
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import AuthModal from "./AuthModal";

type AuthView = "login" | "register";

type AuthModalContextType = {
  isOpen: boolean;
  view: AuthView;
  isAuthenticated: boolean;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
  loginSuccess: () => void;
  logout: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const openLogin = useCallback(() => {
    setView("login");
    setIsOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setView("register");
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const loginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    setIsOpen(false);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      view,
      isAuthenticated,
      openLogin,
      openRegister,
      closeModal,
      setView,
      loginSuccess,
      logout,
    }),
    [isOpen, view, isAuthenticated, openLogin, openRegister, closeModal, loginSuccess, logout]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }

  return context;
}
```

# auth/AuthTriggerButton.tsx 
```
"use client";

import { CSSProperties } from "react";
import { useAuthModal } from "./AuthModalProvider";

type Props = {
  mode?: "login" | "register";
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function AuthTriggerButton({
  mode = "login",
  children,
  className = "",
  style,
}: Props) {
  const { openLogin, openRegister } = useAuthModal();

  const handleClick = () => {
    if (mode === "register") {
      openRegister();
      return;
    }

    openLogin();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
```

# config/design-system/breakpoints.ts

```
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

export type Breakpoints = typeof breakpoints
```

# config/design-system/colors.ts

```
export const colors = {
  brand: {
    primary: "#d13ea2",
    primaryStrong: "#d1296f",
    secondary: "#8b2749",
    soft: "#f3bfdc",
  },

  background: {
    page: "#ffffff",
    soft: "#f5f4f2",
    about: "#f2f2f2",
    achievements: "#f6f1ea",
    dark: "#111111",
    lightPanel: "#f5f1eb",
  },

  text: {
    primary: "#3f2d25",
    secondary: "#6f5b51",
    muted: "#9c8576",
    white: "#ffffff",
    whiteSoft: "rgba(255,255,255,0.7)",
  },

  border: {
    soft: "rgba(0,0,0,0.12)",
    whiteSoft: "rgba(255,255,255,0.10)",
    brand: "#d13ea2",
  },

  overlay: {
    hero: "rgba(209,62,162,0.60)",
    navbar: "rgba(0,0,0,0.30)",
    modal: "rgba(0,0,0,0.60)",
  },

  surface: {
    white: "#ffffff",
    glass: "rgba(255,255,255,0.75)",
    modal: "#111111",
  },
} as const

export type Colors = typeof colors
```

# config/design-system/index.ts

```
export { colors } from "./colors"
export { sizes } from "./sizes"
export { typography } from "./typography"
export { spacing } from "./spacing"
export { radius } from "./radius"
export { shadows } from "./shadows"
export { breakpoints } from "./breakpoints"
export { motion } from "./motion"
export { zIndex } from "./z-index"
```

# config/design-system/motion.ts

```
export const motion = {
  duration: {
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
    slower: 1,
    cinematic: 1.2,
  },

  ease: {
    default: "power2.out",
    smooth: "power3.out",
    inOut: "power2.inOut",
    dramatic: "power4.out",
    none: "none",
  },

  scale: {
    hover: 1.03,
    cardStart: 0.965,
    mediaStart: 0.985,
    backgroundZoom: 1.15,
  },

  hero: {
    titleX: "70vw",
    scrollDistance: 700,
    titleGapMobile: "24px",
    titleGapDesktop: "40px",
    mouseOffsetMobile: "56px",
    mouseOffsetDesktop: "84px",
  },
} as const

export type Motion = typeof motion
```

# config/design-system/radius.ts

```
export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "40px",
  full: "9999px",
} as const

export type Radius = typeof radius
```

# config/design-system/shadow.ts

```
export const shadows = {
  soft: "0 10px 30px rgba(0,0,0,0.06)",
  card: "0 20px 60px rgba(0,0,0,0.08)",
  floating: "0 28px 80px rgba(0,0,0,0.06)",
  modal: "0 30px 80px rgba(0,0,0,0.35)",
  achievement: "0 20px 80px rgba(63,45,37,0.12)",
  glass: "0 10px 40px rgba(63,45,37,0.08)",
} as const

export type Shadows = typeof shadows
```

# config/design-system/sizes.ts

```
export const sizes = {
  hero: {
    titleMobile: "140px",
    titleDesktop: "280px",
    containerMax: "1536px",
    sectionHeight: "100vh",
  },

  about: {
    titleDesktop: "120px",
    imageWidth: "520px",
    imageHeight: "650px",
    textWidth: "500px",
  },

  product: {
    sceneExtraSlides: 1.45,
    cardMaxWidth: "72rem",
    cardHeight: "70vh",
    cardMinHeight: "560px",
    introTitleDesktop: "8rem",
    mediaMax: "84%",
    infoMaxWidth: "36rem",
    mediaPanelPaddingX: "3rem",
    mediaPanelPaddingY: "2rem",
    contentPanelPaddingX: "3.5rem",
    contentPanelPaddingY: "2rem",
    actionMinHeight: "56px",
  },

  achievements: {
    desktopImageHeight: "66vh",
  },

  auth: {
    modalMaxWidth: "28rem",
  },
} as const

export type Sizes = typeof sizes
```

# config/design-system/spacing.ts

```
export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
} as const

export type Spacing = typeof spacing
```

# config/design-system/typography.ts

```
export const typography = {
  fontFamily: {
    sans: "Inter, ui-sans-serif, system-ui, sans-serif",
  },

  fontSize: {
    heroSm: "88px",
    heroMd: "132px",
    heroLg: "220px",
    heroXl: "280px",

    displayLg: "120px",
    displayMd: "80px",

    h1: "64px",
    h2: "48px",
    h3: "32px",
    h4: "24px",

    bodyLg: "20px",
    body: "16px",
    bodySm: "14px",
    caption: "12px",
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    none: 1,
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.8,
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.03em",
    normal: "0",
    wide: "0.18em",
    wider: "0.28em",
    widest: "0.45em",
  },
} as const

export type Typography = typeof typography
```

# config/design-system/z-index.ts

```
export const zIndex = {
  base: 1,
  content: 10,
  overlay: 20,
  navbar: 50,
  intro: 60,
  finalIntro: 80,
  modal: 9999,
} as const

export type ZIndex = typeof zIndex
``` 

# src/app/page.tsx 

```
import About from "./companent/about";
import ProductsSection from "./companent/product";
import AchievementsSection from "./companent/AchievementsSection";
import HomeSection from "./companent/home";
import Footer from "./companent/home/Footer/footer";
export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white">
      <div>
        <HomeSection />
        <About />
        <ProductsSection />
        <div className="h-[20vh] bg-white" />
        <AchievementsSection />
        <Footer />
      </div>
    </main>
  );
}

```

# src/app/layout.tsx

```
import "./globals.css";
import { AuthModalProvider } from "./companent/auth/AuthModalProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>
        <AuthModalProvider>{children}</AuthModalProvider>
      </body>
    </html>
  );
}
```

# src/app/globals.css

```
@import "tailwindcss";

@import "tailwindcss";

:root {
  --color-brand-primary: #d13ea2;
  --color-brand-primary-hover: #bc2f8f;
  --color-brand-secondary: #8b2749;
  --color-brand-accent: #d5b16d;

  --color-bg-page: #ffffff;
  --color-bg-dark: #111111;
  --color-bg-soft: #f5f4f2;
  --color-bg-cream: #f6f1ea;
  --color-bg-section: #f2f2f2;

  --color-surface-base: #ffffff;
  --color-surface-elevated: #fffaf8;
  --color-surface-muted: #faf5ef;

  --color-text-primary: #111111;
  --color-text-secondary: #3f2d25;
  --color-text-muted: #6f5b51;
  --color-text-soft: #7e7169;
  --color-text-white: #ffffff;

  --color-border-light: rgba(255, 255, 255, 0.12);
  --color-border-soft: rgba(0, 0, 0, 0.1);
  --color-overlay-dark: rgba(0, 0, 0, 0.6);
  --color-overlay-hero: rgba(209, 62, 162, 0.6);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-3xl: 40px;
  --radius-full: 9999px;

  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.06);
  --shadow-card: 0 20px 60px rgba(0, 0, 0, 0.08);
  --shadow-floating: 0 28px 80px rgba(0, 0, 0, 0.06);
  --shadow-modal: 0 30px 80px rgba(0, 0, 0, 0.35);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
```

