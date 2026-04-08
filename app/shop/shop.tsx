"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Star, Clock, ChevronLeft, ChevronRight, Search, X,
  Heart, ShoppingBag, Filter, Tag,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  TEAL_GRADIENT,
  ITEMS_PER_PAGE,
} from "./constants";
import { catalogApi } from "@/lib/api/catalog";
import { Loader2 } from "lucide-react";
import { pickCategoryImage, pickVendorImage } from "@/lib/media";
import { CategorySidebarThumb } from "@/components/catalog/CategorySidebarThumb";

const SHOP_CARD_PLACEHOLDER =
  "https://placehold.co/600x400/f3f4f6/64748b?text=Shop";
 

type ShopItem = {
  id: number
  title: string
  image: string
  distance: string
  rating: number
  price: number
  duration: string
  provider: string
  number: string
  pts: number
  vendorId: string
  category: string
  badge?: {
    label: string
    bg: string
  } | null
}

function CardImage({ item }: { item: ShopItem }) {
  const src =
    typeof item.image === "string" && item.image.trim() !== ""
      ? item.image
      : SHOP_CARD_PLACEHOLDER;
  return (
    <div className="relative h-[150px] overflow-hidden bg-gray-100 group">
      <Image
        src={src}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {item.badge && (
        <div
          className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-lg"
          style={{ background: item.badge.bg }}
        >
          {item.badge.label}
        </div>
      )}
    </div>
  );
}
 

function ServiceCard({ service, onVendorSelect }: { service: ShopItem; onVendorSelect?: (vendorId: string) => void }) {
  const router = useRouter();
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col border border-gray-100"
      onClick={() => {
        if (onVendorSelect) onVendorSelect(service.vendorId);
        else {
          router.push(`/shop/${service.vendorId}`);
        }
      }}
    >
      <CardImage item={service} />
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">{service.title}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">{service.number}</p>
          </div>
          <div className="flex items-center gap-0.5 ml-2 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-600">{service.rating}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-2.5 truncate">{service.provider}</p>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-700">Min ₹{service.price}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-amber-600">{service.pts} pts</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-blue-500 shrink-0" />
          <span className="text-xs text-gray-500">Delivery in {service.duration}</span>
        </div>
      </div>
    </div>
  );
}
 

type PaginationProps = {
  current: number
  total: number
  onChange: (page: number) => void
}

function Pagination({ current, total, onChange }: PaginationProps) {


  const getPages = () => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="p-2 rounded-xl bg-white shadow-sm border border-gray-200 disabled:opacity-30 hover:border-emerald-400 transition"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
      {getPages().map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="w-8 text-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => typeof p === "number" && onChange(p)}
            className="w-9 h-9 rounded-xl text-xs font-semibold transition-all border"
            style={
              p === current
                ? { background: TEAL_GRADIENT, color: "white", borderColor: "transparent" }
                : { background: "white", color: "#374151", borderColor: "#e5e7eb" }
            }
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="p-2 rounded-xl bg-white shadow-sm border border-gray-200 disabled:opacity-30 hover:border-emerald-400 transition"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}  
type ShopCategoryRow = { name: string; image: string | null };

type SidebarContentProps = {
  categories: ShopCategoryRow[];
  selectedCats: string[];
  toggleCat: (cat: string) => void
  offersOnly: boolean
  setOffersOnly: (v: boolean) => void
  ratingFilter: number | null
  setRatingFilter: (v: number | null) => void
  setPage: (p: number) => void
}

function SidebarContent({
  categories,
  selectedCats,
  toggleCat,
  offersOnly,
  setOffersOnly,
  ratingFilter,
  setRatingFilter,
  setPage,
}: SidebarContentProps) {
  return (
    <div className="w-full space-y-3"> 
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500">Categories</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
        <div className="px-4 py-3 space-y-2.5">
          {categories.map((row) => {
            const active = selectedCats.includes(row.name);
            return (
              <label key={row.name} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => { toggleCat(row.name); setPage(1); }}
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0"
                  style={
                    active
                      ? { borderColor: "#14b8a6", backgroundColor: "#14b8a6" }  
                      : { borderColor: "#d1d5db", backgroundColor: "#fafafa" }
                  }
                >
                  {active && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <CategorySidebarThumb imageUrl={row.image} label={row.name} size={32} />
                <span className="text-sm font-medium flex-1 min-w-0" style={{ color: active ? "#059669" : "#4b5563" }}>
                  {row.name}
                </span>
              </label>
            );
          })}
        </div>
      </div> 
      <div className="rounded-2xl px-4 py-3 bg-white shadow-sm border border-gray-100">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 flex items-center gap-2 text-gray-500">
          <Tag className="w-3.5 h-3.5 text-amber-400" /> Offers
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => { setOffersOnly(!offersOnly); setPage(1); }}
            className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0"
            style={
              offersOnly
                ? { borderColor: "#f59e0b", backgroundColor: "#f59e0b" }
                : { borderColor: "#d1d5db", backgroundColor: "#fafafa" }
            }
          >
            {offersOnly && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium" style={{ color: offersOnly ? "#b45309" : "#4b5563" }}>
            Show deals only
          </span>
          {offersOnly && (
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              ON
            </span>
          )}
        </label>
      </div> 
      <div className="rounded-2xl px-4 py-3 bg-white shadow-sm border border-gray-100">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 flex items-center gap-2 text-gray-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Rating
        </p>
        <div className="space-y-2.5">
          {[4.5, 4.0, 3.5].map((r) => {
            const active = ratingFilter === r;
            return (
              <label key={r} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => { setRatingFilter(active ? null : r); setPage(1); }}
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                  style={
                    active
                      ? { borderColor: "#f59e0b", backgroundColor: "#f59e0b" }
                      : { borderColor: "#d1d5db", backgroundColor: "#fafafa" }
                  }
                >
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: active ? "#b45309" : "#4b5563" }}
                >
                  {Array.from({ length: Math.floor(r) }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span>{r}+</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
 
export default function ShopPage({ onVendorSelect }: { onVendorSelect?: (vendorId: string) => void }) {
  const [sellers, setSellers] = useState<ShopItem[]>([]);
  const [categories, setCategories] = useState<ShopCategoryRow[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(true);

  const [sortBy, setSortBy] = useState("popularity");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [offersOnly, setOffersOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    catalogApi.getCategories({ limit: 50 }).then((res) => {
      const cats = (res as any)?.data ?? res;
      const rows: ShopCategoryRow[] = (Array.isArray(cats) ? cats : [])
        .map((c: any) => ({
          name: c.name,
          image: pickCategoryImage(c),
        }))
        .filter((r: ShopCategoryRow) => Boolean(r.name));
      if (rows.length) setCategories(rows);
    }).catch(() => {});

    catalogApi.getVendors({ limit: 50 }).then((res) => {
      setSellers(res.data.map((v, i) => ({
        id: v.id,
        title: v.businessName || v.name,
        number: (v as any).phone || `Vendor ${i + 1}`,
        provider: v.description ?? v.businessName ?? v.name,
        category: "General",
        vendorId: String(v.id),
        rating: v.rating ?? 0,
        duration: "30 Min",
        price: 0,
        pts: 100,
        distance: "1.0 km",
        badge: null,
        image: pickVendorImage(v as any) || (v as any).logoUrl || (v as any).logo || (v as any).banner || "",
        reviews: 0,
      })));
    }).catch(() => {}).finally(() => setLoadingSellers(false));
  }, []);

  const filtered = useMemo(() => {
    let data = [...sellers];
    if (selectedCats.length) data = data.filter((s) => selectedCats.includes(s.category));
    if (search) data = data.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    if (ratingFilter) data = data.filter((s) => s.rating >= ratingFilter);
    if (offersOnly) data = data.filter((s) => s.badge !== null);
    if (sortBy === "low") data.sort((a, b) => a.price - b.price);
    else if (sortBy === "high") data.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") data.sort((a, b) => b.id - a.id);
    else data.sort((a, b) => b.rating - a.rating);
    return data;
  }, [sellers, selectedCats, search, ratingFilter, offersOnly, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeFilters = [
    sortBy !== "popularity" ? sortBy : null,
    ratingFilter ? `⭐ ${ratingFilter}+` : null,
    offersOnly ? "Offers" : null,
    ...selectedCats,
  ].filter(Boolean);


  const toggleCat = (cat: string) => {
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
    setPage(1);
  };

  const removeFilter = (f: string) => {
    if (["low", "high", "newest"].includes(f)) setSortBy("popularity");
    else if (f.startsWith("⭐")) setRatingFilter(null);
    else if (f === "Offers") setOffersOnly(false);
    else toggleCat(f);
    setPage(1);
  };

  const sidebarProps = { categories, selectedCats, toggleCat, offersOnly, setOffersOnly, ratingFilter, setRatingFilter, setPage };

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-5 flex gap-5 items-start"> 
        <aside className="hidden lg:block w-52 shrink-0 sticky top-4">
          <SidebarContent {...sidebarProps} />
        </aside> 
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-white/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-800 text-sm">Filters</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <SidebarContent {...sidebarProps} />
            </div>
          </div>
        )} 
        <div className="flex-1 min-w-0"> 
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Electronics</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} results
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm"
            >
              <Filter className="w-4 h-4" /> Filters
              {activeFilters.length > 0 && (
                <span
                  className="ml-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ background: TEAL_GRADIENT }}
                >
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div> 
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {activeFilters.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                  style={{ background: TEAL_GRADIENT }}
                >
                  {f}
                  <button onClick={() => removeFilter(f as string)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => {
                  setSelectedCats([]); setSortBy("popularity");
                  setRatingFilter(null); setOffersOnly(false); setPage(1);
                }}
                className="text-xs text-red-400 underline underline-offset-2 hover:text-red-600"
              >
                Clear all
              </button>
            </div>
          )} 
          <div className="bg-white rounded-2xl px-4 py-3 mb-5 shadow-sm border border-gray-100"> 
            <div
              className="flex items-center gap-2 mb-3"
              style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex-shrink-0">Sort By</span>
              {[
                { label: "Price", icon: <ArrowUp className="w-3 h-3" />, val: "low" },
                { label: "Price", icon: <ArrowDown className="w-3 h-3" />, val: "high" },
                { label: "Newest", val: "newest" },
                { label: "Popularity", val: "popularity" },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => { setSortBy(s.val); setPage(1); }}
                  className="text-xs px-3.5 py-1.5 rounded-full font-medium border transition-all flex-shrink-0 flex items-center gap-1"
                  style={
                    sortBy === s.val
                      ? { background: TEAL_GRADIENT, color: "white", borderColor: "transparent" }
                      : { background: "#f9fafb", color: "#374151", borderColor: "#e5e7eb" }
                  }
                >
                  {s.label}
                  {s.icon && s.icon}
                </button>
              ))}
            </div> 
            <div className="flex justify-end">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden w-48 sm:w-56">
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search Seller"
                  className="text-xs px-3 py-2 outline-none flex-1 bg-transparent min-w-0"
                />
                <button className="px-3 py-2 text-white flex-shrink-0" style={{ background: TEAL_GRADIENT }}>
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div> 
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full inline-block" style={{ background: TEAL_GRADIENT }} />
            Seller List
          </h2>
 
          {loadingSellers ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="bg-white rounded-2xl py-24 text-center text-gray-400 shadow-sm">
              No sellers found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
              {paginated.map((service) => (
                <ServiceCard key={service.id} service={service} onVendorSelect={onVendorSelect} />
              ))}
            </div>
          )} 
          {totalPages > 1 && (
            <Pagination
              current={page}
              total={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}