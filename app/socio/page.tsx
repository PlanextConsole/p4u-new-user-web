
  
"use client";
import SocialPage from "./SocialPage"; 
import Header from "@/components/Header";
import Footer from "@/components/Footer"; 
import { useRouter } from "next/navigation";

export default function ShopRoute() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SocialPage />
      </main>
    </div>
  );
}
