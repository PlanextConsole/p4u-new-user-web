"use client";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Home, Compass, Film, MessageCircle, Bell, PlusCircle, User, Settings } from "lucide-react";
import {
    HomeSection, ExploreSection, ReelsSection, MessagesSection,
    NotificationsSection, CreateSection, ProfileSection, SettingsSection,
} from "./social";
import logo from "../../images/logo.png";

export type Section = "home" | "explore" | "reels" | "messages" | "notifications" | "create" | "profile" | "settings";

const NAV_ITEMS: { label: string; section: Section; icon: React.ElementType }[] = [
    { label: "Home",         section: "home",          icon: Home },
    { label: "Explore",      section: "explore",       icon: Compass },
    { label: "Reels",        section: "reels",         icon: Film },
    { label: "Messages",     section: "messages",      icon: MessageCircle },
    { label: "Notification", section: "notifications", icon: Bell },
    { label: "Create",       section: "create",        icon: PlusCircle },
    { label: "Profile",      section: "profile",       icon: User },
    { label: "Settings",     section: "settings",      icon: Settings },
]; 
const BOTTOM_NAV: Section[] = ["home", "explore", "reels", "create", "profile"];

export const TEAL = "linear-gradient(135deg,#0d9488,#14b8a6)";

export default function SocialPage() {
    const [active, setActive] = useState<Section>("home");
    const [mobileOpen, setMobileOpen] = useState(false);

    const renderSection = () => {
        switch (active) {
            case "home":          return <HomeSection />;
            case "explore":       return <ExploreSection />;
            case "reels":         return <ReelsSection />;
            case "messages":      return <MessagesSection />;
            case "notifications": return <NotificationsSection />;
            case "create":        return <CreateSection />;
            case "profile":       return <ProfileSection />;
            case "settings":      return <SettingsSection onNavigate={setActive} />;
        }
    };

    return (
        <div className="bg-gray-50 font-sans" style={{ minHeight: "100vh" }}>
            <div className="mx-auto flex" style={{ maxWidth: 1400, height: "100vh", overflow: "hidden" }}>
 
                <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 bg-white border-b border-gray-100 shadow-sm lg:hidden" style={{ height: 52 }}>
                    <span
                        className="font-bold text-xl tracking-tight"
                        style={{ background: TEAL, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                        P4U
                    </span>
 
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActive("notifications")}
                            className="relative p-1"
                        >
                            <Bell className={`w-5 h-5 ${active === "notifications" ? "text-teal-600" : "text-gray-700"}`} />
                            {/* unread dot */}
                            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>
                        <button
                            onClick={() => setActive("messages")}
                            className="relative p-1"
                        >
                            <MessageCircle className={`w-5 h-5 ${active === "messages" ? "text-teal-600" : "text-gray-700"}`} />
                            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>
                        <button onClick={() => setMobileOpen(true)} className="p-1">
                            <Menu className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>
 
                {mobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            onClick={() => setMobileOpen(false)}
                        />
                        <div className="absolute right-0 top-0 bottom-0 w-56 bg-white shadow-2xl flex flex-col py-6 px-3">
                            <div className="flex items-center justify-between px-2 mb-6">
                                <span
                                    className="font-bold text-lg"
                                    style={{ background: TEAL, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                                >
                                    P4U
                                </span>
                                <button onClick={() => setMobileOpen(false)} className="p-1">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-1">
                                {NAV_ITEMS.map(({ label, section, icon: Icon }) => (
                                    <button
                                        key={section}
                                        onClick={() => { setActive(section); setMobileOpen(false); }}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${active === section ? "text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}
                                        style={active === section ? { background: TEAL } : {}}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}
 
                <aside
                    className="hidden lg:flex flex-col w-52 shrink-0 bg-white border-r border-gray-100 py-6 px-3"
                    style={{ height: "100vh", overflow: "hidden" }}
                >
                    <nav className="flex flex-col gap-1">
                        {NAV_ITEMS.map(({ label, section, icon: Icon }) => (
                            <button
                                key={section}
                                onClick={() => setActive(section)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${active === section ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                                style={active === section ? { background: TEAL } : {}}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>
  
                <main className="flex-1 min-w-0 overflow-y-auto pb-[56px] lg:pb-0"> 
                    <div className="h-[52px] lg:hidden" />
                    {renderSection()}
                </main> 
                <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg lg:hidden flex items-center justify-around px-2 py-1" style={{ height: 56 }}>
                    {BOTTOM_NAV.map((section) => {
                        const item = NAV_ITEMS.find(n => n.section === section)!;
                        const Icon = item.icon;
                        const isActive = active === section; 
                        if (section === "create") {
                            return (
                                <button
                                    key={section}
                                    onClick={() => setActive(section)}
                                    className="flex items-center justify-center w-10 h-10 rounded-2xl shadow-md transition-transform active:scale-95"
                                    style={{ background: TEAL }}
                                    aria-label="Create"
                                >
                                    <PlusCircle className="w-5 h-5 text-white" />
                                </button>
                            );
                        }

                        return (
                            <button
                                key={section}
                                onClick={() => setActive(section)}
                                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? "text-teal-600" : "text-gray-400 hover:text-gray-600"}`}
                                aria-label={item.label}
                            >
                                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                                <span className={`text-[9px] font-semibold transition-all ${isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span
                                        className="w-1 h-1 rounded-full mt-0.5"
                                        style={{ background: TEAL, display: "block" }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

            </div>
        </div>
    );
}