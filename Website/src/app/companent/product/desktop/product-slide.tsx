"use client"

import ProductMedia from "./product-media"
import ProductInfo from "./product-info"
import ProductColors from "./product-colors"
import ProductActions from "./product-actions"
import ProductGuestCallout from "./product-guest-callout"
import { colors, sizes } from "@/config/design-system"
import { Product } from "../shared/product.types"
import { useAuthModal } from "../../shared/auth/AuthModalProvider"

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