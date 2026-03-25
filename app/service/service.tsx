import { useState, useMemo, useRef, useEffect, ReactNode } from "react";

interface Badge { label: string; bg: string }
interface Color { name: string; hex: string }
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
  description: string;
  duration: string;
  category: string;
  colors?: Color[];
}
interface Vendor {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  verified: boolean;
  since: string;
  category: string;
  subCategory: string;
  delivery: string;
  rating: number;
  totalRatings: number;
  phone: string;
  email: string;
  address: string;
  description: string;
  openHours: string;
  distance: string;
  bannerGradient: string;
  bannerAccent: string;
  bannerTitle: string;
  bannerSubtitle: string;
  tabs: string[];
  products: Product[];
  badge?: Badge | null;
  hasOffer: boolean;
}
interface Seller {
  id: number;
  title: string;
  image: string;
  provider: string;
  description: string;
  rating: number;
  price: number;
  duration: string;
  distance: string;
  category: string;
  badge: Badge | null;
  hasOffer: boolean;
  vendorId: string;
} 
const ICon = {
  Star:     ({ fill="#f59e0b", size=13 }: { fill?: string; size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  MapPin:   () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock:    () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Search:   ({ color="white" }: { color?: string }) => <svg width="14" height="14" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ChevDown: ({ open }: { open: boolean }) => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}><polyline points="6 9 12 15 18 9"/></svg>,
  ChevLeft: ({ size=16, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevRight:({ size=16, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  X:        ({ size=10 }: { size?: number }) => <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Filter:   () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Phone:    () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  Mail:     () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Check:    () => <svg width="16" height="16" fill="#10b981" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#10b981" strokeWidth="2" fill="none"/><polyline points="22 4 12 14.01 9 11.01" stroke="#10b981" strokeWidth="2" fill="none"/></svg>,
  Plus:     () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus:    () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Heart:    ({ filled }: { filled: boolean }) => <svg width="14" height="14" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "#9ca3af"} strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Tag:      () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Zap:      () => <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Gallery:  () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Info:     () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};
 
const TEAL      = "#0d9488";
const TEAL_GRAD = "linear-gradient(135deg,#0d9488,#059669)";
const TEAL_DARK = "radial-gradient(ellipse at 60% 25%, #1a4a3a 0%, #0E221F 55%, #081812 100%)";

const CATS = ["Plumbing","Electrical","Event Management","Cleaning","Repair","Saloon"];

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
];

const VENDOR_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=300&fit=crop",
  "https://images.unsplash.com/photo-1534131707946-e4a053c9ef2a?w=600&h=300&fit=crop", 
"https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=360&fit=crop&auto=format",
"https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=360&fit=crop&auto=format",
];

function makeProducts(vendorName: string, count: number): Product[] {
  const names = ["Switch/Socket repair & replacement","Fan Installation","Light Fitting","Wiring Work","DB Box Repair","MCB Replacement","Earthing Work","Inverter Setup","CCTV Installation","AC Service"];
  return Array.from({ length: count }, (_, i): Product => ({
    id:           i + 1,
    name:         names[i % names.length],
    brand:        ["Havells","Legrand","Anchor","Schneider","Philips"][i % 5],
    price:        [499, 799, 649, 999, 349, 599, 449, 1199, 899, 749][i % 10],
    originalPrice:[699, 999, 899, 1299, 499, 799, 649, 1499, 1199, 999][i % 10],
    rating:       +(4.2 + (i % 5) * 0.1).toFixed(1),
    reviews:      [24, 18, 36, 12, 42, 8, 29, 55, 17, 33][i % 10],
    badge:        i % 4 === 0 ? "Best Seller" : i % 7 === 0 ? "New" : undefined,
    image:        PRODUCT_IMAGES[i % PRODUCT_IMAGES.length],
    description:  `Professional ${names[i % names.length]} service with warranty. Starts at ₹${[49,79,99][i%3]}. ${["20mins","30mins","1hr"][i%3]} response time.`,
    duration:     ["20 mins","30 mins","1 hour","2 hours"][i % 4],
    category:     vendorName,
  }));
}

const VENDORS: Record<string, Vendor> = {
  "v1": {
    id:"v1", name:"Vijaya Electrical & Plumbing", logo:"⚡", logoColor:"#1e40af",
    verified:true, since:"2021", category:"Electrical", subCategory:"Plumbing",
    delivery:"30 mins", rating:4.7, totalRatings:128,
    phone:"+91-77877174848", email:"PlumbersHub@Gmail.Com",
    address:"Nagercoil Telecom Road, Nagercoil Puducherry - 641016",
    description:"Buy And Sell Everything From Used Electronics To Electrical Components. We provide quick fixes for all your electrical and plumbing needs. Highly professional team with guaranteed quality service.",
    openHours:"Open 9:00 – 10:00PM", distance:"1.5 km",
    bannerGradient:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1e40af 100%)",
    bannerAccent:"#60a5fa",
    bannerTitle:"PRODUCTS\nELECTRONICS",
    bannerSubtitle:"50% discount",
    tabs:["Services","About","Gallery"],
    products: makeProducts("Vijaya Electrical & Plumbing", 12),
    badge:{ label:"Top Rated", bg:"#f59e0b" }, hasOffer:true,
  },
  "v2": {
    id:"v2", name:"Selvam Plumbing Works", logo:"🔧", logoColor:"#0d9488",
    verified:true, since:"2019", category:"Plumbing", subCategory:"Sanitary",
    delivery:"45 mins", rating:4.8, totalRatings:96,
    phone:"+91-9876543210", email:"selvam@plumbing.com",
    address:"Anna Nagar, Chennai - 600040",
    description:"Expert plumbing solutions for residential and commercial properties. Quick response, quality materials, guaranteed work.",
    openHours:"Open 8:00 – 9:00PM", distance:"2.2 km",
    bannerGradient:"linear-gradient(135deg,#0f2027 0%,#203a43 50%,#0d9488 100%)",
    bannerAccent:"#34d399",
    bannerTitle:"PLUMBING\nSERVICES",
    bannerSubtitle:"Best prices guaranteed",
    tabs:["Services","About","Gallery"],
    products: makeProducts("Selvam Plumbing", 10),
    badge:{ label:"New Arrival", bg:"#0d9488" }, hasOffer:false,
  },
};

// Generate sellers list
const SELLERS: Seller[] = [
  { id:1, title:"Vijaya Electrical & Plumbing", image:VENDOR_IMAGES[0], provider:"Electrical Services", description:"Quick fixes for leaks, clogs, and more at your doorstep", rating:4.7, price:49, duration:"30 mins", distance:"1.5 km", category:"Electrical", badge:{ label:"Top Rated", bg:"#f59e0b" }, hasOffer:true, vendorId:"v1" },
  { id:2, title:"Selvam Plumbing Works", image:VENDOR_IMAGES[1], provider:"Plumbing Services", description:"Quick fixes for leaks, clogs, and pipe repairs", rating:4.8, price:49, duration:"45 mins", distance:"2.2 km", category:"Plumbing", badge:{ label:"New Arrival", bg:"#0d9488" }, hasOffer:false, vendorId:"v2" },
  ...Array.from({ length: 16 }, (_, i): Seller => ({
    id: i + 3,
    title: ["AC Repair & Maintenance","CleanPro Home Care","TimberCraft Carpentry","GreenLeaf Gardening","SwiftFix Electricals","RapidClean Services","ProFix Solutions","HomeCare Experts","CoolAir HVAC","BrightSpark Electric","DrainMaster Plumbing","PaintPro Services","LockMaster Security","AquaFlow Solutions","GreenGarden Pro","SpeedFix Mobile"][i],
    image: VENDOR_IMAGES[i % VENDOR_IMAGES.length],
    provider: ["Cool Air Experts","HomeCare Services","Wood Experts","Garden Pro","Electrical Experts","Cleaning Hub","Fix It All","Home Services","HVAC Solutions","Electrical Co","Plumbing Hub","Painting Pro","Security Pro","Water Solutions","Garden Services","Mobile Repair"][i],
    description: "Professional service with guaranteed quality and quick response time.",
    rating: +(4.1 + (i % 8) * 0.1).toFixed(1),
    price: [49,79,99,149,199,249,59,89][i % 8],
    duration: ["30 mins","1-2 hours","2-3 hours","Full day"][i % 4],
    distance: `${(0.5 + (i * 0.4) % 6).toFixed(1)} km`,
    category: CATS[i % CATS.length],
    badge: i % 5 === 0 ? { label:"Hot Deal", bg:"#ef4444" } : i % 7 === 0 ? { label:"New Arrival", bg:"#0d9488" } : null,
    hasOffer: i % 3 === 0,
    vendorId: i % 2 === 0 ? "v1" : "v2",
  }))
];

const PER_PAGE = 12;
const RATING_OPTS = [{ label:"4★ & above", min:4.0 },{ label:"3★ & above", min:3.0 },{ label:"2★ & above", min:2.0 }];
const REVIEW_OPTS = ["Excellent","Very Good","Good","Average"];
const OFFER_OPTS  = ["Deals of the Day","Limited Offers","Seasonal Sale"];
const SORT_OPTS   = [{ label:"Price — Low to High", val:"low" },{ label:"Price — High to Low", val:"high" },{ label:"Newest", val:"newest" }];

 
function Checkbox({ checked, onChange, accent=TEAL }: { checked:boolean; onChange:()=>void; accent?:string }) {
  return (
    <div onClick={onChange} style={{ width:15,height:15,borderRadius:3,border:`2px solid ${checked?accent:"#d1d5db"}`,background:checked?accent:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",transition:"all .15s" }}>
      {checked && <svg width="8" height="8" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

function Accordion({ label, isOpen, toggle, children }: { label:string; isOpen:boolean; toggle:()=>void; children:ReactNode }) {
  return (
    <div style={{ borderTop:"1px solid #f0f0f0" }}>
      <button onClick={toggle} style={{ width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:"transparent",border:"none",cursor:"pointer" }}>
        <span style={{ fontSize:12,fontWeight:700,color:"#374151",letterSpacing:"0.05em",textTransform:"uppercase" }}>{label}</span>
        <ICon.ChevDown open={isOpen} />
      </button>
      {isOpen && <div style={{ padding:"2px 14px 12px",display:"flex",flexDirection:"column",gap:9 }}>{children}</div>}
    </div>
  );
}
 
function ServiceCard({ service, onClick }: { service:Seller; onClick:()=>void }) {
  const [fav,setFav] = useState(false);
  return (
    <div style={{ background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.09)",cursor:"pointer",transition:"transform .22s,box-shadow .22s",display:"flex",flexDirection:"column" }}
      onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.transform="scale(1.02)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 10px 30px rgba(0,0,0,0.15)"; }}
      onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.transform="scale(1)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 2px 12px rgba(0,0,0,0.09)"; }}
      onClick={onClick}
    >
      <div style={{ position:"relative",height:180,background:"#e5e7eb",flexShrink:0 }}>
        <img src={service.image} alt={service.title} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
        {service.badge && <div style={{ position:"absolute",top:10,left:10,background:service.badge.bg,color:"#fff",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,border:"2px solid rgba(255,255,255,0.65)",backdropFilter:"blur(4px)",zIndex:2 }}>{service.badge.label}</div>}
        <div style={{ position:"absolute",bottom:10,left:10,background:"rgba(255,255,255,0.93)",backdropFilter:"blur(4px)",borderRadius:20,padding:"3px 9px",display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:"#374151" }}><ICon.MapPin/>{service.distance}</div>
        <button onClick={e=>{e.stopPropagation();setFav(f=>!f);}} style={{ position:"absolute",top:10,right:10,background:"#fff",border:"none",borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.14)" }}><ICon.Heart filled={fav}/></button>
      </div>
      <div style={{ padding:"12px 14px 14px",display:"flex",flexDirection:"column",flex:1 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5 }}>
          <h3 style={{ fontSize:13,fontWeight:700,color:"#111827",margin:0,flex:1,lineHeight:1.3 }}>{service.title}</h3>
          <div style={{ display:"flex",alignItems:"center",gap:3,marginLeft:8,flexShrink:0 }}><ICon.Star/><span style={{ fontSize:12,fontWeight:700,color:"#111827" }}>{service.rating}</span></div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:5,color:"#6b7280",fontSize:12,marginBottom:4 }}><ICon.MapPin/><span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{service.provider}</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:5,color:"#6b7280",fontSize:12,marginBottom:8 }}><ICon.Clock/><span>{service.duration}</span></div>
        <p style={{ fontSize:12,color:"#6b7280",margin:"0 0 12px",lineHeight:1.45,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{service.description}</p>
        <button style={{ width:"100%",padding:"9px 0",color:"#fff",fontSize:12,fontWeight:600,border:"none",borderRadius:10,cursor:"pointer",background:TEAL_DARK,transition:"opacity .2s",marginTop:"auto" }}
          onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity="0.85"}
          onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity="1"}
        >Book Consultant @₹{service.price}</button>
      </div>
    </div>
  );
}
 
function ServiceSidebar({ selectedCats,toggleCat,ratingFilter,toggleRating,reviewFilter,toggleReview,offerFilter,toggleOffer }:{
  selectedCats:string[]; toggleCat:(c:string)=>void;
  ratingFilter:number[]; toggleRating:(v:number)=>void;
  reviewFilter:string[]; toggleReview:(v:string)=>void;
  offerFilter:string[];  toggleOffer:(v:string)=>void;
}) {
  const [catsOpen,setCatsOpen]=useState(true);
  const [ratingOpen,setRatingOpen]=useState(false);
  const [reviewOpen,setReviewOpen]=useState(false);
  const [offersOpen,setOffersOpen]=useState(false);
  return (
    <div style={{ width:200,flexShrink:0,display:"flex",flexDirection:"column",gap:12 }}>
      <div style={{ background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.08)" }}>
        <button onClick={()=>setCatsOpen(o=>!o)} style={{ width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:TEAL_GRAD,border:"none",cursor:"pointer" }}>
          <span style={{ fontSize:12,fontWeight:700,color:"#fff",letterSpacing:"0.06em",textTransform:"uppercase" }}>Categories</span>
          <ICon.ChevDown open={catsOpen}/>
        </button>
        {catsOpen && <div style={{ padding:"6px 0" }}>{CATS.map(cat=>{const active=selectedCats.includes(cat);return(
          <div key={cat} onClick={()=>toggleCat(cat)} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 14px",cursor:"pointer",background:active?"#f0fdf4":"transparent",transition:"background .15s" }}>
            <Checkbox checked={active} onChange={()=>toggleCat(cat)} accent={TEAL}/>
            <span style={{ fontSize:12,color:active?TEAL:"#374151",fontWeight:active?600:400 }}>{cat}</span>
          </div>
        );})}</div>}
        <Accordion label="Rating" isOpen={ratingOpen} toggle={()=>setRatingOpen(o=>!o)}>
          {RATING_OPTS.map(opt=>(
            <div key={opt.label} onClick={()=>toggleRating(opt.min)} style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer" }}>
              <Checkbox checked={ratingFilter.includes(opt.min)} onChange={()=>toggleRating(opt.min)} accent="#f59e0b"/>
              <span style={{ fontSize:12,display:"flex",alignItems:"center",gap:3,color:ratingFilter.includes(opt.min)?"#b45309":"#4b5563" }}>
                {[1,2,3,4].map(n=><ICon.Star key={n} size={11} fill={n<=Math.floor(opt.min)?"#f59e0b":"#e5e7eb"}/>)}
                <span style={{ marginLeft:2 }}>{opt.label}</span>
              </span>
            </div>
          ))}
        </Accordion>
        <Accordion label="Review" isOpen={reviewOpen} toggle={()=>setReviewOpen(o=>!o)}>
          {REVIEW_OPTS.map(opt=>(
            <div key={opt} onClick={()=>toggleReview(opt)} style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer" }}>
              <Checkbox checked={reviewFilter.includes(opt)} onChange={()=>toggleReview(opt)}/>
              <span style={{ fontSize:12,color:reviewFilter.includes(opt)?TEAL:"#4b5563",fontWeight:reviewFilter.includes(opt)?600:400 }}>{opt}</span>
            </div>
          ))}
        </Accordion>
        <Accordion label="Offers" isOpen={offersOpen} toggle={()=>setOffersOpen(o=>!o)}>
          {OFFER_OPTS.map(opt=>(
            <div key={opt} onClick={()=>toggleOffer(opt)} style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer" }}>
              <Checkbox checked={offerFilter.includes(opt)} onChange={()=>toggleOffer(opt)} accent="#7c3aed"/>
              <span style={{ fontSize:12,color:offerFilter.includes(opt)?"#7c3aed":"#4b5563",fontWeight:offerFilter.includes(opt)?600:400 }}>{opt}</span>
            </div>
          ))}
        </Accordion>
      </div> 
      <div style={{ borderRadius:16,overflow:"hidden",position:"relative",background:"linear-gradient(155deg,#7c3aed 0%,#6d28d9 45%,#4c1d95 100%)",padding:"22px 18px 20px",color:"#fff",boxShadow:"0 8px 32px rgba(109,40,217,0.4)" }}>
        <div style={{ position:"absolute",top:-24,right:-24,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,0.07)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:-14,left:-18,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none" }}/>
        <p style={{ fontSize:15,fontWeight:900,color:"#fff",margin:"0 0 6px",lineHeight:1.2,position:"relative" }}>Welcome to ClassiGrids</p>
        <p style={{ fontSize:10,color:"rgba(255,255,255,0.8)",margin:"0 0 12px",lineHeight:1.55,position:"relative" }}>Buy And Sell Everything From Used Cars To Mobile Phones and Computers, Or Jobs And More.</p>
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:50,fontWeight:900,color:"#fff",lineHeight:1,letterSpacing:"-1px" }}>50%</div>
          <div style={{ fontSize:24,fontWeight:900,color:"#fff",lineHeight:1,marginBottom:14 }}>OFF</div>
        </div>
        <button style={{ padding:"9px 0",width:"100%",background:"rgba(255,255,255,0.18)",border:"2px solid rgba(255,255,255,0.5)",borderRadius:10,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer" }}>Buy Now!</button>
      </div>
    </div>
  );
}
 
function ServiceListPage({ onSelectSeller }: { onSelectSeller:(seller:Seller)=>void }) {
  const [selectedCats,setSelectedCats]=useState<string[]>(["Electrical"]);
  const [ratingFilter,setRatingFilter]=useState<number[]>([]);
  const [reviewFilter,setReviewFilter]=useState<string[]>([]);
  const [offerFilter,setOfferFilter]=useState<string[]>([]);
  const [sortBy,setSortBy]=useState("popularity");
  const [search,setSearch]=useState("");
  const [page,setPage]=useState(1);
  const [activeTopFilters,setActiveTopFilters]=useState<string[]>(["Popularity","Rating","Offers","Delivery Time"]);
  const [drawerOpen,setDrawerOpen]=useState(false);

  const mkToggleStr=(setter:React.Dispatch<React.SetStateAction<string[]>>)=>(val:string)=>{ setter(p=>p.includes(val)?p.filter(x=>x!==val):[...p,val]); setPage(1); };
  const mkToggleNum=(setter:React.Dispatch<React.SetStateAction<number[]>>)=>(val:number)=>{ setter(p=>p.includes(val)?p.filter(x=>x!==val):[...p,val]); setPage(1); };
  const toggleCat=(cat:string)=>{ setSelectedCats(p=>p.includes(cat)?p.filter(c=>c!==cat):[...p,cat]); setPage(1); };
  const toggleRating=mkToggleNum(setRatingFilter);
  const toggleReview=mkToggleStr(setReviewFilter);
  const toggleOffer=mkToggleStr(setOfferFilter);

  const filtered=useMemo(()=>{
    let d=[...SELLERS];
    if(selectedCats.length) d=d.filter(s=>selectedCats.includes(s.category));
    if(search) d=d.filter(s=>s.title.toLowerCase().includes(search.toLowerCase()));
    if(ratingFilter.length) d=d.filter(s=>ratingFilter.some(m=>s.rating>=m));
    if(offerFilter.length) d=d.filter(s=>s.hasOffer);
    if(sortBy==="low") d.sort((a,b)=>a.price-b.price);
    else if(sortBy==="high") d.sort((a,b)=>b.price-a.price);
    else if(sortBy==="newest") d.sort((a,b)=>b.id-a.id);
    else d.sort((a,b)=>b.rating-a.rating);
    return d;
  },[selectedCats,search,ratingFilter,offerFilter,sortBy]);

  const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const paginated=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const sidebarActive=[...ratingFilter.map(r=>`⭐ ${r}+`),...reviewFilter,...offerFilter.map(o=>`🏷 ${o}`)];
  const clearAll=()=>{ setActiveTopFilters([]); setSelectedCats([]); setRatingFilter([]); setReviewFilter([]); setOfferFilter([]); setPage(1); };
  const getPages=():( number|"...")[]=>{ const p:( number|"...")[]=[]; for(let i=1;i<=totalPages;i++){ if(i===1||i===totalPages||(i>=page-1&&i<=page+1))p.push(i); else if(p[p.length-1]!=="...")p.push("..."); } return p; };

  return (
    <div > 
 
      <div style={{ maxWidth:1400,margin:"0 auto",padding:"16px",display:"flex",gap:18,alignItems:"flex-start" }}>
        <div className="desktop-sidebar" style={{ position:"sticky",top:12 }}>
          <ServiceSidebar selectedCats={selectedCats} toggleCat={toggleCat} ratingFilter={ratingFilter} toggleRating={toggleRating} reviewFilter={reviewFilter} toggleReview={toggleReview} offerFilter={offerFilter} toggleOffer={toggleOffer}/>
        </div>
        {drawerOpen&&(
          <div style={{ position:"fixed",inset:0,zIndex:300 }}>
            <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.45)" }} onClick={()=>setDrawerOpen(false)}/>
            <div style={{ position:"absolute",left:0,top:0,bottom:0,width:240,background:"#f5f5f5",overflowY:"auto",padding:14,zIndex:1 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
                <span style={{ fontWeight:700 }}>Filters</span>
                <button onClick={()=>setDrawerOpen(false)} style={{ background:"none",border:"none",cursor:"pointer" }}><ICon.X size={18}/></button>
              </div>
              <ServiceSidebar selectedCats={selectedCats} toggleCat={toggleCat} ratingFilter={ratingFilter} toggleRating={toggleRating} reviewFilter={reviewFilter} toggleReview={toggleReview} offerFilter={offerFilter} toggleOffer={toggleOffer}/>
            </div>
          </div>
        )}
        <div style={{ flex:1,minWidth:0 }}> 
          <div style={{ background:"#fff",borderRadius:12,padding:"12px 16px",marginBottom:10,boxShadow:"0 1px 5px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:14,fontWeight:700,color:"#111827" }}>Plumbing</span>
                <span style={{ fontSize:12,color:"#9ca3af" }}>Showing 1–{filtered.length} of {SELLERS.length} Sellers</span>
              </div>
              <button onClick={()=>setDrawerOpen(true)} className="mobile-filter-btn" style={{ display:"none",alignItems:"center",gap:5,padding:"6px 12px",border:"1px solid #e5e7eb",borderRadius:8,background:"#fff",fontSize:12,cursor:"pointer" }}>
                <ICon.Filter/> Filters
              </button>
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,alignItems:"center" }}>
              {activeTopFilters.map(f=>(
                <span key={f} style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,border:"1px solid #e5e7eb",fontSize:12,fontWeight:500,color:"#374151",background:"#fafafa" }}>
                  {f}<button onClick={()=>setActiveTopFilters(p=>p.filter(x=>x!==f))} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",color:"#9ca3af",padding:0 }}><ICon.X/></button>
                </span>
              ))}
              {sidebarActive.map(f=><span key={f} style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:TEAL_GRAD,fontSize:11,fontWeight:600,color:"#fff" }}>{f}</span>)}
              {(activeTopFilters.length>0||sidebarActive.length>0)&&<button onClick={clearAll} style={{ fontSize:12,color:TEAL,fontWeight:600,background:"none",border:"none",cursor:"pointer" }}>Clear all filter</button>}
            </div>
          </div> 
          <div style={{ background:"#fff",borderRadius:12,padding:"10px 16px",marginBottom:14,boxShadow:"0 1px 5px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
            <span style={{ fontSize:12,fontWeight:700,color:"#374151",marginRight:6 }}>Sort By</span>
            {SORT_OPTS.map(s=>(
              <button key={s.val} onClick={()=>{ setSortBy(s.val);setPage(1); }} style={{ fontSize:12,padding:"5px 14px",borderRadius:20,border:sortBy===s.val?"none":"1px solid #e5e7eb",background:sortBy===s.val?TEAL_GRAD:"#f9fafb",color:sortBy===s.val?"#fff":"#6b7280",fontWeight:sortBy===s.val?700:400,cursor:"pointer" }}>{s.label}</button>
            ))}
          </div> 
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <h2 style={{ fontSize:18,fontWeight:800,color:"#111827",margin:0 }}>Near By Plumbing Services</h2>
            <div style={{ display:"flex",alignItems:"center",border:"1px solid #e5e7eb",borderRadius:9,overflow:"hidden",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search Services..." style={{ fontSize:12,padding:"7px 12px",border:"none",outline:"none",width:180,background:"transparent",color:"#374151" }}/>
              <button style={{ padding:"7px 12px",background:TEAL_GRAD,border:"none",cursor:"pointer",display:"flex",alignItems:"center" }}><ICon.Search/></button>
            </div>
          </div> 
          {paginated.length===0?(
            <div style={{ background:"#fff",borderRadius:16,padding:"80px 20px",textAlign:"center",color:"#9ca3af",fontSize:14 }}>No services found.</div>
          ):(
            <div className="service-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
              {paginated.map(s=><ServiceCard key={s.id} service={s} onClick={()=>onSelectSeller(s)}/>)}
            </div>
          )} 
          {totalPages>1&&(
            <div style={{ display:"flex",justifyContent:"center",gap:6,margin:"24px 0 8px" }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ width:34,height:34,borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",cursor:page===1?"not-allowed":"pointer",opacity:page===1?0.4:1,display:"flex",alignItems:"center",justifyContent:"center" }}><ICon.ChevLeft/></button>
              {getPages().map((p,idx)=>p==="..."?<span key={`d${idx}`} style={{ width:34,textAlign:"center",lineHeight:"34px",color:"#9ca3af" }}>…</span>:
                <button key={p} onClick={()=>setPage(p as number)} style={{ width:34,height:34,borderRadius:8,fontSize:12,fontWeight:600,border:page===p?"none":"1px solid #e5e7eb",background:page===p?TEAL_GRAD:"#fff",color:page===p?"#fff":"#374151",cursor:"pointer" }}>{p}</button>)}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ width:34,height:34,borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",cursor:page===totalPages?"not-allowed":"pointer",opacity:page===totalPages?0.4:1,display:"flex",alignItems:"center",justifyContent:"center" }}><ICon.ChevRight/></button>
            </div>
          )}
        </div>
      </div>
      <style>{`.desktop-sidebar{display:block}@media(max-width:900px){.desktop-sidebar{display:none!important}.mobile-filter-btn{display:flex!important}.service-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:560px){.service-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
} 
function VendorBanner({ vendor }: { vendor:Vendor }) {
  const [animating,setAnimating]=useState(false);
  const [slideOut,setSlideOut]=useState(false);

  return (
    <div style={{ position:"relative",width:"100%",height:220,borderRadius:16,overflow:"hidden",marginBottom:16 }}>
   
      <div style={{ position:"absolute",inset:0,background:vendor.bannerGradient }}/>
   
      <div style={{ position:"absolute",inset:0,opacity:0.12,backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 38px,${vendor.bannerAccent}44 38px,${vendor.bannerAccent}44 39px),repeating-linear-gradient(90deg,transparent,transparent 38px,${vendor.bannerAccent}44 38px,${vendor.bannerAccent}44 39px)` }}/>
 
      <div style={{ position:"absolute",right:"5%",top:"10%",width:"40%",height:"80%",background:`radial-gradient(circle,${vendor.bannerAccent}30 0%,transparent 70%)`,borderRadius:"50%" }}/>
 
      <div style={{ position:"absolute",right:"8%",top:"50%",transform:"translateY(-50%)",width:130,height:130,background:"rgba(255,255,255,0.08)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:60 }}>💻</div>
 
      <div style={{ position:"absolute",top:16,right:16,background:vendor.bannerAccent,color:"#fff",fontSize:11,fontWeight:800,padding:"6px 12px",borderRadius:20,letterSpacing:"0.05em",textTransform:"uppercase",boxShadow:`0 4px 16px ${vendor.bannerAccent}55` }}>BEST PRICE</div>
 
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 32px" }}>
        <div style={{ fontSize:10,color:vendor.bannerAccent,fontWeight:600,marginBottom:6,opacity:0.8 }}>@{vendor.name.toLowerCase().replace(/\s+/g,"")}</div>
        <div style={{ fontSize:32,fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:12,textTransform:"uppercase",letterSpacing:"-0.5px",textShadow:`0 0 40px ${vendor.bannerAccent}55` }}>
          {vendor.bannerTitle.split("\n").map((line,i)=><div key={i}>{line}</div>)}
        </div>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:`${vendor.bannerAccent}22`,border:`1px solid ${vendor.bannerAccent}55`,borderRadius:20,padding:"8px 18px",backdropFilter:"blur(4px)",width:"fit-content" }}>
          <ICon.Zap/>
          <span style={{ fontSize:14,fontWeight:700,color:"#fff" }}>{vendor.bannerSubtitle}</span>
        </div>
      </div>
    </div>
  );
}
 
function VendorInfoCard({ vendor }: { vendor:Vendor }) {
  return (
    <div style={{ background:"#fff",borderRadius:16,padding:"16px 20px",marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.08)",border:"1px solid #f0f0f0" }}>
      <div style={{ display:"flex",gap:16,alignItems:"flex-start" }}> 
        <div style={{ width:72,height:72,borderRadius:16,background:vendor.logoColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,boxShadow:`0 4px 16px ${vendor.logoColor}44`,border:`2px solid ${vendor.logoColor}66` }}>
          {vendor.logo}
        </div> 
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
            <h2 style={{ fontSize:18,fontWeight:700,color:"#111827",margin:0 }}>{vendor.name}</h2>
            {vendor.verified&&<ICon.Check/>}
          </div>
          <p style={{ fontSize:12,color:"#6b7280",margin:"0 0 10px",lineHeight:1.5 }}>{vendor.description}</p> 
          <div style={{ display:"flex",gap:0,alignItems:"stretch",flexWrap:"wrap" }}>
            {[
              { label:"Seller Since", value:vendor.since },
              { label:"Open Hours",   value:vendor.openHours },
              { label:"Distance",     value:vendor.distance },
              { label:"Rating",       value:null },
            ].map((item,i,arr)=>(
              <div key={item.label} style={{ display:"flex",alignItems:"stretch",paddingRight:i<arr.length-1?16:0,marginRight:i<arr.length-1?0:0 }}>
                <div>
                  <div style={{ fontSize:10,color:"#9ca3af",marginBottom:2 }}>{item.label}</div>
                  {item.value?(
                    <div style={{ fontSize:12,fontWeight:700,color:"#111827",whiteSpace:"nowrap" }}>{item.value}</div>
                  ):(
                    <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                      <ICon.Star size={12}/>
                      <span style={{ fontSize:12,fontWeight:700,color:"#111827" }}>{vendor.rating}/5</span>
                      <span style={{ fontSize:10,color:"#9ca3af" }}>({vendor.totalRatings})</span>
                    </div>
                  )}
                </div>
                {i<arr.length-1&&<div style={{ width:1,background:"#e5e7eb",margin:"0 12px",alignSelf:"stretch" }}/>}
              </div>
            ))}
          </div>
          {/* CTA */}
          <div style={{ display:"flex",gap:8,marginTop:12 }}>
            <button style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 18px",background:TEAL_GRAD,border:"none",borderRadius:20,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer" }}>
              <ICon.Phone/> Book Now @ ₹49
            </button>
          </div>
        </div> 
        <div style={{ flexShrink:0,minWidth:200,borderLeft:"1px solid #f0f0f0",paddingLeft:20 }}>
          <div style={{ fontSize:12,fontWeight:700,color:"#374151",marginBottom:10 }}>Contact Details</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,color:"#059669",fontSize:12 }}><ICon.Phone/><span style={{ color:"#374151" }}>{vendor.phone}</span></div>
            <div style={{ display:"flex",alignItems:"center",gap:8,color:"#3b82f6",fontSize:12 }}><ICon.Mail/><span style={{ color:"#374151",fontSize:11 }}>{vendor.email}</span></div>
            <div style={{ display:"flex",alignItems:"flex-start",gap:8,color:"#ef4444",fontSize:12 }}><div style={{ marginTop:1 }}><ICon.MapPin/></div><span style={{ color:"#374151",fontSize:11,lineHeight:1.4 }}>{vendor.address}</span></div>
          </div>
          <div style={{ display:"flex",gap:8,marginTop:12 }}>
            <button style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:TEAL_GRAD,border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }}><ICon.Phone/> Send Message</button>
            <button style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#3b82f6",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }}><ICon.MapPin/> Directions</button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
function VendorProductCard({ product }: { product:Product }) {
  const [qty,setQty]=useState(1);
  const [fav,setFav]=useState(false);
  const [added,setAdded]=useState(false);

  const handleAdd=(e:React.MouseEvent)=>{ e.stopPropagation(); setAdded(true); setTimeout(()=>setAdded(false),1500); };

  return (
    <div style={{ background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",border:"1px solid #f0f0f0",display:"flex",flexDirection:"column",cursor:"pointer",transition:"transform .2s,box-shadow .2s" }}
      onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 24px rgba(0,0,0,0.14)"; }}
      onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.transform="translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 2px 12px rgba(0,0,0,0.08)"; }}
    >
      <div style={{ position:"relative",height:160,background:"#f3f4f6",flexShrink:0 }}>
        <img src={product.image} alt={product.name} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
        {product.badge&&<div style={{ position:"absolute",top:8,left:8,background:"rgba(255,255,255,0.92)",color:TEAL,fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:12,border:`1.5px solid ${TEAL}`,backdropFilter:"blur(4px)" }}>{product.badge}</div>}
        <button onClick={e=>{e.stopPropagation();setFav(f=>!f);}} style={{ position:"absolute",top:8,right:8,background:"#fff",border:"none",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.14)" }}><ICon.Heart filled={fav}/></button>
      </div>
      <div style={{ padding:"10px 12px 12px",display:"flex",flexDirection:"column",flex:1 }}>
        <h3 style={{ fontSize:12,fontWeight:700,color:"#111827",margin:"0 0 2px",lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{product.name}</h3>
        <p style={{ fontSize:10,color:"#9ca3af",margin:"0 0 6px" }}>{product.description.substring(0,50)}...</p>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
          <div>
            <span style={{ fontSize:13,fontWeight:800,color:"#111827" }}>₹{product.price}</span>
            {product.originalPrice&&<span style={{ fontSize:10,color:"#9ca3af",textDecoration:"line-through",marginLeft:4 }}>₹{product.originalPrice}</span>}
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:3,background:"#fffbeb",padding:"2px 7px",borderRadius:20 }}>
            <ICon.Star size={10}/><span style={{ fontSize:10,fontWeight:700,color:"#d97706" }}>{product.rating}</span>
            <span style={{ fontSize:9,color:"#9ca3af" }}>({product.reviews})</span>
          </div>
        </div>
        <div style={{ fontSize:10,color:"#6b7280",marginBottom:10,display:"flex",alignItems:"center",gap:4 }}>
          <ICon.Clock/><span>Starts at ₹{[49,79,99][product.id%3]} • {product.duration}</span>
        </div>
        <div style={{ borderTop:"1px solid #f0f0f0",paddingTop:8,display:"flex",gap:6,alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",border:"1.5px solid #e0e0e0",borderRadius:10,overflow:"hidden",background:"#fff" }}>
            <button onClick={e=>{e.stopPropagation();setQty(q=>Math.max(1,q-1));}} style={{ width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",border:"none",background:"#fff",cursor:"pointer" }}><ICon.Minus/></button>
            <span style={{ fontSize:12,fontWeight:600,width:20,textAlign:"center",borderLeft:"1px solid #e0e0e0",borderRight:"1px solid #e0e0e0",lineHeight:"28px" }}>{qty}</span>
            <button onClick={e=>{e.stopPropagation();setQty(q=>q+1);}} style={{ width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",border:"none",background:"#fff",cursor:"pointer" }}><ICon.Plus/></button>
          </div>
          <button onClick={handleAdd} style={{ flex:1,height:30,border:`1.5px solid ${added?"transparent":"#e0e0e0"}`,borderRadius:10,background:added?TEAL_GRAD:"#fff",color:added?"#fff":"#374151",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .2s" }}>
            {added?"✓ Added":"Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
} 
function RatingSection({ vendor }: { vendor:Vendor }) {
  const breakdown=[{stars:5,pct:65},{stars:4,pct:20},{stars:3,pct:8},{stars:2,pct:4},{stars:1,pct:3}];
  return (
    <div style={{ background:"#fff",borderRadius:16,padding:"20px 24px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0" }}>
      <h3 style={{ fontSize:15,fontWeight:700,color:"#111827",margin:"0 0 16px" }}>Ratings & Reviews</h3>
      <div style={{ display:"flex",gap:32,alignItems:"center" }}>
        <div style={{ textAlign:"center",flexShrink:0 }}>
          <div style={{ fontSize:56,fontWeight:900,color:"#111827",lineHeight:1 }}>{vendor.rating}</div>
          <div style={{ display:"flex",justifyContent:"center",gap:2,margin:"6px 0 4px" }}>{[1,2,3,4,5].map(n=><ICon.Star key={n} size={16} fill={n<=Math.floor(vendor.rating)?"#f59e0b":"#e5e7eb"}/>)}</div>
          <div style={{ fontSize:11,color:"#6b7280" }}>{vendor.totalRatings} Ratings</div>
        </div>
        <div style={{ flex:1 }}>
          {breakdown.map(row=>(
            <div key={row.stars} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
              <span style={{ fontSize:11,color:"#6b7280",width:10,textAlign:"right" }}>{row.stars}</span>
              <ICon.Star size={10}/>
              <div style={{ flex:1,height:6,background:"#f0f0f0",borderRadius:3,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${row.pct}%`,background:TEAL_GRAD,borderRadius:3,transition:"width .5s" }}/>
              </div>
              <span style={{ fontSize:11,color:"#6b7280",width:28 }}>{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
function VendorDetailPage({ vendor, onBack }: { vendor:Vendor; onBack:()=>void }) {
  const [activeTab,setActiveTab]=useState(0);
  const [search,setSearch]=useState("");
  const [selectedBrands,setSelectedBrands]=useState<string[]>([]);
  const [ratingFilter,setRatingFilter]=useState<number|null>(null);
  const [offersOnly,setOffersOnly]=useState(false);
  const [filterBarSelected,setFilterBarSelected]=useState("All Service");
  const [sidebarOpen,setSidebarOpen]=useState(false);

  const brands=useMemo(()=>Array.from(new Set(vendor.products.map(p=>p.brand))).sort(),[vendor]);
  const filterOptions=["All Service","Fan","Light","Wiring","Working Machine","Fan Replacement","By Popularity"];

  const filtered=useMemo(()=>{
    let d=[...vendor.products];
    if(search) d=d.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
    if(selectedBrands.length) d=d.filter(p=>selectedBrands.includes(p.brand));
    if(ratingFilter!==null) d=d.filter(p=>p.rating>=ratingFilter);
    if(offersOnly) d=d.filter(p=>Boolean(p.badge));
    return d;
  },[vendor,search,selectedBrands,ratingFilter,offersOnly]);

  const toggleBrand=(b:string)=>setSelectedBrands(p=>p.includes(b)?p.filter(x=>x!==b):[...p,b]);

  const activeFilters:string[]=[
    ratingFilter!==null?`⭐ ${ratingFilter}+`:null,
    offersOnly?"Deals":null,
    ...selectedBrands,
  ].filter((f):f is string=>f!==null);

  const removeFilter=(f:string)=>{ if(f.startsWith("⭐"))setRatingFilter(null); else if(f==="Deals")setOffersOnly(false); else toggleBrand(f); };

  const tabContent=()=>{
    if(activeTab===0) return (
      <div> 
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap" }}>
          <div style={{ display:"flex",gap:6,overflowX:"auto",flex:1,paddingBottom:2 }}>
            {filterOptions.map(opt=>(
              <button key={opt} onClick={()=>setFilterBarSelected(opt)} style={{ padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,border:`1px solid ${filterBarSelected===opt?TEAL:"#e5e7eb"}`,background:filterBarSelected===opt?TEAL_GRAD:"#fff",color:filterBarSelected===opt?"#fff":"#6b7280",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0 }}>{opt}</button>
            ))}
          </div>
          <div style={{ display:"flex",alignItems:"center",border:"1px solid #e5e7eb",borderRadius:9,overflow:"hidden",background:"#fff",marginLeft:"auto" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ fontSize:11,padding:"6px 10px",border:"none",outline:"none",width:140,background:"transparent" }}/>
            <button style={{ padding:"6px 10px",background:TEAL_GRAD,border:"none",cursor:"pointer",display:"flex",alignItems:"center" }}><ICon.Search/></button>
          </div>
          <button onClick={()=>setSidebarOpen(true)} style={{ display:"flex",alignItems:"center",gap:5,padding:"6px 12px",border:"1px solid #e5e7eb",borderRadius:8,background:"#fff",fontSize:11,cursor:"pointer",fontWeight:600,color:"#374151" }}>
            <ICon.Filter/> Filter
          </button>
        </div>
        {activeFilters.length>0&&(
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:12 }}>
            {activeFilters.map(f=>(
              <span key={f} style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,background:TEAL_GRAD,fontSize:11,fontWeight:600,color:"#fff" }}>
                {f}<button onClick={()=>removeFilter(f)} style={{ background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",padding:0 }}><ICon.X size={8}/></button>
              </span>
            ))}
          </div>
        )}
        {filtered.length===0?(
          <div style={{ padding:"60px 20px",textAlign:"center",color:"#9ca3af" }}>No products found.</div>
        ):(
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14 }}>
            {filtered.map(p=><VendorProductCard key={p.id} product={p}/>)}
          </div>
        )}
      </div>
    );
    if(activeTab===1) return (
      <div style={{ padding:"8px 0" }}>
        <h4 style={{ fontSize:15,fontWeight:700,color:"#111827",margin:"0 0 12px" }}>About {vendor.name}</h4>
        <p style={{ fontSize:13,color:"#6b7280",lineHeight:1.7,marginBottom:16 }}>{vendor.description}</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12 }}>
          {[
            { label:"Category",     value:vendor.category },
            { label:"Sub Category", value:vendor.subCategory },
            { label:"Since",        value:vendor.since },
            { label:"Delivery",     value:vendor.delivery },
            { label:"Rating",       value:`${vendor.rating}/5 (${vendor.totalRatings} reviews)` },
            { label:"Hours",        value:vendor.openHours },
          ].map(item=>(
            <div key={item.label} style={{ background:"#f9fafb",borderRadius:10,padding:"12px 14px" }}>
              <div style={{ fontSize:10,color:"#9ca3af",marginBottom:4 }}>{item.label}</div>
              <div style={{ fontSize:13,fontWeight:600,color:"#111827" }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20 }}><RatingSection vendor={vendor}/></div>
      </div>
    ); 
    return (
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
        {vendor.products.slice(0,9).map((p,i)=>(
          <div key={i} style={{ borderRadius:12,overflow:"hidden",aspectRatio:"1",background:"#e5e7eb" }}>
            <img src={p.image} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div >
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"16px" }}> 
        <VendorBanner vendor={vendor}/> 
        <VendorInfoCard vendor={vendor}/> 
        <div style={{ background:"#fff",borderRadius:16,padding:"16px 20px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex",gap:0,borderBottom:"2px solid #f0f0f0",marginBottom:16 }}>
            {vendor.tabs.map((tab,i)=>(
              <button key={tab} onClick={()=>setActiveTab(i)} style={{ padding:"10px 24px",fontSize:13,fontWeight:activeTab===i?700:500,color:activeTab===i?TEAL:"#6b7280",border:"none",background:"transparent",cursor:"pointer",borderBottom:activeTab===i?`2px solid ${TEAL}`:"2px solid transparent",marginBottom:-2,transition:"all .15s",display:"flex",alignItems:"center",gap:6 }}>
                {tab==="Services"&&<ICon.Tag/>}
                {tab==="About"&&<ICon.Info/>}
                {tab==="Gallery"&&<ICon.Gallery/>}
                {tab}
              </button>
            ))}
          </div> 
          {activeTab===0&&<h3 style={{ fontSize:14,fontWeight:700,color:"#111827",margin:"0 0 12px" }}>Service List</h3>}
          {tabContent()}
        </div>
      </div> 
      {sidebarOpen&&(
        <div style={{ position:"fixed",inset:0,zIndex:300 }}>
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.45)" }} onClick={()=>setSidebarOpen(false)}/>
          <div style={{ position:"absolute",right:0,top:0,bottom:0,width:280,background:"#fff",padding:20,overflowY:"auto",zIndex:1 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <span style={{ fontWeight:700,fontSize:15 }}>Filters</span>
              <button onClick={()=>setSidebarOpen(false)} style={{ background:"none",border:"none",cursor:"pointer" }}><ICon.X size={18}/></button>
            </div> 
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em" }}>Brands</div>
              {brands.map(b=>(
                <div key={b} onClick={()=>toggleBrand(b)} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 0",cursor:"pointer" }}>
                  <Checkbox checked={selectedBrands.includes(b)} onChange={()=>toggleBrand(b)}/>
                  <span style={{ fontSize:12,color:selectedBrands.includes(b)?TEAL:"#4b5563",fontWeight:selectedBrands.includes(b)?600:400 }}>{b}</span>
                </div>
              ))}
            </div> 
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em" }}>Rating</div>
              {[4.5,4.0,3.5].map(r=>(
                <div key={r} onClick={()=>setRatingFilter(ratingFilter===r?null:r)} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 0",cursor:"pointer" }}>
                  <Checkbox checked={ratingFilter===r} onChange={()=>setRatingFilter(ratingFilter===r?null:r)} accent="#f59e0b"/>
                  <span style={{ fontSize:12,display:"flex",alignItems:"center",gap:3,color:"#4b5563" }}>
                    {[1,2,3,4].map(n=><ICon.Star key={n} size={11} fill={n<=Math.floor(r)?"#f59e0b":"#e5e7eb"}/>)} {r}+
                  </span>
                </div>
              ))}
            </div> 
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em" }}>Offers</div>
              <div onClick={()=>setOffersOnly(o=>!o)} style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}>
                <Checkbox checked={offersOnly} onChange={()=>setOffersOnly(o=>!o)}/>
                <span style={{ fontSize:12,color:"#4b5563" }}>Show deals only</span>
              </div>
            </div>
            <button onClick={()=>setSidebarOpen(false)} style={{ width:"100%",marginTop:20,padding:"10px",background:TEAL_GRAD,border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer" }}>Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default function FullServiceApp() {
  const [view,setView]=useState<"list"|"vendor">("list");
  const [selectedVendorId,setSelectedVendorId]=useState<string|null>(null);

  const handleSelectSeller=(seller:Seller)=>{
    setSelectedVendorId(seller.vendorId);
    setView("vendor");
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleBack=()=>{ setView("list"); setSelectedVendorId(null); window.scrollTo({ top:0, behavior:"smooth" }); };

  const vendor=selectedVendorId?VENDORS[selectedVendorId]??null:null;

  if(view==="vendor"&&vendor) return <VendorDetailPage vendor={vendor} onBack={handleBack}/>;
  return <ServiceListPage onSelectSeller={handleSelectSeller}/>;
}