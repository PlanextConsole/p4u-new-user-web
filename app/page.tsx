import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import HeroSlider from '@/components/HeroSlider';
import ServiceCards from '@/components/ServiceCards';
import BestProducts from '@/components/BestProducts';
import BrandSections from '@/components/BrandSections';
import PickupSection from '@/components/PickupSection';
import TopServicer from '@/components/TopServicer';
import MostBookedServices from '@/components/MostBookedServices';
import SubscriptionNewsletter from '@/components/SubscriptionNewsletter';
import Footer from '@/components/Footer';
import ClassifiedResale from '@/components/ClassifiedResale';
import ReelsVideo from '@/components/ReelsVideo';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      {/* <Navigation /> */}
      <HeroSlider />
      <ServiceCards />
      <BestProducts />
      <BrandSections />
      <PickupSection />
      <TopServicer />
      <MostBookedServices />
     
      <ReelsVideo /> <ClassifiedResale />
      <SubscriptionNewsletter />
      <Footer />
    </div>
  );
}
