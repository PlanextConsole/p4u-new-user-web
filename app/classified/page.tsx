// app/shop/page.tsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Classified from "@/app/classified/classified";
import { useRouter } from "next/navigation";

export default function ShopRoute() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Classified />
      </main>
      <Footer />
    </div>
  );
}