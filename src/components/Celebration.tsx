"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useWindowSize } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trophy, Star, Clock, Volume2 } from "lucide-react";
import { useSmartTimer } from "@/hooks/useLMSBridge";
import { useLabAudio } from "@/hooks/useLabAudio";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

interface CelebrationProps {
  isActive: boolean;
  hideModal?: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  onReplay?: () => void;
}

function exitFullscreen() {
  if (typeof document !== "undefined") {
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => void;
      msExitFullscreen?: () => void;
      mozCancelFullScreen?: () => void;
    };
    if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) {
      if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
    }
  }
}

export default function Celebration({
  isActive,
  hideModal = false,
  title = "Brilliant Work!",
  message = "You mastered this Grade 3 computing lab.",
}: CelebrationProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const { activeTimeSeconds } = useSmartTimer();
  const { errorCount } = useLabAudio();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const timeTaken = formatTime(activeTimeSeconds);
  const smartScore = Math.max(0, 100 - errorCount * 5);

  const winW = width || (typeof window !== "undefined" ? window.innerWidth : 1024);
  const winH = height || (typeof window !== "undefined" ? window.innerHeight : 768);
  const baseCardWidth = 420;
  const baseCardHeight = 460;
  const scaleFactor = Math.min(
    1,
    Math.max(0.4, Math.min((winW - 16) / baseCardWidth, (winH - 16) / baseCardHeight))
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isActive) {
      exitFullscreen();
      setShowConfetti(true);
      setIsDismissed(false);
      const t = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  const showModal = isActive && !hideModal && !isDismissed;

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-hidden select-none"
          >
            <motion.div
              initial={{ scale: 0.8 * scaleFactor, opacity: 0, y: 20 }}
              animate={{ scale: scaleFactor, opacity: 1, y: 0 }}
              exit={{ scale: 0.8 * scaleFactor, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.35, duration: 0.5 }}
              style={{ transformOrigin: "center center" }}
              className="bg-white border-[4px] sm:border-[6px] border-[#FBBF24] rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-8 max-w-[420px] w-full text-center shadow-[0_0_60px_rgba(0,0,0,0.4)] relative overflow-hidden shrink-0"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 to-emerald-50 rounded-full scale-[0.85] opacity-80 shadow-inner border border-emerald-100/50" />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-gradient-to-br from-yellow-300 via-orange-400 to-orange-500 rounded-full shadow-[0_8px_16px_rgba(249,115,22,0.3)] flex items-center justify-center border-2 border-white/40">
                  <Trophy size={28} className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" strokeWidth={2.5} />
                </div>
              </div>

              <div className="flex items-center justify-between bg-emerald-50 border-[1.5px] border-emerald-300 text-emerald-700 px-3.5 py-1.5 rounded-full mx-auto w-max mb-4 shadow-sm gap-2">
                <CheckCircle2 size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">
                  LAB SUCCESSFULLY COMPLETED
                </span>
                <Volume2 size={16} strokeWidth={2.5} className="opacity-70" />
              </div>

              <h2 className="text-2xl sm:text-[28px] font-black text-slate-900 mb-2 leading-tight font-baloo">
                {title}
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed px-1 sm:px-2 mb-4 sm:mb-6">
                {message}
              </p>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-[20px] p-3 sm:p-4 flex w-full justify-between items-center">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Star size={15} className="text-amber-500" fill="currentColor" />
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">SCORE</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none tracking-tight font-mono">
                    {smartScore}
                  </span>
                </div>

                <div className="w-[1.5px] h-10 bg-emerald-200/80 mx-2" />

                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock size={15} className="text-blue-500" />
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">TIMING</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none tracking-tight font-mono">
                    {timeTaken}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-[100000]">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={350}
            gravity={0.12}
            initialVelocityY={20}
            colors={["#facc15", "#38bdf8", "#34d399", "#f472b6", "#fb923c", "#a78bfa"]}
          />
        </div>
      )}
    </>,
    document.body
  );
}

