"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner1 from "../../images/home-banner/banner1.png";
import banner2 from "../../images/home-banner/banner2.jpg";
import banner3 from "../../images/home-banner/banner3.png";
import { contentApi } from "@/lib/api/content";

const FALLBACK_SLIDES = [
  { image: banner1, alt: "Banner" },
  { image: banner2, alt: "Banner" },
  { image: banner3, alt: "Banner" },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<{ image: any; alt: string }[]>(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [slidePosition, setSlidePosition] = useState(0);

  useEffect(() => {
    contentApi.getBanners().then((banners) => {
      if (banners.length) {
        setSlides(banners.map((b) => ({ image: (b.imageUrl || b.image) as any, alt: b.title ?? "Banner" })));
        setCurrentSlide(0);
        setSlidePosition(0);
      }
    }).catch(() => {});
  }, []);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setSlidePosition((prev) => prev - 100);
    setCurrentSlide((prev) => {
      const len = slides.length;
      if (len < 1) return 0;
      return (prev + 1) % len;
    });
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setSlidePosition((prev) => prev + 100);
    setCurrentSlide((prev) => {
      const len = slides.length;
      if (len < 1) return 0;
      return (prev - 1 + len) % len;
    });
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, nextSlide]);

  useEffect(() => {
    const n = slides.length;
    if (n < 1) return;
    const wrap = n * 100;
    if (currentSlide === 0 && slidePosition <= -wrap) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setSlidePosition(0);
      }, 700);
      return () => clearTimeout(t);
    }
    if (currentSlide === n - 1 && slidePosition >= 0 && slidePosition > -100) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setSlidePosition(-(n - 1) * 100);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [currentSlide, slidePosition, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 mt-2 sm:mt-3 md:mt-4">
        <div className="h-[180px] xs:h-[200px] sm:h-[250px] md:h-[320px] lg:h-[400px] xl:h-[450px] bg-gray-100 rounded-lg sm:rounded-xl md:rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 mt-2 sm:mt-3 md:mt-4">
      <div className="relative h-[180px] xs:h-[200px] sm:h-[250px] md:h-[320px] lg:h-[400px] xl:h-[450px] bg-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
 
        <div
          className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{ transform: `translateX(${slidePosition}%)` }}
        >
           {[...slides, ...slides].map((slide, index) => (
            <div
              key={index}
              className="min-w-full h-full relative flex-shrink-0"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover rounded-lg sm:rounded-xl md:rounded-2xl"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1400px"
              />
            </div>
          ))}
        </div>

         <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 z-20 shadow-md transition-all duration-200 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 z-20 shadow-md transition-all duration-200 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </button>

         <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const diff = index - currentSlide;
                setIsTransitioning(true);
                setSlidePosition((prev) => prev - (diff * 100));
                setCurrentSlide(index);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white w-6 sm:w-8"
                  : "bg-white/50 w-1.5 sm:w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}