"use client";

import { useState } from "react";
import { Activity, Volume2, CheckCircle2, RotateCcw } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function DigitalAudioSampler() {
  const [sampleRate, setSampleRate] = useState<4 | 12 | 24>(4);
  const [bitDepth, setBitDepth] = useState<2 | 8>(2);
  const [hasListenedHighRes, setHasListenedHighRes] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("digital-audio-sampler");

  const handlePlayWaveSound = () => {
    setIsPlayingAudio(true);
    if (typeof window !== "undefined") {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 24 slices = pure sine tone; 12 slices = mellow triangle; 4 slices = raw retro square wave
        osc.type = sampleRate === 24 ? "sine" : sampleRate === 12 ? "triangle" : "sawtooth";
        // Frequency shifts slightly with bit depth resolution
        osc.frequency.setValueAtTime(bitDepth === 8 ? 440 : 392, ctx.currentTime);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch {
        playZap();
      }
    }

    setTimeout(() => setIsPlayingAudio(false), 600);

    if (sampleRate === 24 && bitDepth === 8) {
      setHasListenedHighRes(true);
    }
  };

  const handleFinish = () => {
    playSuccess();
    setHasWon(true);
    reportComplete({ labId: "digital-audio-sampler" });
  };

  const handleReset = () => {
    playClick();
    setSampleRate(4);
    setBitDepth(2);
    setHasListenedHighRes(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "Acoustic Audio Mastered! You sliced smooth sound vibrations into crystal-clear digital samples!"
          : !hasListenedHighRes
          ? "Step 1: Tune Sampling to 24 Slices and Bit Depth to 8-Bit, then press 'PLAY AUDIO PULSE'!"
          : "Hear that pure studio tone! The waveform slices match the sound wave. Click 'FINISH AUDIO LAB'!"
      }
      currentStep={hasListenedHighRes ? 1 : 0}
      totalSteps={2}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          {/* Controls: Sample Rate & Bit Depth */}
          <div className="flex items-center gap-4">
            {/* Sample Rate Knobs */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
                Sampling Rate:
              </span>
              {([4, 12, 24] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    playPop();
                    setSampleRate(r);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black transition-all cursor-pointer ${
                    sampleRate === r
                      ? "bg-[#d97706] text-[#451a03] shadow-md ring-2 ring-[#fbbf24] scale-105"
                      : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
                  }`}
                >
                  {r} Slices/s
                </button>
              ))}
            </div>

            {/* Bit Depth Knobs */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
                Bit Depth:
              </span>
              {([2, 8] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    playPop();
                    setBitDepth(b);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black transition-all cursor-pointer ${
                    bitDepth === b
                      ? "bg-[#059669] text-[#ecfdf5] shadow-md ring-2 ring-[#34d399] scale-105"
                      : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
                  }`}
                >
                  {b}-Bit ({b === 8 ? "256 Levels" : "4 Levels"})
                </button>
              ))}
            </div>
          </div>

          {/* Action: Play Sound / Finish */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayWaveSound}
              className={`px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-[#fef3c7] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 cursor-pointer border border-[#fef08a]/60 ${
                isPlayingAudio ? "ring-4 ring-[#fbbf24] scale-105" : ""
              }`}
            >
              <Volume2 size={16} className={isPlayingAudio ? "animate-bounce" : ""} />
              Play Audio Pulse
            </button>

            {hasListenedHighRes && (
              <button
                onClick={handleFinish}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#047857] hover:from-[#34d399] hover:to-[#059669] text-[#fef3c7] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ring-2 ring-[#a7f3d0] animate-bounce"
              >
                <CheckCircle2 size={16} /> Finish Audio Lab
              </button>
            )}
          </div>
        </div>
      }
    >
      {/* VINTAGE WALNUT & BRUSHED BRASS SYNTHESIZER OSCILLOSCOPE */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
        {/* Brass Screws on 4 Corners */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#fef08a] via-[#d97706] to-[#78350f] border border-[#78350f] shadow-xs flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03] rotate-45" />
        </div>
        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#fef08a] via-[#d97706] to-[#78350f] border border-[#78350f] shadow-xs flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03] -rotate-45" />
        </div>
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#fef08a] via-[#d97706] to-[#78350f] border border-[#78350f] shadow-xs flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03] rotate-12" />
        </div>
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#fef08a] via-[#d97706] to-[#78350f] border border-[#78350f] shadow-xs flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03] rotate-90" />
        </div>

        {/* Brass Nameplate Banner */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md">
          <div className="flex items-center gap-2">
            <Activity size={17} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              Acoustic Wave Slicer • Studio Oscilloscope Model 1974
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] font-black text-[#451a03]">
            <span className="bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
              {sampleRate} SAMPLES / SEC
            </span>
            <span className="bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
              {bitDepth}-BIT RESOLUTION
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                sampleRate === 24 && bitDepth === 8
                  ? "bg-[#059669] text-[#ecfdf5]"
                  : "bg-[#b45309] text-[#fef3c7]"
              }`}
            >
              {sampleRate === 24 && bitDepth === 8 ? "Studio Master" : "Chunky 8-Bit"}
            </span>
          </div>
        </div>

        {/* Phosphor Cathode-Ray Oscilloscope Display */}
        <div className="relative flex-1 w-full my-2 rounded-2xl bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#064e3b] border-3 border-[#047857] shadow-inner p-3 flex flex-col justify-between overflow-hidden">
          {/* Subtle phosphor grid lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #34d399 1px, transparent 1px), linear-gradient(to bottom, #34d399 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Analog Sound Wave (Smooth Golden Curve) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 10 110 Q 100 20, 190 110 T 370 110 T 550 110 T 730 110 T 900 110"
              fill="none"
              stroke="#fbbf24"
              strokeWidth={3.5}
              strokeDasharray="6 3"
              className="opacity-75"
            />
          </svg>

          {/* Sliced Digital Sample Pillars */}
          <div className="relative z-10 w-full h-44 flex items-end justify-between px-4 pb-2">
            {Array.from({ length: sampleRate }).map((_, i) => {
              const angle = (i / sampleRate) * Math.PI * 2 * 2;
              let heightPct = 52 + Math.sin(angle) * 38;

              // Quantize step for 2-bit (4 stepped heights)
              if (bitDepth === 2) {
                heightPct = Math.round(heightPct / 25) * 25;
                if (heightPct < 15) heightPct = 15;
              }

              return (
                <div key={i} className="flex flex-col items-center flex-1 max-w-[28px] mx-0.5">
                  {/* Binary Amplitude Tag */}
                  <span className="text-[9px] font-mono font-bold text-[#6ee7b7] mb-1">
                    {Math.round((heightPct / 100) * (bitDepth === 8 ? 255 : 3))}
                  </span>
                  {/* Digital Pillar */}
                  <div
                    style={{ height: `${heightPct * 1.3}px` }}
                    className={`w-full rounded-t-md transition-all duration-300 border-t-2 border-x ${
                      bitDepth === 8
                        ? "bg-gradient-to-t from-[#047857] via-[#10b981] to-[#6ee7b7] border-[#a7f3d0] shadow-sm shadow-[#10b981]"
                        : "bg-gradient-to-t from-[#b45309] via-[#d97706] to-[#fde047] border-[#fef08a] shadow-sm shadow-[#d97706]"
                    }`}
                  />
                  {/* Base Anchor Dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fef08a] mt-0.5" />
                </div>
              );
            })}
          </div>

          {/* Visual Legend */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-baloo font-bold text-[#a7f3d0] bg-[#022c22]/80 px-3 py-1 rounded-lg border border-[#047857]">
            <span className="flex items-center gap-1.5 text-[#fbbf24]">
              <span className="w-4 h-0.5 bg-[#fbbf24] inline-block border-b border-dashed border-[#fbbf24]" />
              Gold Dashed Wave = Smooth Analog Acoustic Vibration
            </span>
            <span className="flex items-center gap-1.5 text-[#6ee7b7]">
              <span className="w-3 h-3 bg-gradient-to-t from-[#047857] to-[#6ee7b7] rounded inline-block" />
              Vertical Bars = Sliced Digital Binary Numbers
            </span>
          </div>
        </div>

        {/* Chassis Lower Strip: Knurled Brass Status Dial */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
            <span className="text-[11px] font-mono font-bold text-[#fde68a]">
              Audio Slicer Status: {sampleRate >= 24 && bitDepth >= 8 ? "HI-FI MASTERED" : "AWAITING SAMPLES"}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#fde68a]">
            More Slices = Smoother Sound • Higher Bits = Accurate Volume
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="Digital Audio Sampling Mastered!"
        message="You discovered how digital audio converts smooth acoustic vibrations into numeric slices through sampling rate and bit resolution!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
