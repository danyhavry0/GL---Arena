"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface BannerImage {
  src: string;
  alt: string;
}

interface BannerCarouselProps {
  images: BannerImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function BannerCarousel({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1 || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  if (images.length === 0 || !images) return null;
  
  const validIndex = Math.max(0, Math.min(currentIndex, images.length - 1));
  const currentImage = images[validIndex];
  
  if (!currentImage) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[360px] group">
      {/* Outer neon border glow */}
      <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 rounded-2xl opacity-60 blur-sm group-hover:opacity-80 transition-opacity" />
      
      {/* Main container with border */}
      <div className="relative h-full rounded-2xl overflow-hidden border-2 border-cyan-500/50 bg-card">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl z-20" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-pink-400 rounded-tr-2xl z-20" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-violet-400 rounded-bl-2xl z-20" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl z-20" />

        {/* Subtle static overlay for depth */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-30"
          style={{
            background: "linear-gradient(135deg, transparent 40%, rgba(0, 255, 255, 0.05) 50%, transparent 60%)",
          }}
        />

        {/* Background image with dark overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={validIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-transparent to-card/80" />
          </motion.div>
        </AnimatePresence>

        {/* Cyber grid pattern overlay */}
        <div 
          className="absolute inset-0 z-10 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-lg bg-card/80 backdrop-blur-sm border border-cyan-500/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_hsl(190,95%,55%,0.3)] transition-all group/btn"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-cyan-400 group-hover/btn:text-cyan-300" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-lg bg-card/80 backdrop-blur-sm border border-cyan-500/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_hsl(190,95%,55%,0.3)] transition-all group/btn"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover/btn:text-cyan-300" />
            </button>

            {/* Dots indicator with neon style */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-cyan-500/30">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_10px_hsl(190,95%,55%,0.5)]"
                      : "w-2 bg-cyan-500/30 hover:bg-cyan-500/60"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
