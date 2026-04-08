"use client";

import { useState, useEffect } from "react";
import { Heart, Clock, Star } from "lucide-react";
import Image from "next/image";
import { catalogApi } from "@/lib/api/catalog";
import { pickProductImage, pickServiceImage } from "@/lib/media";

import lamp from "../../images/home-services/lamp.png";
import kitchen from "../../images/home-services/kitchenapplication.png";
import homeApp from "../../images/home-services/home-application-left.png";
import flower from "../../images/home-services/flower-stand.png";
import coffee from "../../images/home-services/cofeemaker.png";
import sofa from "../../images/home-services/sofa-chair.png";
import pot from "../../images/home-services/pot.png";
import socket from "../../images/home-services/socket.png";

const FALLBACK_SERVICES = [
  {
    id: 1,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using quality (Anchor)",
    offer: "50% OFF",
  },
  {
    id: 2,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using quality to wall",
    offer: "50% OFF",
  },
  {
    id: 3,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using existing to wall",
    offer: "50% OFF",
  },
  {
    id: 4,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using existing to wall",
    offer: "50% OFF",
  },
  {
    id: 5,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using existing to wall",
    offer: "50% OFF",
  },
  {
    id: 6,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using existing to wall",
    offer: "50% OFF",
  },
  {
    id: 7,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using existing to wall",
    offer: "50% OFF",
  },
  {
    id: 8,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using existing to wall",
    offer: "50% OFF",
  },
  {
    id: 9,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using existing to wall",
    offer: "50% OFF",
  },
  {
    id: 10,
    image: socket,
    title: "Switch/Socket repair & replacement",
    rating: 4.8,
    reviews: 2847,
    price: 79,
    originalPrice: 150,
    duration: "20mins",
    description: "Repair or replacement using existing to wall",
    offer: "50% OFF",
  },
];

const FALLBACK_HOME_SERVICES = [
  { name: "Soft chairs", price: "₹1,499", image: sofa },
  { name: "Sofa & chair", price: "₹1,499", image: sofa },
  { name: "Kitchen dishes", price: "₹1,499", image: pot },
  { name: "Smart watches", price: "₹1,499", image: lamp },
  { name: "Kitchen mixer", price: "₹1,499", image: kitchen },
  { name: "Blenders", price: "₹1,499", image: coffee },
  { name: "Home appliance", price: "₹1,499", image: lamp },
  { name: "Coffee maker", price: "₹1,499", image: flower },
];

const HOME_IMG_MAP: Record<number, any> = { 0: sofa, 1: sofa, 2: pot, 3: lamp, 4: kitchen, 5: coffee, 6: lamp, 7: flower };

export default function ServiceComponents() {
  const [mostBookedServices, setMostBookedServices] = useState<{ id: string | number; image: string | typeof socket; title: string; rating: number; reviews: number; price: number; originalPrice: number; duration: string; description: string; offer: string }[]>([]);
  const [homeServices, setHomeServices] = useState<{ name: string; price: string; image: any }[]>([]);

  useEffect(() => {
    catalogApi
      .getVendors({ limit: 1 })
      .then((vres) => {
        const vid = vres.data?.[0]?.id;
        if (!vid) return;
        return catalogApi.getVendorProducts(vid, { limit: 8, offset: 0 });
      })
      .then((res) => {
        if (!res?.data) return;
        setHomeServices(
          res.data.map((p) => ({
            name: p.name,
            price: p.price
              ? `₹${Number((p as any).finalPrice ?? (p as any).sellPrice ?? p.price).toLocaleString("en-IN")}`
              : "",
            image: pickProductImage(p as any) || sofa,
          })),
        );
      })
      .catch(() => {});

    catalogApi.getServices({ limit: 10 }).then((res) => {
      setMostBookedServices(
        res.data.map((s) => ({
          id: s.id,
          image: pickServiceImage(s as any) || socket,
          title: s.name,
          rating: 0,
          reviews: 0,
          price: Number((s as any).metadata?.price ?? (s as any).price ?? 0),
          originalPrice: (s as any).metadata?.originalPrice
            ? Number((s as any).metadata.originalPrice)
            : Number((s as any).metadata?.price ?? 0),
          duration: String((s as any).metadata?.duration ?? ""),
          description: s.description ?? "",
          offer: "",
        })),
      );
    }).catch(() => {});
  }, []);

  return (
    <div className=" mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6     ">
      <section className="my-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl mb-2   font-bold">
          Most Booked services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
          {mostBookedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg border p-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image Container */}
              <div className="relative bg-gray-100 h-32 sm:h-36 lg:h-40">
                <button className="absolute top-2 right-2 z-10 w-6 h-6 lg:w-7 lg:h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm">
                  <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
                </button>

                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
 
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white rounded px-1.5 py-0.5 shadow-sm">
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                  <span className="font-semibold text-xs">
                    {service.rating}
                  </span>
                </div>
              </div>
 
              <div className="p-2.5 lg:p-3">
                {/* Title */}
                <h3 className="font-semibold text-xs lg:text-sm leading-tight line-clamp-2 mb-2 min-h-[32px]">
                  {service.title}
                </h3>
 
                <div className="mb-2">
                  <div className="text-xs lg:text-sm">
                    <span className="text-gray-600">Starts at </span>
                    <span className="font-bold text-black">
                      ₹{service.price}
                    </span>
                    <span className="line-through text-gray-400 ml-1 text-xs">
                      ₹{service.originalPrice}
                    </span>
                  </div>
                </div> 
                <div className="flex items-center gap-1 text-gray-600 text-xs mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{service.duration}</span>
                </div>
 
                <p className="text-xs text-gray-600 line-clamp-2 mb-2 min-h-[28px]">
                  {service.description}
                </p>
 
                <div className="mb-2">
                  <span className="inline-block bg-green-500 text-white px-2 py-0.5 text-xs rounded font-medium">
                    {service.offer}
                  </span>
                </div> 
                <button className="w-full py-1.5 lg:py-2 border border-teal-500 text-teal-600 rounded text-xs lg:text-sm font-medium hover:bg-teal-50 transition-colors">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section> 
    <section className="my-6"> 
        <div className="block lg:hidden mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Home Services</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"> 
          <div className="hidden lg:flex lg:col-span-1 lg:row-span-2 bg-[#f5e6d3] rounded-lg overflow-hidden relative">
            <div className="w-full h-full flex flex-col"> 
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Home Services
                </h2>
              </div> 
              <div className="flex-1 flex items-end justify-center">
                <Image
                  src={homeApp}
                  alt="Home Services"
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
          </div>
 
          {homeServices.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 sm:p-4 lg:p-4 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex flex-col h-full">
                <h3 className="font-medium text-sm lg:text-base text-left mb-1">
                  {service.name}
                </h3>
                <div className="text-left mb-2">
                  <p className="text-gray-400 text-xs">From</p>
                  <p className="font-normal text-sm text-gray-700">
                    {service.price}
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-end">
                  <Image
                    src={service.image}
                    alt={service.name}
                    className="object-contain max-w-full max-h-full"
                    width={90}
                    height={90}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
