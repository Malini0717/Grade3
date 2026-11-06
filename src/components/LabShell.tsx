"use client";

import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  Clock,
  Star,
  Volume2,
  RotateCcw,
  Maximize,
  Minimize,
  Lightbulb,
  X,
  Compass,
  Hammer,
  GraduationCap,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useSmartTimer, startGlobalTimer } from "@/hooks/useLMSBridge";

interface LabContextType {
  score: number;
  timeFormatted: string;
  isTimerRunning: boolean;
  speakInstructions: (text: string) => void;
  setDynamicHints: (hints: string[]) => void;
  dynamicHints: string[];
}

const LabContext = createContext<LabContextType>({
  score: 100,
  timeFormatted: "00:00",
  isTimerRunning: true,
  speakInstructions: () => {},
  setDynamicHints: () => {},
  dynamicHints: [],
});

export const useLabContext = () => useContext(LabContext);

export type LabCategory = "quest" | "build" | "train" | "create";
export type LabMode = "2D" | "3D" | "both";

const CATEGORY_META: Record<LabCategory, { label: string; icon: LucideIcon; color: string }> = {
  quest: { label: "Quest", icon: Compass, color: "text-[#78350f] bg-[#fef3c7] border-[#f59e0b]" },
  build: { label: "Build", icon: Hammer, color: "text-[#065f46] bg-[#d1fae5] border-[#10b981]" },
  train: { label: "Train", icon: GraduationCap, color: "text-[#075985] bg-[#e0f2fe] border-[#0284c7]" },
  create: { label: "Create", icon: Sparkles, color: "text-[#701a75] bg-[#fae8ff] border-[#a855f7]" },
};

export interface LabShellProps {
  title: string;
  category?: LabCategory;
  mode?: LabMode;
  theme?: "circuit" | "cosmos" | "ocean" | "forge" | "garden" | "studio" | "neon" | "daylight";
  instruction?: string;
  voiceInstruction?: string;
  hints?: string[];
  onReset?: () => void;
  children: ReactNode;
}

export default function LabShell({
  title,
  category = "build",
  mode = "2D",
  theme = "daylight",
  instruction,
  voiceInstruction,
  hints = [],
  onReset,
  children,
}: LabShellProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [dynamicHints, setDynamicHints] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { activeTimeSeconds } = useSmartTimer();
  const { playClick, playPop, speakInstructions, stopSpeaking, isSpeaking, errorCount } = useLabAudio();

  const score = Math.max(0, 100 - errorCount * 5);
  const activeHints = dynamicHints.length > 0 ? dynamicHints : hints;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const timeFormatted = formatTime(activeTimeSeconds);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const handleStart = () => {
    playClick();
    startGlobalTimer();
    setIsStarted(true);
    const spokenText = voiceInstruction || instruction || (activeHints.length > 0 ? activeHints[0] : title);
    if (spokenText) {
      speakInstructions(spokenText);
    }
  };

  const handleSpeak = () => {
    playPop();
    const spokenText = voiceInstruction || instruction || (activeHints.length > 0 ? activeHints[0] : title);
    if (spokenText) {
      speakInstructions(spokenText);
    }
  };

  const handleToggleFullscreen = useCallback(() => {
    playClick();
    if (typeof document !== "undefined") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    }
  }, [playClick]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const meta = CATEGORY_META[category] || CATEGORY_META.build;
  const CatIcon = meta.icon;

  return (
    <LabContext.Provider
      value={{
        score,
        timeFormatted,
        isTimerRunning: isStarted,
        speakInstructions,
        setDynamicHints,
        dynamicHints,
      }}
    >
      <div className={`relative w-full h-[100dvh] flex flex-col overflow-hidden select-none theme-${theme} font-baloo`}>
        {/* Ambient warm glow orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#fde68a]/40 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#fed7aa]/40 blur-3xl" />

        {/* TOP NAVIGATION BAR (Warm Honey Amber Console Trim — Zero White) */}
        <header className="relative z-30 h-14 sm:h-16 px-3 sm:px-5 flex items-center justify-between border-b-2 border-[#f59e0b]/40 bg-[#fffbeb] backdrop-blur-md shrink-0 shadow-sm">
          {/* Left: Category Badge & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${meta.color} shadow-xs`}>
              <CatIcon size={14} />
              <span className="hidden sm:inline">{meta.label}</span>
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-black text-[#451a03] truncate max-w-[180px] sm:max-w-md">
              {title}
            </h1>
            {/* 2D / 3D pill */}
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#78350f] border border-[#fde68a]">
              {mode}
            </span>
          </div>

          {/* Right: Controls & Telemetry */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Score */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#fef3c7] border border-[#f59e0b]/40 text-[#78350f] shadow-xs">
              <Star size={14} className="fill-[#f59e0b] text-[#f59e0b]" />
              <span className="text-xs sm:text-sm font-black font-mono">{score}</span>
            </div>

            {/* Smart Timer */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#e0f2fe] border border-[#0284c7]/40 text-[#075985] shadow-xs">
              <Clock size={14} className="text-[#0284c7]" />
              <span className="text-xs sm:text-sm font-black font-mono">{timeFormatted}</span>
            </div>

            {/* Read aloud TTS */}
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-[#d1fae5] border-[#10b981] text-[#065f46] animate-pulse"
                  : "bg-[#fef3c7] hover:bg-[#fde68a] border-[#fde68a] text-[#78350f] shadow-xs"
              }`}
              title="Read Instructions Aloud"
              aria-label="Speak"
            >
              <Volume2 size={16} />
            </button>

            {/* Hint Modal Toggle */}
            {activeHints.length > 0 && (
              <button
                onClick={() => {
                  playPop();
                  setShowHintModal(!showHintModal);
                }}
                className="p-2 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] text-[#78350f] transition-all cursor-pointer shadow-xs"
                title="Show Hints"
                aria-label="Hints"
              >
                <Lightbulb size={16} />
              </button>
            )}

            {/* Reset */}
            {onReset && (
              <button
                onClick={() => {
                  playPop();
                  onReset();
                }}
                className="p-2 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] text-[#78350f] transition-all cursor-pointer shadow-xs"
                title="Reset Activity"
                aria-label="Reset"
              >
                <RotateCcw size={16} />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] text-[#78350f] transition-all cursor-pointer shadow-xs"
              title="Toggle Fullscreen"
              aria-label="Fullscreen"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </header>

        {/* HINT POPUP MODAL (Warm Amber Frame — Zero White) */}
        <AnimatePresence>
          {showHintModal && (
            <div className="absolute inset-x-0 top-16 z-40 flex justify-center p-3 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="w-full max-w-md bg-[#fffbeb] rounded-3xl p-5 shadow-2xl border-2 border-[#f59e0b] text-[#451a03] pointer-events-auto"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#fde68a]">
                  <div className="flex items-center gap-2 text-[#92400e] font-black text-sm">
                    <Lightbulb size={16} />
                    <span>Lab Hint</span>
                  </div>
                  <button
                    onClick={() => setShowHintModal(false)}
                    className="p-1 rounded-full hover:bg-[#fef3c7] text-[#92400e]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2.5">
                  {activeHints.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-[#fef3c7] p-2.5 rounded-2xl border border-[#fde68a] text-xs sm:text-sm font-semibold text-[#78350f]">
                      <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-[#451a03] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN LAB CANVAS VIEWPORT (Zero clipping, full 100dvh lock) */}
        <main className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col items-center justify-center">
          {!isStarted ? (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-[#78350f]/25 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full bg-[#fffbeb] border-4 border-[#f59e0b] rounded-3xl p-6 sm:p-8 text-center shadow-2xl"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 bg-[#fef3c7] text-[#78350f] border border-[#fde68a] shadow-xs">
                  <CatIcon size={14} />
                  Grade 3 • {meta.label} Lab
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#451a03] mb-3 leading-tight">
                  {title}
                </h2>
                <p className="text-sm sm:text-base text-[#78350f] font-semibold mb-6 leading-relaxed">
                  {instruction || (hints.length > 0 ? hints[0] : "Explore and solve this computing lab.")}
                </p>
                <button
                  onClick={handleStart}
                  className="px-8 py-3.5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-[#fffbeb] font-black text-base uppercase tracking-wider shadow-lg hover:shadow-[#d97706]/40 transition-all cursor-pointer active:scale-95"
                >
                  Start Activity
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden flex flex-col bg-transparent">
              {children}
            </div>
          )}
        </main>
      </div>
    </LabContext.Provider>
  );
}
