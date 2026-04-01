"use client"

import { useRef } from "react"
import { Product } from "../shared/product.types"
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
          <div
            className="text-center"
            style={{
              width: "100%",
              maxWidth: sizes.layout.desktopContainer,
              paddingInline: sizes.layout.gutter,
            }}
          >
            <p
              data-products-kicker
              className="mb-4 text-xs uppercase tracking-[0.45em] sm:text-sm"
              style={{ color: colors.text.secondary }}
            >
              Azizam Market
            </p>

            <h2
              data-products-title
              className="text-6xl font-semibold tracking-tight sm:text-7xl md:text-8xl"
              style={{
                color: colors.brand.primaryStrong,
                fontSize: "clamp(68px, 7vw, 128px)",
              }}
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

        <div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ paddingInline: sizes.layout.gutter }}
        >
          <div
            data-products-card-shell
            className="relative w-full will-change-transform pointer-events-auto"
            style={{
              maxWidth: `min(${sizes.product.cardMaxWidth}, ${sizes.layout.desktopContainer})`,
            }}
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
