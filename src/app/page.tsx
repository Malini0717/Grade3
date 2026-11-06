"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Compass, Hammer, GraduationCap, Sparkles, Box, Layers, ArrowRight } from "lucide-react";
import { LABS, GRADE_LABEL, BOOK_TITLE, LabCategory, LabMode } from "@/data/labs";

export default function HubCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<"ALL" | LabMode>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | LabCategory>("ALL");

  const filteredLabs = useMemo(() => {
    return LABS.filter((lab) => {
      const matchesSearch =
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.concepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMode =
        modeFilter === "ALL" ||
        lab.mode === modeFilter ||
        lab.mode === "both";

      const matchesCategory =
        categoryFilter === "ALL" || lab.category === categoryFilter;

      return matchesSearch && matchesMode && matchesCategory;
    });
  }, [searchQuery, modeFilter, categoryFilter]);

  return (
    <div className="relative w-full h-[100dvh] flex flex-col bg-gradient-to-b from-[#fffefc] via-[#f8fafc] to-[#f1f5f9] text-slate-800 overflow-hidden select-none font-baloo">
      {/* Soft Ambient Pastel Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl" />

      {/* ── TOP HEADER & HERO SECTION (Bright, Fresh Card) ── */}
      <header className="relative z-10 px-4 sm:px-8 pt-5 pb-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shrink-0 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 border border-blue-200/80 text-blue-700 mb-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {GRADE_LABEL} • {BOOK_TITLE}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Interactive Computing Labs
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Explore 2D and 3D digital worlds, algorithms, hardware, and creative coding.
            </p>
          </div>

          {/* Mode Pill Filter (2D / 3D / Both / All) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 self-start md:self-auto shadow-inner">
            {(["ALL", "2D", "3D"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modeFilter === mode
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/70 font-black"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {mode === "ALL" ? "All Modes" : `${mode} Mode`}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-3 mt-4">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs by concept, title, or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm shadow-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(
              [
                { id: "ALL", label: "All Categories", icon: Layers },
                { id: "quest", label: "Quest", icon: Compass },
                { id: "build", label: "Build", icon: Hammer },
                { id: "train", label: "Train", icon: GraduationCap },
                { id: "create", label: "Create", icon: Sparkles },
              ] as const
            ).map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    categoryFilter === cat.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm font-black"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <Icon size={13} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── LAB CATALOG CARDS GRID (Light, Tactile Surface) ── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing {filteredLabs.length} of {LABS.length} Labs
            </span>
          </div>

          {filteredLabs.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center">
              <Box size={44} className="text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No labs matched your search</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the mode or keyword filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredLabs.map((lab) => (
                <Link
                  key={lab.slug}
                  href={`/labs/${lab.slug}`}
                  className="group flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-100 hover:border-blue-400 hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"
                >
                  <div>
                    {/* Card Top: Lesson Tag & Mode Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                        Lesson {lab.n}
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                        {lab.mode}
                      </span>
                    </div>

                    {/* Lab Title */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                      {lab.title}
                    </h3>

                    {/* Lab Description */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 font-medium">
                      {lab.desc}
                    </p>
                  </div>

                  {/* Card Bottom: Concepts & Launch CTA */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {lab.concepts.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/50"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="w-full py-2.5 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md">
                      <span>Launch Lab</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
