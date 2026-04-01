"use client"

import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider"
import { selectPublicProductRecords } from "@/lib/backend/selectors"
import { mapProductRecordsToProducts } from "../shared/products-data"
import ProductsScene from "./products-scene"

export default function ProductsSection() {
  const snapshot = usePublicSiteContent()
  const products = mapProductRecordsToProducts(
    selectPublicProductRecords(snapshot),
    snapshot,
  )

  if (products.length === 0) {
    return null
  }

  return (
    <section id="products" className="relative w-full">
      <ProductsScene products={products} />
    </section>
  )
}
