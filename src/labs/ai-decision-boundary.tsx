"use client";

import { useState } from "react";
import { Plus, HelpCircle } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

interface DataPoint {
  id: string;
  x: number; // Weight (0 to 100)
  y: number; // Height (0 to 100)
  type: "rabbit" | "bear" | "mystery";
}

export default function AiDecisionBoundary() {
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [mysteryClassified, setMysteryClassified] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("ai-decision-boundary");

  const rabbitCount = points.filter((p) => p.type === "rabbit").length;
  const bearCount = points.filter((p) => p.type === "bear").length;

  const handleAddPoint = (type: "rabbit" | "bear") => {
    if (type === "rabbit" && rabbitCount >= 3) return;
    if (type === "bear" && bearCount >= 3) return;

    playPop();

    const newPoint: DataPoint =
      type === "rabbit"
        ? {
            id: `r-${rabbitCount}`,
            x: 16 + rabbitCount * 12 + Math.floor(Math.random() * 6),
            y: 20 + rabbitCount * 10 + Math.floor(Math.random() * 6),
            type: "rabbit",
          }
        : {
            id: `b-${bearCount}`,
            x: 62 + bearCount * 10 + Math.floor(Math.random() * 6),
            y: 65 + bearCount * 9 + Math.floor(Math.random() * 6),
            type: "bear",
          };

    setPoints((prev) => [...prev, newPoint]);
  };

  const handleTestMystery = () => {
    playZap();
    const mystery: DataPoint = {
      id: "mystery",
      x: 30,
      y: 35,
      type: "mystery",
    };
    setPoints((prev) => [...prev, mystery]);
    setMysteryClassified(true);

    setTimeout(() => {
      playSuccess();
      setHasWon(true);
      reportComplete({ labId: "ai-decision-boundary" });
    }, 1200);
  };

  const handleReset = () => {
    playClick();
    setPoints([]);
    setMysteryClassified(false);
    setHasWon(false);
  };

  const hasTrained = rabbitCount >= 3 && bearCount >= 3;

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "Triumph! The machine learning boundary automatically classified the new mystery creature!"
          : !hasTrained
          ? `Train the AI: Stamp 3 Rabbits (${rabbitCount}/3) and 3 Bears (${bearCount}/3) onto the meadow!`
          : !mysteryClassified
          ? "Decision Boundary Drawn! Click 'Classify Mystery Creature' to test the model!"
          : "Analyzing Coordinates... AI Classified as Rabbit!"
      }
      currentStep={mysteryClassified ? 2 : hasTrained ? 1 : 0}
      totalSteps={3}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-2 text-[#451a03]">
          {/* Training Stamp Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddPoint("rabbit")}
              disabled={rabbitCount >= 3 || hasWon}
              className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-40 text-[#f0f9ff] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ring-2 ring-[#7dd3fc]"
            >
              <Plus size={14} /> Stamp Rabbit ({rabbitCount}/3)
            </button>
            <button
              onClick={() => handleAddPoint("bear")}
              disabled={bearCount >= 3 || hasWon}
              className="px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] disabled:opacity-40 text-[#fffbeb] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ring-2 ring-[#fcd34d]"
            >
              <Plus size={14} /> Stamp Bear ({bearCount}/3)
            </button>
          </div>

          {/* Test Phase Action */}
          <div>
            <button
              onClick={handleTestMystery}
              disabled={!hasTrained || mysteryClassified || hasWon}
              className="px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-[#ecfdf5] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ring-2 ring-[#34d399]"
            >
              <HelpCircle size={15} /> Classify Mystery Creature
            </button>
          </div>
        </div>
      }
    >
      {/* ── BOTANICAL MEADOW CLASSIFICATION FIELD (Rich Grass Turf — Zero White / Zero Dark) ── */}
      <div className="relative w-full h-full max-w-3xl max-h-[380px] bg-gradient-to-br from-[#86efac] via-[#4ade80] to-[#22c55e] rounded-3xl border-4 border-[#15803d] shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
        {/* Shaded Classification Zones */}
        {hasTrained && (
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#38bdf8] via-transparent to-[#fbbf24]" />
          </div>
        )}

        {/* Dynamic Decision Boundary Laser Line */}
        {hasTrained && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <line
              x1="0%"
              y1="90%"
              x2="100%"
              y2="10%"
              stroke="#b91c1c"
              strokeWidth={4}
              strokeDasharray="8 6"
            />
            <text x="55%" y="36%" fill="#7f1d1d" fontSize={12} fontWeight={900}>
              DECISION BOUNDARY LINE
            </text>
          </svg>
        )}

        {/* Chart Area with Plotted Points */}
        <div className="relative flex-1 w-full border-l-3 border-b-3 border-[#166534]">
          {/* Y Axis Label */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-black uppercase text-[#14532d] tracking-wider">
            Height (cm)
          </div>

          {/* X Axis Label */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase text-[#14532d] tracking-wider">
            Weight (kg)
          </div>

          {/* Data Points */}
          {points.map((p) => {
            const isRabbit = p.type === "rabbit";
            const isMystery = p.type === "mystery";

            return (
              <div
                key={p.id}
                style={{
                  left: `${p.x}%`,
                  bottom: `${p.y}%`,
                }}
                className={`absolute w-8 h-8 -translate-x-1/2 translate-y-1/2 rounded-full flex items-center justify-center text-xs font-black shadow-lg border-2 transition-all animate-in zoom-in-50 duration-200 z-20 ${
                  isMystery
                    ? "bg-[#9333ea] border-[#f3e8ff] text-white ring-4 ring-[#d8b4fe] animate-bounce"
                    : isRabbit
                    ? "bg-[#0284c7] border-[#e0f2fe] text-white ring-2 ring-[#38bdf8]"
                    : "bg-[#d97706] border-[#fef3c7] text-[#fffbeb] ring-2 ring-[#fbbf24]"
                }`}
              >
                {isMystery ? "?" : isRabbit ? "R" : "B"}
              </div>
            );
          })}
        </div>

        {/* Chart Footer Legend */}
        <div className="flex items-center justify-between pt-3 text-xs font-black text-[#14532d] border-t-2 border-[#166534]/30 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7] border border-[#0369a1]" />
              <span>Rabbits Zone</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#d97706] border border-[#b45309]" />
              <span>Bears Zone</span>
            </div>
          </div>
          <span className="text-[11px] text-[#14532d] font-mono font-bold">Classifier: Linear Hyperplane</span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="Machine Learning Classifier Mastered!"
        message="You trained the algorithm with coordinate points, drawing a mathematical boundary that automatically categorized the new input!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
