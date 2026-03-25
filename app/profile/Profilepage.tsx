"use client";

import React, { useState, useRef, useCallback } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; 
type ActivePage =
  | "profile" | "saved-addresses" | "select-language" | "notification"
  | "your-orders" | "reviews-ratings" | "your-favourites" | "refer-earn"
  | "reward-points" | "become-vendor" | "account-privacy" | "logout";

interface SidebarItem { id: ActivePage; label: string; icon: React.ReactNode; } 
const Ic = ({ d, size = 16, sw = "1.8" }: { d: string; size?: number; sw?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    dangerouslySetInnerHTML={{ __html: d }} />
);
 
const IcUser = ({ s = 16 }) => <Ic size={s} d='<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' />;
const IcMapPin = ({ s = 16 }) => <Ic size={s} d='<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>' />;
const IcGlobe = ({ s = 16 }) => <Ic size={s} d='<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' />;
const IcBell = ({ s = 16 }) => <Ic size={s} d='<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>' />;
const IcPackage = ({ s = 16 }) => <Ic size={s} d='<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>' />;
const IcStar = ({ s = 16 }) => <Ic size={s} d='<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' />;
const IcHeart = ({ s = 16 }) => <Ic size={s} d='<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' />;
const IcGift = ({ s = 16 }) => <Ic size={s} d='<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>' />;
const IcAward = ({ s = 16 }) => <Ic size={s} d='<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>' />;
const IcStore = ({ s = 16 }) => <Ic size={s} d='<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' />;
const IcShield = ({ s = 16 }) => <Ic size={s} d='<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' />;
const IcLogOut = ({ s = 16 }) => <Ic size={s} d='<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>' />;
const IcChevronR = ({ s = 16 }) => <Ic size={s} d='<polyline points="9 18 15 12 9 6"/>' />;
const IcChevronL = ({ s = 16 }) => <Ic size={s} d='<polyline points="15 18 9 12 15 6"/>' />;
const IcPlus = ({ s = 16 }) => <Ic size={s} d='<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' />;
const IcNav = ({ s = 16 }) => <Ic size={s} d='<polygon points="3 11 22 2 13 21 11 13 3 11"/>' />;
const IcCheck = ({ s = 16 }) => <Ic size={s} d='<polyline points="20 6 9 17 4 12"/>' />;
const IcCamera = ({ s = 16 }) => <Ic size={s} d='<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>' />;
const IcUpload = ({ s = 20 }) => <Ic size={s} d='<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>' />;
const IcX = ({ s = 14 }) => <Ic size={s} d='<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' />;
const IcMenu = ({ s = 20 }) => <Ic size={s} d='<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>' />;
const IcCopy = ({ s = 15 }) => <Ic size={s} d='<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' />;
const IcAlert = ({ s = 16 }) => <Ic size={s} d='<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' />;
const IcCalendar = ({ s = 15 }) => <Ic size={s} d='<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' />;
const IcEdit = ({ s = 14 }) => <Ic size={s} d='<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' />;
const IcTrash = ({ s = 14 }) => <Ic size={s} d='<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>' />;
const IcShare = ({ s = 14 }) => <Ic size={s} d='<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' />;
const IcCheckCircle = ({ s = 16 }) => <Ic size={s} d='<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' />;
// notification icons
const IcShoppingBag = ({ s = 18 }) => <Ic size={s} d='<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' />;
const IcTruck = ({ s = 18 }) => <Ic size={s} d='<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' />;
const IcCreditCard = ({ s = 18 }) => <Ic size={s} d='<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>' />;
const IcTag = ({ s = 18 }) => <Ic size={s} d='<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>' />;
// reward icons
const IcThumbsUp = ({ s = 20 }) => <Ic size={s} d='<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>' />;
const IcShare2 = ({ s = 20 }) => <Ic size={s} d='<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' />;
const IcUsers = ({ s = 20 }) => <Ic size={s} d='<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' />;
const IcTarget = ({ s = 36 }) => <Ic size={s} d='<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' />;
const IcPartyPopper = ({ s = 36 }) => <Ic size={s} d='<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2z"/>' />;
// refer icons
const IcUserPlus = ({ s = 20 }) => <Ic size={s} d='<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>' />;
const IcHandshake = ({ s = 20 }) => <Ic size={s} d='<path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>' />;
const IcCoins = ({ s = 20 }) => <Ic size={s} d='<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>' />;
// vendor / waving
const IcSmile = ({ s = 36 }) => <Ic size={s} d='<circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>' />;
// logout wave
const IcLogOutBig = ({ s = 44 }) => <Ic size={s} d='<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>' />;
const IcTrophy = ({ s = 60 }) => <Ic size={s} d='<line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4h10l1 7H6L7 4z"/><path d="M6 11C6 11 3 11 3 8V4"/><path d="M18 11C18 11 21 11 21 8V4"/>' />;
const IcDollarSign = ({ s = 60 }) => <Ic size={s} d='<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' />;


const PRIMARY_GRADIENT = "radial-gradient(at 60% 25%, rgb(26,74,58) 0%, rgb(14,34,31) 55%, rgb(8,24,18) 100%)";
const PRIMARY_SOLID = "#1a4a3a";


const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "profile", label: "My Profile", icon: <IcUser /> },
  { id: "saved-addresses", label: "Saved Addresses", icon: <IcMapPin /> },
  { id: "select-language", label: "Select Language", icon: <IcGlobe /> },
  { id: "notification", label: "Notifications", icon: <IcBell /> },
  { id: "your-orders", label: "Your Orders", icon: <IcPackage /> },
  { id: "reviews-ratings", label: "Reviews & Ratings", icon: <IcStar /> },
  { id: "your-favourites", label: "Your Favorites", icon: <IcHeart /> },
  { id: "refer-earn", label: "Refer & Earn", icon: <IcGift /> },
  { id: "reward-points", label: "Reward Points", icon: <IcAward /> },
  { id: "become-vendor", label: "Become a Vendor", icon: <IcStore /> },
  { id: "account-privacy", label: "Account Privacy", icon: <IcShield /> },
  { id: "logout", label: "Log Out", icon: <IcLogOut /> },
];


const IMG = {
  iphone: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&q=80",
  samsung: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&q=80",
  headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  macbook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80",
  watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=80",
  ac: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=80",
  plumbing: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&q=80",
  dental: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=200&q=80",
  photo: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&q=80",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80",
};

const ProductImg = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <img src={src} alt={alt} loading="lazy"
    className={`object-cover rounded-xl bg-slate-100 ${className}`}
    onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80"; }} />
);


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; icon?: React.ReactNode;
}
const Input: React.FC<InputProps> = ({ label, error, icon, className = "", ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs text-slate-500">{label}</label>}
    <div className="relative">
      <input {...props}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 bg-white outline-none transition-all
          ${error ? "border-red-400 focus:ring-1 focus:ring-red-200" : "border-slate-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-100"}
          ${icon ? "pr-9" : ""} ${className}`} />
      {icon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</span>}
    </div>
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; options: { value: string; label: string }[];
}
const Select: React.FC<SelectProps> = ({ label, error, options, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs text-slate-500">{label}</label>}
    <select {...props}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 bg-white outline-none transition-all cursor-pointer
        ${error ? "border-red-400 focus:ring-1 focus:ring-red-200" : "border-slate-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-100"}`}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string;
}
const Textarea: React.FC<TextareaProps> = ({ label, error, className = "", ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs text-slate-500">{label}</label>}
    <textarea {...props}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 bg-white outline-none resize-none transition-all
        ${error ? "border-red-400 focus:ring-1 focus:ring-red-200" : "border-slate-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-100"}
        ${className}`} />
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);
function TabBar<T extends string>({ tabs, active, onSelect }: { tabs: T[]; active: T; onSelect: (t: T) => void }) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-5 w-full">
      {tabs.map(t => (
        <button key={t} onClick={() => onSelect(t)}
          className="flex-1 py-2.5 text-xs font-medium transition-all border-none cursor-pointer"
          style={{ background: active === t ? PRIMARY_GRADIENT : "#fff", color: active === t ? "#fff" : PRIMARY_SOLID }}>
          {t}
        </button>
      ))}
    </div>
  );
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
    <div className="w-1 h-5 rounded-full" style={{ background: PRIMARY_GRADIENT }} />
    <h2 className="text-base font-semibold text-slate-800">{children}</h2>
  </div>
);

const PrimaryBtn = ({ children, onClick, className = "", disabled = false }: {
  children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean;
}) => (
  <button onClick={onClick} disabled={disabled}
    className={`px-5 py-2.5 rounded-xl text-sm text-white font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${className}`}
    style={{ background: PRIMARY_GRADIENT }}>
    {children}
  </button>
);
const GhostBtn = ({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 active:scale-95 cursor-pointer ${className}`}>
    {children}
  </button>
);

const UploadZone = ({ label, value, onFile, onClear }: {
  label: string; value: string | null; onFile: (url: string) => void; onClear: () => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => onFile(ev.target?.result as string);
    reader.readAsDataURL(f);
    e.target.value = "";
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs text-slate-500">{label}</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200">
          <img src={value} alt={label} className="w-full h-32 object-cover" />
          <button onClick={onClear} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><IcX /></button>
        </div>
      ) : (
        <div onClick={() => ref.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer transition-all hover:border-emerald-500 hover:bg-emerald-50/30 flex flex-col items-center gap-1.5">
          <span className="text-slate-300"><IcUpload /></span>
          <p className="text-xs text-slate-400">Click to upload</p>
          <p className="text-[10px] text-slate-300">JPG, PNG, JPEG • Max 10MB</p>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
};

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4"
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">{children}</div>
  </div>
);

function PageProfile() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", dob: "", gender: "", adhar: "", adharNumber: "", author: false, okps: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const setField = (k: string, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = "Must be a valid 10-digit number";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.gender) e.gender = "Please select your gender";
    if (form.adharNumber && !/^\d{12}$/.test(form.adharNumber)) e.adharNumber = "Aadhar number must be 12 digits";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (!validate()) return; setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="p-5 sm:p-6">
      <SectionTitle>Personal Information</SectionTitle>
      {saved && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <span className="text-emerald-600"><IcCheckCircle /></span> Profile updated successfully!
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Input label="Full Name *" placeholder="Enter your name" value={form.name}
          onChange={e => setField("name", e.target.value)} error={errors.name} />
        <Input label="Mobile Number *" placeholder="10-digit number" value={form.mobile}
          onChange={e => setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} error={errors.mobile} />
        <Input label="Email Address *" placeholder="your@email.com" type="email" value={form.email}
          onChange={e => setField("email", e.target.value)} error={errors.email} />
        <Input label="Date of Birth" type="date" value={form.dob}
          onChange={e => setField("dob", e.target.value)} icon={<IcCalendar />} />
        <Select label="Gender *" value={form.gender} onChange={e => setField("gender", e.target.value)}
          error={errors.gender}
          options={[{ value: "", label: "Select gender" }, { value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} />
        <Input label="Adhar ID" placeholder="Adhar ID number" value={form.adhar}
          onChange={e => setField("adhar", e.target.value)} />
      </div>
      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-2">Author Type</p>
        <div className="flex gap-6">
          {[["author", "Author"], ["okps", "Okps"]].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input type="checkbox" checked={form[k as "author" | "okps"]}
                onChange={e => setField(k, e.target.checked)}
                className="w-4 h-4 accent-emerald-700 cursor-pointer" /> {l}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-5 max-w-xs">
        <Input label="Aadhar Number" placeholder="12-digit aadhar number" value={form.adharNumber}
          onChange={e => setField("adharNumber", e.target.value.replace(/\D/g, "").slice(0, 12))}
          error={errors.adharNumber} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <UploadZone label="Aadhar Card (Front)" value={frontImg} onFile={setFrontImg} onClear={() => setFrontImg(null)} />
        <UploadZone label="Aadhar Card (Back)" value={backImg} onFile={setBackImg} onClear={() => setBackImg(null)} />
      </div>
      <div className="flex justify-end"><PrimaryBtn onClick={handleSubmit}>Update Profile</PrimaryBtn></div>
    </div>
  );
}

interface Address { id: number; name: string; dist: string; addr: string; phone: string; }

function PageSavedAddresses() {
  const [showMap, setShowMap] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mapForm, setMapForm] = useState({ name: "", phone: "", address: "" });
  const [mapErrors, setMapErrors] = useState<Record<string, string>>({});
  const [addrForm, setAddrForm] = useState({ name: "", phone: "", address: "" });
  const [addrErrors, setAddrErrors] = useState<Record<string, string>>({});
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, name: "Planext4u", dist: "7.08 km away", addr: "No11a, Pandivan Street, Sengunthar Nagar, Tiruttani, Tamil Nadu - 631209", phone: "0123456789" },
    { id: 2, name: "Home", dist: "22.8 km away", addr: "15B, MG Road, Chennai, Tamil Nadu - 600001", phone: "9876543210" },
  ]);

  const validateForm = (f: typeof addrForm, setE: (e: Record<string, string>) => void) => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(f.phone)) e.phone = "Enter valid 10-digit phone";
    if (!f.address.trim()) e.address = "Address is required";
    setE(e); return Object.keys(e).length === 0;
  };

  const addFromMap = () => {
    if (!validateForm(mapForm, setMapErrors)) return;
    setAddresses(a => [...a, { id: Date.now(), name: mapForm.name, dist: "Current location", addr: mapForm.address, phone: mapForm.phone }]);
    setMapForm({ name: "", phone: "", address: "" }); setMapErrors({}); setShowMap(false);
  };
  const saveNewAddr = () => {
    if (!validateForm(addrForm, setAddrErrors)) return;
    setAddresses(a => [...a, { id: Date.now(), name: addrForm.name, dist: "New address", addr: addrForm.address, phone: addrForm.phone }]);
    setAddrForm({ name: "", phone: "", address: "" }); setAddrErrors({}); setShowAddForm(false);
  };
  const startEdit = (a: Address) => { setEditId(a.id); setAddrForm({ name: a.name, phone: a.phone, address: a.addr }); setAddrErrors({}); setShowAddForm(false); };
  const saveEdit = () => {
    if (!validateForm(addrForm, setAddrErrors)) return;
    setAddresses(a => a.map(x => x.id === editId ? { ...x, name: addrForm.name, phone: addrForm.phone, addr: addrForm.address } : x));
    setEditId(null); setAddrForm({ name: "", phone: "", address: "" }); setAddrErrors({});
  };
  const cancelEdit = () => { setEditId(null); setAddrForm({ name: "", phone: "", address: "" }); setAddrErrors({}); };
  const removeAddress = (id: number) => setAddresses(a => a.filter(x => x.id !== id));
  const mapField = (k: keyof typeof mapForm, v: string) => { setMapForm(f => ({ ...f, [k]: v })); setMapErrors(e => { const n = { ...e }; delete n[k]; return n; }); };
  const addrField = (k: keyof typeof addrForm, v: string) => { setAddrForm(f => ({ ...f, [k]: v })); setAddrErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  return (
    <div className="p-5 sm:p-6">
      {showMap && (
        <Modal onClose={() => { setShowMap(false); setMapForm({ name: "", phone: "", address: "" }); setMapErrors({}); }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">My Location on Map</span>
            <button onClick={() => { setShowMap(false); setMapForm({ name: "", phone: "", address: "" }); setMapErrors({}); }}
              className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"><IcX /></button>
          </div>
          <div className="relative h-44 overflow-hidden" style={{ background: "linear-gradient(160deg,#c7f1e3 0%,#a0e4cc 40%,#7dd3b8 100%)" }}>
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 176" preserveAspectRatio="none">
              {[0, 44, 88, 132, 176].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#0e2220" strokeWidth="1" />)}
              {[0, 50, 100, 150, 200, 250, 300, 350, 400].map(x => <line key={x} x1={x} y1="0" x2={x} y2="176" stroke="#0e2220" strokeWidth="1" />)}
            </svg>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 176" preserveAspectRatio="none">
              <rect x="160" y="0" width="14" height="176" fill="white" opacity="0.6" rx="2" />
              <rect x="0" y="72" width="400" height="12" fill="white" opacity="0.6" rx="2" />
              <rect x="280" y="0" width="8" height="176" fill="white" opacity="0.4" rx="2" />
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <div className="w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-lg" style={{ background: PRIMARY_GRADIENT }}>
                <span className="text-white"><IcMapPin s={14} /></span>
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-600 mx-auto -mt-0.5 opacity-50" />
            </div>
            <div className="absolute bottom-2 right-3 bg-white/90 rounded-lg px-2 py-1 text-[10px] text-slate-600 font-medium shadow">Tamil Nadu, India</div>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Full Name *" value={mapForm.name} onChange={e => mapField("name", e.target.value)} error={mapErrors.name} />
              <Input placeholder="Phone (10 digits) *" value={mapForm.phone} onChange={e => mapField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} error={mapErrors.phone} />
            </div>
            <Input placeholder="Full Address *" value={mapForm.address} onChange={e => mapField("address", e.target.value)} error={mapErrors.address} />
            <div className="flex gap-3 pt-1">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm border-emerald-200 text-emerald-800 hover:bg-emerald-50 cursor-pointer">
                <IcNav /> Use My Location
              </button>
              <PrimaryBtn onClick={addFromMap} className="flex-1">Add Address</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}

      <SectionTitle>Saved Addresses</SectionTitle>
      <div className="flex flex-wrap gap-3 mb-5">
        <button onClick={() => setShowMap(true)}
          className="flex items-center gap-2 text-sm border border-emerald-200 text-emerald-800 rounded-xl px-4 py-2 hover:bg-emerald-50 cursor-pointer transition-all">
          <IcNav /> Use Current Location
        </button>
        <button onClick={() => { setShowAddForm(v => !v); setEditId(null); setAddrErrors({}); }}
          className="flex items-center gap-2 text-sm text-white rounded-xl px-4 py-2 cursor-pointer transition-all"
          style={{ background: PRIMARY_GRADIENT }}>
          <IcPlus /> {showAddForm ? "Cancel" : "Add New Address"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-5 p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-3">
          <p className="text-xs font-medium text-slate-700">New Address Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Full Name *" value={addrForm.name} onChange={e => addrField("name", e.target.value)} error={addrErrors.name} />
            <Input placeholder="Phone (10 digits) *" value={addrForm.phone} onChange={e => addrField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} error={addrErrors.phone} />
          </div>
          <Input placeholder="Full Address *" value={addrForm.address} onChange={e => addrField("address", e.target.value)} error={addrErrors.address} />
          <div className="flex gap-3">
            <PrimaryBtn onClick={saveNewAddr}>Save Address</PrimaryBtn>
            <GhostBtn onClick={() => { setShowAddForm(false); setAddrErrors({}); }}>Cancel</GhostBtn>
          </div>
        </div>
      )}

      {editId !== null && (
        <div className="mb-5 p-4 rounded-xl border border-amber-100 bg-amber-50/30 space-y-3">
          <p className="text-xs font-medium text-slate-700">Edit Address</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Full Name *" value={addrForm.name} onChange={e => addrField("name", e.target.value)} error={addrErrors.name} />
            <Input placeholder="Phone (10 digits) *" value={addrForm.phone} onChange={e => addrField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} error={addrErrors.phone} />
          </div>
          <Input placeholder="Full Address *" value={addrForm.address} onChange={e => addrField("address", e.target.value)} error={addrErrors.address} />
          <div className="flex gap-3">
            <PrimaryBtn onClick={saveEdit}>Save Changes</PrimaryBtn>
            <GhostBtn onClick={cancelEdit}>Cancel</GhostBtn>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {addresses.map(a => (
          <div key={a.id} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-emerald-100 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5" style={{ background: PRIMARY_GRADIENT }}><IcStore /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">{a.name}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: PRIMARY_SOLID }}>{a.dist}</p>
              <p className="text-xs text-slate-500 mt-0.5 break-words">{a.addr}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><IcNav s={11} /> {a.phone}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => startEdit(a)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"><IcEdit /></button>
              <button onClick={() => removeAddress(a.id)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"><IcTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function PageSelectLanguage() {
  const [selected, setSelected] = useState("English");
  const langs = ["English", "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi"];
  return (
    <div className="p-5 sm:p-6">
      <SectionTitle>Language</SectionTitle>
      <div className="space-y-1">
        {langs.map(lang => (
          <button key={lang} onClick={() => setSelected(lang)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left cursor-pointer border ${selected === lang ? "border-emerald-200 bg-emerald-50" : "border-transparent hover:bg-slate-50"}`}>
            <span className={`text-sm ${selected === lang ? "text-emerald-900 font-medium" : "text-slate-700"}`}>{lang}</span>
            {selected === lang && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: PRIMARY_GRADIENT }}><IcCheck /></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
 
function PageNotification() {
  const NOTIFS_INIT = [
    { id: 1, read: false, icon: <IcShoppingBag />, title: "Order Delivered!", body: "Your order #ORD-4821 has been delivered successfully. Rate your experience.", time: "2 min ago", color: "bg-emerald-50 border-emerald-100", iconBg: "bg-emerald-100 text-emerald-700" },
    { id: 2, read: false, icon: <IcGift />, title: "Refer & Earn Bonus!", body: "Your friend Meena R. joined using your code. You've earned 150 reward points!", time: "1 hr ago", color: "bg-amber-50 border-amber-100", iconBg: "bg-amber-100 text-amber-700" },
    { id: 3, read: false, icon: <IcTruck />, title: "Order Shipped", body: "Your order #ORD-4820 (Apple iPhone 17) has been shipped and is on its way.", time: "3 hrs ago", color: "bg-blue-50 border-blue-100", iconBg: "bg-blue-100 text-blue-700" },
    { id: 4, read: true, icon: <IcStar />, title: "Review Reminder", body: "How was your experience with Apple iPhone 17? Leave a review and earn points.", time: "Yesterday", color: "bg-slate-50 border-slate-100", iconBg: "bg-slate-100 text-slate-500" },
    { id: 5, read: true, icon: <IcCreditCard />, title: "Payment Confirmed", body: "Payment of ₹1,02,700 received for order #ORD-4820. Thank you for shopping!", time: "2 days ago", color: "bg-slate-50 border-slate-100", iconBg: "bg-slate-100 text-slate-500" },
    { id: 6, read: true, icon: <IcTag />, title: "Special Offer!", body: "Flash sale! Get up to 40% off on electronics this weekend only. Shop now.", time: "3 days ago", color: "bg-slate-50 border-slate-100", iconBg: "bg-slate-100 text-slate-500" },
  ];
  const [notifications, setNotifications] = useState(NOTIFS_INIT);
  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: PRIMARY_GRADIENT }} />
          <h2 className="text-base font-semibold text-slate-800">All Notifications</h2>
          {unread > 0 && <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ background: PRIMARY_GRADIENT }}>{unread} new</span>}
        </div>
        {unread > 0 && <button onClick={markAllRead} className="text-xs cursor-pointer font-medium" style={{ color: PRIMARY_SOLID }}>Mark all read</button>}
      </div>
      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} onClick={() => setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${n.read ? "bg-white border-slate-100" : n.color}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.iconBg}`}>{n.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm leading-snug ${n.read ? "text-slate-700" : "text-slate-900 font-medium"}`}>{n.title}</p>
                <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.body}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: PRIMARY_SOLID }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
 
type OrderTab = "Shop" | "Services" | "Booking";

const SHOP_ORDERS = [
  { id: "ORD-4821", title: "Apple iPhone 17 Ultramarine, 128 GB", sub: "Black, 128GB", vendor: "Planext4u", img: IMG.iphone, orig: "₹1,39,999", price: "₹1,02,700", off: "38% OFF", status: "Delivered", statusColor: "#22c55e", date: "Today, 3:45 PM" },
  { id: "ORD-4820", title: "Samsung Galaxy S25 Ultra, 256GB", sub: "Phantom Black, 256GB", vendor: "Planext4u", img: IMG.samsung, orig: "₹1,29,999", price: "₹89,999", off: "31% OFF", status: "In Transit", statusColor: "#f59e0b", date: "Expected: Tomorrow" },
  { id: "ORD-4815", title: "Sony WH-1000XM5 Headphones", sub: "Black", vendor: "Planext4u", img: IMG.headphones, orig: "₹34,990", price: "₹24,990", off: "29% OFF", status: "Processing", statusColor: "#3b82f6", date: "Est: 2-3 days" },
];
const SERVICE_ORDERS = [
  { id: "SRV-201", title: "Home Deep Cleaning Service", sub: "3 BHK Package", vendor: "CleanPro", img: IMG.cleaning, orig: "₹2,500", price: "₹1,800", off: "28% OFF", status: "Scheduled", statusColor: "#8b5cf6", date: "Tomorrow, 10:00 AM" },
  { id: "SRV-199", title: "AC Servicing & Gas Refill", sub: "Split AC (1.5 Ton)", vendor: "TechCool", img: IMG.ac, orig: "₹1,200", price: "₹899", off: "25% OFF", status: "Completed", statusColor: "#22c55e", date: "3 days ago" },
  { id: "SRV-188", title: "Plumbing Repair Service", sub: "Pipe leak fix + check", vendor: "FixIt", img: IMG.plumbing, orig: "₹800", price: "₹599", off: "25% OFF", status: "Cancelled", statusColor: "#ef4444", date: "5 days ago" },
];
const BOOKING_ORDERS = [
  { id: "BKG-90", title: "Sakthi Spa & Wellness", sub: "Full Body Massage – 60 min", vendor: "Sakthi Spa", img: IMG.spa, orig: "₹1,500", price: "₹1,100", off: "27% OFF", status: "Confirmed", statusColor: "#22c55e", date: "Sat, 15 Mar – 11:00 AM" },
  { id: "BKG-88", title: "Dr. Priya's Dental Clinic", sub: "Teeth Cleaning + Checkup", vendor: "SmileCare", img: IMG.dental, orig: "₹800", price: "₹599", off: "25% OFF", status: "Upcoming", statusColor: "#3b82f6", date: "Mon, 17 Mar – 3:00 PM" },
  { id: "BKG-82", title: "Photography Session", sub: "Outdoor portrait – 2 hrs", vendor: "ClickArt", img: IMG.photo, orig: "₹3,000", price: "₹2,200", off: "27% OFF", status: "Completed", statusColor: "#64748b", date: "20 Feb 2026" },
];

function OrderCard({ item }: { item: typeof SHOP_ORDERS[0] }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-sm transition-all">
      <ProductImg src={item.img} alt={item.title} className="w-16 h-20 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium">{item.id}</p>
        <p className="text-sm font-medium text-slate-800 leading-snug mt-0.5">{item.title}</p>
        <p className="text-xs text-slate-400">{item.sub}</p>
        <p className="text-xs text-slate-400">Vendor: {item.vendor}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs text-slate-300 line-through">{item.orig}</span>
          <span className="text-sm font-semibold text-slate-800">{item.price}</span>
          <span className="text-xs font-medium" style={{ color: PRIMARY_SOLID }}>{item.off}</span>
        </div>
        <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.statusColor }} />
            <span className="text-xs font-medium" style={{ color: item.statusColor }}>{item.status}</span>
          </div>
          <span className="text-[10px] text-slate-400">{item.date}</span>
        </div>
      </div>
    </div>
  );
}

function PageYourOrders() {
  const [tab, setTab] = useState<OrderTab>("Shop");
  const data = tab === "Shop" ? SHOP_ORDERS : tab === "Services" ? SERVICE_ORDERS : BOOKING_ORDERS;
  return (
    <div className="p-5 sm:p-6">
      <SectionTitle>My Orders</SectionTitle>
      <TabBar<OrderTab> tabs={["Shop", "Services", "Booking"]} active={tab} onSelect={setTab} />
      <div className="space-y-3">{data.map((o, i) => <OrderCard key={i} item={o} />)}</div>
    </div>
  );
}
 
type ReviewTab = "Shop" | "Services" | "Booking";

const SHOP_REVIEWS = [
  { id: 1, img: IMG.iphone, title: "Apple iPhone 17 Ultramarine, 128 GB", rating: 5, label: "Excellent!", comment: "Superb phone! Camera quality is amazing and battery lasts all day.", date: "5 May 2025" },
  { id: 2, img: IMG.headphones, title: "Sony WH-1000XM5 Headphones", rating: 4, label: "Very Good!", comment: "Great noise cancellation. Build quality could be a tad better.", date: "18 Apr 2025" },
  { id: 3, img: IMG.macbook, title: "MacBook Air M3, 8GB RAM 256GB", rating: 5, label: "Excellent!", comment: "Blazing fast, silent, and the display is gorgeous. Totally worth it.", date: "2 Mar 2025" },
];
const SERVICE_REVIEWS = [
  { id: 4, img: IMG.cleaning, title: "Home Deep Cleaning Service", rating: 5, label: "Excellent!", comment: "The team was very professional and thorough. House sparkles now!", date: "12 May 2025" },
  { id: 5, img: IMG.ac, title: "AC Servicing & Gas Refill", rating: 4, label: "Good!", comment: "Quick service, AC cools much better now. Slightly delayed arrival.", date: "28 Apr 2025" },
];
const BOOKING_REVIEWS = [
  { id: 6, img: IMG.spa, title: "Sakthi Spa & Wellness – Full Body Massage", rating: 5, label: "Excellent!", comment: "The best massage experience I've ever had. Totally relaxed now.", date: "10 May 2025" },
  { id: 7, img: IMG.dental, title: "SmileCare – Dental Cleaning", rating: 4, label: "Very Good!", comment: "Dr. Priya was very gentle and explained everything. Clean and modern.", date: "1 May 2025" },
];

function PageReviews() {
  const [tab, setTab] = useState<ReviewTab>("Shop");
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [errors, setErrors] = useState<{ rating?: string; text?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const data = tab === "Shop" ? SHOP_REVIEWS : tab === "Services" ? SERVICE_REVIEWS : BOOKING_REVIEWS;
  const ratingLabels = ["", "Bad", "OK", "Good", "Very Good", "Excellent"];

  const submit = () => {
    const e: { rating?: string; text?: string } = {};
    if (rating === 0) e.rating = "Please select a star rating";
    if (!reviewText.trim()) e.text = "Please write your review";
    setErrors(e); if (Object.keys(e).length > 0) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); setRating(0); setReviewText(""); }, 2500);
  };

  if (showForm) return (
    <div className="p-5 sm:p-6">
      <button onClick={() => setShowForm(false)} className="flex items-center gap-1 text-sm text-slate-500 mb-4 hover:text-emerald-700 cursor-pointer">
        <IcChevronL /> Back to reviews
      </button>
      <SectionTitle>Write a Review</SectionTitle>
      <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <p className="text-xs font-medium text-slate-700 mb-2">Tips for a great review</p>
        {["Mention specific features you liked or disliked", "Compare with similar products if possible", "Be honest and describe your actual experience"].map((q, i) => (
          <p key={i} className="text-xs text-slate-500 mb-1">• {q}</p>
        ))}
      </div>
      <div className="mb-5">
        <p className="text-xs text-slate-500 mb-2">Star Rating *</p>
        <div className="flex gap-1 mb-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => { setRating(n); setErrors(e => ({ ...e, rating: undefined })); }}
              className="text-3xl transition-transform hover:scale-110 border-none bg-transparent cursor-pointer"
              style={{ color: n <= rating ? "#f59e0b" : "#e2e8f0" }}>★</button>
          ))}
        </div>
        {rating > 0 && <p className="text-xs font-medium text-emerald-700">{ratingLabels[rating]}</p>}
        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
      </div>
      <div className="mb-5">
        <Textarea label="Your Review *" rows={4} value={reviewText}
          onChange={e => { setReviewText(e.target.value); setErrors(ev => ({ ...ev, text: undefined })); }}
          placeholder="Share your experience..." error={errors.text} />
      </div>
      {submitted ? (
        <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium"><IcCheckCircle /> Review submitted! Thank you.</div>
      ) : (
        <div className="flex justify-end"><PrimaryBtn onClick={submit}>Submit Review</PrimaryBtn></div>
      )}
    </div>
  );

  return (
    <div className="p-5 sm:p-6">
      <SectionTitle>My Reviews & Ratings</SectionTitle>
      <TabBar<ReviewTab> tabs={["Shop", "Services", "Booking"]} active={tab} onSelect={setTab} />
      <div className="space-y-3">
        {data.map(r => (
          <div key={r.id} className="flex gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-sm transition-all">
            <ProductImg src={r.img} alt={r.title} className="w-14 h-16 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 leading-snug">{r.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-white text-xs" style={{ background: "#22c55e" }}>{r.rating}.0 ★</span>
                <span className="text-xs text-slate-500">{r.label}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{r.comment}</p>
              <p className="text-[10px] text-slate-300 mt-1">Reviewed on {r.date}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => setShowForm(true)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"><IcEdit /></button>
              <button className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"><IcTrash /></button>
              <button className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer"><IcShare /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
type FavTab = "Shop" | "Services" | "Booking";

const initShopFavs = [
  { id: 1, img: IMG.iphone, title: "Apple iPhone 17 Ultramarine, 128 GB", sub: "Black, 128GB", vendor: "Planext4u", orig: "₹1,39,999", price: "₹1,02,700", off: "38% OFF", liked: true },
  { id: 2, img: IMG.headphones, title: "Sony WH-1000XM5 Headphones", sub: "Black", vendor: "Planext4u", orig: "₹34,990", price: "₹24,990", off: "29% OFF", liked: true },
  { id: 3, img: IMG.watch, title: "Apple Watch Series 10 GPS 46mm", sub: "Midnight", vendor: "TechZone", orig: "₹49,900", price: "₹39,990", off: "20% OFF", liked: true },
  { id: 4, img: IMG.macbook, title: "MacBook Air M3 8GB 256GB", sub: "Midnight", vendor: "AppleHub", orig: "₹1,14,900", price: "₹99,999", off: "13% OFF", liked: true },
];
const initServiceFavs = [
  { id: 5, img: IMG.cleaning, title: "Home Deep Cleaning – 3 BHK", sub: "4 hrs session", vendor: "CleanPro", orig: "₹2,500", price: "₹1,800", off: "28% OFF", liked: true },
  { id: 6, img: IMG.ac, title: "AC Service & Gas Refill", sub: "Split AC 1.5 Ton", vendor: "TechCool", orig: "₹1,200", price: "₹899", off: "25% OFF", liked: true },
  { id: 7, img: IMG.electrical, title: "Electrical Wiring & Repair", sub: "Up to 5 points", vendor: "FixElec", orig: "₹900", price: "₹699", off: "22% OFF", liked: true },
];
const initBookingFavs = [
  { id: 8, img: IMG.spa, title: "Sakthi Spa – Full Body Massage", sub: "60 min session", vendor: "Sakthi Spa", orig: "₹1,500", price: "₹1,100", off: "27% OFF", liked: true },
  { id: 9, img: IMG.restaurant, title: "The Spice Garden Restaurant", sub: "Table for 2", vendor: "SpiceGarden", orig: "₹800", price: "₹599", off: "25% OFF", liked: true },
  { id: 10, img: IMG.photo, title: "Photography Session – Outdoor", sub: "2 hrs portrait", vendor: "ClickArt", orig: "₹3,000", price: "₹2,200", off: "27% OFF", liked: true },
];

function PageFavourites() {
  const [tab, setTab] = useState<FavTab>("Shop");
  const [shopFavs, setShopFavs] = useState(initShopFavs);
  const [serviceFavs, setServiceFavs] = useState(initServiceFavs);
  const [bookingFavs, setBookingFavs] = useState(initBookingFavs);

  const getList = () => tab === "Shop" ? shopFavs : tab === "Services" ? serviceFavs : bookingFavs;
  const getSetter = () => tab === "Shop" ? setShopFavs : tab === "Services" ? setServiceFavs : setBookingFavs;
  const toggle = (id: number) => (getSetter() as React.Dispatch<React.SetStateAction<typeof initShopFavs>>)(list => list.map(x => x.id === id ? { ...x, liked: !x.liked } : x));

  return (
    <div className="p-5 sm:p-6">
      <SectionTitle>My Favorites</SectionTitle>
      <TabBar<FavTab> tabs={["Shop", "Services", "Booking"]} active={tab} onSelect={setTab} />
      <div className="space-y-3">
        {getList().map(item => (
          <div key={item.id} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-sm transition-all">
            <ProductImg src={item.img} alt={item.title} className="w-16 h-16 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 leading-snug">{item.title}</p>
              <p className="text-xs text-slate-400">{item.sub}</p>
              <p className="text-xs text-slate-400">Vendor: {item.vendor}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs text-slate-300 line-through">{item.orig}</span>
                <span className="text-sm font-semibold text-slate-800">{item.price}</span>
                <span className="text-xs font-medium" style={{ color: PRIMARY_SOLID }}>{item.off}</span>
              </div>
            </div>
            <button onClick={() => toggle(item.id)} className="shrink-0 p-2 transition-transform hover:scale-110 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24"
                fill={item.liked ? "#ef4444" : "none"}
                stroke={item.liked ? "#ef4444" : "#cbd5e1"}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 
function PageReferEarn() {
  const [copied, setCopied] = useState(false);
  const code = "P4U2000";
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, []);

  const steps = [
    { icon: <IcUserPlus s={20} />, label: "Refer a Friend", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
    { icon: <IcHandshake s={20} />, label: "Friend Joins", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
    { icon: <IcCoins s={20} />, label: "Earn Points", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  ];

  return (
    <div className="p-5 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <SectionTitle>Refer & Earn</SectionTitle>
        <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{ background: PRIMARY_GRADIENT }}>
          <div className="relative z-10">
            <p className="text-white/70 text-xs mb-1">Your current balance</p>
            <p className="text-white text-3xl font-semibold">300 <span className="text-lg text-white/60">Pts</span></p>
            <p className="text-white/50 text-xs mt-1">Earn 150 pts for every friend who joins</p>
          </div>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white opacity-10"><IcDollarSign s={72} /></div>
        </div>
        <div className="flex items-center justify-between gap-1 mb-6">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${s.bg} ${s.border} ${s.text}`}>{s.icon}</div>
                <p className="text-xs text-slate-500 text-center leading-tight">{s.label}</p>
              </div>
              {i < 2 && <div className="text-slate-300 text-sm pb-4">›</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="flex rounded-xl overflow-hidden border-2" style={{ borderColor: PRIMARY_SOLID }}>
          <div className="flex-1 px-5 py-3 bg-white">
            <p className="text-[10px] text-slate-400 mb-0.5">Referral Code</p>
            <p className="text-lg font-semibold text-slate-800 tracking-widest">{code}</p>
          </div>
          <button onClick={handleCopy}
            className="px-5 py-3 text-white text-sm font-medium flex items-center gap-2 cursor-pointer transition-all"
            style={{ background: PRIMARY_GRADIENT, opacity: copied ? 0.85 : 1 }}>
            <IcCopy /> {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
 
type RewardTab = "Earned" | "Redeemed";

function PageRewardPoints() {
  const [tab, setTab] = useState<RewardTab>("Earned");
  const cards = [
    { label: "Liked", points: 300, icon: <IcThumbsUp />, bg: "#fef2f2", border: "#fecaca", iconColor: "#ef4444" },
    { label: "Shared", points: 400, icon: <IcShare2 />, bg: "#eff6ff", border: "#bfdbfe", iconColor: "#3b82f6" },
    { label: "Follow", points: 500, icon: <IcUsers />, bg: "#f8fafc", border: "#e2e8f0", iconColor: "#64748b" },
    { label: "Referral", points: 400, icon: <IcGift s={20} />, bg: "#f0fdf4", border: "#bbf7d0", iconColor: "#22c55e" },
  ];
  return (
    <div className="p-5 sm:p-6">
      <SectionTitle>Reward Points</SectionTitle>
      <div className="rounded-2xl p-5 mb-5 relative overflow-hidden" style={{ background: PRIMARY_GRADIENT }}>
        <div className="relative z-10">
          <p className="text-white/70 text-xs mb-1">Total Points Available</p>
          <p className="text-white text-4xl font-semibold">1600</p>
          <p className="text-white/50 text-xs mt-1.5">Points never expire • Redeem anytime</p>
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white opacity-10"><IcTrophy s={72} /></div>
      </div>
      <TabBar<RewardTab> tabs={["Earned", "Redeemed"]} active={tab} onSelect={setTab} />
      {tab === "Earned" ? (
        <div className="grid grid-cols-2 gap-3">
          {cards.map(c => (
            <div key={c.label} className="rounded-xl p-4 flex flex-col items-center gap-2 border" style={{ background: c.bg, borderColor: c.border }}>
              <p className="text-xs text-slate-500">{c.label}</p>
              <span style={{ color: c.iconColor }}>{c.icon}</span>
              <p className="text-xl font-semibold text-slate-800">{c.points}</p>
              <p className="text-xs text-slate-400">Points</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-36 gap-3">
          <div className="text-slate-300"><IcTarget s={48} /></div>
          <p className="text-sm text-slate-400">No points redeemed yet.</p>
        </div>
      )}
    </div>
  );
}
 
function PageBecomeVendor() {
  const [showModal, setShowModal] = useState(true);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ shopName: "", gst: "", category: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const setField = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.shopName.trim()) e.shopName = "Shop name is required";
    if (!form.category) e.category = "Please select a category";
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = "Please describe your shop";
    setErrors(e); return Object.keys(e).length === 0;
  };

  if (done) return (
    <div className="p-5 sm:p-6 flex flex-col items-center justify-center min-h-64 gap-4">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600"><IcPartyPopper s={32} /></div>
      <p className="text-base font-semibold text-slate-800">Application Submitted!</p>
      <p className="text-sm text-slate-500 text-center">We'll review your application and get back to you within 2-3 business days.</p>
    </div>
  );

  return (
    <div className="p-5 sm:p-6">
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-7 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600"><IcSmile s={32} /></div>
            <h3 className="text-base font-semibold text-slate-800 mb-2">Ready to Become a Vendor?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Join thousands of sellers on our platform and start selling today.</p>
            <div className="flex gap-3">
              <GhostBtn onClick={() => setShowModal(false)} className="flex-1">Not Now</GhostBtn>
              <PrimaryBtn onClick={() => setShowModal(false)} className="flex-1">Let's Go!</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
      <SectionTitle>Become a Vendor</SectionTitle>
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${step >= s ? "text-white" : "bg-slate-100 text-slate-400"}`}
                style={step >= s ? { background: PRIMARY_GRADIENT } : {}}>
                {step > s ? <IcCheck /> : s}
              </div>
              <span className={`text-xs ${step >= s ? "font-medium" : "text-slate-400"}`} style={step >= s ? { color: PRIMARY_SOLID } : {}}>
                {s === 1 ? "Shop Details" : "Description"}
              </span>
            </div>
            {s < 2 && <div className="flex-1 h-px bg-slate-200 mx-1" />}
          </React.Fragment>
        ))}
      </div>
      {step === 1 ? (
        <div className="space-y-4">
          <Input label="Shop Name *" placeholder="Your shop name" value={form.shopName} onChange={e => setField("shopName", e.target.value)} error={errors.shopName} />
          <Input label="GST Number (Optional)" placeholder="22AAAAA0000A1Z5" value={form.gst} onChange={e => setField("gst", e.target.value.toUpperCase())} />
          <Select label="Category *" value={form.category} onChange={e => setField("category", e.target.value)} error={errors.category}
            options={[{ value: "", label: "Select category" }, { value: "electronics", label: "Electronics" }, { value: "clothing", label: "Clothing" }, { value: "groceries", label: "Groceries" }, { value: "restaurants", label: "Restaurants" }, { value: "services", label: "Services" }]} />
          <div className="flex justify-end pt-2">
            <PrimaryBtn onClick={() => { if (validateStep1()) setStep(2); }}>Next Step →</PrimaryBtn>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea label="Shop Description *" rows={4} value={form.description}
            onChange={e => setField("description", e.target.value)}
            placeholder="Tell customers about your shop, what you sell, and why they should choose you..."
            error={errors.description} />
          <div className="flex gap-3 pt-2">
            <GhostBtn onClick={() => setStep(1)}>← Back</GhostBtn>
            <PrimaryBtn onClick={() => { if (validateStep2()) setDone(true); }}>Submit Application</PrimaryBtn>
          </div>
        </div>
      )}
    </div>
  );
}
  
function PageAccountPrivacy() {
  const [deleteConsent, setDeleteConsent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className="p-5 sm:p-6">
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <div className="p-7 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-500"><IcAlert /></div>
            <h3 className="text-base font-semibold text-slate-800 mb-2">Delete Account?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">This is permanent. All your data, orders, and preferences will be removed and cannot be recovered.</p>
            <div className="flex gap-3">
              <GhostBtn onClick={() => { setShowConfirm(false); setDeleteConsent(false); }} className="flex-1">Cancel</GhostBtn>
              <button className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all cursor-pointer">Delete Forever</button>
            </div>
          </div>
        </Modal>
      )}
      <SectionTitle>Account Privacy</SectionTitle>
      <div className="text-sm text-slate-600 mb-5 space-y-3 leading-relaxed">
        <p>At Planext4u, we are committed to protecting the privacy and security of our users' personal information.</p>
        <p>We collect information such as your name, email address, phone number, and payment details to facilitate transactions and provide our services.</p>
        <p>Your data is stored securely and never sold to third parties. You have the right to access, modify, or delete your personal information at any time.</p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5 flex gap-3">
        <span className="text-amber-500 shrink-0 mt-0.5"><IcAlert /></span>
        <div>
          <p className="text-xs font-medium text-amber-800 mb-1">Account Deletion Warning</p>
          <p className="text-xs text-amber-700 leading-relaxed">Deleting your account permanently removes all data, orders, and preferences. This action cannot be undone.</p>
        </div>
      </div>
      <label className="flex items-start gap-3 cursor-pointer mb-5">
        <input type="checkbox" checked={deleteConsent} onChange={e => setDeleteConsent(e.target.checked)}
          className="w-4 h-4 mt-0.5 accent-red-500 shrink-0 cursor-pointer" />
        <span className="text-sm text-slate-600">I understand and wish to permanently delete my account and all associated data.</span>
      </label>
      {deleteConsent && (
        <button onClick={() => setShowConfirm(true)} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all cursor-pointer">
          Delete My Account
        </button>
      )}
    </div>
  );
}
 
function PageLogout({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="p-5 sm:p-6 flex items-center justify-center min-h-72">
      <div className="bg-white rounded-2xl p-8 w-full max-w-xs shadow-sm border border-slate-100 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-500"><IcLogOutBig /></div>
        <h3 className="text-base font-semibold text-slate-800 mb-2">Leaving so soon?</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">You're about to end your session. Come back anytime!</p>
        <div className="flex gap-3">
          <GhostBtn onClick={onCancel} className="flex-1">Stay</GhostBtn>
          <PrimaryBtn className="flex-1">Log Out</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}
 
function ProfileHeader({ avatarUrl, onAvatarChange }: { avatarUrl: string | null; onAvatarChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => onAvatarChange(ev.target?.result as string);
    reader.readAsDataURL(f); e.target.value = "";
  };
  return (
    <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100" style={{ background: "linear-gradient(to right,#f0fdf4,#f8fafc)" }}>
      <div className="flex items-center gap-3">
        <div className="relative cursor-pointer" onClick={() => ref.current?.click()}>
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-200" />
            : <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold ring-2 ring-emerald-200" style={{ background: PRIMARY_GRADIENT }}>P</div>}
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white" style={{ background: PRIMARY_SOLID }}>
            <IcCamera s={10} />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Planext4u</p>
          <p className="text-xs text-slate-400">One App Infinite Solutions</p>
        </div>
      </div>
      <button onClick={() => ref.current?.click()} className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer">
        <IcCamera />
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
} 
function Sidebar({ active, setActive, onClose }: { active: ActivePage; setActive: (p: ActivePage) => void; onClose?: () => void }) {
  return (
    <div className="w-full bg-white flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] text-slate-400 tracking-widest uppercase">Your Account</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-1">
        {SIDEBAR_ITEMS.map(({ id, label, icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => { setActive(id); onClose?.(); }}
              className={`flex items-center justify-between w-full px-4 py-2.5 text-left text-xs transition-all border-none cursor-pointer ${!isActive ? "text-slate-600 hover:bg-slate-50" : "text-white"}`}
              style={isActive ? { background: PRIMARY_GRADIENT } : {}}>
              <span className="flex items-center gap-2.5">
                <span className={isActive ? "text-white" : "text-slate-400"}>{icon}</span>
                {label}
              </span>
              <span className={isActive ? "text-white/70" : "text-slate-300"}><IcChevronR /></span>
            </button>
          );
        })}
      </nav>
    </div>
  );
} 
export default function ProfilePages() {
  const [activePage, setActivePage] = useState<ActivePage>("profile");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const renderPage = (): React.ReactNode => {
    switch (activePage) {
      case "profile": return <PageProfile />;
      case "saved-addresses": return <PageSavedAddresses />;
      case "select-language": return <PageSelectLanguage />;
      case "notification": return <PageNotification />;
      case "your-orders": return <PageYourOrders />;
      case "reviews-ratings": return <PageReviews />;
      case "your-favourites": return <PageFavourites />;
      case "refer-earn": return <PageReferEarn />;
      case "reward-points": return <PageRewardPoints />;
      case "become-vendor": return <PageBecomeVendor />;
      case "account-privacy": return <PageAccountPrivacy />;
      case "logout": return <PageLogout onCancel={() => setActivePage("profile")} />;
      default: return <PageProfile />;
    }
  };

  const activeLabel = SIDEBAR_ITEMS.find(s => s.id === activePage)?.label || "Profile";
useEffect(() => {
  if (!isLoading && !isLoggedIn) {
    window.location.href = "/p4u"; 
  }
}, [isLoading, isLoggedIn]);

if (isLoading) return null;
if (!isLoggedIn) return null;
  return (
    <>
      <style>{`
        
        .hide-desktop { display: flex !important; }
        .show-desktop { display: none !important; }
        @media (min-width: 768px) {
          .hide-desktop { display: none !important; }
          .show-desktop { display: flex !important; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>

      <div className="min-h-screen bg-white flex flex-col">
    <header className="w-full shadow-sm">
  <div className="max-w-[1400px] mx-auto h-14 flex items-center justify-between px-4 sm:px-6"  style={{ background: PRIMARY_GRADIENT, position: 'sticky', top: 0, zIndex: 50 }}>
            <button className="hide-desktop w-8 h-8 rounded-xl bg-white/10 border border-white/20 items-center justify-center text-white cursor-pointer"
              onClick={() => setMobileOpen(true)}><IcMenu /></button>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-white/40" />
              : <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold">P</div>}
            <div>
              <p className="text-white text-sm font-medium">Planext4u</p>
              <p className="text-white/60 text-[10px]">One App Infinite Solutions</p>
            </div>
          </div> 
        </header>

        <div className="flex-1 bg-white">
          <div className="max-w-[1400px] mx-auto flex min-h-[calc(100vh-56px)]">
           <aside
  className="show-desktop w-[220px] shrink-0 bg-white border-r border-slate-100 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto"
>
              <Sidebar active={activePage} setActive={setActivePage} />
            </aside>

            {mobileOpen && (
              <div className="fixed inset-0 z-[200] md:hidden flex">
                <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                <div className="relative w-56 bg-white h-full shadow-2xl overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-700">Menu</p>
                    <button onClick={() => setMobileOpen(false)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"><IcX /></button>
                  </div>
                  <Sidebar active={activePage} setActive={setActivePage} onClose={() => setMobileOpen(false)} />
                </div>
              </div>
            )}

            <main className="flex-1 min-w-0 bg-white overflow-y-auto h-[calc(100vh-56px)]">
              <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-5 flex gap-5 items-start">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden w-full">
                  <ProfileHeader avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
                  {renderPage()}
                </div>

              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}