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
      className="relative mb-16 overflow-hidden rounded-2xl"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Slides */}
      <div className="relative">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`transition-opacity duration-700 ${
              i === current ? "relative opacity-100" : "absolute inset-0 opacity-0 pointer-events-none"
            }`}
          >
            {slide.type === "hero" ? (
              /* Hero text slide */
              <div className="flex flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
                  {heroTitle}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {heroHighlight}
                  </span>{" "}
                  Task
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
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
              /* Image slide */
              <Link href={slide.href} className="group block">
                <div className="relative">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full rounded-2xl object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                  {/* Overlay text for image slides */}
                  {(slide.title || slide.subtitle) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/30 p-6 text-center transition-colors group-hover:bg-black/40">
                      {slide.title && (
                        <h2 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                          {slide.title}
                        </h2>
                      )}
                      {slide.subtitle && (
                        <p className="mt-2 max-w-xl text-lg text-white/90 drop-shadow-md">
                          {slide.subtitle}
                        </p>
                      )}
                      <span className="mt-4 inline-block rounded-xl bg-white/20 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-white/30">
                        Try Now →
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === current
                  ? "bg-white shadow-md scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
