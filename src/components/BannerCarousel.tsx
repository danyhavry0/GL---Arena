"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

  // Assicurati che currentIndex sia sempre valido
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

  // Controlli di sicurezza
  if (images.length === 0 || !images) return null;
  
  // Assicurati che currentIndex sia valido
  const validIndex = Math.max(0, Math.min(currentIndex, images.length - 1));
  const currentImage = images[validIndex];
  
  if (!currentImage) return null;

  return (
    <div className="relative w-full h-[28rem] md:h-[36rem] lg:h-[44rem] rounded-lg overflow-hidden bg-muted">
      {/* Background blur per tutte le immagini */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`blur-${validIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={currentImage.src}
            alt={`${currentImage.alt} Background`}
            fill
            className="object-cover blur-3xl opacity-50 scale-125"
            priority
            sizes="100vw"
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      {/* Immagini principali */}
      <AnimatePresence mode="wait">
        <motion.div
          key={validIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient metallico uniforme su tutti i lati */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70 z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/70 z-20 pointer-events-none" />

      {/* Controlli di navigazione - mostrati solo se ci sono più immagini */}
      {images.length > 1 && (
        <>
          {/* Freccia sinistra */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-background/40 backdrop-blur-sm border border-border hover:bg-background/60 transition-colors"
            aria-label="Immagine precedente"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Freccia destra */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-background/40 backdrop-blur-sm border border-border hover:bg-background/60 transition-colors"
            aria-label="Immagine successiva"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-foreground/30 hover:bg-foreground/50"
                }`}
                aria-label={`Vai all'immagine ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
