import Navbar from "../components/home/Navbar";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import CoverageSection from "../components/home/CoverageSection";
import EcosystemSection from "../components/home/EcosystemSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import DeliveryTypesSection from "../components/home/DeliveryTypesSection";
import PaymentsAndRiderSection from "../components/home/PaymentsAndRiderSection";
import WhyChooseUsSection from "../components/home/WhyChooseUsSection";
import Footer from "../components/home/Footer";
import HomeSearchBarSection from "../components/home/HomeSearchBar";
import VerticalServicesSection from "../components/home/ServiceSection";
import PopularRestaurantsSection from "../components/home/PopularRestaurant";
import UpcomingEventsSection from "../components/home/UpcomingEvents";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <HomeSearchBarSection />
        <VerticalServicesSection />
        <PopularRestaurantsSection />
        <UpcomingEventsSection />
        <ServicesSection />
        
        <CoverageSection />
        <EcosystemSection />
        <HowItWorksSection />
        <DeliveryTypesSection />
        <PaymentsAndRiderSection />
        <WhyChooseUsSection />
      </main>
      <Footer />
    </div>
  );
}