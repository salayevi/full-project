import Link from "next/link"
import { colors, motion, radius, sizes } from "@/config/design-system"
import { ProductAction } from "../shared/product.types"

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