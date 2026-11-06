"use client";

import { useState } from "react";
import { Tv, RotateCcw, CheckCircle2 } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function SevenSegmentDisplay() {
  // Segments A through G: true = illuminated, false = dark
  const [segments, setSegments] = useState<Record<string, boolean>>({
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
  });
  const [hasFormedEight, setHasFormedEight] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess } = useLabAudio();
  const { reportComplete } = useLMSBridge("seven-segment-display");

  // Standard digit patterns for 7 segments
  const DIGIT_PRESETS: Record<number, Record<string, boolean>> = {
    0: { a: true, b: true, c: true, d: true, e: true, f: true, g: false },
    1: { a: false, b: true, c: true, d: false, e: false, f: false, g: false },
    2: { a: true, b: true, c: false, d: true, e: true, f: false, g: true },
    3: { a: true, b: true, c: true, d: true, e: false, f: false, g: true },
    4: { a: false, b: true, c: true, d: false, e: false, f: true, g: true },
    5: { a: true, b: false, c: true, d: true, e: false, f: true, g: true },
    6: { a: true, b: false, c: true, d: true, e: true, f: true, g: true },
    7: { a: true, b: true, c: true, d: false, e: false, f: false, g: false },
    8: { a: true, b: true, c: true, d: true, e: true, f: true, g: true },
    9: { a: true, b: true, c: true, d: true, e: false, f: true, g: true },
  };

  const toggleSegment = (seg: string) => {
    playPop();
    setSegments((prev) => {
      const next = { ...prev, [seg]: !prev[seg] };
      checkEight(next);
      return next;
    });
  };

  const applyDigitPreset = (num: number) => {
    playClick();
    const preset = DIGIT_PRESETS[num];
    setSegments(preset);
    checkEight(preset);
  };

  const checkEight = (segs: Record<string, boolean>) => {
    const allLit = Object.values(segs).every(Boolean);
    if (allLit && !hasFormedEight) {
      setHasFormedEight(true);
      if (!hasWon) {
        playSuccess();
        setHasWon(true);
        reportComplete({ labId: "seven-segment-display" });
      }
    }
  };

  const litCount = Object.values(segments).filter(Boolean).length;
  // 7-bit binary string (A-G)
  const binaryBits = ["a", "b", "c", "d", "e", "f", "g"].map((k) => (segments[k] ? "1" : "0")).join("");

  const handleReset = () => {
    playClick();
    setSegments({ a: false, b: false, c: false, d: false, e: false, f: false, g: false });
    setHasFormedEight(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "7-Segment Display Mastered! All 7 light bars A through G are glowing to create the numeral 8 (1111111)!"
          : !hasFormedEight
          ? "Step 1: Click the light segments or use the digit buttons to illuminate all 7 bars (A through G) to create the number 8!"
          : "Numeral 8 displayed! Notice how 7 binary on/off switches shape every number from 0 to 9!"
      }
      currentStep={hasFormedEight ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
              Digit Presets:
            </span>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => applyDigitPreset(num)}
                className={`w-7 h-7 rounded-lg font-mono text-xs font-black transition-all cursor-pointer ${
                  num === 8 && hasFormedEight
                    ? "bg-[#059669] text-[#ecfdf5] ring-2 ring-[#34d399]"
                    : "bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border border-[#d97706]/40"
                }`}
              >
                {num}
              </button>
            ))}

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-2.5 py-1 rounded-xl border border-[#d97706]/40 ml-2">
              7-Bit: [{binaryBits}] ({litCount}/7 Bars)
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Clear Segments
            </button>
          </div>
        </div>
      }
    >
      {/* VINTAGE DIGITAL WATCH CASING */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
        {/* Brass Screws at Corners */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] border border-[#78350f] flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03]" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] border border-[#78350f] flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03]" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] border border-[#78350f] flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03]" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] border border-[#78350f] flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03]" />
        </div>

        {/* Watch Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md">
          <div className="flex items-center gap-2">
            <Tv size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              7-Segment Binary LED Display • Digital Readout Mechanics
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03]">
            BINARY DECODER BUS (A-B-C-D-E-F-G)
          </span>
        </div>

        {/* MAIN VISUAL ZONE: 7-SEGMENT DISPLAY & TOGGLE BUTTONS */}
        <div className="grid grid-cols-12 gap-5 my-2 items-center px-4">
          {/* LEFT: INTERACTIVE 7-SEGMENT SVG DISPLAY (Cols 7) */}
          <div className="col-span-7 bg-[#1c1917] p-3 rounded-2xl border-3 border-[#fbbf24] shadow-inner flex items-center justify-center h-52 relative">
            <svg className="w-48 h-44" viewBox="0 0 160 220">
              {/* Segment A (Top Horizontal) */}
              <polygon
                points="35,20 125,20 115,35 45,35"
                fill={segments.a ? "#fef08a" : "#44403c"}
                stroke="#1c1917"
                strokeWidth="2"
                onClick={() => toggleSegment("a")}
                className="cursor-pointer hover:opacity-80 transition-all"
              />
              {/* Segment B (Top Right Vertical) */}
              <polygon
                points="128,24 140,36 135,100 123,90"
                fill={segments.b ? "#fef08a" : "#44403c"}
                stroke="#1c1917"
                strokeWidth="2"
                onClick={() => toggleSegment("b")}
                className="cursor-pointer hover:opacity-80 transition-all"
              />
              {/* Segment C (Bottom Right Vertical) */}
              <polygon
                points="123,115 135,105 130,175 118,187"
                fill={segments.c ? "#fef08a" : "#44403c"}
                stroke="#1c1917"
                strokeWidth="2"
                onClick={() => toggleSegment("c")}
                className="cursor-pointer hover:opacity-80 transition-all"
              />
              {/* Segment D (Bottom Horizontal) */}
              <polygon
                points="45,175 115,175 125,190 35,190"
                fill={segments.d ? "#fef08a" : "#44403c"}
                stroke="#1c1917"
                strokeWidth="2"
                onClick={() => toggleSegment("d")}
                className="cursor-pointer hover:opacity-80 transition-all"
              />
              {/* Segment E (Bottom Left Vertical) */}
              <polygon
                points="25,105 37,115 32,187 20,175"
                fill={segments.e ? "#fef08a" : "#44403c"}
                stroke="#1c1917"
                strokeWidth="2"
                onClick={() => toggleSegment("e")}
                className="cursor-pointer hover:opacity-80 transition-all"
              />
              {/* Segment F (Top Left Vertical) */}
              <polygon
                points="25,36 37,24 42,90 30,100"
                fill={segments.f ? "#fef08a" : "#44403c"}
                stroke="#1c1917"
                strokeWidth="2"
                onClick={() => toggleSegment("f")}
                className="cursor-pointer hover:opacity-80 transition-all"
              />
              {/* Segment G (Middle Horizontal) */}
              <polygon
                points="40,105 120,105 110,115 50,115"
                fill={segments.g ? "#fef08a" : "#44403c"}
                stroke="#1c1917"
                strokeWidth="2"
                onClick={() => toggleSegment("g")}
                className="cursor-pointer hover:opacity-80 transition-all"
              />

              {/* Labels A-G */}
              <text x="80" y="32" fill="#78716c" fontSize="10" textAnchor="middle" fontWeight="bold">A</text>
              <text x="135" y="65" fill="#78716c" fontSize="10" textAnchor="middle" fontWeight="bold">B</text>
              <text x="130" y="150" fill="#78716c" fontSize="10" textAnchor="middle" fontWeight="bold">C</text>
              <text x="80" y="185" fill="#78716c" fontSize="10" textAnchor="middle" fontWeight="bold">D</text>
              <text x="25" y="150" fill="#78716c" fontSize="10" textAnchor="middle" fontWeight="bold">E</text>
              <text x="30" y="65" fill="#78716c" fontSize="10" textAnchor="middle" fontWeight="bold">F</text>
              <text x="80" y="112" fill="#78716c" fontSize="10" textAnchor="middle" fontWeight="bold">G</text>
            </svg>
          </div>

          {/* RIGHT: 7 TOGGLE BUTTON SWITCHES (Cols 5) */}
          <div className="col-span-5 bg-[#292524] p-3 rounded-2xl border-3 border-[#d97706] shadow-lg flex flex-col justify-between h-52">
            <div className="flex items-center justify-between pb-1 border-b border-[#78350f]">
              <span className="font-baloo font-black text-xs text-[#fef3c7] uppercase">
                Binary Bar Switches
              </span>
              <span className="font-mono text-[10px] text-[#fbbf24]">Click to Toggle</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 my-1">
              {["a", "b", "c", "d", "e", "f", "g"].map((seg) => (
                <button
                  key={seg}
                  onClick={() => toggleSegment(seg)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black transition-all cursor-pointer flex items-center justify-between border ${
                    segments[seg]
                      ? "bg-[#d97706] text-[#451a03] border-[#fef08a] shadow-xs"
                      : "bg-[#451a03] text-[#fde68a] border-[#78350f] hover:bg-[#78350f]"
                  }`}
                >
                  <span className="uppercase">Bar {seg}:</span>
                  <span>{segments[seg] ? "ON (1)" : "OFF (0)"}</span>
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono text-[#fde68a] pt-1 border-t border-[#78350f]">
              Status: {hasFormedEight ? "Numeral 8 Complete! ✓" : "Toggle bars to form numerals"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7]">
          <span>
            A 7-segment display uses seven glowing light bars (A to G) to form all numerals from 0 to 9!
          </span>
          <span className="font-mono text-[#fbbf24]">
            ACTIVE BARS: {litCount}/7
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="7-Segment Display Mastered!"
        message="You discovered how seven individual illuminated light bars turn on and off in binary combinations to shape digital numerals!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}

