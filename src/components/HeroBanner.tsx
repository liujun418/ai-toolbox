"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export interface HeroSlide {
  type: "hero";
}

export interface ImageSlide {
  type: "image";
  image: string;
  href: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

export type Slide = HeroSlide | ImageSlide;

interface HeroBannerProps {
  locale: string;
  slides: Slide[];
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  signupLabel: string;
  pricingLabel: string;
}

export default function HeroBanner({
  locale,
  slides,
  heroTitle,
  heroHighlight,
  heroDescription,
  signupLabel,
  pricingLabel,
}: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [hovering, setHovering] = useState(false);

  const goTo = useCallback((i: number) => setCurrent(i), []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (hovering || slides.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [hovering, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative mb-10 overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Slides track — horizontal sliding */}
      <div className="relative h-80 sm:h-96 lg:h-[420px]">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="h-full w-full shrink-0">
              {slide.type === "hero" ? (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center sm:px-6">
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
                    {heroTitle}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {heroHighlight}
                    </span>{" "}
                    Task
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
                    {heroDescription}
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Link
                      href={`/${locale}/signup`}
                      className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      {signupLabel}
                    </Link>
                    <Link
                      href={`/${locale}/pricing`}
                      className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {pricingLabel}
                    </Link>
                  </div>
                </div>
              ) : (
                <Link href={slide.href} className="group relative flex h-full w-full">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="h-full w-full object-cover"
                  />
                  {(slide.title || slide.subtitle) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-6 text-center transition-colors group-hover:bg-black/40">
                      {slide.title && (
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg sm:text-3xl lg:text-4xl">
                          {slide.title}
                        </h2>
                      )}
                      {slide.subtitle && (
                        <p className="mt-2 max-w-xl text-base text-white/90 drop-shadow-md sm:text-lg">
                          {slide.subtitle}
                        </p>
                      )}
                      <span className="mt-4 inline-block rounded-xl bg-white/20 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-white/30">
                        Try Now →
                      </span>
                    </div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === current
                  ? "w-5 bg-white shadow-sm"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
