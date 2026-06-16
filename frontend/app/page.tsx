import PublicNavbar from "@/components/layout/public-navbar";
import Hero from "@/components/marketing/hero";
import FeatureGrid from "@/components/marketing/feature-grid";
import PricingPreview from "@/components/marketing/pricing-preview";
import Footer from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />

      <Hero />

      <FeatureGrid />

      <PricingPreview />

      <Footer />
    </main>
  );
}
