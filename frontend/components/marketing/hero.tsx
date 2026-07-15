"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock3,
  BarChart3,
} from "lucide-react";
import { getAnalyticsSummary } from "@/services/api/analytics.api";
import { getCurrentPlans } from "@/services/api/planner.api";
import { useAuthStore } from "@/store/auth.store";

interface HeroSlide {
  title: string;
  subtitle: string;
  details: string;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  slides?: HeroSlide[];
}

const defaultSlides: HeroSlide[] = [
  {
    title: "AI-powered script creation",
    subtitle: "Move from idea to publish-ready content in minutes.",
    details:
      "Generate voice-consistent scripts, social hooks, and content outlines with built-in guidance.",
  },
  {
    title: "Smart calendar planning",
    subtitle: "Keep your publishing rhythm moving forward.",
    details:
      "Visualize every release, deadline, and campaign moment in one fast creator workflow.",
  },
  {
    title: "Creator analytics made easy",
    subtitle: "See what works and iterate faster.",
    details:
      "Track performance trends, audience interest, and content momentum in a simple dashboard.",
  },
];

const slideIcons = [Sparkles, Clock3, BarChart3];
const numberFormat = new Intl.NumberFormat("en-US");

export default function Hero({
  title = "Create better content with less effort.",
  subtitle = "Generate scripts, organize ideas, plan campaigns, and stay consistent across every channel with a single creator workspace.",
  slides = defaultSlides,
}: HeroProps) {
  const user = useAuthStore((state) => state.user);
  const access = useAuthStore((state) => state.access);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesWithIcons = slides.map((slide, index) => ({
    ...slide,
    icon: slideIcons[index % slideIcons.length],
  }));

  const activeSlide = slidesWithIcons[activeIndex];
  const ActiveIcon = activeSlide.icon;
  const activityStatsEnabled = hasHydrated && Boolean(user && access);

  const analyticsQuery = useQuery({
    queryKey: ["analytics-summary"],
    queryFn: getAnalyticsSummary,
    enabled: activityStatsEnabled,
    staleTime: 60_000,
  });

  const plannerQuery = useQuery({
    queryKey: ["planner-current"],
    queryFn: getCurrentPlans,
    enabled: activityStatsEnabled && Boolean(user?.niche),
    staleTime: 60_000,
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slidesWithIcons.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [slidesWithIcons.length]);

  const heroButtons = useMemo(
    () => (
      <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 lg:justify-start">
        <Link
          href={user ? "/dashboard" : "/demo"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_22px_55px_-25px_rgba(212,175,55,0.9)] transition hover:opacity-95 sm:w-auto sm:px-8 sm:py-4"
        >
          {user ? "Go to dashboard" : "Try Free"}
          <ArrowRight size={16} />
        </Link>

        {!user && (
          <Link
            href="/register"
            className="theme-action-secondary inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm shadow-[var(--shadow)] transition sm:w-auto sm:px-8 sm:py-4"
          >
            Create Account
          </Link>
        )}
      </div>
    ),
    [user],
  );

  const weeklyItems =
    plannerQuery.data && !("missing_niche" in plannerQuery.data)
      ? plannerQuery.data.weekly.items.length
      : 0;
  const loadedPlannerIdeas =
    plannerQuery.data && !("missing_niche" in plannerQuery.data)
      ? plannerQuery.data.weekly.items.length +
        plannerQuery.data.monthly.items.length
      : 0;
  const lifetimeIdeas = Math.max(
    analyticsQuery.data?.totals.planned_items ?? 0,
    loadedPlannerIdeas,
  );

  const activityStats = [
    {
      label: "Ideas",
      value: analyticsQuery.isLoading
        ? "..."
        : numberFormat.format(lifetimeIdeas),
    },
    {
      label: "Scripts",
      value: analyticsQuery.isLoading
        ? "..."
        : numberFormat.format(analyticsQuery.data?.totals.scripts ?? 0),
    },
    {
      label: "7-day plan",
      value: plannerQuery.isLoading ? "..." : `${weeklyItems}/7`,
    },
  ];

  return (
    <section className="relative overflow-hidden px-4 py-12 text-[var(--foreground)] sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(212,175,55,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-[#d4af37]/10 via-[#3b82f6]/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 sm:gap-12 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div className="max-w-3xl text-center lg:text-left">
            <h1 className="mt-6 text-3xl font-bold leading-tight sm:mt-8 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="theme-muted mx-auto mt-4 max-w-3xl text-sm leading-6 sm:mt-6 sm:text-lg sm:leading-7 lg:mx-0">
              {subtitle}
            </p>

            {heroButtons}

            {activityStatsEnabled && (
              <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
                {activityStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="min-w-0 bg-[var(--surface-soft)] px-3 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur sm:px-4"
                  >
                    <p className="theme-muted truncate text-[11px] uppercase sm:text-xs">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-base font-semibold sm:text-lg">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-x-8 top-8 h-40 bg-linear-to-r from-[#d4af37]/20 via-[#3b82f6]/15 to-[#05070b]/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-lg bg-[var(--surface-soft)] p-3 shadow-[0_30px_100px_-55px_rgba(212,175,55,0.9)] backdrop-blur-xl sm:p-5">
              <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:22px_22px]" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="theme-icon-tile inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11">
                    <ActiveIcon size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      Niche command deck
                    </p>
                    <p className="theme-muted text-xs">
                      Cycle {activeIndex + 1} of {slides.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mt-4 grid gap-4 sm:mt-6 lg:grid-cols">
                <div className="hidden space-y-3 sm:block">
                  {slidesWithIcons.map((slide, index) => {
                    const SlideIcon = slide.icon;
                    const selected = index === activeIndex;

                    return (
                      <button
                        key={`${slide.title}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                          selected
                            ? "bg-[var(--accent-soft)] text-[var(--foreground)] shadow-[inset_3px_0_0_rgba(212,175,55,0.85)]"
                            : "theme-muted bg-[var(--surface)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        <span className="theme-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                          <SlideIcon size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {slide.title}
                          </span>
                          <span className="theme-muted block truncate text-xs">
                            {slide.subtitle}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-lg bg-[var(--surface)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
                  <div className="flex items-center gap-3 text-[#d4af37]">
                    <ActiveIcon size={18} />
                    <span className="text-xs font-semibold uppercase">
                      Active brief
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--foreground)] sm:text-3xl">
                      {activeSlide.title}
                    </h2>
                    <p className="theme-muted text-sm sm:text-base">
                      {activeSlide.subtitle}
                    </p>
                    <p className="theme-muted hidden sm:block">
                      {activeSlide.details}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mt-4 flex items-center gap-2 sm:mt-5 sm:gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (prev) => (prev - 1 + slides.length) % slides.length,
                    )
                  }
                  className="theme-action-secondary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-[var(--shadow)] transition sm:h-11 sm:w-11"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % slides.length)
                  }
                  className="theme-action-secondary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-[var(--shadow)] transition sm:h-11 sm:w-11"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="flex flex-1 gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 grow rounded-full transition ${
                        index === activeIndex
                          ? "bg-[#d4af37]"
                          : "bg-[var(--text-subtle)]"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
