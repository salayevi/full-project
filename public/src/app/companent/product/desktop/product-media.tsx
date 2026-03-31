"use client"

import { Product } from "../shared/product.types"
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