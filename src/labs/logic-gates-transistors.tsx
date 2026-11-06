"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Key,
  Plug,
  ArrowRight,
  RotateCcw,
  Zap,
  Star,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge, startGlobalTimer } from "@/hooks/useLMSBridge";

// ── COLOR CONSTANTS (Sunny, Vibrant Grade 3 Palette) ──
const C = {
  cream: "#FFF8E7",
  creamDark: "#F3E8D0",
  yellow: "#FFD93D",
  yellowShadow: "#F59E0B",
  sky: "#6EC6FF",
  skyShadow: "#0284C7",
  mint: "#7EE8C1",
  mintDark: "#059669",
  mintShadow: "#10B981",
  pcbGreen: "#059669",
  pcbGreenDark: "#047857",
  pcbGreenLight: "#10B981",
  coral: "#FF8A80",
  coralShadow: "#E11D48",
  pink: "#FFB3D9",
  pinkShadow: "#DB2777",
  lavender: "#C9B6FF",
  lavenderShadow: "#7C3AED",
  orange: "#FFB347",
  orangeShadow: "#D97706",
  purple: "#6B3FA0", // Primary 5-6px outline
  purpleLight: "#8B5CF6",
  brown: "#8A5A3C",
  gold: "#FFD54F",
  goldTrace: "#FBBF24",
  silver: "#E2E8F0",
  silverDark: "#94A3B8",
  white: "#FFFFFF",
};

// ── TYPES ──
type DragItemType = "magnifier" | "key" | "plug" | null;

interface DragState {
  type: DragItemType;
  x: number;
  y: number;
  isDragging: boolean;
}

export default function LogicGatesTransistors() {
  // ── 8 TOTAL PROGRESSIVE LEVELS (Intro + All Basic, Universal & Derived Gates) ──
  // 1: Zoom In Intro (Drag Magnifier to energize the chip)
  // 2: AND ("Series: BOTH must be ON")
  // 3: OR ("Parallel: EITHER can be ON")
  // 4: NOT ("Inverter: Flips 0 to 1 and 1 to 0")
  // 5: NAND ("NOT-AND: ON unless BOTH are ON")
  // 6: NOR ("NOT-OR: ON only when BOTH are OFF")
  // 7: XOR ("Different: ON when inputs do NOT match")
  // 8: XNOR ("Same: ON when both inputs match")
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1);

  // Audio Hooks & LMS Bridge
  const { playClick, playPop, playSuccess, playZap, playDrop, playChime } = useLabAudio();
  const { reportComplete } = useLMSBridge("logic-gates-transistors");

  // Win State, Score & Telemetry
  const [hasWon, setHasWon] = useState(false);
  const [score, setScore] = useState(100);
  const [scorePopup, setScorePopup] = useState<string | null>(null);
  const hasReportedRef = useRef(false);

  // ── FIX 1: START TIMER PROPERLY ON COMPONENT MOUNT ──
  useEffect(() => {
    startGlobalTimer();
  }, []);

  // ── IDLE HINT HAND TRACKING ──
  const [showIdleHint, setShowIdleHint] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    setShowIdleHint(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setShowIdleHint(true);
    }, 3500);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    const handleActivity = () => resetIdleTimer();
    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("pointermove", handleActivity);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("pointermove", handleActivity);
    };
  }, [resetIdleTimer]);

  // ── STAGE 1: ZOOM IN STATE ──
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  // ── STAGE 2: AND GATE STATE (Series: Both must be closed) ──
  const [andDoor1, setAndDoor1] = useState(false);
  const [andDoor2, setAndDoor2] = useState(false);
  const andPowerOn = andDoor1 && andDoor2;

  // ── STAGE 3: OR GATE STATE (Parallel: Either can be closed) ──
  const [orDoorTop, setOrDoorTop] = useState(false);
  const [orDoorBottom, setOrDoorBottom] = useState(false);
  const orPowerOn = orDoorTop || orDoorBottom;

  // ── STAGE 4: NOT GATE STATE ──
  // isPluggedIn=true means door is CLOSED → signal blocked → NOT flips → light ON
  // isPluggedIn=false means door is OPEN  → signal flows  → NOT flips → light OFF
  // User rule: door closed → light glows
  const [isPluggedIn, setIsPluggedIn] = useState(true);
  const notPowerOn = isPluggedIn; // door CLOSED (plugged) → light ON

  // ── STAGE 5: NAND GATE STATE (NOT-AND: ON unless both are on) ──
  const [nandDoor1, setNandDoor1] = useState(false);
  const [nandDoor2, setNandDoor2] = useState(false);
  const nandPowerOn = !(nandDoor1 && nandDoor2);

  // ── STAGE 6: NOR GATE STATE (NOT-OR: ON only when both are off) ──
  const [norDoorTop, setNorDoorTop] = useState(false);
  const [norDoorBottom, setNorDoorBottom] = useState(false);
  const norPowerOn = !(norDoorTop || norDoorBottom);

  // ── STAGE 7: XOR GATE STATE (Outputs ON when inputs are different) ──
  const [xorSwitchA, setXorSwitchA] = useState(false);
  const [xorSwitchB, setXorSwitchB] = useState(false);
  const xorPowerOn = (xorSwitchA && !xorSwitchB) || (!xorSwitchA && xorSwitchB);

  // ── STAGE 8: XNOR GATE STATE (Outputs ON when inputs are the same) ──
  const [xnorSwitchA, setXnorSwitchA] = useState(false);
  const [xnorSwitchB, setXnorSwitchB] = useState(true); // Start different so child flips to solve!
  const xnorPowerOn = (xnorSwitchA && xnorSwitchB) || (!xnorSwitchA && !xnorSwitchB);

  // ── FIX 2: BULLETPROOF GLOBAL DRAG & DROP POINTER SYSTEM ──
  const [dragState, setDragState] = useState<DragState>({
    type: null,
    x: 0,
    y: 0,
    isDragging: false,
  });
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const chipTargetRef = useRef<HTMLDivElement>(null);
  const door1Ref = useRef<SVGGElement>(null);
  const door2Ref = useRef<SVGGElement>(null);
  const orTopRef = useRef<SVGGElement>(null);
  const orBottomRef = useRef<SVGGElement>(null);
  const plugSocketRef = useRef<SVGGElement>(null);

  const isOverTarget = (x: number, y: number, ref: React.RefObject<Element | null>) => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    return x >= rect.left - 40 && x <= rect.right + 40 && y >= rect.top - 40 && y <= rect.bottom + 40;
  };

  const triggerZoom = useCallback(() => {
    if (isZoomedIn) return;
    playZap();
    setIsZoomedIn(true);
    setTimeout(() => {
      playChime();
      setStage(2);
      setScore((prev) => prev + 25);
      setScorePopup("+25 PTS!");
      setTimeout(() => setScorePopup(null), 1400);
    }, 750);
  }, [isZoomedIn, playZap, playChime]);

  const handlePointerDown = (type: DragItemType, e: React.PointerEvent) => {
    e.preventDefault();
    playPop();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragState({
      type,
      x: e.clientX,
      y: e.clientY,
      isDragging: true,
    });
  };

  // Window-level pointer tracking for smooth, unclipped dragging anywhere on screen
  useEffect(() => {
    if (!dragState.isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      setDragState((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const onPointerUp = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      const itemType = dragState.type;
      const dist = Math.hypot(x - dragStartPos.current.x, y - dragStartPos.current.y);
      const isClick = dist < 12;

      setDragState({ type: null, x: 0, y: 0, isDragging: false });

      if (stage === 1 && itemType === "magnifier") {
        if (isClick || isOverTarget(x, y, chipTargetRef)) {
          triggerZoom();
        } else {
          playZap();
        }
      } else if (stage === 2 && itemType === "key") {
        if (isOverTarget(x, y, door1Ref)) {
          playDrop();
          setAndDoor1((prev) => !prev);
          playZap();
        } else if (isOverTarget(x, y, door2Ref)) {
          playDrop();
          setAndDoor2((prev) => !prev);
          playZap();
        } else if (isClick) {
          playDrop();
          if (!andDoor1) setAndDoor1(true);
          else setAndDoor2((prev) => !prev);
          playZap();
        } else {
          playZap();
        }
      } else if (stage === 3 && itemType === "key") {
        if (isOverTarget(x, y, orTopRef)) {
          playDrop();
          setOrDoorTop((prev) => !prev);
          playZap();
        } else if (isOverTarget(x, y, orBottomRef)) {
          playDrop();
          setOrDoorBottom((prev) => !prev);
          playZap();
        } else if (isClick) {
          playDrop();
          if (!orDoorTop) setOrDoorTop(true);
          else setOrDoorBottom((prev) => !prev);
          playZap();
        } else {
          playZap();
        }
      } else if (stage === 4 && itemType === "plug") {
        if (isClick || isOverTarget(x, y, plugSocketRef)) {
          playDrop();
          setIsPluggedIn((prev) => !prev);
          playZap();
        } else {
          playZap();
        }
      } else if (stage === 5 && itemType === "key") {
        if (isOverTarget(x, y, door1Ref)) {
          playDrop();
          setNandDoor1((prev) => !prev);
          playZap();
        } else if (isOverTarget(x, y, door2Ref)) {
          playDrop();
          setNandDoor2((prev) => !prev);
          playZap();
        } else if (isClick) {
          playDrop();
          setNandDoor1((prev) => !prev);
          playZap();
        }
      } else if (stage === 6 && itemType === "key") {
        if (isOverTarget(x, y, orTopRef)) {
          playDrop();
          setNorDoorTop((prev) => !prev);
          playZap();
        } else if (isOverTarget(x, y, orBottomRef)) {
          playDrop();
          setNorDoorBottom((prev) => !prev);
          playZap();
        } else if (isClick) {
          playDrop();
          setNorDoorTop((prev) => !prev);
          playZap();
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [
    dragState.isDragging,
    dragState.type,
    stage,
    andDoor1,
    orDoorTop,
    triggerZoom,
    playDrop,
    playZap,
  ]);

  // Grand triumph check on Stage 8 completion
  useEffect(() => {
    if (stage === 8 && xnorPowerOn && !hasWon) {
      const timer = setTimeout(() => {
        playSuccess();
        playChime();
        setHasWon(true);
        if (!hasReportedRef.current) {
          hasReportedRef.current = true;
          reportComplete({ labId: "logic-gates-transistors", points: score + 25 });
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [stage, xnorPowerOn, hasWon, score, playSuccess, playChime, reportComplete]);

  const advanceStage = (nextStage: number) => {
    playChime();
    setScore((prev) => prev + 25);
    setScorePopup("+25 PTS!");
    setTimeout(() => setScorePopup(null), 1400);
    setStage(nextStage as any);
  };

  const handleReset = () => {
    playClick();
    setStage(1);
    setIsZoomedIn(false);
    setAndDoor1(false);
    setAndDoor2(false);
    setOrDoorTop(false);
    setOrDoorBottom(false);
    setIsPluggedIn(true);
    setNandDoor1(false);
    setNandDoor2(false);
    setNorDoorTop(false);
    setNorDoorBottom(false);
    setXorSwitchA(false);
    setXorSwitchB(false);
    setXnorSwitchA(false);
    setXnorSwitchB(true);
    setHasWon(false);
    setScore(100);
    hasReportedRef.current = false;
  };

  // Steps Configuration for Scaffold Dots (Short titles under 20 chars)
  const stepsConfig = [
    { id: 1, label: "Zoom", isCompleted: stage > 1, isCurrent: stage === 1 },
    { id: 2, label: "AND", isCompleted: stage > 2, isCurrent: stage === 2 },
    { id: 3, label: "OR", isCompleted: stage > 3, isCurrent: stage === 3 },
    { id: 4, label: "NOT", isCompleted: stage > 4, isCurrent: stage === 4 },
    { id: 5, label: "NAND", isCompleted: stage > 5, isCurrent: stage === 5 },
    { id: 6, label: "NOR", isCompleted: stage > 6, isCurrent: stage === 6 },
    { id: 7, label: "XOR", isCompleted: stage > 7, isCurrent: stage === 7 },
    { id: 8, label: "XNOR", isCompleted: hasWon, isCurrent: stage === 8 },
  ];

  // ── FIX 3: CONCISE HEADER DIRECTIVES (Zero truncation in header) ──
  const stepInstruction =
    stage === 1
      ? "Zoom into the microchip!"
      : stage === 2
      ? "AND: Close BOTH doors!"
      : stage === 3
      ? "OR: Open EITHER door!"
      : stage === 4
      ? "NOT: Pull plug to flip!"
      : stage === 5
      ? "NAND: Opposite of AND!"
      : stage === 6
      ? "NOR: Opposite of OR!"
      : stage === 7
      ? "XOR: Make inputs DIFFER!"
      : "XNOR: Make inputs MATCH!";

  // ── FULL EDUCATIONAL SENTENCE (Clear In-Scene Banner) ──
  const inSceneExplanation =
    stage === 2
      ? "AND GATE: Series switches — BOTH doors must be ON for current to flow!"
      : stage === 3
      ? "OR GATE: Parallel switches — Current flows if EITHER door is ON!"
      : stage === 4
      ? "NOT GATE: Inverter — Signal flips upside-down! OFF becomes ON!"
      : stage === 5
      ? "NAND GATE: Universal NOT-AND — Stays ON unless BOTH switches are ON!"
      : stage === 6
      ? "NOR GATE: Universal NOT-OR — Stays ON only when BOTH switches are OFF!"
      : stage === 7
      ? "XOR GATE: Exclusive OR — Turns ON when inputs are DIFFERENT!"
      : "XNOR GATE: Exclusive NOR — Turns ON when inputs are the SAME!";

  // Current power status based on active level
  const isCircuitActive =
    (stage === 2 && andPowerOn) ||
    (stage === 3 && orPowerOn) ||
    (stage === 4 && notPowerOn) ||
    (stage === 5 && nandPowerOn) ||
    (stage === 6 && norPowerOn) ||
    (stage === 7 && xorPowerOn) ||
    (stage === 8 && xnorPowerOn);

  return (
    <GradeThreeScaffold
      fullBleed={true}
      hideHeader={false}
      instruction={stepInstruction}
      currentStep={stage - 1}
      totalSteps={8}
      steps={stepsConfig}
      onReset={handleReset}
      tray={
        /* ── DOCKED TOOL TRAY: ITEMS STRICTLY CENTERED IN THE MIDDLE ── */
        <div className="flex items-center justify-center w-full px-4 relative py-1">
          {/* Centered Controls Container */}
          <div className="flex items-center justify-center gap-6">
            {stage === 1 && (
              <div className="flex flex-col items-center">
                <motion.div
                  onPointerDown={(e) => handlePointerDown("magnifier", e)}
                  onClick={triggerZoom}
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-4 select-none touch-none"
                  style={{
                    backgroundColor: C.yellow,
                    borderColor: C.purple,
                    boxShadow: `0 4px 0 ${C.yellowShadow}`,
                    color: C.purple,
                  }}
                  title="Drag or tap to zoom"
                >
                  <Search size={34} strokeWidth={3} />
                </motion.div>
                <span className="text-[10px] font-black uppercase text-purple-900 mt-1">
                  Drag or Tap
                </span>
              </div>
            )}

            {(stage === 2 || stage === 3 || stage === 5 || stage === 6) && (
              <div className="flex flex-col items-center">
                <motion.div
                  onPointerDown={(e) => handlePointerDown("key", e)}
                  onClick={() => {
                    playDrop();
                    if (stage === 2) {
                      if (!andDoor1) setAndDoor1(true);
                      else setAndDoor2((prev) => !prev);
                    } else if (stage === 3) {
                      if (!orDoorTop) setOrDoorTop(true);
                      else setOrDoorBottom((prev) => !prev);
                    } else if (stage === 5) {
                      setNandDoor1((prev) => !prev);
                    } else if (stage === 6) {
                      setNorDoorTop((prev) => !prev);
                    }
                    playZap();
                  }}
                  whileHover={{ scale: 1.15, rotate: -6 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-4 select-none touch-none"
                  style={{
                    backgroundColor: C.yellow,
                    borderColor: C.purple,
                    boxShadow: `0 4px 0 ${C.yellowShadow}`,
                    color: C.purple,
                  }}
                  title="Drag key to switch or tap"
                >
                  <Key size={34} strokeWidth={3} />
                </motion.div>
                <span className="text-[10px] font-black uppercase text-purple-900 mt-1">
                  Drag or Tap Key
                </span>
              </div>
            )}

            {stage === 4 && (
              <div className="flex flex-col items-center">
                <motion.div
                  onPointerDown={(e) => handlePointerDown("plug", e)}
                  onClick={() => {
                    playDrop();
                    setIsPluggedIn((prev) => !prev);
                    playZap();
                  }}
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-4 select-none touch-none"
                  style={{
                    backgroundColor: isPluggedIn ? C.coral : C.mint,
                    borderColor: C.purple,
                    boxShadow: `0 4px 0 ${isPluggedIn ? C.coralShadow : C.mintShadow}`,
                    color: C.white,
                  }}
                  title="Drag or tap to pull plug"
                >
                  <Plug size={32} strokeWidth={3} />
                </motion.div>
                <span className="text-[10px] font-black uppercase text-purple-900 mt-1">
                  {isPluggedIn ? "Tap to Unplug" : "Tap to Plug"}
                </span>
              </div>
            )}

            {stage === 7 && (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => {
                    playPop();
                    setXorSwitchA(!xorSwitchA);
                  }}
                  className="px-6 py-2.5 rounded-2xl font-baloo font-black text-sm border-4 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: xorSwitchA ? C.yellow : C.cream,
                    borderColor: C.purple,
                    color: C.purple,
                    boxShadow: `0 4px 0 ${xorSwitchA ? C.yellowShadow : C.creamDark}`,
                  }}
                >
                  Switch A: {xorSwitchA ? "1 (ON)" : "0 (OFF)"}
                </button>
                <button
                  onClick={() => {
                    playPop();
                    setXorSwitchB(!xorSwitchB);
                  }}
                  className="px-6 py-2.5 rounded-2xl font-baloo font-black text-sm border-4 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: xorSwitchB ? C.yellow : C.cream,
                    borderColor: C.purple,
                    color: C.purple,
                    boxShadow: `0 4px 0 ${xorSwitchB ? C.yellowShadow : C.creamDark}`,
                  }}
                >
                  Switch B: {xorSwitchB ? "1 (ON)" : "0 (OFF)"}
                </button>
              </div>
            )}

            {stage === 8 && (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => {
                    playPop();
                    setXnorSwitchA(!xnorSwitchA);
                  }}
                  className="px-6 py-2.5 rounded-2xl font-baloo font-black text-sm border-4 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: xnorSwitchA ? C.yellow : C.cream,
                    borderColor: C.purple,
                    color: C.purple,
                    boxShadow: `0 4px 0 ${xnorSwitchA ? C.yellowShadow : C.creamDark}`,
                  }}
                >
                  Switch A: {xnorSwitchA ? "1 (ON)" : "0 (OFF)"}
                </button>
                <button
                  onClick={() => {
                    playPop();
                    setXnorSwitchB(!xnorSwitchB);
                  }}
                  className="px-6 py-2.5 rounded-2xl font-baloo font-black text-sm border-4 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: xnorSwitchB ? C.yellow : C.cream,
                    borderColor: C.purple,
                    color: C.purple,
                    boxShadow: `0 4px 0 ${xnorSwitchB ? C.yellowShadow : C.creamDark}`,
                  }}
                >
                  Switch B: {xnorSwitchB ? "1 (ON)" : "0 (OFF)"}
                </button>
              </div>
            )}
          </div>

          {/* Next Button Positioned on the Right */}
          {isCircuitActive && stage < 8 && (
            <div className="absolute right-6 sm:right-12">
              <motion.button
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => advanceStage(stage + 1)}
                className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-4"
                style={{
                  backgroundColor: C.mint,
                  borderColor: C.purple,
                  boxShadow: `0 4px 0 ${C.mintShadow}`,
                  color: C.purple,
                }}
                title="Next Logic Level"
              >
                <ArrowRight size={28} strokeWidth={3.5} />
              </motion.button>
            </div>
          )}
        </div>
      }
    >
      {/* ── ROOT INTERACTIVE CANVAS ── */}
      <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-[#059669]">
        {/* ── STAGE 1: INTRO ZOOM ON REALISTIC MICROCHIP ── */}
        {stage === 1 ? (
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: C.cream }}
          >
            <motion.div
              animate={{
                scale: isZoomedIn ? 5.5 : 1,
                opacity: isZoomedIn ? 0 : 1,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center cursor-pointer"
              onClick={triggerZoom}
            >
              <div
                ref={chipTargetRef}
                className="w-80 h-80 rounded-[44px] flex flex-col items-center justify-center relative shadow-2xl border-[6px]"
                style={{
                  backgroundColor: C.pcbGreen,
                  borderColor: C.purple,
                  boxShadow: `0 12px 0 ${C.pcbGreenDark}`,
                }}
              >
                {/* PCB Gold Edge Pins */}
                {[-100, -60, -20, 20, 60, 100].map((xOffset, i) => (
                  <div
                    key={`pin-t-${i}`}
                    className="absolute -top-4 w-6 h-4 rounded-t-sm"
                    style={{
                      left: `calc(50% + ${xOffset - 12}px)`,
                      backgroundColor: C.gold,
                      border: `2px solid ${C.purple}`,
                    }}
                  />
                ))}
                {[-100, -60, -20, 20, 60, 100].map((xOffset, i) => (
                  <div
                    key={`pin-b-${i}`}
                    className="absolute -bottom-4 w-6 h-4 rounded-b-sm"
                    style={{
                      left: `calc(50% + ${xOffset - 12}px)`,
                      backgroundColor: C.gold,
                      border: `2px solid ${C.purple}`,
                    }}
                  />
                ))}

                {/* Inner Black Silicon IC Package */}
                <div
                  className="w-60 h-60 rounded-[32px] border-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner"
                  style={{ backgroundColor: "#1E293B", borderColor: C.purple }}
                >
                  {/* IC Laser Engraving */}
                  <div className="absolute top-4 left-6 flex items-center gap-1.5 opacity-80">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-mono font-bold text-amber-200">
                      CHIP-7400 GRADE-3
                    </span>
                  </div>

                  <div
                    className="w-40 h-40 rounded-2xl border-4 flex flex-col items-center justify-center relative shadow-lg"
                    style={{ backgroundColor: C.mint, borderColor: C.purple }}
                  >
                    <div className="flex gap-4">
                      <div className="w-3.5 h-3.5 rounded-full bg-purple-900" />
                      <div className="w-3.5 h-3.5 rounded-full bg-purple-900" />
                    </div>
                    <div className="w-8 h-3 border-b-4 border-purple-900 rounded-full mt-2" />
                    <span className="text-[11px] font-black text-purple-900 mt-2 uppercase">
                      Silicon Core
                    </span>
                  </div>

                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mt-3 px-4 py-1.5 rounded-full flex items-center gap-2 border-2 shadow-xs font-baloo font-black text-xs"
                    style={{ backgroundColor: C.yellow, borderColor: C.purple, color: C.purple }}
                  >
                    <Search size={15} strokeWidth={3} />
                    <span>TAP OR DROP TO ZOOM</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* ── STAGES 2 TO 8: PCB fills the ENTIRE CANVAS — zero dead space ── */
          <div className="relative w-full h-full overflow-hidden">
            {/* FULL-BLEED SVG MOTHERBOARD — no HTML wrapper, everything inside SVG */}
            <svg
              viewBox="0 0 1000 420"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ display: "block" }}
            >
                <defs>
                  {/* Glowing Active Trace Filter */}
                  <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="sunburstGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. PCB MOTHERBOARD SUBSTRATE (Emerald Green with Metallic Screws & Traces) */}
                <rect x="8" y="8" width="984" height="324" rx="28" fill="#059669" stroke={C.purple} strokeWidth="5" />
                <rect x="18" y="18" width="964" height="304" rx="20" fill="#047857" opacity="0.35" />

                {/* Corner Standoff Screws */}
                {[
                  [35, 35],
                  [965, 35],
                  [35, 305],
                  [965, 305],
                ].map(([cx, cy], i) => (
                  <g key={`screw-${i}`}>
                    <circle cx={cx} cy={cy} r="12" fill={C.silverDark} stroke={C.purple} strokeWidth="2.5" />
                    <circle cx={cx} cy={cy} r="8" fill={C.silver} />
                    <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke={C.purple} strokeWidth="2" />
                    <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke={C.purple} strokeWidth="2" />
                  </g>
                ))}

                {/* Top and Bottom Gold Edge Pins */}
                {Array.from({ length: 26 }).map((_, i) => (
                  <g key={`pin-t-${i}`}>
                    <rect x={55 + i * 35} y="1" width="16" height="12" rx="3" fill={isCircuitActive ? C.yellow : C.gold} stroke={C.purple} strokeWidth="2" />
                    <rect x={55 + i * 35} y="327" width="16" height="12" rx="3" fill={isCircuitActive ? C.yellow : C.gold} stroke={C.purple} strokeWidth="2" />
                  </g>
                ))}

                {/* Realistic Silkscreen PCB Labels */}
                <text x="50" y="38" fill={C.mint} opacity="0.8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  +5V VCC
                </text>
                <text x="50" y="310" fill={C.mint} opacity="0.8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  GND BUS
                </text>
                <text x="890" y="38" fill={C.mint} opacity="0.8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  OUT-PIN
                </text>
                <text x="890" y="310" fill={C.mint} opacity="0.8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  REF: 74LS
                </text>

                {/* 2. REALISTIC SMD COMPONENTS & CAPACITORS (Flanking PCB) */}
                <g transform="translate(180, 32)">
                  <rect width="48" height="18" rx="4" fill="#1E293B" stroke={C.purple} strokeWidth="2" />
                  <text x="24" y="13" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                    R1 330Ω
                  </text>
                </g>
                <g transform="translate(730, 32)">
                  <rect width="48" height="18" rx="4" fill="#1E293B" stroke={C.purple} strokeWidth="2" />
                  <text x="24" y="13" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                    R2 10kΩ
                  </text>
                </g>
                <circle cx="204" cy="298" r="13" fill={C.sky} stroke={C.purple} strokeWidth="2.5" />
                <circle cx="754" cy="298" r="13" fill={C.pink} stroke={C.purple} strokeWidth="2.5" />

                {/* 3. CONTINUOUS COPPER TRACKS DIRECTLY THROUGH ALL COMPONENTS ── */}
                {/* ── SERIES GATES (AND: Stage 2, NAND: Stage 5) ── */}
                {(stage === 2 || stage === 5) && (
                  <g>
                    {/* Track 1: Sparky Output -> Gate 1 Input */}
                    <path d="M 160 170 L 330 170" stroke={C.goldTrace} strokeWidth="16" strokeLinecap="round" />
                    <path d="M 160 170 L 330 170" stroke={C.yellow} strokeWidth="10" strokeLinecap="round" />
                    <circle cx="330" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    <circle cx="330" cy="170" r="6" fill={C.gold} />

                    {/* Bridge 1 Connection (Solid line when connected, air gap when open) */}
                    <path
                      d="M 330 170 L 440 170"
                      stroke={(stage === 2 ? andDoor1 : nandDoor1) ? C.goldTrace : "#047857"}
                      strokeWidth="12"
                      strokeDasharray={(stage === 2 ? andDoor1 : nandDoor1) ? "none" : "6 6"}
                    />
                    <circle cx="440" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    <circle cx="440" cy="170" r="6" fill={C.gold} />

                    {/* Track 2: Gate 1 Output -> Gate 2 Input */}
                    <path
                      d="M 440 170 L 550 170"
                      stroke={(stage === 2 ? andDoor1 : nandDoor1) ? C.goldTrace : C.silverDark}
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 440 170 L 550 170"
                      stroke={(stage === 2 ? andDoor1 : nandDoor1) ? C.yellow : C.silver}
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <circle cx="550" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    <circle cx="550" cy="170" r="6" fill={C.gold} />

                    {/* Bridge 2 Connection */}
                    <path
                      d="M 550 170 L 660 170"
                      stroke={(stage === 2 ? andDoor2 : nandDoor2) ? C.goldTrace : "#047857"}
                      strokeWidth="12"
                      strokeDasharray={(stage === 2 ? andDoor2 : nandDoor2) ? "none" : "6 6"}
                    />
                    <circle cx="660" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    <circle cx="660" cy="170" r="6" fill={C.gold} />

                    {/* Inverter Bubble on NAND (Stage 5) */}
                    {stage === 5 && (
                      <g transform="translate(680, 170)">
                        <circle cx="0" cy="0" r="11" fill={C.coral} stroke={C.purple} strokeWidth="3.5" />
                        <text x="0" y="4" textAnchor="middle" fill={C.white} fontSize="10" fontWeight="bold">
                          NOT
                        </text>
                      </g>
                    )}

                    {/* Track 3: Final Output Line into Lumi */}
                    <path
                      d={stage === 5 ? "M 692 170 L 780 170" : "M 660 170 L 780 170"}
                      stroke={isCircuitActive ? C.goldTrace : C.silverDark}
                      strokeWidth="16"
                      strokeLinecap="round"
                      filter={isCircuitActive ? "url(#goldGlow)" : undefined}
                    />
                    <path
                      d={stage === 5 ? "M 692 170 L 780 170" : "M 660 170 L 780 170"}
                      stroke={isCircuitActive ? C.yellow : C.silver}
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <circle cx="780" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    <circle cx="780" cy="170" r="6" fill={C.gold} />

                    {/* Animated Golden Electrons when power is flowing */}
                    {isCircuitActive && (
                      <motion.path
                        d="M 160 170 L 780 170"
                        stroke={C.white}
                        strokeWidth="6"
                        strokeDasharray="12 12"
                        strokeLinecap="round"
                        animate={{ strokeDashoffset: [-48, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      />
                    )}
                  </g>
                )}

                {/* ── PARALLEL GATES (OR: Stage 3, NOR: Stage 6) ── */}
                {(stage === 3 || stage === 6) && (
                  <g>
                    {/* Fork from Sparky into Top and Bottom Roads */}
                    <path d="M 160 170 L 260 170 Q 310 170 340 95 L 420 95" stroke={C.goldTrace} strokeWidth="16" strokeLinecap="round" fill="none" />
                    <path d="M 160 170 L 260 170 Q 310 170 340 245 L 420 245" stroke={C.goldTrace} strokeWidth="16" strokeLinecap="round" fill="none" />

                    {/* Top Door Bridge */}
                    <circle cx="420" cy="95" r="11" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    <path
                      d="M 420 95 L 560 95"
                      stroke={(stage === 3 ? orDoorTop : norDoorTop) ? C.goldTrace : "#047857"}
                      strokeWidth="12"
                      strokeDasharray={(stage === 3 ? orDoorTop : norDoorTop) ? "none" : "6 6"}
                    />
                    <circle cx="560" cy="95" r="11" fill={C.silver} stroke={C.purple} strokeWidth="3" />

                    {/* Bottom Door Bridge */}
                    <circle cx="420" cy="245" r="11" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    <path
                      d="M 420 245 L 560 245"
                      stroke={(stage === 3 ? orDoorBottom : norDoorBottom) ? C.goldTrace : "#047857"}
                      strokeWidth="12"
                      strokeDasharray={(stage === 3 ? orDoorBottom : norDoorBottom) ? "none" : "6 6"}
                    />
                    <circle cx="560" cy="245" r="11" fill={C.silver} stroke={C.purple} strokeWidth="3" />

                    {/* Re-join into Lumi */}
                    <path d="M 560 95 Q 630 95 680 170 L 780 170" stroke={isCircuitActive ? C.goldTrace : C.silverDark} strokeWidth="16" strokeLinecap="round" fill="none" filter={isCircuitActive ? "url(#goldGlow)" : undefined} />
                    <path d="M 560 245 Q 630 245 680 170 L 780 170" stroke={isCircuitActive ? C.goldTrace : C.silverDark} strokeWidth="16" strokeLinecap="round" fill="none" filter={isCircuitActive ? "url(#goldGlow)" : undefined} />

                    {/* Inverter Bubble on NOR (Stage 6) */}
                    {stage === 6 && (
                      <g transform="translate(710, 170)">
                        <circle cx="0" cy="0" r="11" fill={C.coral} stroke={C.purple} strokeWidth="3.5" />
                        <text x="0" y="4" textAnchor="middle" fill={C.white} fontSize="10" fontWeight="bold">
                          NOT
                        </text>
                      </g>
                    )}

                    <circle cx="780" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                  </g>
                )}

                {/* ── NOT GATE (Stage 4) ── */}
                {/* Door CLOSED (isPluggedIn=true) = signal blocked through gate = NOT output is ON = light glows */}
                {stage === 4 && (
                  <g>
                    {/* Input line into NOT gate (always live from Sparky) */}
                    <path d="M 160 170 L 400 170" stroke={C.goldTrace} strokeWidth="16" strokeLinecap="round" />
                    <circle cx="400" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    {/* Bridge through the NOT gate block — solid when door is CLOSED (isPluggedIn), dashed when OPEN */}
                    <path
                      d="M 400 170 L 580 170"
                      stroke={isPluggedIn ? C.goldTrace : "#047857"}
                      strokeWidth="12"
                      strokeDasharray={isPluggedIn ? "none" : "6 6"}
                    />
                    <circle cx="580" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    {/* Output line to Lumi — lit when notPowerOn (= isPluggedIn) */}
                    <path d="M 580 170 L 780 170" stroke={notPowerOn ? C.goldTrace : C.silverDark} strokeWidth="16" strokeLinecap="round" filter={notPowerOn ? "url(#goldGlow)" : undefined} />
                    <path d="M 580 170 L 780 170" stroke={notPowerOn ? C.yellow : C.silver} strokeWidth="10" strokeLinecap="round" />
                    <circle cx="780" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    {/* Animated electrons when powered */}
                    {notPowerOn && (
                      <motion.path
                        d="M 160 170 L 780 170"
                        stroke={C.white}
                        strokeWidth="6"
                        strokeDasharray="12 12"
                        strokeLinecap="round"
                        animate={{ strokeDashoffset: [-48, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      />
                    )}
                  </g>
                )}

                {/* ── XOR & XNOR GATES (Stage 7 & Stage 8) ── */}
                {(stage === 7 || stage === 8) && (
                  <g>
                    <path d="M 160 170 L 370 170" stroke={C.goldTrace} strokeWidth="16" strokeLinecap="round" />
                    <circle cx="370" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                    <path
                      d="M 370 170 L 610 170"
                      stroke={isCircuitActive ? C.goldTrace : "#047857"}
                      strokeWidth="12"
                      strokeDasharray={isCircuitActive ? "none" : "6 6"}
                    />
                    <circle cx="610" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />

                    {/* Inverter Bubble on XNOR (Stage 8) */}
                    {stage === 8 && (
                      <g transform="translate(628, 170)">
                        <circle cx="0" cy="0" r="11" fill={C.coral} stroke={C.purple} strokeWidth="3.5" />
                        <text x="0" y="4" textAnchor="middle" fill={C.white} fontSize="10" fontWeight="bold">
                          NOT
                        </text>
                      </g>
                    )}

                    <path d="M 610 170 L 780 170" stroke={isCircuitActive ? C.goldTrace : C.silverDark} strokeWidth="16" strokeLinecap="round" filter={isCircuitActive ? "url(#goldGlow)" : undefined} />
                    <circle cx="780" cy="170" r="13" fill={C.silver} stroke={C.purple} strokeWidth="3" />
                  </g>
                )}

                {/* ── 4. CHARACTERS & GATES INTEGRATED DIRECTLY IN SVG ── */}

                {/* LEFT: SPARKY BATTERY (Centered at X: 110, Y: 170) */}
                <g transform="translate(45, 95)">
                  <rect x="95" y="68" width="22" height="14" rx="4" fill={C.yellow} stroke={C.purple} strokeWidth="3" />
                  <foreignObject width="130" height="155">
                    <SparkyBattery isEnergized={isCircuitActive} />
                  </foreignObject>
                </g>

                {/* MIDDLE GATES & DOORS */}
                {/* Series Stage (AND: 2, NAND: 5) */}
                {(stage === 2 || stage === 5) && (
                  <>
                    <g
                      ref={door1Ref}
                      transform="translate(325, 85)"
                      onClick={() =>
                        stage === 2 ? setAndDoor1(!andDoor1) : setNandDoor1(!nandDoor1)
                      }
                      className="cursor-pointer"
                    >
                      <foreignObject width="120" height="175">
                        <TransistorBlock
                          isOpen={stage === 2 ? andDoor1 : nandDoor1}
                          label="Door 1"
                          onToggle={() =>
                            stage === 2 ? setAndDoor1(!andDoor1) : setNandDoor1(!nandDoor1)
                          }
                        />
                      </foreignObject>
                    </g>
                    <g
                      ref={door2Ref}
                      transform="translate(545, 85)"
                      onClick={() =>
                        stage === 2 ? setAndDoor2(!andDoor2) : setNandDoor2(!nandDoor2)
                      }
                      className="cursor-pointer"
                    >
                      <foreignObject width="120" height="175">
                        <TransistorBlock
                          isOpen={stage === 2 ? andDoor2 : nandDoor2}
                          label="Door 2"
                          onToggle={() =>
                            stage === 2 ? setAndDoor2(!andDoor2) : setNandDoor2(!nandDoor2)
                          }
                        />
                      </foreignObject>
                    </g>
                  </>
                )}

                {/* Parallel Stage (OR: 3, NOR: 6) */}
                {(stage === 3 || stage === 6) && (
                  <>
                    <g
                      ref={orTopRef}
                      transform="translate(440, 10)"
                      onClick={() =>
                        stage === 3 ? setOrDoorTop(!orDoorTop) : setNorDoorTop(!norDoorTop)
                      }
                      className="cursor-pointer"
                    >
                      <foreignObject width="120" height="175">
                        <TransistorBlock
                          isOpen={stage === 3 ? orDoorTop : norDoorTop}
                          label="Top Road"
                          onToggle={() =>
                            stage === 3 ? setOrDoorTop(!orDoorTop) : setNorDoorTop(!norDoorTop)
                          }
                        />
                      </foreignObject>
                    </g>
                    <g
                      ref={orBottomRef}
                      transform="translate(440, 170)"
                      onClick={() =>
                        stage === 3
                          ? setOrDoorBottom(!orDoorBottom)
                          : setNorDoorBottom(!norDoorBottom)
                      }
                      className="cursor-pointer"
                    >
                      <foreignObject width="120" height="175">
                        <TransistorBlock
                          isOpen={stage === 3 ? orDoorBottom : norDoorBottom}
                          label="Bottom Road"
                          onToggle={() =>
                            stage === 3
                              ? setOrDoorBottom(!orDoorBottom)
                              : setNorDoorBottom(!norDoorBottom)
                          }
                        />
                      </foreignObject>
                    </g>
                  </>
                )}

                {/* NOT Gate Stage (4) */}
                {/* isPluggedIn=true → door is CLOSED (isOpen=false) → NOT output is ON → light glows */}
                {stage === 4 && (
                  <g
                    ref={plugSocketRef}
                    transform="translate(435, 95)"
                    onClick={() => setIsPluggedIn(!isPluggedIn)}
                    className="cursor-pointer"
                  >
                    <foreignObject width="120" height="175">
                      <TransistorBlock
                        isOpen={!isPluggedIn}
                        gatekeeper="bunny"
                        label="NOT"
                        onToggle={() => setIsPluggedIn(!isPluggedIn)}
                      />
                    </foreignObject>
                  </g>
                )}

                {/* XOR & XNOR Interactive Board Switches (Stages 7 & 8) */}
                {(stage === 7 || stage === 8) && (
                  <g transform="translate(390, 85)">
                    {/* Main Logic Package Chassis */}
                    <rect x="0" y="0" width="200" height="155" rx="24" fill={C.lavender} stroke={C.purple} strokeWidth="5" />
                    <rect x="10" y="10" width="180" height="135" rx="16" fill="#1E293B" stroke={C.purple} strokeWidth="3" />

                    <text x="100" y="36" textAnchor="middle" fill={C.yellow} fontWeight="900" fontSize="16" fontFamily="Baloo 2">
                      {stage === 7 ? "XOR LOGIC GATE" : "XNOR LOGIC GATE"}
                    </text>

                    {/* Interactive Switch A and Switch B directly on board */}
                    <g
                      transform="translate(25, 48)"
                      className="cursor-pointer"
                      onClick={() => {
                        playPop();
                        if (stage === 7) setXorSwitchA(!xorSwitchA);
                        else setXnorSwitchA(!xnorSwitchA);
                      }}
                    >
                      <rect
                        width="68"
                        height="52"
                        rx="10"
                        fill={(stage === 7 ? xorSwitchA : xnorSwitchA) ? C.mint : C.coral}
                        stroke={C.purple}
                        strokeWidth="3"
                      />
                      <text x="34" y="24" textAnchor="middle" fill={C.purple} fontWeight="bold" fontSize="11" fontFamily="Baloo 2">
                        INPUT A
                      </text>
                      <text x="34" y="44" textAnchor="middle" fill={C.purple} fontWeight="900" fontSize="16" fontFamily="Baloo 2">
                        {(stage === 7 ? xorSwitchA : xnorSwitchA) ? "1 (ON)" : "0 (OFF)"}
                      </text>
                    </g>

                    <g
                      transform="translate(107, 48)"
                      className="cursor-pointer"
                      onClick={() => {
                        playPop();
                        if (stage === 7) setXorSwitchB(!xorSwitchB);
                        else setXnorSwitchB(!xnorSwitchB);
                      }}
                    >
                      <rect
                        width="68"
                        height="52"
                        rx="10"
                        fill={(stage === 7 ? xorSwitchB : xnorSwitchB) ? C.mint : C.coral}
                        stroke={C.purple}
                        strokeWidth="3"
                      />
                      <text x="34" y="24" textAnchor="middle" fill={C.purple} fontWeight="bold" fontSize="11" fontFamily="Baloo 2">
                        INPUT B
                      </text>
                      <text x="34" y="44" textAnchor="middle" fill={C.purple} fontWeight="900" fontSize="16" fontFamily="Baloo 2">
                        {(stage === 7 ? xorSwitchB : xnorSwitchB) ? "1 (ON)" : "0 (OFF)"}
                      </text>
                    </g>

                    <text x="100" y="128" textAnchor="middle" fill={isCircuitActive ? C.mint : C.coral} fontWeight="900" fontSize="14" fontFamily="Baloo 2">
                      {isCircuitActive ? "OUTPUT: 1 (POWER ON!)" : "OUTPUT: 0 (POWER OFF)"}
                    </text>
                  </g>
                )}

                {/* ── TOP BAR INSIDE SVG: Score, Banner, Badge, Reset ── */}
                {/* PCB board full background */}
                <rect x="0" y="0" width="1000" height="420" fill="#059669" />
                <rect x="8" y="8" width="984" height="404" rx="22" fill="#047857" opacity="0.28" />

                {/* Grid silkscreen lines */}
                {[90, 180, 270, 360].map((y, i) => (
                  <line key={`hl-${i}`} x1="20" y1={y} x2="980" y2={y} stroke="#10B981" strokeWidth="1" opacity="0.22" />
                ))}
                {[200, 400, 600, 800].map((x, i) => (
                  <line key={`vl-${i}`} x1={x} y1="20" x2={x} y2="400" stroke="#10B981" strokeWidth="1" opacity="0.22" />
                ))}

                {/* Score badge */}
                <g transform="translate(55, 15)">
                  <rect x="0" y="0" width="84" height="28" rx="8" fill={C.yellow} stroke={C.purple} strokeWidth="3" />
                  <text x="42" y="20" textAnchor="middle" fill={C.purple} fontWeight="900" fontSize="14" fontFamily="Baloo 2">★ {score}</text>
                </g>

                {/* Full educational sentence banner */}
                <g transform="translate(165, 15)">
                  <rect x="0" y="0" width="590" height="28" rx="8" fill={C.cream} stroke={C.purple} strokeWidth="2.5" />
                  <text x="295" y="20" textAnchor="middle" fill={C.purple} fontWeight="800" fontSize="12" fontFamily="Baloo 2">{inSceneExplanation}</text>
                </g>

                {/* Gate badge */}
                <g transform="translate(780, 15)">
                  <rect x="0" y="0" width="140" height="28" rx="8" fill={C.yellow} stroke={C.purple} strokeWidth="3" />
                  <text x="70" y="20" textAnchor="middle" fill={C.purple} fontWeight="900" fontSize="14" fontFamily="Baloo 2">
                    {stage === 2 && "AND GATE"}
                    {stage === 3 && "OR GATE"}
                    {stage === 4 && "NOT GATE"}
                    {stage === 5 && "NAND GATE"}
                    {stage === 6 && "NOR GATE"}
                    {stage === 7 && "XOR GATE"}
                    {stage === 8 && "XNOR GATE"}
                  </text>
                </g>

                {/* RIGHT: LUMI LIGHTBULB (centered at Y=240 of the board area, Y offset=145 so center ~220) */}
                <g transform="translate(840, 128)">
                  <foreignObject width="150" height="200">
                    <LumiBulb isLit={isCircuitActive} />
                  </foreignObject>
                </g>
              </svg>

              {/* Reset button absolutely on top-right corner of the board */}
              <button
                onClick={handleReset}
                className="absolute top-3 right-4 p-1.5 rounded-xl border-2 shadow-md cursor-pointer hover:scale-105 active:scale-95 z-10"
                style={{ backgroundColor: C.cream, borderColor: C.orange, color: C.purple }}
                title="Restart"
              >
                <RotateCcw size={18} />
              </button>
            </div>
        )}

        {/* ── 5. SCREEN-WIDE FLOATING DRAG TOKEN (Always Rendered on Top) ── */}
        {dragState.isDragging && (
          <div
            className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
            style={{ left: dragState.x, top: dragState.y }}
          >
            <div
              className="w-20 h-20 rounded-3xl border-4 flex items-center justify-center shadow-2xl scale-110"
              style={{
                backgroundColor:
                  dragState.type === "plug"
                    ? isPluggedIn
                      ? C.coral
                      : C.mint
                    : C.yellow,
                borderColor: C.purple,
                color: dragState.type === "plug" ? C.white : C.purple,
              }}
            >
              {dragState.type === "magnifier" && <Search size={40} strokeWidth={3.5} />}
              {dragState.type === "key" && <Key size={40} strokeWidth={3.5} />}
              {dragState.type === "plug" && <Plug size={38} strokeWidth={3.5} />}
            </div>
          </div>
        )}
      </div>

      {/* Global Celebration Overlay (Fires once on Stage 8 victory) */}
      <Celebration
        isActive={hasWon}
        title="Logic Master Triumph!"
        message="You mastered ALL 7 Logic Gates: AND, OR, NOT, NAND, NOR, XOR, and XNOR!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}

// ── 1. SPARKY BATTERY SVG COMPONENT ──
function SparkyBattery({ isEnergized }: { isEnergized: boolean }) {
  return (
    <motion.div
      animate={
        isEnergized
          ? { y: [-2, -12, 0], scale: [1, 1.08, 1] }
          : { y: [-3, 3, -3] }
      }
      transition={{
        repeat: isEnergized ? 1 : Infinity,
        duration: isEnergized ? 0.6 : 2.4,
        ease: "easeInOut",
      }}
      className="relative flex items-center justify-center shrink-0 origin-bottom"
    >
      {isEnergized && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.9 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute w-32 h-32 rounded-full border-4 pointer-events-none"
          style={{ borderColor: C.yellow }}
        />
      )}

      <svg width="128" height="152" viewBox="0 0 128 152" className="overflow-visible">
        {/* Battery Top Terminal */}
        <rect x="50" y="6" width="28" height="14" rx="5" fill={C.orange} stroke={C.purple} strokeWidth="5" />
        <path d="M 64 9 L 64 17 M 60 13 L 68 13" stroke={C.white} strokeWidth="3" strokeLinecap="round" />
        {/* Battery Body */}
        <rect x="16" y="18" width="96" height="124" rx="24" fill={C.yellow} stroke={C.purple} strokeWidth="5.5" />
        <path d="M 19 116 C 28 134 100 134 109 116 L 109 122 C 109 136 97 142 84 142 L 44 142 C 31 142 19 136 19 122 Z" fill={C.yellowShadow} />
        <path d="M 30 36 C 36 28 50 26 64 28" stroke={C.white} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
        {/* Eyes & Cheeks */}
        <circle cx="48" cy="56" r="6.5" fill={C.purple} />
        <circle cx="45" cy="53" r="2.5" fill={C.white} />
        <circle cx="80" cy="56" r="6.5" fill={C.purple} />
        <circle cx="77" cy="53" r="2.5" fill={C.white} />
        <circle cx="36" cy="65" r="5" fill={C.coral} opacity="0.8" />
        <circle cx="92" cy="65" r="5" fill={C.coral} opacity="0.8" />
        {/* Smile */}
        <path d={isEnergized ? "M 48 70 Q 64 88 80 70" : "M 50 70 Q 64 82 78 70"} stroke={C.purple} strokeWidth="4.5" strokeLinecap="round" fill={isEnergized ? C.coral : "none"} />
        {/* Lightning Bolt Emblem */}
        <path d="M 68 84 L 56 100 L 64 100 L 60 116 L 74 98 L 66 98 Z" fill={C.orange} stroke={C.purple} strokeWidth="3.5" />
        {/* Charge Level Bars */}
        {[0, 1, 2].map((idx) => (
          <motion.rect
            key={idx}
            x={28 + idx * 26}
            y="126"
            width="20"
            height="6"
            rx="3"
            fill={C.mint}
            stroke={C.purple}
            strokeWidth="2.5"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.3 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// ── 2. LUMI LIGHTBULB SVG COMPONENT (WITH 16 RADIANT RAYS ALL AROUND) ──
function LumiBulb({ isLit }: { isLit: boolean }) {
  // 16 Radiant Rays spreading in full 360-degrees around Lumi
  const rayAngles = [
    0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5,
  ];

  return (
    <motion.div
      animate={
        isLit
          ? { rotate: [-4, 4, -4], y: [-3, 3, -3] }
          : { rotate: [-1.5, 1.5, -1.5] }
      }
      transition={{ repeat: Infinity, duration: isLit ? 0.7 : 3, ease: "easeInOut" }}
      className="relative flex items-center justify-center shrink-0 origin-bottom"
    >
      {/* Brilliant Radial Glow Aura when Lit */}
      {isLit && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="absolute w-56 h-56 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: C.yellow }}
        />
      )}

      <svg width="140" height="152" viewBox="0 0 140 152" className="overflow-visible">
        {/* 16 RADIANT RAYS BURSTING OUTWARDS IN 360 DEGREES */}
        {isLit && (
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            style={{ originX: "70px", originY: "68px" }}
          >
            {rayAngles.map((angle, i) => (
              <line
                key={i}
                x1="70"
                y1="14"
                x2="70"
                y2="-8"
                stroke={i % 2 === 0 ? C.yellow : C.gold}
                strokeWidth={i % 2 === 0 ? "6" : "4"}
                strokeLinecap="round"
                transform={`rotate(${angle} 70 68)`}
              />
            ))}
          </motion.g>
        )}

        {/* Bulb Glass Body */}
        <path
          d="M 44 78 C 30 64 30 38 70 28 C 110 38 110 64 96 78 C 90 84 86 94 86 102 L 54 102 C 54 94 50 84 44 78 Z"
          fill={isLit ? C.yellow : C.lavender}
          stroke={C.purple}
          strokeWidth="5.5"
        />
        {/* Offset Bottom Shadow */}
        <path
          d="M 54 94 C 60 106 80 106 86 94 L 86 102 L 54 102 Z"
          fill={isLit ? C.yellowShadow : C.lavenderShadow}
        />

        {/* Glossy Top-Left Reflection */}
        <path
          d="M 52 48 C 56 36 74 34 88 38"
          stroke={C.white}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Metal Thread Base */}
        <rect x="58" y="102" width="24" height="7" rx="3" fill={C.orange} stroke={C.purple} strokeWidth="4" />
        <rect x="60" y="109" width="20" height="7" rx="3" fill={C.orange} stroke={C.purple} strokeWidth="4" />
        <path d="M 64 116 Q 70 122 76 116" fill={C.purple} />

        {/* Face State: Awake vs Sleepy */}
        {isLit ? (
          <>
            <circle cx="60" cy="62" r="7" fill={C.purple} />
            <circle cx="57" cy="59" r="2.5" fill={C.white} />
            <circle cx="80" cy="62" r="7" fill={C.purple} />
            <circle cx="77" cy="59" r="2.5" fill={C.white} />
            <circle cx="48" cy="72" r="5" fill={C.coral} opacity="0.9" />
            <circle cx="92" cy="72" r="5" fill={C.coral} opacity="0.9" />
            <path
              d="M 60 74 Q 70 90 80 74 Z"
              fill={C.coral}
              stroke={C.purple}
              strokeWidth="4"
            />
          </>
        ) : (
          <>
            <path d="M 54 62 Q 60 68 66 62" stroke={C.purple} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 74 62 Q 80 68 86 62" stroke={C.purple} strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="48" cy="70" r="4.5" fill={C.coral} opacity="0.4" />
            <circle cx="92" cy="70" r="4.5" fill={C.coral} opacity="0.4" />
            <path d="M 64 72 Q 70 77 76 72" stroke={C.purple} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        )}
      </svg>
    </motion.div>
  );
}

// ── 3. RAISED PCB TRANSISTOR GATE BLOCK (With Exact Track Pin Alignment) ──
function TransistorBlock({
  isOpen,
  label,
  gatekeeper = "robot",
  onToggle,
}: {
  isOpen: boolean;
  label?: string;
  gatekeeper?: "robot" | "bunny";
  onToggle?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onToggle}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
    >
      <svg width="120" height="142" viewBox="0 0 120 142" className="overflow-visible">
        {/* Silver Mounting Pin Legs gripping the copper track directly at Y=75 (aligned to Y=170) */}
        {[-1, 1].map((side) => (
          <g key={`leg-${side}`}>
            <rect
              x={side === -1 ? 2 : 110}
              y="67"
              width="8"
              height="16"
              rx="2"
              fill={C.silver}
              stroke={C.purple}
              strokeWidth="2.5"
            />
            <circle cx={side === -1 ? 6 : 114} cy="75" r="3" fill={C.gold} />
          </g>
        ))}

        {/* Transistor Raised Chassis */}
        <rect x="12" y="24" width="96" height="100" rx="16" fill={C.lavender} stroke={C.purple} strokeWidth="5" />
        <path d="M 14 108 C 24 122 96 122 106 108 L 106 112 C 106 122 96 126 86 126 L 34 126 C 24 126 14 122 14 112 Z" fill={C.lavenderShadow} />
        <path d="M 10 34 Q 60 10 110 34" fill={C.pink} stroke={C.purple} strokeWidth="5" />
        <path d="M 24 26 Q 60 14 96 26" stroke={C.white} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />

        {/* Inner Doorway Opening */}
        <rect x="26" y="42" width="68" height="82" rx="8" fill={isOpen ? C.mint : C.cream} stroke={C.purple} strokeWidth="3.5" />

        {/* Sliding Transistor Door / Bridge Blade */}
        <motion.g animate={{ x: isOpen ? 52 : 0 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}>
          <rect x="26" y="42" width="68" height="82" rx="8" fill={C.coral} stroke={C.purple} strokeWidth="4" />
          <circle cx="44" cy="83" r="5" fill={C.yellow} stroke={C.purple} strokeWidth="2.5" />
          <path d="M 44 85 L 44 92" stroke={C.purple} strokeWidth="2" />
        </motion.g>

        {/* Gatekeeper Character */}
        {gatekeeper === "robot" ? (
          <g transform="translate(44, 4)">
            <line x1="16" y1="6" x2="16" y2="0" stroke={C.purple} strokeWidth="3" />
            <circle cx="16" cy="0" r="4" fill={C.yellow} stroke={C.purple} strokeWidth="2" />
            <rect x="4" y="6" width="24" height="18" rx="5" fill={C.sky} stroke={C.purple} strokeWidth="3.5" />
            <circle cx="11" cy="15" r="3" fill={C.purple} />
            <circle cx="21" cy="15" r="3" fill={C.purple} />
          </g>
        ) : (
          <g transform="translate(44, 2)">
            <ellipse cx="10" cy="5" rx="4" ry="9" fill={C.pink} stroke={C.purple} strokeWidth="3" />
            <ellipse cx="22" cy="5" rx="4" ry="9" fill={C.pink} stroke={C.purple} strokeWidth="3" />
            <circle cx="16" cy="16" r="11" fill={C.cream} stroke={C.purple} strokeWidth="3" />
            <circle cx="12" cy="15" r="2" fill={C.purple} />
            <circle cx="20" cy="15" r="2" fill={C.purple} />
            <polygon points="16,18 14,20 18,20" fill={C.coral} />
          </g>
        )}
      </svg>

      {label && (
        <span
          className="text-[11px] font-black uppercase tracking-wider -mt-1 px-3 py-0.5 rounded-full border-2 shadow-xs"
          style={{ backgroundColor: C.mint, borderColor: C.purple, color: C.purple }}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
}
