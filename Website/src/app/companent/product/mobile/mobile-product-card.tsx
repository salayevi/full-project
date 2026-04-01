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
