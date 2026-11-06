"use client";

import { useState } from "react";
import { Sparkles, Sliders, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function DiffusionDenoisingArt() {
  // Denoising Steps: 0 (Pure Static Noise) to 4 (Crystal Clear Generative Art)
  const [denoiseStep, setDenoiseStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isDenoising, setIsDenoising] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("diffusion-denoising-art");

  const noisePercentages = [100, 75, 50, 25, 0];

  const handleStepDenoise = () => {
    if (denoiseStep >= 4 || isDenoising) return;

    setIsDenoising(true);
    playZap();

    setTimeout(() => {
      playPop();
      const nextStep = (denoiseStep + 1) as 1 | 2 | 3 | 4;
      setDenoiseStep(nextStep);
      setIsDenoising(false);

      if (nextStep === 4 && !hasWon) {
        playSuccess();
        setHasWon(true);
        reportComplete({ labId: "diffusion-denoising-art" });
      }
    }, 500);
  };

  const handleReset = () => {
    playClick();
    setDenoiseStep(0);
    setIsDenoising(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "Diffusion AI Mastered! By reversing static noise step-by-step, the generative model reconstructed sharp artwork!"
          : denoiseStep === 0
          ? "Step 1: The canvas begins with 100% random static fuzz. Press 'APPLY DENOISE STEP' to remove noise!"
          : denoiseStep < 4
          ? `Step ${denoiseStep + 1}: Filter out more noise (${noisePercentages[denoiseStep]}% noise remaining) to sharpen the hidden picture!`
          : "Artwork fully reconstructed! Click 'FINISH DIFFUSION LAB' to complete!"
      }
      currentStep={denoiseStep}
      totalSteps={4}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleStepDenoise}
              disabled={denoiseStep >= 4 || isDenoising}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer border-2 transition-all ${
                denoiseStep >= 4
                  ? "bg-[#059669] text-[#ecfdf5] border-[#34d399]"
                  : "bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-[#fef3c7] border-[#fef08a] ring-2 ring-[#fbbf24]"
              }`}
            >
              <Sparkles size={16} className={isDenoising ? "animate-spin" : ""} />
              <span>
                {isDenoising
                  ? "Subtracting Noise Tensor..."
                  : denoiseStep >= 4
                  ? "Generative Denoise Complete ✓"
                  : `Apply Denoise Step (${denoiseStep + 1}/4)`}
              </span>
            </button>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              Noise Level: {noisePercentages[denoiseStep]}% Static • Step {denoiseStep}/4
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset to 100% Noise
            </button>
          </div>
        </div>
      }
    >
      {/* ARTIST STUDIO ATELIER & DIFFUSION EASEL */}
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

        {/* Studio Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              Generative AI Atelier • Reverse Diffusion Denoising
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03]">
            LATENT DIFFUSION MODEL (50 STEPS EQUIVALENT)
          </span>
        </div>

        {/* MAIN VISUAL ZONE: THE DIFFUSION CANVAS & DENOISING ARM */}
        <div className="relative my-2 flex-1 w-full bg-[#1c1917] rounded-2xl border-3 border-[#fbbf24] shadow-inner p-3 flex items-center justify-center overflow-hidden">
          {/* UNDERLYING GENERATIVE ART (Astronaut Space Cat) */}
          <div className="relative w-72 h-44 flex items-center justify-center">
            {/* Space Nebula Background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#831843] flex items-center justify-center shadow-md">
              <svg className="w-48 h-36" viewBox="0 0 200 150">
                {/* Nebula Stars */}
                <circle cx="20" cy="25" r="2" fill="#fef08a" />
                <circle cx="180" cy="30" r="1.5" fill="#fef08a" />
                <circle cx="160" cy="120" r="2" fill="#67e8f9" />
                <circle cx="35" cy="115" r="1.5" fill="#f472b6" />

                {/* Astronaut Helmet Visor */}
                <ellipse cx="100" cy="75" rx="55" ry="50" fill="#0284c7" stroke="#38bdf8" strokeWidth="4" />
                <ellipse cx="100" cy="75" rx="45" ry="40" fill="#0f172a" />
                {/* Visor Glare */}
                <path d="M 75 55 Q 100 45, 125 55" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.6" />

                {/* Cute Space Cat Ears inside Helmet */}
                <polygon points="70,50 82,30 94,50" fill="#f59e0b" />
                <polygon points="106,50 118,30 130,50" fill="#f59e0b" />

                {/* Cat Face Whiskers & Eyes */}
                <ellipse cx="88" cy="75" rx="6" ry="8" fill="#34d399" />
                <ellipse cx="112" cy="75" rx="6" ry="8" fill="#34d399" />
                <circle cx="90" cy="73" r="2" fill="#ffffff" />
                <circle cx="114" cy="73" r="2" fill="#ffffff" />
                <polygon points="100,82 96,87 104,87" fill="#f472b6" />
              </svg>
            </div>

            {/* OVERLAYING STATIC NOISE FILTER (Opacity drops with denoiseStep) */}
            <div
              style={{ opacity: noisePercentages[denoiseStep] / 100 }}
              className="absolute inset-0 rounded-2xl bg-[#78350f] pointer-events-none transition-opacity duration-500 overflow-hidden"
            >
              {/* Dense mathematical static pattern */}
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "radial-gradient(#fde68a 1px, transparent 1px), radial-gradient(#b45309 1px, transparent 1px)",
                  backgroundSize: "6px 6px, 10px 10px",
                  backgroundPosition: "0 0, 3px 3px",
                }}
              />
            </div>
          </div>

          {/* Denoising Step Badge Overlay */}
          <div className="absolute bottom-2 left-4 px-3 py-1 rounded-xl bg-[#022c22]/90 border border-[#10b981] font-mono text-xs font-black text-[#a7f3d0]">
            Noise Removed: {100 - noisePercentages[denoiseStep]}%
          </div>

          <div className="absolute bottom-2 right-4 px-3 py-1 rounded-xl bg-[#451a03]/90 border border-[#fbbf24] font-mono text-xs font-black text-[#fef08a]">
            Prompt: &quot;Astronaut cat in nebula&quot;
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7]">
          <span>
            Diffusion models create clear images by gradually predicting and subtracting noise from pure static!
          </span>
          <span className="font-mono text-[#fbbf24]">
            DENOISE LEVEL: {denoiseStep}/4
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="AI Diffusion Denoising Mastered!"
        message="You discovered how modern generative AI constructs sharp artwork by gradually removing random mathematical static noise!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}

