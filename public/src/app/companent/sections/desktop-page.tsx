import About from "../about/desktop";
import ProductsSection from "../product/desktop";
import AchievementsSection from "../AchievementsSection/desktop/AchievementsSection";
import Footer from "../home/desktop/Footer/footer";
import HomeSection from "../home/desktop";
import { sizes } from "@/config/design-system";

export default function DesktopPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <div>
        <HomeSection />
        <About />
        <ProductsSection />
        <div className="bg-white" style={{ height: sizes.layout.sectionGap }} />
        <AchievementsSection />
        <Footer />
      </div>
    </main>
  );
}
