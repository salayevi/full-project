import type { ProductRecord, PublicSiteSnapshot } from "@/lib/backend/domain";
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders";
import { selectMediaAsset, selectProductColorVariants } from "@/lib/backend/selectors";
import type { Product } from "./product.types";

function mapProductActions(product: ProductRecord): Product["actions"] {
  const actions: Product["actions"] = [];

  if (product.cartEnabled) {
    actions.push({ label: "Add to cart", href: "/cart", type: "primary" });
  }

  if (product.savedEnabled) {
    actions.push({ label: "Save", href: "/wishlist", type: "secondary" });
  }

  return actions;
}

export function mapProductRecordsToProducts(
  records: ProductRecord[],
  snapshot: PublicSiteSnapshot,
): Product[] {
  return records.map((record) => {
    const mediaAsset = selectMediaAsset(snapshot, record.mediaAssetId);
    const colorVariants = selectProductColorVariants(snapshot, record.id);

    return {
      id: record.id,
      slug: record.slug,
      name: record.title,
      subtitle: record.subtitle,
      description: record.description,
      price: record.price,
      badge: record.badge,
      theme: record.displayTheme,
      mediaPanel: record.mediaPanel,
      media: {
        type: mediaAsset?.kind === "video" ? "video" : "image",
        src:
          mediaAsset?.url ??
          createContentPlaceholderDataUri({
            title: record.title,
            subtitle: record.subtitle ?? record.badge ?? "Product",
            background: record.displayTheme.bg,
            foreground: record.displayTheme.text,
            accent: record.displayTheme.accent,
          }),
        alt: mediaAsset?.alt ?? record.title,
        hasTransparentBg: record.mediaPanel.mode !== "imageTone",
      },
      colors: colorVariants.map((variant) => ({
        name: variant.name,
        hex: variant.hex,
      })),
      actions: mapProductActions(record),
    };
  });
}
