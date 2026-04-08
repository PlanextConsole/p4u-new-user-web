"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetailPage from "@/app/shop/Productdetailpage";
import { catalogApi } from "@/lib/api/catalog";
import { commerceApi } from "@/lib/api/commerce";
import { buildProductGalleryImages, pickProductImage, resolveMediaUrl } from "@/lib/media";

export default function ProductRoute({
  params,
}: {
  params: { vendorId: string; productId: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const p = await catalogApi.getProduct(params.productId);

        // Fetch reviews from API
        let reviewsList: Record<string, unknown>[] = [];
        let reviewSummary = { averageRating: 0, totalReviews: 0, breakdown: {} as Record<number, number> };
        try {
          const [reviews, summary] = await Promise.all([
            commerceApi.getReviews("product", p.id),
            commerceApi.getReviewSummary("product", p.id),
          ]);
          reviewsList = reviews.map((r) => ({
            id: r.id,
            name: r.userId ? `User #${r.userId}` : "Anonymous",
            verified: true,
            rating: r.rating,
            title: "",
            comment: r.comment ?? "",
            date: new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            helpful: 0,
            images: [],
          }));
          reviewSummary = summary;
        } catch {
          // Reviews not available — continue without them
        }

        const priceNum = Number(
          (p as any).finalPrice ?? (p as any).sellPrice ?? p.price ?? 0,
        );
        const mainImage =
          pickProductImage(p as any) ||
          resolveMediaUrl(String((p as any).metadata?.imageUrl || "")) ||
          "";
        const gallery = buildProductGalleryImages({
          thumbnailUrl: (p as any).thumbnailUrl,
          bannerUrls: (p as any).bannerUrls,
          image: (p as any).image,
          metadata: p.metadata as any,
        });

        setProduct({
          id: p.id,
          name: p.name,
          price: priceNum,
          originalPrice: p.originalPrice ?? priceNum,
          image: mainImage,
          imageUrl: mainImage,
          images: gallery.length ? gallery : mainImage ? [mainImage] : [],
          description:
            (p as any).longDescription ||
            (p as any).shortDescription ||
            p.description ||
            "",
          rating: reviewSummary.averageRating || 0,
          reviews: reviewSummary.totalReviews || 0,
          ratingBreakdown: Object.keys(reviewSummary.breakdown).length ? reviewSummary.breakdown : undefined,
          reviewsList: reviewsList.length ? reviewsList : undefined,
          vendorId: p.vendorId,
          categoryId: p.categoryId,
          brand: p.metadata?.brand ?? "",
          specs: p.metadata ?? {},
        });
      } catch {
        // Product not found via API
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.vendorId, params.productId]);

  if (loading) {
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Product not found.</p>
        <button
          onClick={() => {
            notifyNavigationIntent();
            router.push(`/shop/${params.vendorId}`);
          }}
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
          onBack={() => {
            router.push(`/shop/${params.vendorId}`);
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
