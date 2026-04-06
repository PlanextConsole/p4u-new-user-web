"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceListPage  from "@/app/service/ServiceListPage";
import VendorDetailPage from "@/app/service/VendorDetailPage";
import { Seller } from "@/app/service/serviceData";

export default function ShopRoute() {
  const [view,     setView]     = useState<"list" | "vendor">("list");
  const [vendorId, setVendorId] = useState<string | null>(null);

  const handleSelectSeller = (seller: Seller) => {
    setVendorId(seller.vendorId);
    setView("vendor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("list");
    setVendorId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {view === "vendor" && vendorId ? (
          <VendorDetailPage vendorId={vendorId} onBack={handleBack} />
        ) : (
          <ServiceListPage onSelectSeller={handleSelectSeller} />
        )}
      </main>
      <Footer />
    </div>
  );
}