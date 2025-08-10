import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { PopularProducts } from "@/components/PopularProducts";
import { NewArrivals } from "@/components/NewArrivals";
import { CustomerTestimonials } from "@/components/CustomerTestimonials";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroBanner />
        <FeaturedCategories />
        <PopularProducts />
        <NewArrivals />
        <CustomerTestimonials />
        <Newsletter />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
