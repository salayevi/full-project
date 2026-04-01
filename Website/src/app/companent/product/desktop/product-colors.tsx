import { ProductColor } from "../shared/product.types"
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