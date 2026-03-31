import { mobileSections } from "@/config/mobile-system/mobile-sections";
import MobileProductCard, { type MobileProductItem } from "./mobile-product-card";

type MobileProductShellProps = {
  products: MobileProductItem[];
  floatingIndex: number;
  activeIndex: number;
  cardsProgress: number;
  cardsRevealProgress: number;
};

export default function MobileProductShell({
  products,
  floatingIndex,
  activeIndex,
  cardsProgress,
  cardsRevealProgress,
}: MobileProductShellProps) {
  return (
    <div
      className="relative mx-auto w-full"
      style={{
        maxWidth: mobileSections.product.frameMaxWidth,
        height: "100svh",
      }}
    >
      {products.map((product, index) => (
        <MobileProductCard
          key={product.id}
          product={product}
          index={index}
          floatingIndex={floatingIndex}
          activeIndex={activeIndex}
          cardsProgress={cardsProgress}
          cardsRevealProgress={cardsRevealProgress}
        />
      ))}
    </div>
  );
}