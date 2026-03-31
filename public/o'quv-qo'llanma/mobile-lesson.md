# To'liq yangilangan Arxitektura (Papka va Filelar joylashuvi) 
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

"Bu mobile lesson.md ichida faqat mobile versia code structuralar yoziladi"

# home/mobile/index.tsx

```
"use client";

import MobileHero from "./mobile-hero";

type MobileHomeSectionProps = {
  startupReady?: boolean;
};

export default function MobileHomeSection({
  startupReady = false,
}: MobileHomeSectionProps) {
  return <MobileHero startupReady={startupReady} />;
}
```

# home/mobile/mobile-bottom-nav.tsx

```
"use client";

import { mobileHero } from "@/config/mobile-system/mobile-hero";
import { mobileNavbar } from "@/config/mobile-system/mobile-navbar";
import { mobileSpacing } from "@/config/mobile-system/mobile-spacing";
import { mobileTypography } from "@/config/mobile-system/mobile-typography";

const navItems = [
  { label: "Bosh sahifa", href: "#home-mobile" },
  { label: "About", href: "#about" },
  { label: "Mahsulot", href: "#products" },
  { label: "Yutuqlar", href: "#achievements" },
];

type MobileBottomNavProps = {
  bottomNavRef?: React.RefObject<HTMLDivElement | null>;
};

export default function MobileBottomNav({ bottomNavRef }: MobileBottomNavProps) {
  return (
    <div
      ref={bottomNavRef}
      className="fixed left-1/2 z-40 w-full -translate-x-1/2"
      style={{
        maxWidth: "480px",
        bottom: mobileSpacing.bottomNavY,
        paddingInline: mobileSpacing.bottomNavX,
      }}
    >
      <nav
        className="grid grid-cols-4 items-center"
        style={{
          minHeight: mobileNavbar.bottomHeight,
          borderRadius: mobileNavbar.bottomRadius,
          backgroundColor: mobileHero.bottomNavBackground,
          backdropFilter: `blur(${mobileNavbar.bottomBlur})`,
          boxShadow: mobileHero.navShadow,
          paddingInline: mobileSpacing.bottomNavInnerX,
        }}
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex h-full items-center justify-center text-center"
            style={{
              color: mobileHero.bottomNavTextColor,
              fontSize: mobileTypography.nav.label,
              fontWeight: mobileTypography.nav.weight,
              lineHeight: mobileTypography.nav.lineHeight,
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
```

# home/mobile/mobile-footer.tsx

```
"use client";

import AuthTriggerButton from "../../shared/auth/AuthTriggerButton";

export default function MobileFooter() {
  return (
    <section
      className="relative flex min-h-[100svh] w-full items-end justify-center bg-[#f5f1f3] px-5"
      style={{
        paddingBottom: "120px",
        paddingTop: "100px",
      }}
    >
      {/* glow background */}
      <div className="pointer-events-none absolute top-[-120px] h-[300px] w-[300px] rounded-full bg-[#cf2f8f]/20 blur-[120px]" />

      <div className="relative w-full max-w-[380px]">
        {/* main card */}
        <div className="rounded-[36px] border border-[#efbfd8] bg-white px-7 py-12 text-center shadow-[0_30px_80px_rgba(207,47,143,0.15)]">
          {/* brand */}
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9b6c7c]">
            Azizam Market
          </p>

          {/* main headline */}
          <h2 className="mt-4 text-[40px] font-bold leading-[1.05] tracking-[-0.04em] text-[#cf2f8f]">
            Go‘zallik sizdan boshlanadi
          </h2>

          {/* description */}
          <p className="mx-auto mt-5 max-w-[280px] text-[15px] leading-[1.6] text-[#6f4d57]">
            Har bir mahsulot ortida mehr, e’tibor va nafislik mujassam.
            Siz bunga loyiqsiz.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <AuthTriggerButton
              mode="login"
              className="w-full max-w-[240px] rounded-full bg-[#cf2f8f] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(207,47,143,0.35)] active:scale-[0.97]"
            >
              Boshlash
            </AuthTriggerButton>

            <a
              href="#home-mobile"
              className="w-full max-w-[240px] rounded-full border border-[#cf2f8f] px-6 py-3 text-sm font-semibold text-[#cf2f8f] transition active:scale-[0.97]"
            >
              Yuqoriga qaytish
            </a>
          </div>

          {/* divider */}
          <div className="my-8 h-px w-full bg-[#f1d6e4]" />

          {/* nav links */}
          <div className="flex items-center justify-center gap-5 text-[13px] font-medium text-[#8c6772]">
            <a href="#about">About</a>
            <a href="#products">Mahsulot</a>
            <a href="#achievements">Yutuqlar</a>
          </div>

          {/* bottom note */}
          <p className="mt-6 text-[12px] text-[#b08a97]">
            © {new Date().getFullYear()} Azizam Market
          </p>
        </div>
      </div>
    </section>
  );
}
```

# home/mobile/mobile-hero.tsx

```
"use client";

import { useRef } from "react";
import { mobileHero } from "@/config/mobile-system/mobile-hero";
import { mobileLayout } from "@/config/mobile-system/mobile-layout";
import { mobileSpacing } from "@/config/mobile-system/mobile-spacing";
import { mobileTypography } from "@/config/mobile-system/mobile-typography";
import MobileBottomNav from "./mobile-bottom-nav";
import MobileTopbar from "./mobile-topbar";
import useMobileHeroMotion from "../../shared/hooks/use-mobile-hero-motion";

export default function MobileHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const bgRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const topbarRef = useRef<HTMLDivElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const azizamRef = useRef<HTMLHeadingElement | null>(null);
  const marketRef = useRef<HTMLHeadingElement | null>(null);
  const bottomNavRef = useRef<HTMLDivElement | null>(null);

 useMobileHeroMotion({
  sectionRef,
  stageRef,
  bgRef,
  overlayRef,
  titleWrapRef,
  azizamRef,
  marketRef,
});

  return (
    <section
      id="home-mobile"
      ref={sectionRef}
      className="relative w-full"
      style={{
        minHeight: `calc(${mobileLayout.heroMinHeight} + ${mobileLayout.heroScrollRunway})`,
        backgroundColor: "#000",
      }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 overflow-hidden"
        style={{
          height: mobileLayout.heroViewportHeight,
          minHeight: mobileLayout.heroMinHeight,
          backgroundColor: "#000",
        }}
      >
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${mobileHero.backgroundImage}')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            transformOrigin: "center center",
            willChange: "transform",
          }}
        />

        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            backgroundColor: mobileHero.overlayColor,
            opacity: 1,
          }}
        />

        <MobileTopbar topbarRef={topbarRef} />

        <div
          className="relative z-20 mx-auto h-full w-full"
          style={{
            maxWidth: mobileLayout.heroContentMaxWidth,
            paddingInline: mobileSpacing.pageX,
            paddingBottom: mobileSpacing.heroBottomSafeSpace,
          }}
        >
          <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
            <div
              ref={titleWrapRef}
              className="mx-auto w-full"
              style={{
                width: mobileLayout.heroTitleMaxWidth,
                maxWidth: mobileLayout.heroTitleMaxWidth,
                transform: `translateY(${mobileSpacing.heroTitleOffsetY})`,
                willChange: "transform, opacity",
              }}
            >
              <h1
                ref={azizamRef}
                className="text-left"
                style={{
                  color: mobileHero.titleColor,
                  fontSize: mobileTypography.hero.title,
                  lineHeight: mobileTypography.hero.lineHeight,
                  letterSpacing: mobileTypography.hero.letterSpacing,
                  fontWeight: mobileTypography.hero.weight,
                  whiteSpace: "nowrap",
                  margin: 0,
                }}
              >
                Azizam
              </h1>

              <h1
                ref={marketRef}
                className="text-right"
                style={{
                  color: mobileHero.titleColor,
                  fontSize: mobileTypography.hero.title,
                  lineHeight: mobileTypography.hero.lineHeight,
                  letterSpacing: mobileTypography.hero.letterSpacing,
                  fontWeight: mobileTypography.hero.weight,
                  whiteSpace: "nowrap",
                  margin: 0,
                  marginTop: "6px",
                }}
              >
                Market
              </h1>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
```

# home/mobile/mobile-topbar.tsx

```
"use client";

import type { ReactNode, RefObject } from "react";
import Image from "next/image";
import AuthTriggerButton from "../../shared/auth/AuthTriggerButton";
import useMobileCollapsedNav from "../../shared/hooks/use-mobile-collapsed-nav";
import { mobileNavbar } from "@/config/mobile-system/mobile-navbar";
import { mobileSpacing } from "@/config/mobile-system/mobile-spacing";
import { mobileHero } from "@/config/mobile-system/mobile-hero";

type MobileTopbarProps = {
  topbarRef?: RefObject<HTMLDivElement | null>;
};

function CircleShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: mobileNavbar.topIconSize,
        height: mobileNavbar.topIconSize,
        borderRadius: "9999px",
        backgroundColor: mobileHero.topIconOuterBackground,
        boxShadow: mobileHero.softShadow,
        flexShrink: 0,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: mobileNavbar.topIconInnerSize,
          height: mobileNavbar.topIconInnerSize,
          borderRadius: "9999px",
          backgroundColor: mobileHero.topIconInnerBackground,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function MobileTopbar({ topbarRef }: MobileTopbarProps) {
  const isCollapsed = useMobileCollapsedNav(110);

  return (
    <div
      ref={topbarRef}
      className="fixed z-40 flex flex-col transition-all duration-300"
      style={{
        top: mobileSpacing.topbarTop,
        left: mobileSpacing.topbarLeft,
        gap: mobileNavbar.topIconGap,
        opacity: isCollapsed ? 0 : 1,
        pointerEvents: isCollapsed ? "none" : "auto",
        transform: isCollapsed ? "translateY(-8px)" : "translateY(0)",
      }}
    >
      <CircleShell>
        <Image
          src="/logo.png"
          alt="Azizam Market"
          width={34}
          height={34}
          priority
        />
      </CircleShell>

      <AuthTriggerButton
        mode="login"
        className="block"
        style={{
          padding: 0,
          border: "none",
          background: "transparent",
        }}
      >
        <CircleShell>
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
              fill="#D74BAA"
            />
            <path
              d="M4 20C4.92575 16.5539 8.07838 14 12 14C15.9216 14 19.0742 16.5539 20 20"
              fill="#D74BAA"
            />
          </svg>
        </CircleShell>
      </AuthTriggerButton>
    </div>
  );
}
```

# about/mobile/index.tsx

```
import MobileAboutStory from "./mobile-about-story";

export default function MobileAboutSection() {
  return <MobileAboutStory />;
}
```

# about/mobile/mobile-about-story.tsx

```
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mobileSections } from "@/config/mobile-system/mobile-sections";
import { mobileSpacing } from "@/config/mobile-system/mobile-spacing";
import { mobileMotion } from "@/config/mobile-system/mobile-motion";
import { colors } from "@/config/design-system";

gsap.registerPlugin(ScrollTrigger);

const aboutTexts = [
  "Azizam Market — bu shunchaki kosmetika do‘koni emas.",
  "Bu — mehr, e’tibor va qadrlash maskani.",
  "“Azizam” so‘zi biz uchun oddiy murojaat emas.",
  "Bu yaqinlikni, samimiyatni va muhabbatni anglatadi.",
  "Biz har bir inson o‘zini aziz his qilishi uchun ishlaymiz.",
];

export default function MobileAboutStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const infoTitleRef = useRef<HTMLHeadingElement | null>(null);
  const textsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const title = titleRef.current;
    const imageWrap = imageWrapRef.current;
    const infoTitle = infoTitleRef.current;

    if (!section || !sticky || !title || !imageWrap || !infoTitle) return;

    const ctx = gsap.context(() => {
      gsap.set(title, {
        autoAlpha: 0,
        y: mobileMotion.about.titleY,
        scale: 1.02,
      });

      gsap.set(imageWrap, {
        autoAlpha: 0,
        y: mobileMotion.about.imageY,
        scale: mobileMotion.about.imageScaleFrom,
        clipPath: "inset(100% 0% 0% 0%)",
      });

      gsap.set(infoTitle, {
        autoAlpha: 0,
        y: mobileMotion.about.textY,
      });

      gsap.set(textsRef.current, {
        autoAlpha: 0,
        y: mobileMotion.about.textY,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1600",
          scrub: mobileMotion.about.scrub,
          pin: sticky,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(title, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
      });

      tl.to(title, {
        autoAlpha: 0,
        y: -20,
        duration: 0.35,
        ease: "power2.out",
      });

      tl.to(
        imageWrap,
        {
          autoAlpha: 1,
          y: 0,
          scale: mobileMotion.about.imageScaleTo,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.55,
          ease: "power2.out",
        },
        ">-0.05",
      );

      tl.to(imageWrap, {
        y: mobileSections.about.imageShiftY,
        duration: 0.55,
        ease: "power2.inOut",
      });

      tl.to(
        infoTitle,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        "<+0.05",
      );

      textsRef.current.forEach((textEl) => {
        if (!textEl) return;

        tl.to(textEl, {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        tl.to(textEl, {
          autoAlpha: 0,
          y: -14,
          duration: 0.24,
          ease: "power1.out",
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: mobileSections.about.minHeight,
        backgroundColor: colors.background.about,
      }}
    >
      <div
        ref={stickyRef}
        className="relative h-[100svh] w-full overflow-hidden"
      >
        <div
          className="relative mx-auto h-full w-full"
          style={{
            maxWidth: "420px",
            paddingInline: mobileSpacing.pageX,
          }}
        >
          <h2
            ref={titleRef}
            className="absolute top-1/2 z-20 w-full text-center font-bold"
            style={{
              left: 0,
              transform: `translateY(calc(-50% - ${mobileSections.about.titleTopOffset}))`,
              color: colors.brand.primaryStrong,
              fontSize: "clamp(32px, 8vw, 48px)",
              lineHeight: 0.96,
              letterSpacing: "-0.04em",
            }}
          >
            Biz Haqimizda
          </h2>

          <div
            className="absolute left-1/2 top-1/2 z-10 w-full"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="mx-auto flex w-full flex-col items-center"
              style={{
                maxWidth: "420px",
              }}
            >
              <div
                ref={imageWrapRef}
                className="overflow-hidden bg-white"
                style={{
                  width: "100%",
                  maxWidth: mobileSections.about.frameMaxWidth,
                  borderRadius: mobileSections.about.imageRadius,
                  border: `${mobileSections.about.imageBorderWidth} solid ${colors.brand.primary}`,
                }}
              >
                <Image
                  src="/grid-img.png"
                  alt="Azizam Market"
                  width={420}
                  height={620}
                  className="block w-full object-cover"
                  sizes="(max-width: 480px) 84vw, 350px"
                  style={{
                    height: mobileSections.about.imageHeight,
                  }}
                />
              </div>

              <div
                className="w-full text-center"
                style={{
                  maxWidth: mobileSections.about.contentMaxWidth,
                  marginTop: mobileSections.about.infoGap,
                }}
              >
                <h3
                  ref={infoTitleRef}
                  className="font-semibold"
                  style={{
                    color: colors.brand.primaryStrong,
                    fontSize: "clamp(26px, 6.8vw, 34px)",
                    lineHeight: 1.03,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Azizam Market
                </h3>

                <div className="relative mt-4 min-h-[84px]">
                  {aboutTexts.map((text, index) => (
                    <p
                      key={index}
                      ref={(el) => {
                        textsRef.current[index] = el;
                      }}
                      className="absolute left-0 top-0 w-full text-[15px] leading-7"
                      style={{
                        color: colors.brand.secondary,
                      }}
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```



# product/mobile/index.tsx

```
"use client";

import { useEffect, useState } from "react";
import { mobileSections } from "@/config/mobile-system/mobile-sections";
import { productsData } from "../shared/products-data";
import MobileProductShell from "./mobile-product-shell";
import useMobileProductsScroll from "../../shared/hooks/useMobileProductsScroll";

const mobileProducts = productsData.map((product) => ({
  id: Number(product.id),
  title: product.name,
  eyebrow: product.subtitle ?? "",
  promo: product.badge,
  description: product.description,
  image: product.media.src,
  imageAlt: product.media.alt ?? product.name,
  theme: product.theme,
  price: product.price ?? "Narx mavjud emas",
}));

export default function MobileProductSection() {
  const [titleIntroReady, setTitleIntroReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setTitleIntroReady(true);
    }, 80);

    return () => window.clearTimeout(id);
  }, []);

  const scrollState = useMobileProductsScroll({
    sectionId: "products",
    totalItems: mobileProducts.length,
  });

  const titleIntroProgress = Math.min(scrollState.sectionProgress / 0.12, 1);

  const titleOpacity = titleIntroProgress * (1 - scrollState.titleFadeProgress);

  const titleTranslateY =
    (1 - titleIntroProgress) * 42 + scrollState.titleFadeProgress * -26;

  const titleScale =
    0.92 + titleIntroProgress * 0.08 - scrollState.titleFadeProgress * 0.04;

  return (
    <section
      id="products"
      className="relative w-full overflow-clip bg-[#f5f1f3]"
      style={{
        minHeight: mobileSections.product.minHeight,
      }}
    >
      <div
        className="sticky top-0 flex w-full items-center justify-center overflow-hidden px-3"
        style={{
          height: mobileSections.product.stickyHeight,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-6 text-center"
          style={{
            opacity: titleOpacity,
            transition: "opacity 120ms linear, transform 120ms linear",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: mobileSections.product.frameMaxWidth,
              transform: `translateY(${titleTranslateY}px) scale(${titleScale})`,
              transformOrigin: "center center",
            }}
          >
            <h2 className="text-[clamp(34px,10vw,50px)] font-bold leading-none tracking-[-0.05em] text-[#cf2f8f]">
              Maxsulotlar
            </h2>
          </div>
        </div>

        <MobileProductShell
          products={mobileProducts}
          floatingIndex={scrollState.floatingIndex}
          activeIndex={scrollState.activeIndex}
          cardsProgress={scrollState.cardsProgress}
          cardsRevealProgress={scrollState.cardsRevealProgress}
        />
      </div>
    </section>
  );
}

```

# product/mobile/mobile-product-actions.tsx

```
"use client";

import { useEffect, useState } from "react";

type MobileProductActionsProps = {
  price?: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  backgroundColor: string;
  dark?: boolean;
};

export default function MobileProductActions({
  price,
  accentColor,
  textColor,
  mutedColor,
  borderColor,
  backgroundColor,
  dark = false,
}: MobileProductActionsProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setReady(true);
    }, 40);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className="mt-5 rounded-[24px] border shadow-[0_10px_26px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out"
      style={{
        paddingInline: "16px",
        paddingBlock: "16px",
        background: backgroundColor,
        borderColor,
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0px)" : "translateY(10px)",
      }}
    >
      <div
        className="flex items-start justify-between gap-4 transition-all duration-500 ease-out"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0px)" : "translateY(8px)",
        }}
      >
        <div>
          <p
            className="text-[13px] font-medium"
            style={{ color: mutedColor }}
          >
            Narx
          </p>

          <p
            className="mt-1 text-[clamp(24px,6vw,30px)] font-bold leading-none"
            style={{ color: textColor }}
          >
            {price ?? "Narx mavjud emas"}
          </p>
        </div>

        <button
          type="button"
          className="rounded-full px-5 py-3 text-[15px] font-semibold transition-all duration-500 ease-out"
          style={{
            background: accentColor,
            color: dark ? "#111" : "#fff",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0px)" : "translateY(12px)",
            transitionDelay: "80ms",
          }}
        >
          Sotib olish
        </button>
      </div>

      <button
        type="button"
        className="mt-3 w-full rounded-full border px-5 py-3 text-[15px] font-semibold transition-all duration-500 ease-out hover:opacity-90"
        style={{
          borderColor,
          color: textColor,
          background: "transparent",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0px)" : "translateY(14px)",
          transitionDelay: "140ms",
        }}
      >
        Savatga qo'shish
      </button>
    </div>
  );
}
```

# product/mobile/mobile-product-card.tsx

```
import { mobileMotion } from "@/config/mobile-system/mobile-motion";
import { mobileSections } from "@/config/mobile-system/mobile-sections";
import MobileProductGuestCallout from "./mobile-product-guest-callout";
import MobileProductInfo from "./mobile-product-info";
import MobileProductMedia from "./mobile-product-media";
import MobileProductActions from "./mobile-product-actions";
import { useEffect, useState } from "react";
import { useAuthModal } from "../../shared/auth/AuthModalProvider";

type ProductTheme = {
  bg: string;
  text: string;
  accent: string;
  muted?: string;
  card?: string;
  tone?: "light" | "dark";
};

export type MobileProductItem = {
  id: number;
  title: string;
  eyebrow: string;
  promo?: string;
  description: string;
  image: string;
  imageAlt?: string;
  theme: ProductTheme;
  price?: string;
};

type MobileProductCardProps = {
  product: MobileProductItem;
  index: number;
  floatingIndex: number;
  activeIndex: number;
  cardsProgress: number;
  cardsRevealProgress: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function MobileProductCard({
  product,
  index,
  floatingIndex,
  activeIndex,
  cardsProgress,
  cardsRevealProgress,
}: MobileProductCardProps) {
  const { isAuthenticated } = useAuthModal();
  const [actionsVisible, setActionsVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const id = window.setTimeout(() => {
        setActionsVisible(true);
      }, 60);

      return () => window.clearTimeout(id);
    }

    setActionsVisible(false);
  }, [isAuthenticated]);

  const distance = index - floatingIndex;
  const limitedDistance = clamp(distance, -1.2, 2.4);

  const isFront = Math.abs(distance) < 0.55 || index === activeIndex;
  const passedCard = distance < -0.55;

  const revealLift =
    (1 - cardsRevealProgress) * mobileMotion.product.introOffsetY;
  const revealScale =
    mobileMotion.product.introScaleFrom +
    (1 - mobileMotion.product.introScaleFrom) * cardsRevealProgress;

  const translateY = passedCard
    ? -mobileMotion.product.exitLift * clamp(Math.abs(distance), 0, 1)
    : limitedDistance * mobileMotion.product.stackOffsetY +
      Math.max(limitedDistance, 0) * 16 +
      revealLift;

  const scale = passedCard
    ? 0.91
    : (1 - Math.max(limitedDistance, 0) * mobileMotion.product.stackScaleStep) *
      revealScale;

  const opacityBase = passedCard
    ? Math.max(0, 1 - Math.abs(distance) * 1.8)
    : clamp(
        1 - Math.max(limitedDistance, 0) * 0.22,
        mobileMotion.product.inactiveOpacity,
        1,
      );

  const opacity = opacityBase * cardsRevealProgress;
  const blur = passedCard ? 5 : Math.max(0, limitedDistance) * 1.15;
  const zIndex = 100 - Math.round(Math.max(limitedDistance, 0) * 10);

  const isDark = product.theme.tone === "dark";
  const bottomSafeOffset = 60; // nav height

  const outerColor = isDark ? "#1f1f1f" : "#7b001d";
  const topColor = isDark ? "#2b2b2b" : "#b61d52";
  const bottomColor = product.theme.card ?? (isDark ? "#191919" : "#f3dbe5");
  const borderColor = product.theme.accent;
  const textColor = product.theme.text;
  const subtextColor = product.theme.muted ?? product.theme.text;

  return (
    <article
      className="absolute left-1/2 top-1/2 w-full overflow-hidden transition-transform duration-200 ease-out"
      style={{
        width: mobileSections.product.cardMaxWidth,
        minHeight: mobileSections.product.cardMinHeight,
        borderRadius: mobileSections.product.cardRadius,
        transform: `translate(-50%, calc(-50% + ${translateY - bottomSafeOffset}px)) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        zIndex,
        pointerEvents: isFront ? "auto" : "none",
        background: outerColor,
        border: `1px solid ${borderColor}`,
        boxShadow: isFront
          ? "0 22px 54px rgba(71, 10, 30, 0.22)"
          : "0 12px 28px rgba(71, 10, 30, 0.12)",
      }}
    >
      <div className="p-[clamp(14px,4vw,18px)]">
        <div
          className="overflow-hidden"
          style={{
            borderRadius: mobileSections.product.cardRadius,
            background: bottomColor,
          }}
        >
          <div
            className="px-[clamp(14px,4vw,18px)] pt-[clamp(14px,4vw,18px)]"
            style={{ background: topColor }}
          >
            <MobileProductMedia
              image={product.image}
              title={product.imageAlt ?? product.title}
            />
          </div>

          <div
            className="px-[clamp(18px,4.8vw,22px)] pb-[clamp(18px,4.8vw,22px)] pt-[clamp(18px,4.8vw,24px)]"
            style={{
              marginTop: "-2px",
              background: bottomColor,
            }}
          >
            <MobileProductInfo
              title={product.title}
              eyebrow={product.eyebrow}
              promo={product.promo}
              description={product.description}
              textColor={textColor}
              subtextColor={subtextColor}
              accentColor={product.theme.accent}
            />

            {isAuthenticated ? (
              <div
                className="transition-all duration-500 ease-out"
                style={{
                  opacity: actionsVisible ? 1 : 0,
                  transform: actionsVisible
                    ? "translateY(0px) scale(1)"
                    : "translateY(16px) scale(0.98)",
                  filter: actionsVisible ? "blur(0px)" : "blur(4px)",
                }}
              >
                <MobileProductActions
                  price={product.price}
                  accentColor={product.theme.accent}
                  textColor={textColor}
                  mutedColor={subtextColor}
                  borderColor={borderColor}
                  backgroundColor={isDark ? "#222222" : "#f8edf2"}
                  dark={isDark}
                />
              </div>
            ) : (
              <div
                className="transition-all duration-300 ease-out"
                style={{
                  opacity: isAuthenticated ? 0 : 1,
                  transform: isAuthenticated
                    ? "translateY(-10px)"
                    : "translateY(0px)",
                }}
              >
                <MobileProductGuestCallout
                  compact={!isFront && cardsProgress < 0.98}
                  accentColor={product.theme.accent}
                  textColor={textColor}
                  borderColor={borderColor}
                  backgroundColor={isDark ? "#222222" : "#f8edf2"}
                  mutedColor={subtextColor}
                  dark={isDark}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
```

# product/mobile/mobile-product-guest-callout.tsx

```
"use client";

import AuthTriggerButton from "../../shared/auth/AuthTriggerButton";

type MobileProductGuestCalloutProps = {
  compact?: boolean;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  backgroundColor: string;
  dark?: boolean;
};

export default function MobileProductGuestCallout({
  compact = false,
  accentColor,
  textColor,
  mutedColor,
  borderColor,
  backgroundColor,
  dark = false,
}: MobileProductGuestCalloutProps) {
  return (
    <div
      className="mt-5 rounded-[24px] border shadow-[0_10px_26px_rgba(0,0,0,0.08)]"
      style={{
        paddingInline: compact ? "14px" : "16px",
        paddingBlock: compact ? "14px" : "16px",
        background: backgroundColor,
        borderColor,
      }}
    >
      <p
        className="text-[clamp(14px,3.8vw,16px)] font-semibold leading-[1.35]"
        style={{ color: textColor }}
      >
        To‘liq imkoniyatlar uchun tizimga kiring
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(13px,3.7vw,15px)]">
        <AuthTriggerButton
          mode="register"
          className="font-semibold underline underline-offset-4"
          style={{ color: accentColor }}
        >
          Ro‘yxatdan o‘ting
        </AuthTriggerButton>

        <span style={{ color: mutedColor }}>yoki</span>

        <AuthTriggerButton
          mode="login"
          className="rounded-full px-4 py-2 font-semibold"
          style={{
            background: accentColor,
            color: dark ? "#111" : "#fff",
          }}
        >
          Kirish
        </AuthTriggerButton>
      </div>
    </div>
  );
}
```

# product/mobile/mobile-product-info.tsx

```
type MobileProductInfoProps = {
  title: string;
  eyebrow: string;
  promo?: string;
  description: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
};

export default function MobileProductInfo({
  title,
  eyebrow,
  promo,
  description,
  textColor,
  subtextColor,
  accentColor,
}: MobileProductInfoProps) {
  return (
    <div className="space-y-3 text-left">
      <h3
        className="text-[clamp(28px,8vw,40px)] font-semibold leading-[0.96] tracking-[-0.045em]"
        style={{ color: textColor }}
      >
        {title}
      </h3>

      {eyebrow ? (
        <p
          className="text-[clamp(14px,4vw,18px)] font-medium leading-[1.25]"
          style={{ color: subtextColor }}
        >
          {eyebrow}
        </p>
      ) : null}

      {promo ? (
        <p
          className="text-[clamp(12px,3.6vw,14px)] font-semibold tracking-[0.01em]"
          style={{ color: accentColor }}
        >
          {promo}
        </p>
      ) : null}

      <p
        className="max-w-[30ch] text-[clamp(15px,4.2vw,18px)] leading-[1.45]"
        style={{ color: textColor }}
      >
        {description}
      </p>
    </div>
  );
}
```

# product/mobile/mobile-product-media.tsx

```
import Image from "next/image";

type MobileProductMediaProps = {
  image: string;
  title: string;
};

export default function MobileProductMedia({
  image,
  title,
}: MobileProductMediaProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[24px] bg-[#f8f1f4]">
      <Image
        src={image}
        alt={title}
        width={640}
        height={520}
        className="h-[clamp(236px,33svh,310px)] w-full object-cover object-center"
        priority={false}
      />
    </div>
  );
}
```

# product/mobile/mobile-product-shell.tsx

```
import { mobileSections } from "@/config/mobile-system/mobile-sections";
import MobileProductCard, { type MobileProductItem } from "./mobile-product-card";

type MobileProductShellProps = {
  products: MobileProductItem[];
  floatingIndex: number;
  activeIndex: number;
  cardsProgress: number;
  cardsRevealProgress: number;
};

export default function MobileProductShell({
  products,
  floatingIndex,
  activeIndex,
  cardsProgress,
  cardsRevealProgress,
}: MobileProductShellProps) {
  return (
    <div
      className="relative mx-auto w-full"
      style={{
        maxWidth: mobileSections.product.frameMaxWidth,
        height: "100svh",
      }}
    >
      {products.map((product, index) => (
        <MobileProductCard
          key={product.id}
          product={product}
          index={index}
          floatingIndex={floatingIndex}
          activeIndex={activeIndex}
          cardsProgress={cardsProgress}
          cardsRevealProgress={cardsRevealProgress}
        />
      ))}
    </div>
  );
}
```

# commponent/shared/hooks/useMobileProductsScroll.ts

```
"use client";

import { useEffect, useMemo, useState } from "react";
import { mobileMotion } from "@/config/mobile-system/mobile-motion";

type UseMobileProductsScrollOptions = {
  sectionId: string;
  totalItems: number;
};

type MobileProductsScrollState = {
  sectionProgress: number;
  titleHoldProgress: number;
  titleFadeProgress: number;
  cardsRevealProgress: number;
  cardsProgress: number;
  floatingIndex: number;
  activeIndex: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function rangeProgress(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp((value - start) / (end - start), 0, 1);
}

export default function useMobileProductsScroll({
  sectionId,
  totalItems,
}: UseMobileProductsScrollOptions): MobileProductsScrollState {
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = Math.max(rect.height - window.innerHeight, 1);
      const passed = clamp(-rect.top, 0, totalScrollable);
      setSectionProgress(passed / totalScrollable);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionId]);

  return useMemo(() => {
    const titleHoldProgress = rangeProgress(
      sectionProgress,
      mobileMotion.product.titleOnlyStart,
      mobileMotion.product.titleOnlyEnd,
    );

    const titleFadeProgress = rangeProgress(
      sectionProgress,
      mobileMotion.product.titleFadeStart,
      mobileMotion.product.titleFadeEnd,
    );

    const cardsRevealProgress = rangeProgress(
      sectionProgress,
      mobileMotion.product.cardsRevealStart,
      mobileMotion.product.cardsRevealEnd,
    );

    const cardsProgress = rangeProgress(
      sectionProgress,
      mobileMotion.product.cardsStart,
      mobileMotion.product.cardsEnd,
    );

    const maxIndex = Math.max(totalItems - 1, 0);
    const floatingIndex = cardsProgress * maxIndex;
    const activeIndex = clamp(Math.round(floatingIndex), 0, maxIndex);

    return {
      sectionProgress,
      titleHoldProgress,
      titleFadeProgress,
      cardsRevealProgress,
      cardsProgress,
      floatingIndex,
      activeIndex,
    };
  }, [sectionProgress, totalItems]);
}
```

# product/shared/product.types.ts

```
export type ProductColor = {
  name: string
  hex: string
  preview?: string
}

export type ProductAction = {
  label: string
  href?: string
  type?: "primary" | "secondary"
}

export type ProductMedia = {
  type: "image" | "video"
  src: string
  poster?: string
  alt?: string
  hasTransparentBg?: boolean
}

export type Product = {
  id: string
  slug: string
  name: string
  subtitle?: string
  description: string
  price?: string
  badge?: string

  theme: {
    bg: string
    text: string
    accent: string
    muted?: string
    card?: string
    tone?: "light" | "dark"
  }

  mediaPanel: {
    mode: "imageTone" | "forceBlack" | "forceWhite"
    color?: string
  }

  media: ProductMedia
  colors: ProductColor[]
  actions: ProductAction[]
}
```

# product/shared/products-data.ts

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

# AchievementsSection/mobile/index.tsx

```
"use client";

import { mobileSections } from "@/config/mobile-system/mobile-sections";
import MobileAchievementsShell from "./mobile-achievements-shell";
import useMobileAchievementsScroll from "./useMobileAchievementsScroll";

const mobileAchievements = [
  {
    id: 1,
    name: "Quvnoq Jamoa",
    role: "Jamoamiz",
    description:
      "Samimiy jamoa, iliq muhit va bir maqsad sari birlashgan ishonchli hamkorlik.",
    image: "/achievements/team-1.jpg",
    theme: {
      frame: "#f0069f",
      ribbon: "#f0069f",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.92)",
    },
  },
  {
    id: 2,
    name: "Go‘zallik Ruhi",
    role: "Nafosat",
    description:
      "Har bir tanlovda nozik did, yengillik va qadrlash hissi sezilib turadi.",
    image: "/achievements/team-2.jpg",
    theme: {
      frame: "#f0069f",
      ribbon: "#f0069f",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.92)",
    },
  },
  {
    id: 3,
    name: "Azizam Mehri",
    role: "Qadriyat",
    description:
      "Azizam Market inson o‘zini aziz his qiladigan tajribani yaratishga intiladi.",
    image: "/achievements/team-3.jpg",
    theme: {
      frame: "#f0069f",
      ribbon: "#f0069f",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.92)",
    },
  },
];

export default function MobileAchievementsSection() {
  const scroll = useMobileAchievementsScroll({
    sectionId: "achievements",
    totalItems: mobileAchievements.length,
  });

  const titleIntroProgress = Math.min(scroll.sectionProgress / 0.12, 1);
  const titleOpacity = titleIntroProgress * (1 - scroll.titleFadeProgress);
  const titleY = (1 - titleIntroProgress) * 40 + scroll.titleFadeProgress * -26;
  const titleScale =
    0.92 + titleIntroProgress * 0.08 - scroll.titleFadeProgress * 0.04;

  const showCard = scroll.sectionProgress >= 0.22;

  return (
    <section
      id="achievements"
      className="relative w-full overflow-clip bg-[#f5f1f3]"
      style={{ minHeight: "320svh" }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-6 text-center"
          style={{ opacity: titleOpacity }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: mobileSections.achievements.frameMaxWidth,
              transform: `translateY(${titleY}px) scale(${titleScale})`,
              transformOrigin: "center center",
            }}
          >
            <h2 className="text-[clamp(34px,10vw,50px)] font-bold leading-none tracking-[-0.05em] text-[#cf2f8f]">
              Kompanya Yutuqlari
            </h2>
          </div>
        </div>

        {showCard ? (
          <MobileAchievementsShell
            items={mobileAchievements}
            currentIndex={scroll.currentIndex}
            nextIndex={scroll.nextIndex}
            blend={scroll.blend}
            frameRevealProgress={scroll.frameRevealProgress}
            ribbonRevealProgress={scroll.ribbonRevealProgress}
          />
        ) : null}
      </div>
    </section>
  );
}

```

# AchievementsSection/mobile/mobile-achievement-card.tsx

```
"use client";

import Image from "next/image";

export type MobileAchievementItem = {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  theme: {
    frame: string;
    ribbon: string;
    text: string;
    muted: string;
  };
};

type MobileAchievementCardProps = {
  items: MobileAchievementItem[];
  currentIndex: number;
  nextIndex: number;
  blend: number;
  frameRevealProgress: number;
  ribbonRevealProgress: number;
};

export default function MobileAchievementCard({
  items,
  currentIndex,
  nextIndex,
  blend,
  frameRevealProgress,
  ribbonRevealProgress,
}: MobileAchievementCardProps) {
  const currentItem = items[currentIndex];
  const nextItem = items[nextIndex] ?? currentItem;

  const frameOpacity = frameRevealProgress;
  const frameScale = 0.9 + frameRevealProgress * 0.1;
  const frameY = (1 - frameRevealProgress) * 115;

  const imageLift = ribbonRevealProgress * -22;

  const currentImageOpacity = 1 - blend;
  const nextImageOpacity = nextIndex === currentIndex ? 0 : blend;

  const ribbonOpacity = ribbonRevealProgress;
  const ribbonTranslateY = (1 - ribbonRevealProgress) * -104;
  const ribbonScaleY = 0.86 + ribbonRevealProgress * 0.14;

  const currentTextOpacity = 1 - blend;
  const nextTextOpacity = nextIndex === currentIndex ? 0 : blend;

  const frameColor = currentItem.theme.frame;
  const ribbonColor = currentItem.theme.ribbon;

  const frameShape =
    "polygon(2% 4%, 8% 1%, 18% 3%, 27% 0%, 40% 2%, 54% 1%, 67% 4%, 81% 2%, 92% 1%, 98% 5%, 99% 16%, 98% 28%, 99% 44%, 98% 59%, 99% 74%, 98% 88%, 96% 97%, 86% 96%, 72% 98%, 58% 97%, 43% 99%, 29% 97%, 16% 98%, 6% 96%, 2% 89%, 1% 74%, 2% 59%, 1% 44%, 2% 29%, 1% 15%)";

  return (
    <article
      className="absolute left-1/2 top-1/2 w-full"
      style={{
        transform: "translate(-50%, -50%)",
        opacity: frameOpacity,
        pointerEvents: "auto",
      }}
    >
      <div className="mx-auto w-full max-w-[390px] px-4">
        <div
          style={{
            transform: `translateY(${frameY}px) scale(${frameScale})`,
            transition: "transform 120ms linear, opacity 120ms linear",
          }}
        >
          <div className="relative mx-auto w-full max-w-[360px]">
            <div
              className="relative z-20 overflow-visible"
              style={{
                filter: "drop-shadow(0 24px 46px rgba(0,0,0,0.16))",
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  clipPath: frameShape,
                  background: frameColor,
                  padding: "4px",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    clipPath: frameShape,
                    background: "#f3f0f2",
                  }}
                >
                  <div
                    className="relative h-[clamp(348px,47svh,460px)] w-full"
                    style={{
                      transform: `translateY(${imageLift}px) scale(1.02)`,
                      transition: "transform 120ms linear",
                    }}
                  >
                    <Image
                      src={currentItem.image}
                      alt={currentItem.name}
                      fill
                      sizes="(max-width: 480px) 92vw, 360px"
                      className="object-cover object-center"
                      style={{
                        opacity: currentImageOpacity,
                        transition: "opacity 120ms linear",
                      }}
                    />

                    {nextIndex !== currentIndex ? (
                      <Image
                        src={nextItem.image}
                        alt={nextItem.name}
                        fill
                        sizes="(max-width: 480px) 92vw, 360px"
                        className="object-cover object-center"
                        style={{
                          opacity: nextImageOpacity,
                          transition: "opacity 120ms linear",
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative z-10 mx-auto w-[96%]"
              style={{
                marginTop: `${-70 + ribbonRevealProgress * 58}px`,
                opacity: ribbonOpacity,
                transform: `translateY(${ribbonTranslateY}px) scaleY(${ribbonScaleY})`,
                transformOrigin: "top center",
                transition:
                  "transform 120ms linear, opacity 120ms linear, margin-top 120ms linear",
              }}
            >
              <div className="absolute inset-x-[12%] bottom-[-18px] h-[30px] bg-black/20 blur-[18px]" />

              <div
                className="relative overflow-hidden rounded-t-[10px]"
                style={{
                  background: `linear-gradient(
                    180deg,
                    #ff2bad 0%,
                    ${ribbonColor} 32%,
                    #d10f8f 66%,
                    #b8077b 100%
                  )`,
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -8px 18px rgba(0,0,0,0.12)",
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 84%, 82% 84%, 68% 92%, 50% 100%, 32% 92%, 18% 84%, 0 84%)",
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-[4px]"
                  style={{ background: frameColor }}
                />

                <div className="absolute inset-x-[10%] top-[8px] h-[20px] rounded-full bg-white/15 blur-[8px]" />

                <div className="relative min-h-[276px] px-6 pb-[72px] pt-6 text-white">
                  <div
                    style={{
                      opacity: currentTextOpacity,
                      transition: "opacity 120ms linear",
                    }}
                  >
                    <p className="text-[13px] uppercase tracking-[0.16em] text-white/80">
                      {currentItem.role}
                    </p>

                    <h3 className="mt-2 text-[clamp(28px,8vw,40px)] font-bold leading-[1]">
                      {currentItem.name}
                    </h3>

                    <p
                      className="mt-4 text-[15px] leading-[1.45] text-white/85"
                      style={{ color: currentItem.theme.muted }}
                    >
                      {currentItem.description}
                    </p>
                  </div>

                  {nextIndex !== currentIndex ? (
                    <div
                      className="absolute inset-0 px-6 pb-[72px] pt-6"
                      style={{
                        opacity: nextTextOpacity,
                        transition: "opacity 120ms linear",
                        color: nextItem.theme.text,
                      }}
                    >
                      <p className="text-[13px] uppercase tracking-[0.16em] text-white/80">
                        {nextItem.role}
                      </p>

                      <h3 className="mt-2 text-[clamp(28px,8vw,40px)] font-bold leading-[1]">
                        {nextItem.name}
                      </h3>

                      <p
                        className="mt-4 text-[15px] leading-[1.45] text-white/85"
                        style={{ color: nextItem.theme.muted }}
                      >
                        {nextItem.description}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
```

# AchievementsSection/mobile/mobile-achievements-shell.tsx

```
import MobileAchievementCard, {
  type MobileAchievementItem,
} from "./mobile-achievement-card";

type MobileAchievementsShellProps = {
  items: MobileAchievementItem[];
  currentIndex: number;
  nextIndex: number;
  blend: number;
  frameRevealProgress: number;
  ribbonRevealProgress: number;
};

export default function MobileAchievementsShell({
  items,
  currentIndex,
  nextIndex,
  blend,
  frameRevealProgress,
  ribbonRevealProgress,
}: MobileAchievementsShellProps) {
  return (
    <div className="relative mx-auto h-[100svh] w-full max-w-[390px]">
      <MobileAchievementCard
        items={items}
        currentIndex={currentIndex}
        nextIndex={nextIndex}
        blend={blend}
        frameRevealProgress={frameRevealProgress}
        ribbonRevealProgress={ribbonRevealProgress}
      />
    </div>
  );
}
```

# AchievementsSection/mobile/useMobileAchievementsScroll.ts

```
"use client";

import { useEffect, useMemo, useState } from "react";

type UseMobileAchievementsScrollOptions = {
  sectionId: string;
  totalItems: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const rangeProgress = (value: number, start: number, end: number) => {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp((value - start) / (end - start), 0, 1);
};

export default function useMobileAchievementsScroll({
  sectionId,
  totalItems,
}: UseMobileAchievementsScrollOptions) {
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = Math.max(rect.height - window.innerHeight, 1);
      const passed = clamp(-rect.top, 0, totalScrollable);
      const progress = passed / totalScrollable;
      setSectionProgress(progress);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionId]);

  return useMemo(() => {
    const titleFadeProgress = rangeProgress(sectionProgress, 0.08, 0.24);

    // Card yig‘ilish bosqichi
    const frameRevealProgress = rangeProgress(sectionProgress, 0.24, 0.42);

    // Bayroqcha frame ichidan chiqish bosqichi
    const ribbonRevealProgress = rangeProgress(sectionProgress, 0.38, 0.58);

    // Faqat shundan keyin content almashishni boshlaymiz
    const contentStart = 0.58;
    const contentEnd = 0.96;
    const contentProgress = rangeProgress(sectionProgress, contentStart, contentEnd);

    const maxIndex = Math.max(totalItems - 1, 0);
    const floatingIndex = contentProgress * maxIndex;

    const currentIndex = clamp(Math.floor(floatingIndex), 0, maxIndex);
    const nextIndex = clamp(currentIndex + 1, 0, maxIndex);

    const blend = clamp(floatingIndex - currentIndex, 0, 1);

    return {
      sectionProgress,
      titleFadeProgress,
      frameRevealProgress,
      ribbonRevealProgress,
      contentProgress,
      floatingIndex,
      currentIndex,
      nextIndex,
      blend,
    };
  }, [sectionProgress, totalItems]);
}
```

# sections/mobile-page.tsx

```
"use client";

import MobileAboutSection from "../about/mobile";
import MobileAchievementsSection from "../AchievementsSection/mobile";
import MobileHomeSection from "../home/mobile";
import MobileFooter from "../home/mobile/mobile-footer";
import MobileBottomNav from "../home/mobile/mobile-bottom-nav";
import MobileProductSection from "../product/mobile";
import MobileTopbar from "../home/mobile/mobile-topbar";
import MobileStartupLoader from "../shared/loading/mobile-startup-loader";
import useStartupLoading from "../shared/hooks/use-startup-loading";

export default function MobilePage() {
  const { isLoading, isReady } = useStartupLoading({
    rootSelector: "#mobile-page-root",
    minDurationMs: 650,
    maxDurationMs: 1800,
  });

  return (
    <>
      <MobileStartupLoader visible={isLoading} />
      <main
        id="mobile-page-root"
        className="relative min-h-screen w-full bg-white"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 400ms ease",
        }}
      >
        <MobileTopbar />
        <MobileBottomNav />

        <div>
          <MobileHomeSection startupReady={isReady} />
          <MobileAboutSection />
          <MobileProductSection />
          <MobileAchievementsSection />
          <MobileFooter />
        </div>
      </main>
    </>
  );
}
```

# shared/hooks/use-mobile-hero-motion.ts

```
"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mobileMotion } from "@/config/mobile-system/mobile-motion";

gsap.registerPlugin(ScrollTrigger);

type UseMobileHeroMotionParams = {
  sectionRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  bgRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  titleWrapRef: RefObject<HTMLDivElement | null>;
  azizamRef: RefObject<HTMLHeadingElement | null>;
  marketRef: RefObject<HTMLHeadingElement | null>;
  startupReady?: boolean;
};

export default function useMobileHeroMotion({
  sectionRef,
  stageRef,
  bgRef,
  overlayRef,
  titleWrapRef,
  azizamRef,
  marketRef,
  startupReady = false,
}: UseMobileHeroMotionParams) {
  useEffect(() => {
    if (!startupReady) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const bg = bgRef.current;
    const overlay = overlayRef.current;
    const titleWrap = titleWrapRef.current;
    const azizam = azizamRef.current;
    const market = marketRef.current;

    if (!section || !stage || !bg || !overlay || !titleWrap || !azizam || !market) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bg, {
        scale: 1.01,
        transformOrigin: "center center",
      });

      gsap.set(titleWrap, {
        autoAlpha: 0,
        y: mobileMotion.hero.titleIntroY,
        scale: 0.99,
      });

      gsap.set(overlay, {
        opacity: 0,
      });

      const introDelay = 0.08;

      gsap.to(titleWrap, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: mobileMotion.hero.introDuration,
        delay: introDelay,
        ease: mobileMotion.hero.introEase,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${mobileMotion.hero.scrollDistance}`,
          scrub: mobileMotion.hero.scrub,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        bg,
        {
          scale: mobileMotion.hero.backgroundScaleTo,
          ease: "none",
        },
        0,
      )
        .to(
          overlay,
          {
            opacity: 0.72,
            ease: "none",
          },
          0,
        )
        .to(
          azizam,
          {
            x: -mobileMotion.hero.titleSplitX,
            autoAlpha: mobileMotion.hero.titleFadeTo,
            ease: "none",
          },
          0,
        )
        .to(
          market,
          {
            x: mobileMotion.hero.titleSplitX,
            autoAlpha: mobileMotion.hero.titleFadeTo,
            ease: "none",
          },
          0,
        )
        .to(
          titleWrap,
          {
            y: mobileMotion.hero.titleLiftTo,
            ease: "none",
          },
          0,
        );

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      ctx.revert();
    };
  }, [
    sectionRef,
    stageRef,
    bgRef,
    overlayRef,
    titleWrapRef,
    azizamRef,
    marketRef,
    startupReady,
  ]);
}
```

# config/mobile-system/mobile-hero.ts

```
export const mobileLayout = {
  pageMaxWidth: "480px",

  heroViewportHeight: "100dvh",
  heroMinHeight: "100svh",

  heroContentMaxWidth: "420px",
  heroTitleMaxWidth: "min(88vw, 360px)",

  heroScrollRunway: "560px",
} as const;

export type MobileLayout = typeof mobileLayout;
```

# config/mobile-system/mobile-layout.ts

```
export const mobileLayout = {
  pageMaxWidth: "480px",

  heroViewportHeight: "100dvh",
  heroMinHeight: "100svh",

  heroContentMaxWidth: "420px",
  heroTitleMaxWidth: "min(88vw, 360px)",

  heroScrollRunway: "560px",
} as const;

export type MobileLayout = typeof mobileLayout;
```

# config/mobile-system/mobile-motion.ts

```
export const mobileMotion = {
  about: {
    titleY: 26,
    imageY: 54,
    textY: 18,
    imageScaleFrom: 0.94,
    imageScaleTo: 1,
    scrub: 0.32,
  },

  hero: {
    introDuration: 0.68,
    introEase: "power2.out",

    titleIntroY: 12,
    topbarIntroY: 10,
    navIntroY: 10,

    scrollDistance: 560,
    backgroundScaleTo: 1.08,

    titleSplitX: 120,
    titleFadeTo: 0,
    titleLiftTo: -8,

    scrub: 0.12,
  },

 product: {
    titleOnlyStart: 0,
    titleOnlyEnd: 0.2,

    titleFadeStart: 0.16,
    titleFadeEnd: 0.3,

    cardsRevealStart: 0.24,
    cardsRevealEnd: 0.4,

    cardsStart: 0.34,
    cardsEnd: 0.96,

    stackOffsetY: 28,
    stackScaleStep: 0.055,
    inactiveOpacity: 0.38,
    exitLift: 156,

    introOffsetY: 72,
    introScaleFrom: 0.94,
  },
  
} as const;

export type MobileMotion = typeof mobileMotion;
```

# config/mobile-system/mobile-navbar.ts

```
export const mobileNavbar = {
  topIconSize: "78px",
  topIconInnerSize: "62px",
  topIconGap: "16px",

  bottomHeight: "78px",
  bottomRadius: "9999px",
  bottomBlur: "14px",

  collapsedHeight: "68px",
  collapsedRadius: "9999px",
  collapsedBlur: "12px",
  collapsedIconOuter: "54px",
  collapsedIconInner: "42px",
} as const;

export type MobileNavbar = typeof mobileNavbar;
```

# config/mobile-system/mobile-sections.ts

```
export const mobileSections = {
  about: {
    minHeight: "235svh",
    stickyTop: "0px",

    frameMaxWidth: "min(84vw, 350px)",
    imageRadius: "28px",
    imageBorderWidth: "2px",
    imageHeight: "clamp(360px, 50svh, 440px)",

    imageShiftY: "-56px",

    titleTopOffset: "22svh",
    contentMaxWidth: "min(78vw, 300px)",
    infoGap: "20px",
  },

  product: {
    minHeight: "380svh",
    stickyHeight: "100svh",
    frameMaxWidth: "min(calc(100vw - 24px), 390px)",
    titleTopOffset: "0svh",
    cardMaxWidth: "min(calc(100vw - 34px), 392px)",
    cardRadius: "30px",
    cardMinHeight: "clamp(560px, 76svh, 710px)",
    contentBottomOffset: "110px",
  },

  achievements: {
    minHeight: "280svh",
    frameMaxWidth: "380px",
    titleTopOffset: "12vh",
    cardMaxWidth: "360px",
    cardRadius: "28px",
    cardMinHeight: "560px",
  },

  footer: {
    minHeight: "100svh",
    contentMaxWidth: "380px",
    bottomPadding: "120px",
  },
} as const;

export type MobileSections = typeof mobileSections;
```

# config/mobile-system/mobile-spacing.ts

```
export const mobileSpacing = {
  pageX: "20px",

  topbarTop: "26px",
  topbarLeft: "20px",
  topbarGap: "18px",

  heroBottomSafeSpace: "148px",

  bottomNavX: "16px",
  bottomNavY: "20px",
  bottomNavInnerX: "18px",

  heroTitleOffsetY: "0svh",
} as const;

export type MobileSpacing = typeof mobileSpacing;
```

# config/mobile-system/mobile-typography.ts

```
export const mobileTypography = {
  hero: {
    title: "clamp(50px, 14vw, 76px)",
    lineHeight: 0.9,
    letterSpacing: "-0.06em",
    weight: 700,
    lineGap: "4px",
  },

  nav: {
    label: "11px",
    weight: 600,
    lineHeight: 1.1,
  },
} as const;

export type MobileTypography = typeof mobileTypography;
```

<!-- ushbu mobile-lesson.md fileda mobile versiayaga oid barcha xozirgacha yozilgan codelar tushirilib chiqildi -->