import { Product } from "../shared/product.types"
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