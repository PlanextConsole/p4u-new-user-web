export interface Badge  { label: string; bg: string }
export interface Color  { name: string; hex: string }

export interface Product {
  id:            number;
  name:          string;
  brand:         string;
  price:         number;
  originalPrice?: number;
  rating:        number;
  reviews:       number;
  badge?:        string;
  image:         string;
  description:   string;
  duration:      string;
  category:      string;
}

export interface BannerSlide {
  gradient:   string;
  accent:     string;
  title:      string;
  subtitle:   string;
  handle:     string;
  badgeText:  string;
  icon:       string;
}

export interface Vendor {
  id:           string;
  name:         string;
  logo:         string;
  logoColor:    string;
  verified:     boolean;
  since:        string;
  category:     string;
  subCategory:  string;
  delivery:     string;
  rating:       number;
  totalRatings: number;
  phone:        string;
  email:        string;
  address:      string;
  description:  string;
  openHours:    string;
  distance:     string;
  banners:      BannerSlide[];
  tabs:         string[];
  products:     Product[];
}

export interface Seller {
  id:          number;
  title:       string;
  image:       string;
  provider:    string;
  description: string;
  rating:      number;
  price:       number;
  duration:    string;
  distance:    string;
  category:    string;
  badge:       Badge | null;
  hasOffer:    boolean;
  vendorId:    string;
}
 
export const TEAL      = "#0d9488";
export const TEAL_GRAD = "linear-gradient(135deg,#0d9488,#059669)";
export const TEAL_DARK = "radial-gradient(ellipse at 60% 25%,#1a4a3a 0%,#0E221F 55%,#081812 100%)";
export const CATS      = ["Plumbing","Electrical","Event Management","Cleaning","Repair","Saloon"];
 
const PRODUCT_IMGS = [
  "https://images.unsplash.com/photo-1621905251918-d87c1a8b8856?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&auto=format", 
"https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop&auto=format",
"https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&auto=format",
];

const VENDOR_IMGS = [
  "https://images.unsplash.com/photo-1621905251918-d87c1a8b8856?w=600&h=360&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=360&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=360&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=360&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=360&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&h=360&fit=crop&auto=format", 
"https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=360&fit=crop&auto=format",
"https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=360&fit=crop&auto=format",
];

function makeProducts(count: number): Product[] {
  const names = ["Switch/Socket repair & replacement","Fan Installation","Light Fitting","Wiring Work","DB Box Repair","MCB Replacement","Earthing Work","Inverter Setup","CCTV Installation","AC Service"];
  return Array.from({ length: count }, (_, i): Product => ({
    id:            i + 1,
    name:          names[i % names.length],
    brand:         ["Havells","Legrand","Anchor","Schneider","Philips"][i % 5],
    price:         [499,799,649,999,349,599,449,1199,899,749][i % 10],
    originalPrice: [699,999,899,1299,499,799,649,1499,1199,999][i % 10],
    rating:        +(4.2 + (i % 5) * 0.1).toFixed(1),
    reviews:       [24,18,36,12,42,8,29,55,17,33][i % 10],
    badge:         i % 4 === 0 ? "Best Seller" : i % 7 === 0 ? "New" : undefined,
    image:         PRODUCT_IMGS[i % PRODUCT_IMGS.length],
    description:   `Professional ${names[i % names.length]} service with warranty. Starts at ₹${[49,79,99][i%3]}.`,
    duration:      ["20 mins","30 mins","1 hour","2 hours"][i % 4],
    category:      names[i % names.length],
  }));
}
 
export const VENDORS: Record<string, Vendor> = {
  v1: {
    id:"v1", name:"Vijaya Electrical & Plumbing", logo:"⚡", logoColor:"#1e40af",
    verified:true, since:"2021", category:"Electrical", subCategory:"Plumbing",
    delivery:"30 mins", rating:4.7, totalRatings:128,
    phone:"+91-77877174848", email:"PlumbersHub@Gmail.Com",
    address:"Nagercoil Telecom Road, Nagercoil Puducherry - 641016",
    description:"Buy And Sell Everything From Used Electronics To Electrical Components. We provide quick fixes for all your electrical and plumbing needs.",
    openHours:"Open 9:00 – 10:00PM", distance:"1.5 km",
    banners:[
      { gradient:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1e40af 100%)", accent:"#60a5fa", title:"PRODUCTS\nELECTRONICS", subtitle:"50% discount", handle:"@vijayaelectrical", badgeText:"BEST PRICE", icon:"💻" },
      { gradient:"linear-gradient(135deg,#0f172a 0%,#1a3a2a 60%,#0d9488 100%)", accent:"#34d399", title:"ELECTRICAL\nSERVICES", subtitle:"Book now & save", handle:"@vijayaelectrical", badgeText:"HOT DEAL", icon:"⚡" },
      { gradient:"linear-gradient(135deg,#1a0533 0%,#2d1b69 60%,#7c3aed 100%)", accent:"#a78bfa", title:"PREMIUM\nINSTALLATION", subtitle:"Expert technicians", handle:"@vijayaelectrical", badgeText:"TOP RATED", icon:"🔌" },
    ],
    tabs:["Services","About","Gallery"],
    products: makeProducts(12),
  },
  v2: {
    id:"v2", name:"Selvam Plumbing Works", logo:"🔧", logoColor:"#0d9488",
    verified:true, since:"2019", category:"Plumbing", subCategory:"Sanitary",
    delivery:"45 mins", rating:4.8, totalRatings:96,
    phone:"+91-9876543210", email:"selvam@plumbing.com",
    address:"Anna Nagar, Chennai - 600040",
    description:"Expert plumbing solutions for residential and commercial properties. Quick response, quality materials, guaranteed work.",
    openHours:"Open 8:00 – 9:00PM", distance:"2.2 km",
    banners:[
      { gradient:"linear-gradient(135deg,#0f2027 0%,#0d2a1f 60%,#0d9488 100%)", accent:"#34d399", title:"PLUMBING\nSERVICES", subtitle:"Best prices guaranteed", handle:"@selvamplumbingworks", badgeText:"BEST PRICE", icon:"💻" },
      { gradient:"linear-gradient(135deg,#0f1722 0%,#0a2233 60%,#0369a1 100%)", accent:"#38bdf8", title:"PIPE\nREPAIRS", subtitle:"Same day service", handle:"@selvamplumbingworks", badgeText:"FAST SERVICE", icon:"🔧" },
      { gradient:"linear-gradient(135deg,#1a0f0f 0%,#2d1515 60%,#b91c1c 100%)", accent:"#fca5a5", title:"EMERGENCY\nFIXES", subtitle:"24/7 available", handle:"@selvamplumbingworks", badgeText:"24/7", icon:"🚨" },
    ],
    tabs:["Services","About","Gallery"],
    products: makeProducts(10),
  },
};
 
const BADGES: (Badge|null)[] = [
  { label:"New Arrival", bg:"#0d9488" },
  { label:"Hot Deal",    bg:"#ef4444" },
  { label:"Top Rated",  bg:"#f59e0b" },
  null, null, null, null,
];

export const SELLERS: Seller[] = [
  { id:1, title:"Vijaya Electrical & Plumbing", image:VENDOR_IMGS[0], provider:"Electrical Services", description:"Quick fixes for leaks, clogs, and electrical needs at your doorstep", rating:4.7, price:49, duration:"30 mins", distance:"1.5 km", category:"Electrical", badge:{ label:"Top Rated", bg:"#f59e0b" }, hasOffer:true, vendorId:"v1" },
  { id:2, title:"Selvam Plumbing Works",         image:VENDOR_IMGS[1], provider:"Plumbing Services",   description:"Quick fixes for leaks, clogs, and pipe repairs", rating:4.8, price:49, duration:"45 mins", distance:"2.2 km", category:"Plumbing",   badge:{ label:"New Arrival", bg:"#0d9488" }, hasOffer:false, vendorId:"v2" },
  ...Array.from({ length: 16 }, (_, i): Seller => ({
    id:          i + 3,
    title:       ["AC Repair & Maintenance","CleanPro Home Care","TimberCraft Carpentry","GreenLeaf Gardening","SwiftFix Electricals","RapidClean Services","ProFix Solutions","HomeCare Experts","CoolAir HVAC","BrightSpark Electric","DrainMaster Plumbing","PaintPro Services","LockMaster Security","AquaFlow Solutions","GreenGarden Pro","SpeedFix Mobile"][i],
    image:       VENDOR_IMGS[i % VENDOR_IMGS.length],
    provider:    ["Cool Air Experts","HomeCare Services","Wood Experts","Garden Pro","Electrical Experts","Cleaning Hub","Fix It All","Home Services","HVAC Solutions","Electrical Co","Plumbing Hub","Painting Pro","Security Pro","Water Solutions","Garden Services","Mobile Repair"][i],
    description: "Professional service with guaranteed quality and quick response time.",
    rating:      +(4.1 + (i % 8) * 0.1).toFixed(1),
    price:       [49,79,99,149,199,249,59,89][i % 8],
    duration:    ["30 mins","1-2 hours","2-3 hours","Full day"][i % 4],
    distance:    `${(0.5 + (i * 0.4) % 6).toFixed(1)} km`,
    category:    CATS[i % CATS.length],
    badge:       BADGES[i % BADGES.length],
    hasOffer:    i % 3 === 0,
    vendorId:    i % 2 === 0 ? "v1" : "v2",
  })),
];
    
export const RATING_OPTS = [{ label:"4★ & above", min:4.0 },{ label:"3★ & above", min:3.0 },{ label:"2★ & above", min:2.0 }];
export const REVIEW_OPTS = ["Excellent","Very Good","Good","Average"];
export const OFFER_OPTS  = ["Deals of the Day","Limited Offers","Seasonal Sale"];
export const SORT_OPTS   = [{ label:"Price — Low to High", val:"low" },{ label:"Price — High to Low", val:"high" },{ label:"Newest", val:"newest" }];
export const PER_PAGE    = 12;