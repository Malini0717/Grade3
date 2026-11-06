"use client";

import { ReactNode } from "react";
import { Volume2, CheckCircle2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useLabAudio } from "@/hooks/useLabAudio";

export interface StepDot {
  id: string | number;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface GradeThreeScaffoldProps {
  instruction: string;
  currentStep?: number;
  totalSteps?: number;
  steps?: StepDot[];
  tray?: ReactNode;
  children: ReactNode;
  onReset?: () => void;
  fullBleed?: boolean;
  hideHeader?: boolean;
}

export default function GradeThreeScaffold({
  instruction,
  currentStep = 0,
  totalSteps = 3,
  steps,
  tray,
  children,
  onReset,
  fullBleed = false,
  hideHeader = false,
}: GradeThreeScaffoldProps) {
  const { speakInstructions, playPop, isSpeaking } = useLabAudio();

  const handleSpeak = () => {
    playPop();
    speakInstructions(instruction);
  };

  const stepList: StepDot[] =
    steps ||
    Array.from({ length: totalSteps }, (_, idx) => ({
      id: idx,
      label: `Step ${idx + 1}`,
      isCompleted: idx < currentStep,
      isCurrent: idx === currentStep,
    }));

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden font-baloo select-none ${
        fullBleed ? "p-0 gap-0" : "p-2 sm:p-3 gap-2"
      }`}
    >
      {/* ── TOP TASK INSTRUCTION & STEP DOTS (Can be hidden if fullBleed / custom side) ── */}
      {!hideHeader && (
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#fffbeb] border-2 border-[#f59e0b]/40 rounded-2xl px-4 py-2 shadow-md shrink-0">
          {/* Step dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {stepList.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-1.5">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black transition-all ${
                    step.isCompleted
                      ? "bg-[#10b981] text-[#064e3b] shadow-xs"
                      : step.isCurrent
                      ? "bg-[#f59e0b] text-[#451a03] scale-110 ring-2 ring-[#fbbf24] shadow-sm"
                      : "bg-[#fef3c7] text-[#92400e] border border-[#fde68a]"
                  }`}
                  title={step.label}
                >
                  {step.isCompleted ? <CheckCircle2 size={13} strokeWidth={3} /> : idx + 1}
                </div>
                {idx < stepList.length - 1 && (
                  <div
                    className={`w-4 h-0.5 rounded-full ${
                      step.isCompleted ? "bg-[#10b981]" : "bg-[#fde68a]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* In-world Directive Prompt with audio button */}
          <div className="flex items-center gap-2 text-center sm:text-left flex-1 min-w-0 justify-center sm:justify-start px-2">
            <p className="text-xs sm:text-sm md:text-base font-black text-[#451a03] truncate">
              {instruction}
            </p>
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isSpeaking
                  ? "bg-[#d1fae5] border-[#10b981] text-[#065f46] animate-pulse"
                  : "bg-[#fef3c7] hover:bg-[#fde68a] border-[#fcd34d] text-[#78350f] shadow-xs"
              }`}
              title="Read Instruction Aloud"
              aria-label="Speak Instruction"
            >
              <Volume2 size={15} />
            </button>
          </div>

          {/* Optional Reset Button */}
          {onReset && (
            <button
              onClick={() => {
                playPop();
                onReset();
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-bold border border-[#fcd34d] transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw size={12} />
              <span>Reset Step</span>
            </button>
          )}
        </div>
      )}

      {/* ── MAIN PLAYGROUND CANVAS (Full-Bleed Edge-to-Edge or Centered) ── */}
      <div
        className={`relative flex-1 min-h-0 w-full ${
          fullBleed ? "max-w-none rounded-none" : "max-w-5xl rounded-3xl"
        } mx-auto flex items-center justify-center overflow-hidden bg-transparent`}
      >
        {children}
      </div>

      {/* ── BOTTOM TOOL / TOKEN TRAY DOCK ── */}
      {tray && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`w-full ${
            fullBleed
              ? "max-w-none rounded-none border-t-2 px-3 py-2"
              : "max-w-4xl mx-auto rounded-2xl border-2 p-2.5"
          } flex items-center justify-center bg-[#fffbeb] border-[#f59e0b]/40 shadow-lg shrink-0`}
        >
          {tray}
        </motion.div>
      )}
    </div>
  );
}
