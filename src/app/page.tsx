import HeroSection from "@/src/components/HeroSection";
import ServicesSection from "@/src/components/ServicesSection";
import WhyChooseUs from "@/src/components/WhyChooseUs";
import AmbassadorsSection from "@/src/components/AmbassadorsSection";
import HowItWorks from "@/src/components/HowItWorks";
import RegionalBanner from "@/src/components/RegionalBanner";
import Footer from "@/src/components/Footer";
import PartnersSection from "../components/PartnerSection";

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-[#07120f] text-gray-900 selection:bg-green-600 selection:text-white">
      <HeroSection />
      <ServicesSection />
      <WhyChooseUs />
      <AmbassadorsSection />
      
      <HowItWorks />
      <PartnersSection />
      <RegionalBanner />
      <Footer />
    </main>
  );
}