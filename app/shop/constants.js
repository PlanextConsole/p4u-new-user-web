import orangeMobiles  from "./images/orange-mobiles.png";
import pskMobiles     from "./images/psk-mobiles.jpg";
import midcareplus     from "./images/midcareplus.png";
import salemRrBiryani from "./images/salem-rrbriyani.jpg";
import galaxyClothing from "./images/galaxy.jpeg";
import freshBasket    from "./images/fresh basket.jpg";
 
export const TEAL_GRADIENT =
  "radial-gradient(ellipse at 60% 25%, #1a4a3a 0%, #0E221F 55%, #081812 100%)";

export const CATEGORIES = ["Electronics", "Restaurants", "Clothing", "Groceries", "Medical", "Cosmetics"];

export const BADGE_STYLES = [
  { label: "20% Off",       bg: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { label: "Free Delivery", bg: "linear-gradient(135deg,#10b981,#059669)" },
  { label: "New Arrival",   bg: "linear-gradient(135deg,#3b82f6,#6366f1)" },
  { label: "Trending",      bg: "linear-gradient(135deg,#ec4899,#f43f5e)" },
  { label: "Popular",       bg: "linear-gradient(135deg,#f97316,#ef4444)" },
];

export const CAT_IMAGES = {
  Electronics: [orangeMobiles, pskMobiles],
  Restaurants: [salemRrBiryani],
  Clothing:    [galaxyClothing],
  Groceries:   [freshBasket],
  Medical:     [midcareplus],
  Cosmetics:   [galaxyClothing],
};

export const RAW_SELLERS = Array.from({ length: 40 }, (_, i) => {
  const cats = [
    { cat: "Electronics", name: "Orange Mobiles",   sub: "Mobile & Accessories", duration: "60 Min",   price: 100, pts: 150, vendorId: "orange-mobiles" },
    { cat: "Restaurants",  name: "Salem RR Biryani", sub: "Food & Beverages",     duration: "45 Min",   price: 150, pts: 200, vendorId: "salem-rr-biryani" },
    { cat: "Clothing",     name: "Galaxy Style",     sub: "Fashion & Apparel",    duration: "2 Days",   price: 200, pts: 300, vendorId: "galaxy-style" },
    { cat: "Groceries",    name: "Fresh Basket",     sub: "Daily Essentials",     duration: "30 Min",   price: 50,  pts: 75,  vendorId: "fresh-basket" },
    { cat: "Medical",      name: "MediCare Plus",    sub: "Healthcare Services",  duration: "Same Day", price: 80,  pts: 100, vendorId: "medicare-plus" },
    { cat: "Cosmetics",    name: "Glow Studio",      sub: "Beauty & Skin Care",   duration: "Full Day", price: 120, pts: 180, vendorId: "glow-studio" },
  ];
  const t        = cats[i % cats.length];
  const imgPool  = CAT_IMAGES[t.cat];
  const image    = imgPool[i % imgPool.length];
  const badgeIdx = i % 7 === 0 ? 0 : i % 5 === 0 ? 1 : i % 9 === 0 ? 2 : i % 11 === 0 ? 3 : i % 6 === 0 ? 4 : -1;
  return {
    id: i + 1, title: t.name, number: `#${String(i + 1).padStart(3, "0")}`,
    provider: t.sub, category: t.cat, vendorId: t.vendorId,
    rating: +(4.3 + Math.random() * 0.7).toFixed(1),
    duration: t.duration, price: t.price + (i % 4) * 10, pts: t.pts,
    distance: `${(0.5 + (i % 10) * 0.4).toFixed(1)} km`,
    badge: badgeIdx >= 0 ? BADGE_STYLES[badgeIdx] : null, image, reviews: 80 + i * 3,
  };
});

export const ITEMS_PER_PAGE = 10; 
export const VENDORS = {
  "orange-mobiles": {
    id: "orange-mobiles", name: "Orange Mobiles", logoColor: "#FF6B00", logo: "🟠",
    verified: true, since: "2025", category: "Electronics", subCategory: "Mobile, Accessories, Speakers",
    rating: 4.7, reviews: 1024, delivery: "Delivery/Self-Pickup",
    phone: "+91-9787176868", email: "Planet4uofficial@Gmail.Com",
    address: "Nagamanicken Palayam Road, Coimbatore - 641016",
    banners: [
      { gradient: "linear-gradient(135deg, #0a0a2e 0%, #1a1a6e 40%, #0d47a1 100%)", title: "PRODUCTS ELECTRONICS", subtitle: "50% discount", badge: "BEST PRICES", accent: "#00d4ff", emoji: "📱" },
      { gradient: "linear-gradient(135deg, #1a0a2e 0%, #4a1a8e 40%, #7b1fa2 100%)", title: "SMART GADGETS",        subtitle: "40% discount", badge: "NEW ARRIVAL", accent: "#ff6bff", emoji: "⌚" },
      { gradient: "linear-gradient(135deg, #0a1a2e 0%, #0d2b5e 40%, #0a3d62 100%)", title: "ACCESSORIES SALE",     subtitle: "60% discount", badge: "HOT DEALS",   accent: "#00ffb3", emoji: "🎧" },
    ],
    tabs: ["All Product", "Mobile", "Smart Watch", "Accessories", "Tablets", "House Needs"],
    tabCounts: [51, 20, 34, 44, 34, 44],
    products: [
      { id: 1, name: "Apple iPhone 17",         color: "Green",  price: 102900, originalPrice: 115000, rating: 4.8, reviews: 1024, sizes: ["128GB","214GB","512GB"],        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80", badge: "New Arrival", badgeColor: "#10b981" },
      { id: 2, name: "Samsung Galaxy S25",       color: "Gen",    price: 89900,  originalPrice: 99000,  rating: 4.8, reviews: 1024, sizes: ["12/256GB","12/512GB","12/1TB"], image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&q=80", badge: "Save 10%",   badgeColor: "#3b82f6" },
      { id: 3, name: "Noise Two Wireless",       color: "Blue",   price: 3499,   originalPrice: 4999,   rating: 4.8, reviews: 1024,                                          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", badge: "New Arrival", badgeColor: "#10b981" },
      { id: 4, name: "Noise Two Wireless",       color: "Black",  price: 3499,   originalPrice: 4999,   rating: 4.8, reviews: 1024,                                          image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400&q=80", badge: "New Arrival", badgeColor: "#10b981" },
      { id: 5, name: "Boat Storm Infinity Plus", color: "Gen",    price: 4999,   originalPrice: 6999,   rating: 4.8, reviews: 1024,                                          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", badge: "New Arrival", badgeColor: "#10b981" },
      { id: 6, name: "Samsung Galaxy S25",       color: "Violet", price: 89900,  originalPrice: 99000,  rating: 4.8, reviews: 1024, sizes: ["12/256GB","12/512GB"],          image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&q=80", badge: "Save 10%",   badgeColor: "#3b82f6" },
      { id: 7, name: 'LG Smart LED TV 43"',      color: "Black",  price: 32900,  originalPrice: 42000,  rating: 4.8, reviews: 1024, sizes: ["32in","43 Inch","47in"],        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: "New Arrival", badgeColor: "#10b981" },
      { id: 8, name: "Noise Two Wireless",       color: "White",  price: 3499,   originalPrice: 4999,   rating: 4.8, reviews: 1024,                                          image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80", badge: "New Arrival", badgeColor: "#10b981" },
    ],
  },
  "salem-rr-biryani": {
    id: "salem-rr-biryani", name: "Salem RR Biryani", logoColor: "#e65100", logo: "🍛",
    verified: true, since: "2020", category: "Restaurants", subCategory: "Food & Beverages",
    rating: 4.9, reviews: 3200, delivery: "Home Delivery",
    phone: "+91-9876543210", email: "salemrr@gmail.com", address: "Main Road, Salem - 636001",
    banners: [
      { gradient: "linear-gradient(135deg, #1a0500 0%, #5d1a00 40%, #bf360c 100%)", title: "AUTHENTIC BIRYANI", subtitle: "Order Now",         badge: "CHEF SPECIAL", accent: "#ffab40", emoji: "🍛" },
      { gradient: "linear-gradient(135deg, #1b0000 0%, #4e0a0a 40%, #b71c1c 100%)", title: "FAMILY FEAST",     subtitle: "30% off on combos", badge: "HOT DEAL",     accent: "#ff6b6b", emoji: "🔥" },
    ],
    tabs: ["All", "Biryani", "Starters", "Curries", "Breads", "Desserts"],
    tabCounts: [48, 12, 8, 14, 6, 8],
    products: [
      { id: 1, name: "Chicken Biryani", color: "Regular", price: 220, originalPrice: 260, rating: 4.9, reviews: 890,  image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&q=80", badge: "Best Seller",  badgeColor: "#f59e0b" },
      { id: 2, name: "Mutton Biryani",  color: "Large",   price: 320, originalPrice: 380, rating: 4.8, reviews: 640,  image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80", badge: "Chef Special", badgeColor: "#ef4444" },
      { id: 3, name: "Paneer Biryani",  color: "Regular", price: 180, originalPrice: 210, rating: 4.7, reviews: 420,  image: "https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&q=80", badge: "Veg",          badgeColor: "#10b981" },
      { id: 4, name: "Chicken 65",      color: "Half",    price: 160, originalPrice: 190, rating: 4.8, reviews: 510,  image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&q=80", badge: "Popular",      badgeColor: "#f97316" },
      { id: 5, name: "Prawn Biryani",   color: "Regular", price: 380, originalPrice: 450, rating: 4.9, reviews: 320,  image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80", badge: "Special",      badgeColor: "#8b5cf6" },
      { id: 6, name: "Veg Biryani",     color: "Regular", price: 150, originalPrice: 180, rating: 4.6, reviews: 280,  image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80", badge: "Veg",          badgeColor: "#10b981" },
    ],
  },
  "galaxy-style": {
    id: "galaxy-style", name: "Galaxy Style", logoColor: "#7c3aed", logo: "👗",
    verified: true, since: "2022", category: "Clothing", subCategory: "Fashion & Apparel",
    rating: 4.6, reviews: 2100, delivery: "2 Days Delivery",
    phone: "+91-9123456789", email: "galaxy@style.com", address: "Fashion Street, Chennai - 600001",
    banners: [
      { gradient: "linear-gradient(135deg, #0d0014 0%, #2d0057 40%, #4a0080 100%)", title: "FASHION COLLECTION", subtitle: "Up to 50% Off", badge: "NEW SEASON", accent: "#e879f9", emoji: "👗" },
      { gradient: "linear-gradient(135deg, #0a0a14 0%, #1a1050 40%, #2d1b69 100%)", title: "TRENDY STYLES",      subtitle: "Free delivery",  badge: "TRENDING",   accent: "#818cf8", emoji: "✨" },
    ],
    tabs: ["All", "Men", "Women", "Kids", "Ethnic", "Western"],
    tabCounts: [120, 45, 52, 15, 28, 30],
    products: [
      { id: 1, name: "Cotton Kurta Set", color: "Blue",      price: 899,  originalPrice: 1200, rating: 4.7, reviews: 340, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80", badge: "New Arrival", badgeColor: "#10b981" },
      { id: 2, name: "Slim Fit Jeans",   color: "Dark Blue", price: 1299, originalPrice: 1800, rating: 4.6, reviews: 520, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", badge: "Trending",    badgeColor: "#ec4899" },
      { id: 3, name: "Floral Dress",     color: "Multi",     price: 799,  originalPrice: 1100, rating: 4.8, reviews: 290, image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80", badge: "Popular",     badgeColor: "#f97316" },
      { id: 4, name: "Men Polo Shirt",   color: "White",     price: 599,  originalPrice: 850,  rating: 4.5, reviews: 410, image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80", badge: "Save 30%",    badgeColor: "#3b82f6" },
      { id: 5, name: "Ethnic Saree",     color: "Red",       price: 2499, originalPrice: 3500, rating: 4.9, reviews: 180, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80", badge: "Premium",     badgeColor: "#8b5cf6" },
    ],
  },
  "fresh-basket": {
    id: "fresh-basket", name: "Fresh Basket", logoColor: "#16a34a", logo: "🧺",
    verified: true, since: "2021", category: "Groceries", subCategory: "Daily Essentials",
    rating: 4.5, reviews: 890, delivery: "30 Min Delivery",
    phone: "+91-9988776655", email: "freshbasket@shop.com", address: "Market Road, Coimbatore - 641001",
    banners: [
      { gradient: "linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 100%)", title: "FRESH GROCERIES", subtitle: "Daily Essentials",  badge: "30 MIN",  accent: "#4ade80", emoji: "🥦" },
      { gradient: "linear-gradient(135deg, #0a1f0a 0%, #1a3d1a 40%, #22543d 100%)", title: "FARM FRESH",      subtitle: "Direct from Farm", badge: "ORGANIC", accent: "#86efac", emoji: "🥕" },
    ],
    tabs: ["All", "Vegetables", "Fruits", "Dairy", "Grains", "Snacks"],
    tabCounts: [80, 22, 18, 12, 16, 12],
    products: [
      { id: 1, name: "Fresh Tomatoes 1kg",  color: "Red",    price: 40,  originalPrice: 60,  rating: 4.5, reviews: 220, image: "https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=400&q=80", badge: "Fresh",    badgeColor: "#10b981" },
      { id: 2, name: "Basmati Rice 5kg",    color: "White",  price: 320, originalPrice: 380, rating: 4.7, reviews: 340, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", badge: "Popular",  badgeColor: "#f97316" },
      { id: 3, name: "Amul Butter 500g",    color: "Yellow", price: 280, originalPrice: 310, rating: 4.8, reviews: 450, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80", badge: "Best Buy", badgeColor: "#f59e0b" },
      { id: 4, name: "Mixed Fruits Basket", color: "Multi",  price: 199, originalPrice: 250, rating: 4.6, reviews: 180, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80", badge: "Fresh",    badgeColor: "#10b981" },
    ],
  },
  "medicare-plus": {
    id: "medicare-plus", name: "MediCare Plus", logoColor: "#dc2626", logo: "🏥",
    verified: true, since: "2019", category: "Medical", subCategory: "Healthcare Services",
    rating: 4.8, reviews: 560, delivery: "Same Day Delivery",
    phone: "+91-9871234567", email: "medicare@health.com", address: "Hospital Road, Coimbatore - 641018",
    banners: [
      { gradient: "linear-gradient(135deg, #0f0000 0%, #3b0000 40%, #7f1d1d 100%)", title: "YOUR HEALTH PARTNER", subtitle: "Trusted Medicines",  badge: "CERTIFIED", accent: "#f87171", emoji: "💊" },
      { gradient: "linear-gradient(135deg, #000a14 0%, #001f3f 40%, #0c4a6e 100%)", title: "MEDICAL SUPPLIES",    subtitle: "Same Day Delivery", badge: "24/7",      accent: "#38bdf8", emoji: "🩺" },
    ],
    tabs: ["All", "Medicines", "Supplements", "Devices", "Personal Care", "Baby Care"],
    tabCounts: [60, 25, 12, 8, 10, 5],
    products: [
      { id: 1, name: "Vitamin C 1000mg",     color: "Orange", price: 299,  originalPrice: 399,  rating: 4.8, reviews: 340, image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80", badge: "Best Seller", badgeColor: "#f59e0b" },
      { id: 2, name: "BP Monitor Digital",   color: "White",  price: 1499, originalPrice: 2000, rating: 4.9, reviews: 180, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80", badge: "Certified",   badgeColor: "#10b981" },
      { id: 3, name: "Paracetamol 500mg",    color: "White",  price: 25,   originalPrice: 35,   rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=80", badge: "Essential",   badgeColor: "#3b82f6" },
      { id: 4, name: "Hand Sanitizer 500ml", color: "Clear",  price: 120,  originalPrice: 160,  rating: 4.6, reviews: 420, image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&q=80", badge: "Popular",     badgeColor: "#f97316" },
    ],
  },
  "glow-studio": {
    id: "glow-studio", name: "Glow Studio", logoColor: "#db2777", logo: "✨",
    verified: true, since: "2023", category: "Cosmetics", subCategory: "Beauty & Skin Care",
    rating: 4.7, reviews: 1340, delivery: "Full Day Delivery",
    phone: "+91-9765432100", email: "glow@studio.in", address: "Beauty Lane, Chennai - 600002",
    banners: [
      { gradient: "linear-gradient(135deg, #1a0010 0%, #4a0030 40%, #831843 100%)", title: "GLOW COLLECTION", subtitle: "Beauty Essentials", badge: "LUXURY",  accent: "#f9a8d4", emoji: "💄" },
      { gradient: "linear-gradient(135deg, #12000a 0%, #3b0020 40%, #701a47 100%)", title: "SKINCARE RANGE",  subtitle: "Natural & Organic",  badge: "NATURAL", accent: "#fda4af", emoji: "🌸" },
    ],
    tabs: ["All", "Skincare", "Makeup", "Haircare", "Fragrances", "Tools"],
    tabCounts: [95, 28, 32, 18, 10, 7],
    products: [
      { id: 1, name: "Rose Face Serum 30ml",  color: "Pink",   price: 899, originalPrice: 1200, rating: 4.8, reviews: 340, image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80", badge: "Best Seller", badgeColor: "#ec4899" },
      { id: 2, name: "Matte Lipstick Set",    color: "Red",    price: 599, originalPrice: 899,  rating: 4.7, reviews: 520, image: "https://images.unsplash.com/photo-1586495777744-4e6232bf4e2f?w=400&q=80", badge: "Trending",    badgeColor: "#f43f5e" },
      { id: 3, name: "Vitamin C Face Wash",   color: "Yellow", price: 349, originalPrice: 499,  rating: 4.6, reviews: 280, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80", badge: "Natural",     badgeColor: "#10b981" },
      { id: 4, name: "Hair Growth Oil 100ml", color: "Brown",  price: 449, originalPrice: 650,  rating: 4.9, reviews: 410, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80", badge: "Popular",     badgeColor: "#f97316" },
      { id: 5, name: "Compact Powder",        color: "Beige",  price: 299, originalPrice: 420,  rating: 4.5, reviews: 190, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", badge: "New",         badgeColor: "#8b5cf6" },
    ],
  },
};