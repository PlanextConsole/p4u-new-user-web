// app/shop/page.tsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopPage from "@/app/shop/shop";
import { useRouter } from "next/navigation";

export default function ShopRoute() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ShopPage onVendorSelect={(vendorId: string) => router.push(`/shop/${vendorId}`)} />
      </main>
      <Footer />
    </div>
  );
}