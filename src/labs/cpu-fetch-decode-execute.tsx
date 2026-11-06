"use client";

import { useState } from "react";
import { Cpu, Zap, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function CpuFetchDecodeExecute() {
  const [pipelineStep, setPipelineStep] = useState<0 | 1 | 2 | 3>(0);
  const [hasWon, setHasWon] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("cpu-fetch-decode-execute");

  const handleClockPulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 400);

    if (pipelineStep === 0) {
      playZap();
      setPipelineStep(1); // FETCH
    } else if (pipelineStep === 1) {
      playPop();
      setPipelineStep(2); // DECODE
    } else if (pipelineStep === 2) {
      playSuccess();
      setPipelineStep(3); // EXECUTE (Result = 7)
      setHasWon(true);
      reportComplete({ labId: "cpu-fetch-decode-execute" });
    }
  };

  const handleReset = () => {
    playClick();
    setPipelineStep(0);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        pipelineStep === 0
          ? "Step 1: Tap the Quartz Crystal Clock to FETCH instruction 'ADD 4 + 3' from Memory!"
          : pipelineStep === 1
          ? "Step 2: Pulse the Clock again to DECODE the operation into Inputs A (4) and B (3)!"
          : pipelineStep === 2
          ? "Step 3: Pulse the Clock to EXECUTE the math calculation in the Arithmetic Logic Unit (ALU)!"
          : "Triumph! The CPU computed 4 + 3 = 7 through the Fetch-Decode-Execute pipeline!"
      }
      currentStep={pipelineStep}
      totalSteps={3}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          {/* Quartz Crystal Pulse Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClockPulse}
              disabled={pipelineStep === 3}
              className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] disabled:opacity-40 text-[#fef3c7] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer border-2 border-[#fef08a] ${
                isPulsing ? "ring-4 ring-[#fbbf24] scale-105" : ""
              }`}
            >
              <Zap size={16} className="fill-[#fef08a] text-[#fef08a]" />
              <span>
                {pipelineStep === 0
                  ? "Pulse Clock: FETCH"
                  : pipelineStep === 1
                  ? "Pulse Clock: DECODE"
                  : pipelineStep === 2
                  ? "Pulse Clock: EXECUTE"
                  : "Cycle Complete (7)"}
              </span>
            </button>

            <span className="text-xs font-mono font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              Pipeline Stage: {pipelineStep === 0 ? "Ready (Idle)" : `${pipelineStep}/3 Active`}
            </span>
          </div>

          {/* Reset Action */}
          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Pipeline
            </button>
          </div>
        </div>
      }
    >
      {/* JADE-GREEN SILICON PCB CHIP BOARD */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#064e3b] via-[#047857] to-[#022c22] rounded-3xl border-4 border-[#10b981] shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
        {/* PCB Gold Screws at Corners */}
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

        {/* Board Header & Quartz Crystal Indicator */}
        <div className="flex items-center justify-between bg-[#022c22]/80 border border-[#10b981]/50 px-4 py-1.5 rounded-xl">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-[#6ee7b7]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#ecfdf5]">
              Silicon Microprocessor Architecture • 3-Stage Pipeline
            </span>
          </div>

          {/* Quartz Crystal Resonator Widget */}
          <div className="flex items-center gap-2 bg-[#064e3b] px-3 py-1 rounded-lg border border-[#34d399]/40">
            <div className={`w-3 h-3 rounded-full ${isPulsing ? "bg-[#fef08a] shadow-lg shadow-[#fbbf24] animate-ping" : "bg-[#059669]"}`} />
            <span className="font-mono text-[11px] font-black text-[#a7f3d0]">
              QUARTZ 12.00 MHz
            </span>
          </div>
        </div>

        {/* Golden Bus Lines SVG Background connecting the 3 stages */}
        <svg className="absolute inset-x-0 top-16 w-full h-40 pointer-events-none z-0">
          <defs>
            <linearGradient id="goldBus" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* Traces from RAM to Decoder */}
          <path d="M 260 80 H 340" stroke="url(#goldBus)" strokeWidth={4} fill="none" strokeDasharray={pipelineStep >= 1 ? "4 2" : "none"} />
          {/* Traces from Decoder to ALU */}
          <path d="M 540 80 H 620" stroke="url(#goldBus)" strokeWidth={4} fill="none" strokeDasharray={pipelineStep >= 2 ? "4 2" : "none"} />
          {/* Bus Taps */}
          <circle cx="260" cy="80" r="4" fill="#fbbf24" stroke="#78350f" />
          <circle cx="340" cy="80" r="4" fill="#fbbf24" stroke="#78350f" />
          <circle cx="540" cy="80" r="4" fill="#fbbf24" stroke="#78350f" />
          <circle cx="620" cy="80" r="4" fill="#fbbf24" stroke="#78350f" />
        </svg>

        {/* 3 Physical Stages (Ceramic DIP Chips & ALU) */}
        <div className="relative z-10 grid grid-cols-3 gap-5 my-2 px-3">
          {/* STAGE 1: RAM & FETCH */}
          <div
            className={`relative rounded-2xl p-3 border-2 transition-all duration-300 flex flex-col justify-between ${
              pipelineStep >= 1
                ? "bg-[#78350f]/80 border-[#fbbf24] shadow-lg shadow-[#d97706]/40 scale-[1.02]"
                : "bg-[#451a03]/80 border-[#b45309]/60 opacity-80"
            }`}
          >
            {/* Ceramic Chip Pins (Gold) */}
            <div className="flex justify-between px-2 mb-1">
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
            </div>

            <div className="flex items-center justify-between pb-1 border-b border-[#fef08a]/30">
              <span className="text-[11px] font-black uppercase text-[#fef3c7] font-baloo">
                1. FETCH STAGE
              </span>
              <span className="text-[10px] font-mono font-bold text-[#fde68a]">ROM $004A</span>
            </div>

            <div className="my-2 bg-[#292524] p-2 rounded-xl border border-[#d97706]">
              <div className="text-[10px] font-mono text-[#fbbf24] uppercase">Stored Op:</div>
              <div className="text-base font-black font-mono text-[#fef08a] tracking-wider">
                ADD 4, 3
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#fde68a]">
              <span>RAM Bus:</span>
              <span className={`font-bold ${pipelineStep >= 1 ? "text-[#a7f3d0]" : "text-[#fde68a]/60"}`}>
                {pipelineStep >= 1 ? "PULSED TO BUS ✓" : "WAITING CLOCK"}
              </span>
            </div>
          </div>

          {/* STAGE 2: DECODER */}
          <div
            className={`relative rounded-2xl p-3 border-2 transition-all duration-300 flex flex-col justify-between ${
              pipelineStep >= 2
                ? "bg-[#78350f]/80 border-[#fbbf24] shadow-lg shadow-[#d97706]/40 scale-[1.02]"
                : "bg-[#451a03]/80 border-[#b45309]/60 opacity-80"
            }`}
          >
            {/* Ceramic Chip Pins (Gold) */}
            <div className="flex justify-between px-2 mb-1">
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
            </div>

            <div className="flex items-center justify-between pb-1 border-b border-[#fef08a]/30">
              <span className="text-[11px] font-black uppercase text-[#fef3c7] font-baloo">
                2. DECODE STAGE
              </span>
              <span className="text-[10px] font-mono font-bold text-[#fde68a]">Control Logic</span>
            </div>

            <div className="my-2 bg-[#292524] p-2 rounded-xl border border-[#d97706] space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[#fbbf24]">Operation:</span>
                <span className="font-bold text-[#fef08a]">{pipelineStep >= 2 ? "ADDITION (+)" : "--"}</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[#fbbf24]">Reg A / Reg B:</span>
                <span className="font-bold text-[#fef08a]">{pipelineStep >= 2 ? "A=4, B=3" : "--"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#fde68a]">
              <span>Decoder:</span>
              <span className={`font-bold ${pipelineStep >= 2 ? "text-[#a7f3d0]" : "text-[#fde68a]/60"}`}>
                {pipelineStep >= 2 ? "SIGNALS ROUTED ✓" : "LATCHED"}
              </span>
            </div>
          </div>

          {/* STAGE 3: ALU & EXECUTE */}
          <div
            className={`relative rounded-2xl p-3 border-2 transition-all duration-300 flex flex-col justify-between ${
              pipelineStep === 3
                ? "bg-[#064e3b]/90 border-[#34d399] shadow-lg shadow-[#10b981]/50 scale-[1.02]"
                : "bg-[#451a03]/80 border-[#b45309]/60 opacity-80"
            }`}
          >
            {/* Ceramic Chip Pins (Gold) */}
            <div className="flex justify-between px-2 mb-1">
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
              <span className="w-1.5 h-2 bg-[#fbbf24] rounded-t-xs" />
            </div>

            <div className="flex items-center justify-between pb-1 border-b border-[#fef08a]/30">
              <span className="text-[11px] font-black uppercase text-[#ecfdf5] font-baloo">
                3. EXECUTE (ALU)
              </span>
              <span className="text-[10px] font-mono font-bold text-[#a7f3d0]">Math Unit</span>
            </div>

            <div className="my-2 bg-[#022c22] p-2 rounded-xl border border-[#059669] text-center">
              <div className="text-[10px] font-mono text-[#6ee7b7] uppercase">Output Accumulator:</div>
              <div className="text-2xl font-black font-mono text-[#fef08a]">
                {pipelineStep === 3 ? "7" : "0"}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#a7f3d0]">
              <span>Status Flag:</span>
              <span className={`font-bold ${pipelineStep === 3 ? "text-[#6ee7b7]" : "text-[#a7f3d0]/60"}`}>
                {pipelineStep === 3 ? "CALCULATED (4+3=7) ✓" : "IDLE"}
              </span>
            </div>
          </div>
        </div>

        {/* Silicon PCB Bottom Silk-screen Notation */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#022c22]/80 border border-[#10b981]/40 rounded-xl">
          <span className="text-[11px] font-baloo font-bold text-[#ecfdf5]">
            Each tick of the quartz crystal moves the instruction forward: FETCH → DECODE → EXECUTE.
          </span>
          <span className="text-[11px] font-mono font-bold text-[#fbbf24]">
            CLOCK CYCLES: {pipelineStep}/3
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="CPU Pipeline Mastered!"
        message="You guided the microprocessor through Fetch, Decode, and Execute to compute arithmetic inside the ALU!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
