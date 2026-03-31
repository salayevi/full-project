"use client";

import { useEffect, useState } from "react";
import { mobileSections } from "@/config/mobile-system/mobile-sections";
import { colors } from "@/config/design-system";
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider";
import { selectPublicProductRecords } from "@/lib/backend/selectors";
import { mapProductRecordsToProducts } from "../shared/products-data";
import MobileProductShell from "./mobile-product-shell";
import useMobileProductsScroll from "../../shared/hooks/useMobileProductsScroll";

export default function MobileProductSection() {
  const snapshot = usePublicSiteContent();
  const products = mapProductRecordsToProducts(
    selectPublicProductRecords(snapshot),
    snapshot,
  );
  const [titleIntroReady, setTitleIntroReady] = useState(false);

  const mobileProducts = products.map((product, index) => ({
    id: index + 1,
    title: product.name,
    eyebrow: product.subtitle ?? "",
    promo: product.badge,
    description: product.description,
    image: product.media.src,
    imageAlt: product.media.alt ?? product.name,
    theme: product.theme,
    price: product.price ?? "Narx mavjud emas",
  }));

  if (mobileProducts.length === 0) {
    return null;
  }

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
      className="relative w-full overflow-clip"
      style={{
        backgroundColor: colors.background.soft,
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
            <h2
              className="text-[clamp(34px,10vw,50px)] font-bold leading-none tracking-[-0.05em]"
              style={{ color: colors.brand.primaryStrong }}
            >
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
