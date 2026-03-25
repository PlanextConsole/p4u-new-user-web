"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Image from "next/image"; 
import bluetooth from "../images/best-products/bluetooth-speaker.png";
import mobile from "../images/best-products/mobile.png";
import moniter from "../images/best-products/moniter.png";
import printer from "../images/best-products/printer.png";
import watch from "../images/best-products/watch.png";

const products = [
  {
    name: "Best Truewireless",
    subtitle: "Grab Now",
    price: null,
    image: mobile,
  },
  {
    name: "Best Selling Mobile S.....",
    subtitle: null,
    price: "₹499*",
    image: bluetooth,
  },
  {
    name: "Smart Watches",
    subtitle: null,
    price: "₹1,399",
    image: watch,
  },
  {
    name: "Printers",
    subtitle: null,
    price: "₹2,336",
    image: printer,
  },
  {
    name: "Monitor",
    subtitle: null,
    price: "₹9,336",
    image: moniter,
  },
  {
    name: "Monitor",
    subtitle: null,
    price: "₹9,336",
    image: moniter,
  },
  {
    name: "Best Truewireless",
    subtitle: "Grab Now",
    price: null,
    image: mobile,
  },
  {
    name: "Best Selling Mobile S.....",
    subtitle: null,
    price: "₹499*",
    image: bluetooth,
  },
];

export default function BestProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className=" mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 mt-2 sm:mt-3 md:mt-4">  
       <div
  className="rounded-2xl sm:rounded-3xl overflow-hidden"
  style={{
    background: `
      linear-gradient(
        to bottom,
        transparent 0%,
        transparent 50%,
        white 50%,
        white 100%
      ),
      radial-gradient(
        at 60% 25%,
        rgb(26, 74, 58) 0%,
        rgb(14, 34, 31) 55%,
        rgb(8, 24, 18) 100%
      )
    `,
  }}
>

          <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6"> 
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold">
                Best of Products
              </h2>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => scroll("left")}
                  className="bg-white rounded-full p-1.5 sm:p-2 lg:p-2.5 hover:bg-gray-100 transition-colors shadow-md"
                  aria-label="Scroll left"
                >
                  <ChevronLeft
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: "var(--primary-teal)" }}
                  />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="bg-white rounded-full p-1.5 sm:p-2 lg:p-2.5 hover:bg-gray-100 transition-colors shadow-md"
                  aria-label="Scroll right"
                >
                  <ChevronRight
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: "var(--primary-teal)" }}
                  />
                </button>
              </div>
            </div>

            {/* Products Slider */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-hide pb-4 sm:pb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((product, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[240px] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="h-[160px] sm:h-[200px] lg:h-[240px] bg-white flex items-center justify-center p-4 sm:p-5 lg:p-6">
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 lg:p-5 text-center bg-white border-t border-gray-100">
                    <p className="text-xs sm:text-sm lg:text-base text-gray-800 mb-1 font-medium line-clamp-2">
                      {product.name}
                    </p>
                    {product.subtitle && (
                      <p className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">
                        {product.subtitle}
                      </p>
                    )}
                    {product.price && (
                      <p className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">
                        From {product.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
