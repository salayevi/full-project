"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mobileSections } from "@/config/mobile-system/mobile-sections";
import { mobileSpacing } from "@/config/mobile-system/mobile-spacing";
import { mobileMotion } from "@/config/mobile-system/mobile-motion";
import { colors } from "@/config/design-system";
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider";
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders";
import { selectAboutViewModel } from "@/lib/backend/selectors";

gsap.registerPlugin(ScrollTrigger);

export default function MobileAboutStory() {
  const snapshot = usePublicSiteContent();
  const about = selectAboutViewModel(snapshot);
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
            {about.section.sectionLabel}
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
                  src={
                    about.image?.url ??
                    createContentPlaceholderDataUri({
                      title: about.section.brandTitle,
                      subtitle: about.section.sectionLabel,
                    })
                  }
                  alt={about.image?.alt ?? about.section.brandTitle}
                  width={420}
                  height={620}
                  className="block w-full object-cover"
                  sizes="(max-width: 480px) 84vw, 350px"
                  unoptimized
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
                  {about.section.brandTitle}
                </h3>

                <div className="relative mt-4 min-h-[84px]">
                  {about.textItems.map((item, index) => (
                    <p
                      key={item.id}
                      ref={(el) => {
                        textsRef.current[index] = el;
                      }}
                      className="absolute left-0 top-0 w-full text-[15px] leading-7"
                      style={{
                        color: colors.brand.secondary,
                      }}
                    >
                      {item.text}
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
