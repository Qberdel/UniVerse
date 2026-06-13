import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { BANNER_SLIDES, BANNER_INTERVAL_MS } from "../lib/banner-data";

export function ActivityBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    const total = BANNER_SLIDES.length;
    if (total === 0) return;
    setActiveIndex(((index % total) + total) % total);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % BANNER_SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused || BANNER_SLIDES.length <= 1) return;
    const timer = window.setInterval(goNext, BANNER_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, goNext]);

  if (BANNER_SLIDES.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden rounded-xl border bg-card shadow-sm"
      aria-roledescription="carousel"
      aria-label="Активности университетов"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-[2.4/1] sm:aspect-[2.8/1] md:aspect-[3.2/1] min-h-[140px] max-h-[280px] sm:max-h-[300px]">
        {BANNER_SLIDES.map((slide, index) => (
          <article
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
            aria-hidden={index !== activeIndex}
          >
            <img
              src={slide.imageSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-primary/20" />
            <div className="relative z-10 flex h-full flex-col justify-center px-4 sm:px-8 md:px-10 lg:px-12 max-w-xl md:max-w-2xl">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-primary-foreground/70 mb-1 sm:mb-1.5">
                {slide.university}
              </p>
              <h2 className="text-base sm:text-xl md:text-2xl font-medium text-primary-foreground mb-1 sm:mb-2 leading-snug line-clamp-2">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-primary-foreground/85 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {slide.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {BANNER_SLIDES.length > 1 && (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute left-2 sm:left-3 top-1/2 z-20 -translate-y-1/2 size-8 sm:size-9 rounded-full opacity-80 hover:opacity-100 shadow-md"
            onClick={goPrev}
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 sm:right-3 top-1/2 z-20 -translate-y-1/2 size-8 sm:size-9 rounded-full opacity-80 hover:opacity-100 shadow-md"
            onClick={goNext}
            aria-label="Следующий слайд"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </Button>

          <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:gap-2">
            {BANNER_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Слайд ${index + 1}: ${slide.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  index === activeIndex
                    ? "w-6 sm:w-8 bg-primary-foreground"
                    : "w-1.5 bg-primary-foreground/40 hover:bg-primary-foreground/60",
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
