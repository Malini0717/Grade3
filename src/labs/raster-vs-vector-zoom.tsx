"use client";

import { useState } from "react";
import {
  ZoomIn,
  RotateCcw,
  Sparkles,
  Grid,
  CheckCircle2,
  Volume2,
  Paintbrush,
  Sliders,
  ArrowRight,
  Maximize2,
  Shapes,
  FileImage,
  Lock,
} from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function RasterVsVectorZoom() {
  // ── 3 PROGRESSIVE DISCOVERY LEVELS ──
  // Level 1: RASTER WORKSHOP - Paint with square pixel tiles on 8x8 heart on light drafting pad, discover staircase effect
  // Level 2: VECTOR BLUEPRINT LAB - Complex Aerodynamic Starship SVG, sculpt Bézier wing sweep, zoom to 64x
  // Level 3: BILLBOARD SHOWDOWN & VISUAL SORTER - High-end Astronaut SVG scaled to 50ft Billboard (Gated Zoom Exploration Required!)
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  // ── LEVEL 1 STATES (Raster Pixel Workshop) ──
  const [paintedPixelIds, setPaintedPixelIds] = useState<number[]>([]);
  const targetPixelIds = [11, 12, 19, 28]; // The 4 target pixels completing the rounded heart curve
  const [rasterZoom, setRasterZoom] = useState<number>(1); // 1x to 6x

  // ── LEVEL 2 STATES (Vector Blueprint Lab - Complex Aerodynamic Starship) ──
  const [wingSweepY, setWingSweepY] = useState<number>(55); // 35 to 80 (Interactive wing aerodynamic curve)
  const [vectorZoom, setVectorZoom] = useState<number>(1); // 1x to 32x
  const [hasTestedVectorZoom, setHasTestedVectorZoom] = useState<boolean>(false);

  // ── LEVEL 3 STATES (Billboard Showdown & Visual SVG Sorter) ──
  const [billboardLever, setBillboardLever] = useState<number>(1); // 1 = 1-inch Sticker, 10 = 50ft Billboard
  const [hasExploredBillboardZoom, setHasExploredBillboardZoom] = useState<boolean>(false);
  const [photoSortedTarget, setPhotoSortedTarget] = useState<"raster" | "vector" | null>(null);
  const [logoSortedTarget, setLogoSortedTarget] = useState<"raster" | "vector" | null>(null);
  const [sorterError, setSorterError] = useState<string | null>(null);

  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap, speakInstructions, isSpeaking } = useLabAudio();
  const { reportComplete } = useLMSBridge("raster-vs-vector-zoom");

  // In-world Directive per Level
  const currentDirective =
    hasWon
      ? "Triumph! You mastered Raster Bitmaps vs Vector Curves: pixel grids blur when scaled, while math formulas stay infinitely sharp!"
      : level === 1
      ? paintedPixelIds.length < targetPixelIds.length
        ? "Level 1: Tap the 4 glowing golden boxes on the drafting pad to paint the curved heart with pixels!"
        : "Now drag the Magnifier Slider to zoom in and discover the jagged pixel staircase!"
      : level === 2
      ? !hasTestedVectorZoom
        ? "Level 2: Drag the yellow Bézier handle to sculpt the starship's curved wings, then zoom to 64x to test for pixel blocks!"
        : "Notice: No square blocks at all! The complex starship curves recalculate silky-smooth at any scale."
      : !hasExploredBillboardZoom
      ? "Level 3: Pull the heavy lever down to '50-Foot Billboard' to test what happens to the Astronaut!"
      : "Step 2: Great! Now drop the Puppy Photo and Diamond App Logo into the matching format boxes!";

  // ── LEVEL 1 HANDLERS (Raster) ──
  const handlePixelClick = (id: number) => {
    if (!targetPixelIds.includes(id)) return;
    if (paintedPixelIds.includes(id)) return;
    playPop();
    const updated = [...paintedPixelIds, id];
    setPaintedPixelIds(updated);
    if (updated.length === targetPixelIds.length) {
      playSuccess();
    }
  };

  const handleRasterZoomChange = (z: number) => {
    playClick();
    setRasterZoom(z);
  };

  const handleProceedToLevel2 = () => {
    playSuccess();
    setLevel(2);
  };

  // ── LEVEL 2 HANDLERS (Vector) ──
  const handleWingSweepDrag = (val: number) => {
    playClick();
    setWingSweepY(val);
  };

  const handleVectorZoomChange = (z: number) => {
    playClick();
    setVectorZoom(z);
    if (z >= 24 && !hasTestedVectorZoom) {
      setHasTestedVectorZoom(true);
      playSuccess();
    }
  };

  const handleProceedToLevel3 = () => {
    playSuccess();
    setLevel(3);
  };

  // ── LEVEL 3 HANDLERS (Billboard Zoom Exploration & Visual SVG Sorter) ──
  const handleLeverPull = (val: number) => {
    playClick();
    setBillboardLever(val);
    if (val >= 8 && !hasExploredBillboardZoom) {
      playSuccess();
      setHasExploredBillboardZoom(true);
    }
  };

  const handleSortItem = (item: "photo" | "logo", target: "raster" | "vector") => {
    if (!hasExploredBillboardZoom) {
      playZap();
      setSorterError("Pull the heavy lever to '50-Foot Billboard' first to inspect how images scale!");
      return;
    }

    playClick();
    setSorterError(null);

    if (item === "photo") {
      if (target === "raster") {
        playSuccess();
        setPhotoSortedTarget("raster");
        checkWinCondition("raster", logoSortedTarget);
      } else {
        playZap();
        setSorterError("A photo needs millions of color pixels! Best as Raster (PNG/JPG).");
      }
    } else if (item === "logo") {
      if (target === "vector") {
        playSuccess();
        setLogoSortedTarget("vector");
        checkWinCondition(photoSortedTarget, "vector");
      } else {
        playZap();
        setSorterError("A logo must stay sharp on giant billboards! Best as Vector (SVG).");
      }
    }
  };

  const checkWinCondition = (photo: "raster" | "vector" | null, logo: "raster" | "vector" | null) => {
    // Both items must be sorted AND the zoom filter must have been explored!
    if (photo === "raster" && logo === "vector" && hasExploredBillboardZoom) {
      setTimeout(() => {
        playSuccess();
        setHasWon(true);
        reportComplete({ points: 100 });
      }, 700);
    }
  };

  const handleReset = () => {
    playPop();
    setLevel(1);
    setPaintedPixelIds([]);
    setRasterZoom(1);
    setWingSweepY(55);
    setVectorZoom(1);
    setHasTestedVectorZoom(false);
    setBillboardLever(1);
    setHasExploredBillboardZoom(false);
    setPhotoSortedTarget(null);
    setLogoSortedTarget(null);
    setSorterError(null);
    setHasWon(false);
  };

  const handleSpeak = () => {
    playPop();
    speakInstructions(currentDirective);
  };

  // 8x8 Grid Array for Level 1 Heart Mosaic
  const heartGrid = [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 2, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  return (
    <GradeThreeScaffold
      fullBleed={true}
      hideHeader={true}
      instruction={currentDirective}
      currentStep={level - 1}
      totalSteps={3}
      onReset={handleReset}
      tray={
        /* ── CLEAN STATUS HUD BAR ── */
        <div className="flex items-center justify-between w-full px-3 sm:px-6 text-[#451a03]">
          {/* Level Progress Badge & Directive */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-[#f59e0b] text-[#451a03] font-mono text-xs font-black shadow-xs">
              LEVEL {level} OF 3
            </span>
            <span className="text-xs font-black text-[#78350f] hidden sm:inline truncate max-w-[380px] md:max-w-[540px]">
              {currentDirective}
            </span>
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-[#d1fae5] border-[#10b981] text-[#065f46] animate-pulse"
                  : "bg-[#fef3c7] hover:bg-[#fde68a] border-[#fcd34d] text-[#78350f]"
              }`}
              title="Read Directive Aloud"
            >
              <Volume2 size={14} />
            </button>
          </div>

          {/* Dynamic Stage Indicator */}
          <div className="flex items-center gap-3 text-xs font-black">
            <span className="text-[#92400e] hidden md:inline">Topic:</span>
            <span className="px-2.5 py-1 rounded-xl font-mono text-[11px] bg-[#fed7aa] text-[#9a3412] border border-[#ea580c] shadow-xs">
              {level === 1
                ? "Part 1: How Raster Works (Pixels)"
                : level === 2
                ? "Part 2: How Vector Works (Math Curves)"
                : !hasExploredBillboardZoom
                ? "Part 3: 50ft Billboard Test (Required)"
                : "Part 3: Ready to Classify"}
            </span>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border border-[#fcd34d] cursor-pointer shadow-xs transition-all"
              title="Restart Discovery"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      }
    >
      {/* ── FULL-BLEED SUNLIT WORKBENCH (Zero Side Gaps, Zero Dark Voids) ── */}
      <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#fef3c7] via-[#fffbeb] to-[#fde68a] p-1.5 sm:p-3">
        
        {/* Subtle Workshop Drafting Blueprint Grid SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="draftGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#d97706" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.5" fill="#b45309" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#draftGrid)" />
        </svg>

        {/* ── TOP APPARATUS HEADER RIBBON ── */}
        <div className="relative z-10 w-full flex items-center justify-between px-3 py-1 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] rounded-xl border-2 border-[#fef08a] shadow-md shrink-0">
          <div className="flex items-center gap-2 text-white font-black text-xs tracking-wide">
            {level === 1 ? <Grid size={15} /> : level === 2 ? <Shapes size={15} /> : <Sliders size={15} />}
            <span>
              {level === 1
                ? "LEVEL 1: THE RASTER PIXEL WORKSHOP"
                : level === 2
                ? "LEVEL 2: THE VECTOR MATH BLUEPRINT LAB"
                : "LEVEL 3: THE 50-FOOT BILLBOARD SHOWDOWN"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold bg-[#fef3c7] text-[#92400e] px-2.5 py-0.5 rounded-md border border-[#b45309]">
              {level === 1 ? "Square Tiles Engine" : level === 2 ? "Aerodynamic Starship Vector" : "Realistic Astronaut Challenge"}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ── LEVEL 1: HOW RASTER WORKS (GLOWING TARGET PIXEL BOXES!) ─── */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {level === 1 && (
          <div className="relative z-10 flex-1 min-h-0 w-full flex flex-col md:flex-row items-center justify-between gap-3 my-1">
            {/* Left Column: Interactive Pixel Canvas on Light Drafting Pad */}
            <div className="flex-1 w-full h-full max-h-[440px] bg-white rounded-2xl border-3 border-[#ea580c] shadow-xl p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="w-full flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Paintbrush size={14} className="text-amber-600" />
                  <span>Pixel Art Canvas: Painting a Curved Heart</span>
                </span>
                <span className="text-[9px] font-mono text-slate-500 font-bold">
                  Fixed 8×8 Grid ({paintedPixelIds.length}/4 completed)
                </span>
              </div>

              {/* The 8x8 Pixel Grid Viewport (ON A LIGHT NON-WHITE WARM PARCHMENT PAD!) */}
              <div className="flex-1 w-full flex items-center justify-center overflow-hidden my-1 bg-gradient-to-br from-[#fef3c7] via-[#fde68a] to-[#fed7aa] rounded-xl border-2 border-[#f59e0b] p-3 relative shadow-inner">
                {/* Millimeter drafting lines on parchment pad */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <defs>
                    <pattern id="lightPadGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="16" y2="0" stroke="#d97706" strokeWidth="0.6" />
                      <line x1="0" y1="0" x2="0" y2="16" stroke="#d97706" strokeWidth="0.6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#lightPadGrid)" />
                </svg>

                {/* The 8x8 Heart Tile Grid */}
                <div
                  className="grid grid-cols-8 grid-rows-8 gap-1.5 p-2.5 bg-[#fef08a]/80 backdrop-blur-xs rounded-xl border-3 border-[#ca8a04] shadow-xl transition-all duration-300 relative z-10"
                  style={{
                    transform: `scale(${1 + (rasterZoom - 1) * 0.25})`,
                  }}
                >
                  {heartGrid.flatMap((row, r) =>
                    row.map((val, c) => {
                      const cellId = r * 8 + c;
                      const isTarget = targetPixelIds.includes(cellId);
                      const isPainted = paintedPixelIds.includes(cellId);

                      let tileBg = "bg-white/60 border border-[#fde047]";
                      let text = "";

                      if (val === 1 || isPainted) {
                        tileBg = "bg-gradient-to-br from-rose-500 to-rose-600 border border-rose-700 shadow-sm text-white";
                        text = "■";
                      } else if (isTarget) {
                        // ── PROMINENT RADIANT GLOWING EFFECT ON THE 4 TARGET BOXES! ──
                        tileBg = "bg-amber-300 border-2 border-amber-600 shadow-[0_0_16px_rgba(245,158,11,0.95)] ring-2 ring-yellow-400 animate-pulse cursor-pointer text-[#78350f]";
                        text = "★";
                      }

                      return (
                        <button
                          key={cellId}
                          onClick={() => handlePixelClick(cellId)}
                          disabled={!isTarget || isPainted}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[3px] transition-all flex items-center justify-center font-mono text-[10px] font-black ${tileBg} ${
                            isTarget && !isPainted ? "hover:bg-amber-400 hover:scale-110 active:scale-95" : ""
                          }`}
                        >
                          {text}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Staircase Callout when Zoomed */}
                {rasterZoom >= 3 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1 rounded-xl font-mono text-[9px] font-black shadow-lg border border-yellow-200 animate-bounce z-20">
                    STAIRCASE JAGGIES! Square blocks cannot make true curves!
                  </div>
                )}
              </div>

              {/* Bottom Educational Caption */}
              <div className="text-[9px] font-mono text-center text-slate-600 font-bold pt-1">
                A Raster image is made of square blocks called <strong>PIXELS</strong>.
              </div>
            </div>

            {/* Right Column: Magnifier Slider & Discovery Gate */}
            <div className="w-full md:w-80 h-full max-h-[440px] bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] rounded-2xl border-3 border-[#d97706] shadow-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black text-[#78350f] pb-1 border-b border-[#f59e0b]/30">
                  <ZoomIn size={14} className="text-[#d97706]" />
                  <span>MAGNIFYING LOUPE</span>
                </div>

                <p className="text-[10px] text-slate-700 font-bold my-2 leading-relaxed">
                  Notice how square pixel blocks look like a jagged <strong>staircase</strong> when making curves. Zoom in to inspect!
                </p>

                {/* Tactile Zoom Slider */}
                <div className="bg-white p-3 rounded-xl border border-[#f59e0b]/40 shadow-xs flex flex-col gap-1.5 my-2">
                  <div className="flex items-center justify-between font-mono text-xs font-black text-[#92400e]">
                    <span>ZOOM POWER:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">{rasterZoom}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={rasterZoom}
                    onChange={(e) => handleRasterZoomChange(Number(e.target.value))}
                    className="w-full h-2.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-500">
                    <span>1x (Natural)</span>
                    <span>6x (Huge Pixels)</span>
                  </div>
                </div>
              </div>

              {/* Discovery Summary Box */}
              <div className="bg-amber-100/80 p-2.5 rounded-xl border border-amber-300 text-[9.5px] font-bold text-amber-950 flex flex-col gap-1">
                <span className="font-black text-[#92400e] flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Raster Rule:</span>
                </span>
                <span>Raster images (like PNG or JPG photos) are fixed grids of square pixels. When enlarged, they break into jagged blocks!</span>
              </div>

              {/* Proceed Button */}
              {paintedPixelIds.length >= targetPixelIds.length && (
                <button
                  onClick={handleProceedToLevel2}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 animate-pulse transition-all mt-2"
                >
                  <span>See How Vector Solves This →</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ── LEVEL 2: HOW VECTOR WORKS (COMPLEX STARSHIP VECTOR ART) ── */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {level === 2 && (
          <div className="relative z-10 flex-1 min-h-0 w-full flex flex-col md:flex-row items-center justify-between gap-3 my-1">
            {/* Left Column: Complex Aerodynamic Starship Blueprint Canvas */}
            <div className="flex-1 w-full h-full max-h-[440px] bg-white rounded-2xl border-3 border-[#0284c7] shadow-xl p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="w-full flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-black text-sky-900 flex items-center gap-1.5">
                  <Shapes size={14} className="text-sky-600" />
                  <span>Vector Starship Blueprint: Complex Multi-Path Geometry</span>
                </span>
                <span className="text-[9px] font-mono text-sky-700 font-bold bg-sky-100 px-2 py-0.5 rounded-md">
                  100% Mathematical Precision
                </span>
              </div>

              {/* High-End Vector Starship Viewport */}
              <div className="flex-1 w-full flex items-center justify-center overflow-hidden my-1 bg-[#082f49] rounded-xl border-2 border-sky-800 p-2 relative shadow-inner">
                <div
                  className="transition-all duration-300 flex items-center justify-center"
                  style={{
                    transform: `scale(${1 + (vectorZoom - 1) * 0.12})`,
                  }}
                >
                  {/* COMPLEX AERODYNAMIC STARSHIP SVG */}
                  <svg width="280" height="210" viewBox="0 0 280 210" className="overflow-visible drop-shadow-2xl">
                    <defs>
                      <pattern id="starshipGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="20" y2="0" stroke="#0284c7" strokeWidth="0.5" opacity="0.35" />
                        <line x1="0" y1="0" x2="0" y2="20" stroke="#0284c7" strokeWidth="0.5" opacity="0.35" />
                      </pattern>
                      <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#0369a1" />
                      </linearGradient>
                      <linearGradient id="canopyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                      <linearGradient id="ionFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>

                    {/* Blueprint Background Grid */}
                    <rect width="280" height="210" fill="url(#starshipGrid)" rx="10" />

                    {/* Twin Ion Plasma Thruster Plumes */}
                    <path d="M100,165 C95,190 105,205 105,205 C105,205 115,190 110,165 Z" fill="url(#ionFlame)" className="animate-pulse" />
                    <path d="M170,165 C165,190 175,205 175,205 C175,205 185,190 180,165 Z" fill="url(#ionFlame)" className="animate-pulse" />

                    {/* Swept-Back Aerodynamic Wing Stabilizers */}
                    <polygon points="65,115 15,145 65,155" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.8" />
                    <polygon points="215,115 265,145 215,155" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.8" />

                    {/* Aerodynamic Forward Wing Sweeps (Bézier Handle!) */}
                    <path
                      d={`M 140 25 Q 40 ${wingSweepY + 60} 55 160`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                    />
                    <path
                      d={`M 140 25 Q 240 ${wingSweepY + 60} 225 160`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                    />

                    {/* Main Sleek Aerodynamic Starship Fuselage Body */}
                    <path
                      d="M 140,20 C 110,60 90,110 90,165 L 190,165 C 190,110 170,60 140,20 Z"
                      fill="url(#fuselageGrad)"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />

                    {/* Aerodynamic Panel Seam Lines */}
                    <line x1="140" y1="20" x2="140" y2="70" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="3 2" />
                    <line x1="100" y1="120" x2="180" y2="120" stroke="#bae6fd" strokeWidth="1.2" opacity="0.6" />

                    {/* Glass Cockpit Canopy with Specular Reflections */}
                    <ellipse cx="140" cy="85" rx="24" ry="38" fill="url(#canopyGrad)" stroke="#ffffff" strokeWidth="2" />
                    <ellipse cx="134" cy="74" rx="7" ry="16" fill="#ffffff" opacity="0.7" transform="rotate(-15 134 74)" />

                    {/* Tangent Guide Rods */}
                    <line
                      x1="140"
                      y1="25"
                      x2="40"
                      y2={wingSweepY + 60}
                      stroke="#facc15"
                      strokeWidth="1.8"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="55"
                      y1="160"
                      x2="40"
                      y2={wingSweepY + 60}
                      stroke="#facc15"
                      strokeWidth="1.8"
                      strokeDasharray="3 3"
                    />

                    {/* Anchor Pins */}
                    <circle cx="140" cy="25" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x="146" y="28" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">P0 (Nose)</text>

                    <circle cx="55" cy="160" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x="30" y="174" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">P1 (Wing Base)</text>

                    {/* INTERACTIVE BÉZIER CONTROL HANDLE */}
                    <g transform={`translate(40, ${wingSweepY + 60})`}>
                      <circle cx="0" cy="0" r="11" fill="#facc15" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                      <circle cx="0" cy="0" r="4" fill="#854d0e" />
                      <text x="-30" y="-14" fill="#facc15" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        Bézier Handle
                      </text>
                    </g>
                  </svg>
                </div>

                {vectorZoom >= 16 && (
                  <div className="absolute top-2 right-2 bg-sky-500 text-sky-950 px-3 py-1 rounded-xl font-mono text-[9px] font-black shadow-lg border border-cyan-200 animate-bounce">
                    ZERO BLOCKS! Every curve, wing, and panel recalculates mathematically!
                  </div>
                )}
              </div>

              {/* Bottom Educational Caption */}
              <div className="text-[9px] font-mono text-center text-slate-600 font-bold pt-1">
                Real vector artwork combines dozens of mathematical paths connecting anchor pins.
              </div>
            </div>

            {/* Right Column: Wing Sweep Sculptor & Microscope Zoom */}
            <div className="w-full md:w-80 h-full max-h-[440px] bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] rounded-2xl border-3 border-[#0284c7] shadow-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black text-sky-900 pb-1 border-b border-sky-300">
                  <Sliders size={14} className="text-sky-600" />
                  <span>STARSHIP VECTOR CONTROLS</span>
                </div>

                {/* Handle Slider */}
                <div className="bg-white p-2.5 rounded-xl border border-sky-300 shadow-xs flex flex-col gap-1.5 my-2">
                  <div className="flex items-center justify-between font-mono text-[10px] font-black text-sky-900">
                    <span>SCULPT WING SWEEP:</span>
                    <span className="text-amber-600">Bends with Math!</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="80"
                    value={wingSweepY}
                    onChange={(e) => handleWingSweepDrag(Number(e.target.value))}
                    className="w-full h-2.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-[#0284c7]"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-500">
                    <span>Forward Flare</span>
                    <span>Delta Sweep!</span>
                  </div>
                </div>

                {/* Zoom Slider */}
                <div className="bg-white p-2.5 rounded-xl border border-sky-300 shadow-xs flex flex-col gap-1.5 my-2">
                  <div className="flex items-center justify-between font-mono text-[10px] font-black text-sky-900">
                    <span>MICROSCOPE ZOOM:</span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800">{vectorZoom * 2}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="32"
                    value={vectorZoom}
                    onChange={(e) => handleVectorZoomChange(Number(e.target.value))}
                    className="w-full h-2.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-[#0284c7]"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-500">
                    <span>1x (Full View)</span>
                    <span>64x (Super-Zoom)</span>
                  </div>
                </div>
              </div>

              {/* Vector Rule Summary Box */}
              <div className="bg-sky-100/90 p-2.5 rounded-xl border border-sky-300 text-[9.5px] font-bold text-sky-950 flex flex-col gap-1">
                <span className="font-black text-sky-900 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Vector Rule:</span>
                </span>
                <span>Because vectors are made of formulas connecting points, every line and curve stays 100% sharp at any size!</span>
              </div>

              {/* Proceed Button */}
              {hasTestedVectorZoom && (
                <button
                  onClick={handleProceedToLevel3}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 animate-pulse transition-all mt-2"
                >
                  <span>Test Both on a Giant Billboard →</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ── LEVEL 3: 50-FT BILLBOARD SHOWDOWN (ASTRONAUT & GATED ZOOM) ─ */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {level === 3 && (
          <div className="relative z-10 flex-1 min-h-0 w-full flex flex-col md:flex-row items-center justify-between gap-3 my-1">
            {/* Left: Giant Billboard Dual Gantry (Realistic Cosmic Astronaut!) */}
            <div className="flex-1 w-full h-full max-h-[440px] bg-slate-900 rounded-2xl border-3 border-amber-500 shadow-2xl p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="w-full flex items-center justify-between pb-1 border-b border-slate-700">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Maximize2 size={14} />
                  <span>Billboard Print Test: Sticker (1-inch) ➔ Giant Billboard (50-foot)</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-600">
                  {billboardLever <= 2 ? "1-Inch Sticker" : billboardLever >= 8 ? "50-Foot Billboard! (Tested ✓)" : "Poster Size"}
                </span>
              </div>

              {/* Dual Billboard Viewports (HIGH-END REALISTIC ASTRONAUT SVG!) */}
              <div className="flex-1 w-full grid grid-cols-2 gap-2 my-1 overflow-hidden">
                {/* Raster Side */}
                <div className="bg-slate-950 rounded-xl border-2 border-red-500/80 p-2 flex flex-col items-center justify-between relative overflow-hidden shadow-inner">
                  <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-md border border-red-800">
                    RASTER BITMAP (PNG/JPG)
                  </span>

                  {/* Realistic Astronaut (Pixelated & Blurry when Lever Pulled!) */}
                  <div
                    className="flex-1 flex items-center justify-center transition-all duration-300"
                    style={{
                      transform: `scale(${1 + (billboardLever - 1) * 0.16})`,
                      filter: billboardLever >= 6 ? `blur(${billboardLever * 0.45}px)` : "none",
                    }}
                  >
                    <svg width="130" height="130" viewBox="0 0 140 140">
                      <defs>
                        <radialGradient id="visorGold" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="70%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#b45309" />
                        </radialGradient>
                      </defs>

                      {/* Life Support Backpack Frame */}
                      <rect x="30" y="55" width="80" height="70" rx="12" fill="#334155" />
                      <line x1="108" y1="45" x2="118" y2="15" stroke="#94a3b8" strokeWidth="2.5" />
                      <circle cx="118" cy="15" r="3.5" fill="#ef4444" />

                      {/* Astronaut Torso Suit */}
                      <path d="M42,88 C42,88 36,135 38,135 L102,135 C104,135 98,88 98,88 Z" fill="#f8fafc" />
                      {/* Shoulder Patches */}
                      <rect x="36" y="90" width="12" height="20" rx="3" fill="#0284c7" />
                      <rect x="92" y="90" width="12" height="20" rx="3" fill="#0284c7" />

                      {/* Chest Control Console */}
                      <rect x="52" y="98" width="36" height="30" rx="5" fill="#1e293b" />
                      <circle cx="61" cy="108" r="4" fill="#38bdf8" />
                      <circle cx="79" cy="108" r="4" fill="#10b981" />
                      <rect x="58" y="118" width="24" height="4" rx="2" fill="#f59e0b" />

                      {/* Space Helmet Shell */}
                      <circle cx="70" cy="52" r="36" fill="#f8fafc" />
                      {/* Helmet Collar Ring */}
                      <rect x="46" y="82" width="48" height="8" rx="4" fill="#64748b" />

                      {/* Large Curved Golden-Tinted Visor */}
                      <ellipse cx="70" cy="52" rx="26" ry="21" fill="url(#visorGold)" />
                      {/* Curved Specular Reflection Highlights */}
                      <ellipse cx="62" cy="45" rx="7" ry="13" fill="#ffffff" opacity="0.65" transform="rotate(-25 62 45)" />

                      {/* Side Audio Earcup Mounts */}
                      <rect x="31" y="46" width="6" height="14" rx="3" fill="#475569" />
                      <rect x="103" y="46" width="6" height="14" rx="3" fill="#475569" />
                    </svg>
                  </div>

                  {billboardLever >= 7 ? (
                    <span className="text-[8.5px] font-mono font-black text-red-300 bg-red-900/90 px-2.5 py-0.5 rounded-full border border-red-500 animate-pulse">
                      BLURRED & PIXELATED ON 50FT BILLBOARD!
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono text-slate-500">Fixed square pixels</span>
                  )}
                </div>

                {/* Vector Side */}
                <div className="bg-slate-950 rounded-xl border-2 border-cyan-500/80 p-2 flex flex-col items-center justify-between relative overflow-hidden shadow-inner">
                  <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800">
                    VECTOR GRAPHIC (SVG)
                  </span>

                  {/* Realistic Astronaut (100% Razor Sharp Math Curves!) */}
                  <div
                    className="flex-1 flex items-center justify-center transition-all duration-300"
                    style={{
                      transform: `scale(${1 + (billboardLever - 1) * 0.16})`,
                    }}
                  >
                    <svg width="130" height="130" viewBox="0 0 140 140">
                      <defs>
                        <radialGradient id="vectorVisorGold" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="70%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#b45309" />
                        </radialGradient>
                      </defs>

                      {/* Life Support Backpack Frame */}
                      <rect x="30" y="55" width="80" height="70" rx="12" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                      <line x1="108" y1="45" x2="118" y2="15" stroke="#94a3b8" strokeWidth="2.5" />
                      <circle cx="118" cy="15" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />

                      {/* Astronaut Torso Suit */}
                      <path d="M42,88 C42,88 36,135 38,135 L102,135 C104,135 98,88 98,88 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                      <rect x="36" y="90" width="12" height="20" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                      <rect x="92" y="90" width="12" height="20" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

                      {/* Chest Control Console */}
                      <rect x="52" y="98" width="36" height="30" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                      <circle cx="61" cy="108" r="4" fill="#38bdf8" />
                      <circle cx="79" cy="108" r="4" fill="#10b981" />
                      <rect x="58" y="118" width="24" height="4" rx="2" fill="#f59e0b" />

                      {/* Space Helmet Shell */}
                      <circle cx="70" cy="52" r="36" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                      {/* Helmet Collar Ring */}
                      <rect x="46" y="82" width="48" height="8" rx="4" fill="#64748b" stroke="#475569" strokeWidth="1" />

                      {/* Large Curved Golden-Tinted Visor */}
                      <ellipse cx="70" cy="52" rx="26" ry="21" fill="url(#vectorVisorGold)" stroke="#ca8a04" strokeWidth="1.5" />
                      {/* Curved Specular Reflection Highlights */}
                      <ellipse cx="62" cy="45" rx="7" ry="13" fill="#ffffff" opacity="0.75" transform="rotate(-25 62 45)" />

                      {/* Side Audio Earcup Mounts */}
                      <rect x="31" y="46" width="6" height="14" rx="3" fill="#475569" stroke="#334155" strokeWidth="1" />
                      <rect x="103" y="46" width="6" height="14" rx="3" fill="#475569" stroke="#334155" strokeWidth="1" />
                    </svg>
                  </div>

                  {billboardLever >= 7 ? (
                    <span className="text-[8.5px] font-mono font-black text-emerald-300 bg-emerald-900/90 px-2.5 py-0.5 rounded-full border border-emerald-500 animate-bounce">
                      100% RAZOR SHARP ON 50FT BILLBOARD!
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono text-cyan-500">Calculated by math</span>
                  )}
                </div>
              </div>

              {/* Heavy Scaling Lever */}
              <div className="bg-slate-950 p-2 rounded-xl border border-amber-500/40 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <span>PULL HEAVY SCALING LEVER:</span>
                    {hasExploredBillboardZoom && <span className="text-emerald-400 font-black">✓ 50FT TESTED</span>}
                  </span>
                  <span className="text-yellow-400">{billboardLever}x Print Scale ({billboardLever >= 8 ? "50-Foot Billboard" : "Handheld"})</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={billboardLever}
                  onChange={(e) => handleLeverPull(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            {/* Right: Graphic Detective Visual SVG Sorter Cards (GATED UNTIL LEVER IS TESTED!) */}
            <div className="w-full md:w-80 h-full max-h-[440px] bg-white rounded-2xl border-3 border-[#d97706] shadow-xl p-3 flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between pb-1 border-b border-[#f59e0b]/30">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#78350f]">
                    <CheckCircle2 size={14} className="text-[#d97706]" />
                    <span>GRAPHIC DETECTIVE CHALLENGE</span>
                  </div>
                  {!hasExploredBillboardZoom && (
                    <span className="text-[8px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                      <Lock size={9} /> Test Zoom First
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-700 font-bold my-1 leading-snug">
                  {!hasExploredBillboardZoom
                    ? "Pull the lever to 50ft Billboard to unlock classification!"
                    : "Choose the best format for each real-world design:"}
                </p>

                {sorterError && (
                  <div className="text-[9px] font-mono text-red-600 bg-red-50 p-1 rounded border border-red-300 font-bold animate-shake">
                    {sorterError}
                  </div>
                )}

                {/* ── CARD 1: CUTE PET PUPPY PHOTO SVG ── */}
                <div className={`p-2 rounded-xl border transition-all my-1 shadow-xs ${
                  hasExploredBillboardZoom ? "bg-amber-50/70 border-amber-300" : "bg-slate-100/60 border-slate-300 opacity-70"
                }`}>
                  <div className="flex items-center gap-2">
                    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0 rounded-lg border border-amber-400 bg-amber-100 p-0.5">
                      <circle cx="22" cy="22" r="18" fill="#d97706" />
                      <ellipse cx="10" cy="18" rx="6" ry="11" fill="#92400e" transform="rotate(-15 10 18)" />
                      <ellipse cx="34" cy="18" rx="6" ry="11" fill="#92400e" transform="rotate(15 34 18)" />
                      <circle cx="22" cy="24" r="14" fill="#fef3c7" />
                      <circle cx="17" cy="21" r="2.5" fill="#1e1b4b" />
                      <circle cx="18" cy="20" r="1" fill="#ffffff" />
                      <circle cx="27" cy="21" r="2.5" fill="#1e1b4b" />
                      <circle cx="28" cy="20" r="1" fill="#ffffff" />
                      <polygon points="22,25 19,23 25,23" fill="#1e1b4b" />
                      <path d="M22,26 C21,29 20,29 19,28" stroke="#1e1b4b" strokeWidth="1" fill="none" />
                      <path d="M22,26 C23,29 24,29 25,28" stroke="#1e1b4b" strokeWidth="1" fill="none" />
                    </svg>

                    <div>
                      <div className="text-[10px] font-black text-amber-950">Pet Puppy Photo</div>
                      <span className="text-[8px] text-slate-500 font-mono block">Millions of rich fur colors</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      onClick={() => handleSortItem("photo", "raster")}
                      className={`flex-1 py-1 rounded-lg font-mono text-[9px] font-black border cursor-pointer active:scale-95 transition-all ${
                        photoSortedTarget === "raster"
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      Raster (PNG/JPG) {photoSortedTarget === "raster" && "✓"}
                    </button>
                    <button
                      onClick={() => handleSortItem("photo", "vector")}
                      className="flex-1 py-1 rounded-lg font-mono text-[9px] font-bold border border-slate-300 bg-white text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      Vector (SVG)
                    </button>
                  </div>
                </div>

                {/* ── CARD 2: MODERN DIAMOND APP LOGO SVG ── */}
                <div className={`p-2 rounded-xl border transition-all my-1 shadow-xs ${
                  hasExploredBillboardZoom ? "bg-sky-50/70 border-sky-300" : "bg-slate-100/60 border-slate-300 opacity-70"
                }`}>
                  <div className="flex items-center gap-2">
                    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0 rounded-lg border border-sky-400 bg-sky-900 p-0.5">
                      <polygon points="22,4 38,16 22,40 6,16" fill="#0284c7" />
                      <polygon points="22,4 38,16 22,26" fill="#38bdf8" />
                      <polygon points="22,4 6,16 22,26" fill="#7dd3fc" />
                      <polygon points="6,16 22,40 22,26" fill="#0369a1" />
                      <polygon points="38,16 22,40 22,26" fill="#0284c7" />
                    </svg>

                    <div>
                      <div className="text-[10px] font-black text-sky-950">Diamond App Logo</div>
                      <span className="text-[8px] text-slate-500 font-mono block">Must scale from watch to 50ft</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      onClick={() => handleSortItem("logo", "raster")}
                      className="flex-1 py-1 rounded-lg font-mono text-[9px] font-bold border border-slate-300 bg-white text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      Raster (PNG/JPG)
                    </button>
                    <button
                      onClick={() => handleSortItem("logo", "vector")}
                      className={`flex-1 py-1 rounded-lg font-mono text-[9px] font-black border cursor-pointer active:scale-95 transition-all ${
                        logoSortedTarget === "vector"
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      Vector (SVG) {logoSortedTarget === "vector" && "✓"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Summary Callout */}
              <div className="bg-amber-100/90 p-2 rounded-xl border border-amber-300 text-[9px] font-bold text-amber-950 text-center">
                Photos = <strong>Raster</strong> (rich pixels). Logos = <strong>Vector</strong> (infinite scaling).
              </div>
            </div>
          </div>
        )}

      </div>

      <Celebration
        isActive={hasWon}
        title="Vector vs. Raster Mastered!"
        message="You proved that raster photos are made of square pixels that pixelate when blown up, while vector graphics are smooth math curves that scale infinitely to any billboard!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
