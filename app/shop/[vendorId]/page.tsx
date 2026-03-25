import { VENDORS } from "@/app/shop/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VendorDetailPage from "@/app/shop/VendorPage"; 

export function generateStaticParams() {
  return Object.keys(VENDORS).map((vendorId) => ({ vendorId }));
}

export default function VendorRoute({ params }: { params: { vendorId: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
       <VendorDetailPage vendorId={params.vendorId} />
      </main>
      <Footer />
    </div>
  );
}