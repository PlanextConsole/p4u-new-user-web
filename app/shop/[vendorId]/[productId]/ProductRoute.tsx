"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailPage from "@/app/shop/Productdetailpage";
import { VENDORS } from "@/app/shop/constants";

export default function ProductRoute({
  params,
}: {
  params: { vendorId: string; productId: string };
}) {
  const router = useRouter();
  const vendor = (VENDORS as Record<string, any>)[params.vendorId];
  const product = vendor?.products?.find(
    (p: any) => String(p.id) === params.productId
  );

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Product not found.</p>
        <button
          onClick={() => router.push(`/shop/${params.vendorId}`)}
          className="px-4 py-2 rounded-xl text-white bg-teal-600"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetailPage
          product={product}
          onBack={() => router.push(`/shop/${params.vendorId}`)}
        />
      </main>
      <Footer />
    </div>
  );
}