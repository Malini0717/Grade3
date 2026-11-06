"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  MousePointer,
  Music,
  Palette,
  FileText,
  RotateCcw,
  Disc,
  Target,
  Move,
  Box,
  Eye,
  Keyboard as KeyboardIcon,
} from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

interface WindowState {
  id: string;
  title: string;
  icon: typeof FileText;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  bgGradient: string;
  borderColor: string;
  titleBg: string;
  textColor: string;
  desc: string;
  isDocked?: boolean;
}

// Radar target beacons for Level 1 Calibration
const RADAR_TARGETS = [
  { id: 1, label: "Beacon Alpha (Top-Left)", x: 80, y: 50 },
  { id: 2, label: "Beacon Beta (Center-Right)", x: 420, y: 110 },
  { id: 3, label: "Beacon Gamma (Bottom-Center)", x: 250, y: 170 },
];

// ─────────────────────────────────────────────────────────────
// ── 3D ISOMETRIC LIVING ROOM STUDIO (Three.js / R3F) ────────
// ─────────────────────────────────────────────────────────────

interface WorkstationSceneProps {
  cursorPos: { x: number; y: number };
  padPos: { x: number; y: number };
  isMouseDown: boolean;
  level: number;
  beaconsHit: number[];
  windows: WindowState[];
  onMousePadDrag: (normX: number, normY: number) => void;
  onWindowClick: (id: string) => void;
}

function LivingRoom3DScene({
  cursorPos,
  padPos,
  isMouseDown,
  windows,
  onMousePadDrag,
  onWindowClick,
}: WorkstationSceneProps) {
  const mouseMeshRef = useRef<THREE.Group>(null);
  const lButtonRef = useRef<THREE.Mesh>(null);
  const redLedRef = useRef<THREE.PointLight>(null);
  const spacebarRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mouseMeshRef.current) {
      const targetX = 1.3 + (padPos.x / 100) * 1.8;
      const targetZ = 0.0 + (padPos.y / 100) * 1.6;
      mouseMeshRef.current.position.x = THREE.MathUtils.lerp(
        mouseMeshRef.current.position.x,
        targetX,
        0.3
      );
      mouseMeshRef.current.position.z = THREE.MathUtils.lerp(
        mouseMeshRef.current.position.z,
        targetZ,
        0.3
      );
    }

    if (lButtonRef.current) {
      const targetY = isMouseDown ? 0.08 : 0.12;
      lButtonRef.current.position.y = THREE.MathUtils.lerp(
        lButtonRef.current.position.y,
        targetY,
        0.3
      );
    }

    if (spacebarRef.current) {
      const targetY = isMouseDown ? 0.04 : 0.08;
      spacebarRef.current.position.y = THREE.MathUtils.lerp(
        spacebarRef.current.position.y,
        targetY,
        0.3
      );
    }

    if (redLedRef.current) {
      redLedRef.current.intensity = isMouseDown ? 2.5 : 1.2;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* Floor */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#fde68a" roughness={0.5} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-6.5, 3.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[6.5, 3.5, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.8} />
      </mesh>

      {/* Standing Desk */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[8.8, 0.25, 4.8]} />
        <meshStandardMaterial color="#b45309" metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Black Steel Legs */}
      {[-3.8, 3.8].map((lx) =>
        [-1.8, 1.8].map((lz) => (
          <mesh key={`${lx}-${lz}`} position={[lx, -0.4, lz]}>
            <cylinderGeometry args={[0.08, 0.08, 1.4, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Proportional Desktop Monitor */}
      <group position={[0, 2.3, -0.8]}>
        <mesh position={[0, -1.75, 0]}>
          <cylinderGeometry args={[1.1, 1.3, 0.1, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.0, 0.05]}>
          <boxGeometry args={[0.3, 1.5, 0.2]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[5.6, 3.4, 0.25]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0.14]}>
          <planeGeometry args={[5.2, 3.0]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#fbbf24"
            emissiveIntensity={0.25}
            roughness={0.2}
          />
        </mesh>

        {/* Windows on 3D Screen */}
        {windows.map((win) => {
          const posX = -2.4 + (win.x / 520) * 4.8 + 0.8;
          const posY = 1.2 - (win.y / 220) * 2.4 - 0.5;
          const posZ = 0.18 + win.zIndex * 0.04;
          const isMusic = win.id === "music";
          const isPaint = win.id === "paint";
          const winColor = isMusic ? "#38bdf8" : isPaint ? "#f472b6" : "#facc15";

          return (
            <group
              key={win.id}
              position={[posX, posY, posZ]}
              onClick={(e) => {
                e.stopPropagation();
                onWindowClick(win.id);
              }}
            >
              <mesh>
                <boxGeometry args={[1.7, 1.1, 0.02]} />
                <meshStandardMaterial
                  color={winColor}
                  polygonOffset
                  polygonOffsetFactor={-1}
                  polygonOffsetUnits={-1}
                />
              </mesh>
              <mesh position={[0, 0.44, 0.015]}>
                <boxGeometry args={[1.68, 0.2, 0.02]} />
                <meshStandardMaterial
                  color={isMusic ? "#0284c7" : isPaint ? "#db2777" : "#ca8a04"}
                />
              </mesh>
            </group>
          );
        })}

        {/* Laser Crosshairs */}
        <group
          position={[
            -2.4 + (cursorPos.x / 520) * 4.8,
            1.2 - (cursorPos.y / 220) * 2.4,
            0.32,
          ]}
        >
          <mesh>
            <ringGeometry args={[0.07, 0.11, 16]} />
            <meshBasicMaterial color="#ea580c" side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* Desk Mat with Keyboard & Mouse */}
      <mesh position={[0, 0.54, 0.9]}>
        <boxGeometry args={[6.8, 0.03, 2.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      <group position={[-1.4, 0.62, 0.9]} rotation={[-0.06, 0, 0]}>
        <mesh>
          <boxGeometry args={[3.8, 0.16, 1.8]} />
          <meshStandardMaterial color="#292524" metalness={0.6} roughness={0.5} />
        </mesh>
        <mesh ref={spacebarRef} position={[0, 0.08, 0.6]}>
          <boxGeometry args={[2.0, 0.1, 0.32]} />
          <meshStandardMaterial
            color={isMouseDown ? "#10b981" : "#fef3c7"}
            emissive={isMouseDown ? "#10b981" : "#000000"}
            emissiveIntensity={isMouseDown ? 0.6 : 0}
          />
        </mesh>
      </group>

      <group
        position={[2.2, 0.56, 0.9]}
        onPointerMove={(e) => {
          const normX = THREE.MathUtils.clamp((e.point.x - 1.2) / 2.0, 0, 1) * 100;
          const normZ = THREE.MathUtils.clamp((e.point.z - 0.0) / 1.8, 0, 1) * 100;
          onMousePadDrag(normX, normZ);
        }}
      >
        <mesh>
          <boxGeometry args={[2.2, 0.02, 2.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>

      <group ref={mouseMeshRef} position={[2.2, 0.65, 0.9]}>
        <mesh position={[0, 0.06, 0.15]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.5, 0.16, 0.75]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh ref={lButtonRef} position={[-0.13, 0.12, -0.2]}>
          <boxGeometry args={[0.2, 0.08, 0.3]} />
          <meshStandardMaterial color={isMouseDown ? "#10b981" : "#38bdf8"} />
        </mesh>
        <mesh position={[0.13, 0.12, -0.2]}>
          <boxGeometry args={[0.2, 0.08, 0.3]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <pointLight
          ref={redLedRef}
          color="#ef4444"
          distance={1.4}
          intensity={1.5}
          position={[0, -0.05, 0]}
        />
      </group>

      {/* Room Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 9, 6]} intensity={1.3} color="#fef3c7" />
      <pointLight position={[-4, 4, 1]} intensity={0.8} color="#fed7aa" />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// ── MAIN WINDOW HIT TESTER LAB COMPONENT ────────────────────
// ─────────────────────────────────────────────────────────────

export default function WindowHitTester() {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");

  // Gameplay Progression Levels
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  // Monitor cursor coordinates (relative to monitor screen 0 to 520px x 0 to 220px)
  const [cursorPos, setCursorPos] = useState({ x: 260, y: 110 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Physical Mouse position on desk mat (0 to 100% relative coordinates)
  const [padPos, setPadPos] = useState({ x: 50, y: 50 });
  const [isDraggingPhysicalMouse, setIsDraggingPhysicalMouse] = useState(false);

  // Level 1: Radar Beacons Reached (0, 1, 2, 3)
  const [beaconsHit, setBeaconsHit] = useState<number[]>([]);

  // Level 2: Windows raised
  const [raisedWindows, setRaisedWindows] = useState<Set<string>>(new Set());

  // Level 3: Windows Docked
  const [dockedCount, setDockedCount] = useState<number>(0);

  // Last fired OS event label for live ticker
  const [lastEvent, setLastEvent] = useState<string>("kernel_idle");

  const [hasWon, setHasWon] = useState(false);

  const monitorScreenRef = useRef<HTMLDivElement>(null);
  const mouseGlideRef = useRef<HTMLDivElement>(null);

  const { playClick, playPop, playSuccess } = useLabAudio();
  const { reportComplete } = useLMSBridge("window-hit-tester");

  // 3 OS Windows
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "music",
      title: "Audio Synth",
      icon: Music,
      x: 55,
      y: 30,
      w: 190,
      h: 125,
      zIndex: 1,
      bgGradient: "bg-gradient-to-br from-[#7dd3fc] to-[#38bdf8]",
      borderColor: "border-[#0284c7]",
      titleBg: "bg-[#0284c7]",
      textColor: "text-[#0c4a6e]",
      desc: "Sound wave oscillator stream. Click or drag titlebar!",
    },
    {
      id: "paint",
      title: "Palette Studio",
      icon: Palette,
      x: 160,
      y: 50,
      w: 195,
      h: 130,
      zIndex: 2,
      bgGradient: "bg-gradient-to-br from-[#fbcfe8] to-[#f472b6]",
      borderColor: "border-[#db2777]",
      titleBg: "bg-[#db2777]",
      textColor: "text-[#831843]",
      desc: "Vector Canvas ready! Hit-test checks top Z-layer.",
    },
    {
      id: "notes",
      title: "Tactile Notes",
      icon: FileText,
      x: 265,
      y: 70,
      w: 190,
      h: 125,
      zIndex: 3,
      bgGradient: "bg-gradient-to-br from-[#fef08a] to-[#fde047]",
      borderColor: "border-[#ca8a04]",
      titleBg: "bg-[#eab308]",
      textColor: "text-[#713f12]",
      desc: "OS calculates X & Y bounds to target mouse clicks.",
    },
  ]);

  // Determine top-most active window by zIndex
  const topWindow = [...windows].sort((a, b) => b.zIndex - a.zIndex)[0];

  // Hit-test: Which window is currently under (cursorPos.x, cursorPos.y) in reverse Z-order
  const hitTestWindow = useCallback(
    (x: number, y: number) => {
      const sorted = [...windows].sort((a, b) => b.zIndex - a.zIndex);
      for (const win of sorted) {
        if (x >= win.x && x <= win.x + win.w && y >= win.y && y <= win.y + win.h) {
          return win;
        }
      }
      return null;
    },
    [windows]
  );

  const hoveredWindow = hitTestWindow(cursorPos.x, cursorPos.y);

  // Sync monitor coords with physical mouse pad in exact 1:1 lockstep
  const updatePointer = useCallback((newX: number, newY: number) => {
    const clampedX = Math.max(10, Math.min(510, newX));
    const clampedY = Math.max(10, Math.min(210, newY));
    setCursorPos({ x: clampedX, y: clampedY });
    setPadPos({
      x: Math.round((clampedX / 520) * 100),
      y: Math.round((clampedY / 220) * 100),
    });
  }, []);

  // Window Titlebar Pointer Down: Start Drag / Raise Z-Index
  const handleWindowPointerDown = useCallback((id: string, e?: React.MouseEvent | React.PointerEvent) => {
    if (e) e.stopPropagation();
    playClick();
    setIsMouseDown(true);
    setActiveDragId(id);

    // Bring to front (max Z + 1)
    const maxZ = Math.max(...windows.map((w) => w.zIndex));
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
    );

    const targetWin = windows.find((w) => w.id === id);
    if (targetWin) {
      setDragOffset({
        x: cursorPos.x - targetWin.x,
        y: cursorPos.y - targetWin.y,
      });
    }

    setLastEvent(`mousedown: HIT [${id.toUpperCase()}] -> Z-INDEX RAISED TO FRONT`);

    // Level 2 Progression
    if (level === 2) {
      const nextRaised = new Set(raisedWindows).add(id);
      setRaisedWindows(nextRaised);
      if (nextRaised.size >= 3) {
        playSuccess();
        setTimeout(() => {
          setLevel(3);
          setLastEvent("LEVEL_3_ACTIVATED: DRAG_AND_DOCK");
        }, 600);
      }
    }
  }, [windows, cursorPos.x, cursorPos.y, level, raisedWindows, playClick, playSuccess]);

  // Physical Mouse Click Down: Hits whatever window or beacon is currently targeted by the crosshair
  const handlePhysicalMouseDown = useCallback((e?: React.MouseEvent | React.PointerEvent) => {
    if (e) e.stopPropagation();
    playClick();
    setIsMouseDown(true);
    setIsDraggingPhysicalMouse(true);

    // Hit test window under current crosshairs
    const target = hitTestWindow(cursorPos.x, cursorPos.y);
    if (target) {
      handleWindowPointerDown(target.id, e);
    } else {
      setLastEvent(`mousedown: DESKTOP (X:${cursorPos.x}, Y:${cursorPos.y})`);
    }

    // Level 1: Beacon click tolerance
    if (level === 1) {
      const nextTarget = RADAR_TARGETS[beaconsHit.length];
      if (nextTarget) {
        const dist = Math.hypot(cursorPos.x - nextTarget.x, cursorPos.y - nextTarget.y);
        if (dist < 42) {
          playPop();
          const next = [...beaconsHit, nextTarget.id];
          setBeaconsHit(next);
          setLastEvent(`BEACON_${nextTarget.id}_LOCKED (X:${nextTarget.x}, Y:${nextTarget.y})`);
          if (next.length === 3) {
            playSuccess();
            setTimeout(() => {
              setLevel(2);
              setLastEvent("LEVEL_2_ACTIVATED: REVERSE_Z_TESTING");
            }, 600);
          }
        }
      }
    }
  }, [cursorPos, hitTestWindow, handleWindowPointerDown, level, beaconsHit, playClick, playPop, playSuccess]);

  // Level 1: Check Radar Beacon Collision
  useEffect(() => {
    if (level === 1) {
      const nextTarget = RADAR_TARGETS[beaconsHit.length];
      if (nextTarget) {
        const dist = Math.hypot(cursorPos.x - nextTarget.x, cursorPos.y - nextTarget.y);
        if (dist < 28) {
          playPop();
          const next = [...beaconsHit, nextTarget.id];
          setBeaconsHit(next);
          setLastEvent(`BEACON_${nextTarget.id}_LOCKED (X:${nextTarget.x}, Y:${nextTarget.y})`);

          if (next.length === 3) {
            playSuccess();
            setTimeout(() => {
              setLevel(2);
              setLastEvent("LEVEL_2_ACTIVATED: REVERSE_Z_TESTING");
            }, 600);
          }
        }
      }
    }
  }, [cursorPos, level, beaconsHit, playPop, playSuccess]);

  // Handle pointer move on Monitor Screen
  const handleMonitorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!monitorScreenRef.current) return;
    const rect = monitorScreenRef.current.getBoundingClientRect();
    const curX = Math.round(((e.clientX - rect.left) / rect.width) * 520);
    const curY = Math.round(((e.clientY - rect.top) / rect.height) * 220);

    updatePointer(curX, curY);

    if (activeDragId) {
      setLastEvent(`pointermove: DRAGGING_${activeDragId.toUpperCase()} (ΔX, ΔY)`);
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === activeDragId) {
            const nextX = Math.max(5, Math.min(320, curX - dragOffset.x));
            const nextY = Math.max(5, Math.min(95, curY - dragOffset.y));
            return { ...w, x: nextX, y: nextY };
          }
          return w;
        })
      );
    } else {
      const target = hitTestWindow(curX, curY);
      setLastEvent(
        target
          ? `mousemove: HIT [${target.title}] (Layer Z:${target.zIndex})`
          : `mousemove: DESKTOP (X:${curX}, Y:${curY})`
      );
    }
  };

  // Handle pointer drag on Physical Mouse Glide Zone (100% 1:1 Coordinated Sync)
  const handleMouseGlideMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseGlideRef.current) return;
    const rect = mouseGlideRef.current.getBoundingClientRect();
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const curX = Math.round(normX * 520);
    const curY = Math.round(normY * 220);
    updatePointer(curX, curY);

    if (activeDragId) {
      setLastEvent(`pointermove: DRAGGING_${activeDragId.toUpperCase()} (X:${curX}, Y:${curY})`);
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === activeDragId) {
            const nextX = Math.max(5, Math.min(320, curX - dragOffset.x));
            const nextY = Math.max(5, Math.min(95, curY - dragOffset.y));
            return { ...w, x: nextX, y: nextY };
          }
          return w;
        })
      );
    } else {
      const target = hitTestWindow(curX, curY);
      setLastEvent(
        target
          ? `mousemove: HIT [${target.title}] (Layer Z:${target.zIndex})`
          : `mousemove: DESKTOP (X:${curX}, Y:${curY})`
      );
    }
  };

  // Pointer Up: Release Drag & Check Level 3 Docking
  const handlePointerUp = useCallback(() => {
    if (activeDragId) {
      playPop();
      setLastEvent(`mouseup: DROPPED [${activeDragId.toUpperCase()}]`);

      // Level 3 Docking Check
      if (level === 3) {
        const dragged = windows.find((w) => w.id === activeDragId);
        if (dragged) {
          const inLeftDock = dragged.x < 120 && !dragged.isDocked;
          const inRightDock = dragged.x > 210 && !dragged.isDocked;

          if (inLeftDock || inRightDock) {
            playSuccess();
            setWindows((prev) =>
              prev.map((w) => (w.id === activeDragId ? { ...w, isDocked: true } : w))
            );
            const nextCount = dockedCount + 1;
            setDockedCount(nextCount);
            setLastEvent(`DOCK_SNAPPED: [${activeDragId.toUpperCase()}] ✓`);

            if (nextCount >= 2 && !hasWon) {
              setHasWon(true);
              reportComplete({ labId: "window-hit-tester" });
            }
          }
        }
      }
    }
    setIsMouseDown(false);
    setActiveDragId(null);
    setIsDraggingPhysicalMouse(false);
  }, [activeDragId, level, windows, dockedCount, hasWon, playPop, playSuccess, reportComplete]);

  useEffect(() => {
    const handleGlobalUp = () => {
      if (isMouseDown || activeDragId || isDraggingPhysicalMouse) {
        handlePointerUp();
      }
    };
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, [isMouseDown, activeDragId, isDraggingPhysicalMouse, handlePointerUp]);

  const handleReset = () => {
    playClick();
    setLevel(1);
    setCursorPos({ x: 260, y: 110 });
    setPadPos({ x: 50, y: 50 });
    setBeaconsHit([]);
    setRaisedWindows(new Set());
    setDockedCount(0);
    setIsMouseDown(false);
    setActiveDragId(null);
    setLastEvent("kernel_reset");
    setHasWon(false);
    setWindows([
      { ...windows[0], x: 55, y: 30, zIndex: 1, isDocked: false },
      { ...windows[1], x: 160, y: 50, zIndex: 2, isDocked: false },
      { ...windows[2], x: 265, y: 70, zIndex: 3, isDocked: false },
    ]);
  };

  return (
    <GradeThreeScaffold
      fullBleed={true}
      instruction={
        hasWon
          ? "Triumph! You mastered OS cursor coordinate hit-testing, layer Z-order priority, and window drag event listeners!"
          : level === 1
          ? `Level 1: Move the Physical Mouse on the desk mat to steer the cursor into Beacon #${beaconsHit.length + 1} (${beaconsHit.length}/3 locked)!`
          : level === 2
          ? `Level 2: Hit-Test the exposed tabs of buried windows to raise all 3 apps to the top layer (${raisedWindows.size}/3 raised)!`
          : `Level 3: Grab window titlebars and drag them into the Left and Right docking bays (${dockedCount}/2 docked)!`
      }
      currentStep={level === 1 ? beaconsHit.length : level === 2 ? 3 + raisedWindows.size : 6 + dockedCount}
      totalSteps={9}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-2 text-[#451a03]">
          {/* Coordinates HUD */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#fed7aa] border-2 border-[#ea580c]/40 rounded-xl text-xs font-mono font-black shadow-xs">
              <MousePointer size={14} className="text-[#c2410c]" />
              <span>X: {cursorPos.x}px, Y: {cursorPos.y}px</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#fef08a] border-2 border-[#ca8a04]/40 rounded-xl text-xs font-black shadow-xs">
              <Target size={14} className="text-[#a16207]" />
              <span>
                Hit Target:{" "}
                <span className="font-mono text-[#854d0e]">
                  {hoveredWindow ? hoveredWindow.title : "Desktop Wallpaper"}
                </span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#d97706]/20 border border-[#d97706]/40 rounded-xl text-[10px] font-mono text-[#78350f]">
              <span className="font-bold">OS Dispatch:</span>
              <span>{lastEvent}</span>
            </div>
          </div>

          {/* Mode Switcher & Level Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playPop();
                setViewMode((m) => (m === "2D" ? "3D" : "2D"));
              }}
              className="px-3 py-1 rounded-xl bg-[#fed7aa] hover:bg-[#fdba74] text-[#9a3412] font-mono text-xs font-black border border-[#ea580c]/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {viewMode === "2D" ? <Box size={13} /> : <Eye size={13} />}
              <span>{viewMode === "2D" ? "3D Room Studio" : "Isometric Room"}</span>
            </button>

            <span className="px-3 py-1 rounded-xl bg-[#059669] text-[#ecfdf5] font-mono text-xs font-black border border-[#34d399] shadow-xs">
              LEVEL {level} OF 3
            </span>
            <button
              onClick={handleReset}
              className="px-3 py-1 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>
      }
    >
      {/* ── 3D ISOMETRIC ROOM (React Three Fiber) ── */}
      {viewMode === "3D" ? (
        <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#fed7aa] via-[#fde68a] to-[#78350f]">
          <Canvas
            camera={{ position: [0, 4.2, 6.8], fov: 40 }}
            className="w-full h-full"
          >
            <LivingRoom3DScene
              cursorPos={cursorPos}
              padPos={padPos}
              isMouseDown={isMouseDown}
              level={level}
              beaconsHit={beaconsHit}
              windows={windows}
              onMousePadDrag={(normX, normZ) => {
                const curX = Math.round((normX / 100) * 520);
                const curY = Math.round((normZ / 100) * 220);
                updatePointer(curX, curY);
              }}
              onWindowClick={(id) => handleWindowPointerDown(id)}
            />
            <OrbitControls
              enablePan={false}
              minPolarAngle={Math.PI / 4.5}
              maxPolarAngle={Math.PI / 2.3}
              minDistance={5}
              maxDistance={10}
            />
          </Canvas>
        </div>
      ) : (
        /* ── 2D FULL-BLEED ISOMETRIC LIVING ROOM WORKSTATION ── */
        <div
          onPointerUp={handlePointerUp}
          className="relative w-full h-full overflow-hidden select-none flex flex-col justify-between"
        >
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* ── 1. CLEAN MODERN LIGHT-OAK FLOOR & ISOMETRIC ROOM (SVG) ─── */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1200 680"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Clean, Modern Light-Oak Parquet Plank Floor (Matching Blueprint) */}
              <pattern id="lightOakFloor" width="160" height="32" patternUnits="userSpaceOnUse">
                <rect width="160" height="32" fill="#fde68a" />
                <rect x="0" y="0" width="80" height="16" fill="#fef08a" stroke="#d97706" strokeWidth="0.5" />
                <rect x="80" y="0" width="80" height="16" fill="#fde68a" stroke="#d97706" strokeWidth="0.5" />
                <rect x="0" y="16" width="60" height="16" fill="#fde68a" stroke="#d97706" strokeWidth="0.5" />
                <rect x="60" y="16" width="100" height="16" fill="#fef08a" stroke="#d97706" strokeWidth="0.5" />
                <line x1="0" y1="16" x2="160" y2="16" stroke="#b45309" strokeWidth="0.8" opacity="0.35" />
                <line x1="0" y1="32" x2="160" y2="32" stroke="#b45309" strokeWidth="0.8" opacity="0.35" />
              </pattern>
              {/* Soft Room Ambient Light */}
              <radialGradient id="lampGlow" cx="20%" cy="25%" r="45%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Left Corner Wall (Warm Cream Panel) */}
            <polygon points="0,0 600,80 600,430 0,360" fill="#fef3c7" stroke="#eab308" strokeWidth="1" />
            {/* Right Corner Wall (Warm Sunlit Tan) */}
            <polygon points="600,80 1200,0 1200,360 600,430" fill="#fed7aa" stroke="#f59e0b" strokeWidth="1" />
            {/* Center Corner Seam */}
            <line x1="600" y1="80" x2="600" y2="430" stroke="#b45309" strokeWidth="2.5" opacity="0.4" />

            {/* Clean Light-Oak Parquet Floor */}
            <polygon points="0,360 600,430 1200,360 1200,680 0,680" fill="url(#lightOakFloor)" opacity="0.95" />
            {/* Floor Ambient Lighting Layer */}
            <polygon points="0,360 600,430 1200,360 1200,680 0,680" fill="url(#lampGlow)" opacity="0.5" />

            {/* ── WALL DECOR: HONEYCOMB HEXAGON LED LIGHTS (From Blueprint) ── */}
            <g transform="translate(140, 100)" opacity="0.95">
              {[
                { cx: 0, cy: 0 },
                { cx: 28, cy: -16 },
                { cx: 56, cy: 0 },
                { cx: 28, cy: 32 },
                { cx: 56, cy: 48 },
                { cx: 84, cy: 32 },
              ].map((pos, i) => (
                <polygon
                  key={i}
                  points={`${pos.cx},${pos.cy - 14} ${pos.cx + 13},${pos.cy - 7} ${pos.cx + 13},${pos.cy + 7} ${pos.cx},${pos.cy + 14} ${pos.cx - 13},${pos.cy + 7} ${pos.cx - 13},${pos.cy - 7}`}
                  fill="#fef08a"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  filter="drop-shadow(0px 0px 8px #fef08a)"
                />
              ))}
            </g>

            {/* ── WALL DECOR: STUDIO PEGBOARD (From Blueprint) ── */}
            <g transform="translate(850, 80)">
              <rect x="0" y="0" width="160" height="110" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
              {[20, 50, 80, 110, 140].map((px) =>
                [20, 45, 70, 95].map((py) => (
                  <circle key={`${px}-${py}`} cx={px} cy={py} r="2" fill="#64748b" />
                ))
              )}
              <rect x="25" y="40" width="22" height="36" rx="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
              <rect x="55" y="40" width="22" height="36" rx="3" fill="#10b981" stroke="#064e3b" strokeWidth="1" />
              <rect x="85" y="40" width="22" height="36" rx="3" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" />
              <rect x="115" y="40" width="22" height="36" rx="3" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            </g>

            {/* ── FILING CABINET WITH POTTED PLANT (From Blueprint) ── */}
            <g transform="translate(1010, 370)">
              <polygon points="0,40 70,10 130,40 60,70" fill="#475569" />
              <polygon points="0,40 60,70 60,190 0,160" fill="#334155" />
              <polygon points="60,70 130,40 130,160 60,190" fill="#1e293b" />
              {[80, 120, 160].map((dy) => (
                <line key={dy} x1="12" y1={dy} x2="48" y2={dy + 18} stroke="#fbbf24" strokeWidth="2.5" />
              ))}
              <ellipse cx="65" cy="35" rx="14" ry="7" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.5" />
              <path d="M 65 30 Q 55 10 50 15 Q 60 25 65 30" fill="#10b981" />
              <path d="M 65 30 Q 75 8 80 12 Q 70 25 65 30" fill="#059669" />
              <path d="M 65 30 Q 65 0 65 5 Q 65 25 65 30" fill="#34d399" />
            </g>
          </svg>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* ── 2. UNIFIED STANDING DESK WITH MONITOR, KEYBOARD & MOUSE ─── */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center py-1 sm:py-2 px-2 pointer-events-auto">
            {/* ── THE COMPLETE HARDWOOD STANDING DESK WORKSTATION ── */}
            <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
              {/* 1. FREESTANDING 16:9 PROPORTIONAL MONITOR (Screen Against Room Wall, Standing ON Table!) */}
              <div className="relative z-20 flex flex-col items-center">
                {/* Monitor Chassis (Natural 16:9 / 16:10 aspect ratio) */}
                <div className="relative w-[480px] sm:w-[510px] h-[215px] sm:h-[230px] bg-[#020617] rounded-2xl border-4 border-[#334155] shadow-2xl p-1.5 flex flex-col justify-between">
                  {/* Top Bezel with Webcam */}
                  <div className="flex items-center justify-between px-3 py-0.5 text-[8px] font-mono text-[#94a3b8] border-b border-[#1e293b]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                      <span>OS Kernel Window Server • 60 FPS Event Dispatcher</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0f172a] border border-[#475569] flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#38bdf8]" />
                    </div>
                    <span>Z-Buffer Depth: 3 Windows Active</span>
                  </div>

                  {/* Digital Desktop OS Screen */}
                  <div
                    ref={monitorScreenRef}
                    onMouseMove={handleMonitorMouseMove}
                    className="relative flex-1 w-full bg-gradient-to-br from-[#fde68a] via-[#fcd34d] to-[#fbbf24] rounded-xl border border-[#ca8a04] shadow-inner overflow-hidden cursor-crosshair"
                  >
                    {/* Grid Watermark */}
                    <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
                      <defs>
                        <pattern id="monitorGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                          <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#78350f" strokeWidth="0.8" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#monitorGrid)" />
                    </svg>

                    {/* Laser Crosshair Reticles following Cursor Pos */}
                    <div
                      className="pointer-events-none absolute w-full border-t border-dashed border-[#ea580c]/60 z-30"
                      style={{ top: `${(cursorPos.y / 220) * 100}%` }}
                    />
                    <div
                      className="pointer-events-none absolute h-full border-l border-dashed border-[#ea580c]/60 z-30"
                      style={{ left: `${(cursorPos.x / 520) * 100}%` }}
                    />

                    {/* Pointer Crosshair Target Dot */}
                    <div
                      className="pointer-events-none absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-[#ea580c] z-30 flex items-center justify-center shadow-xs"
                      style={{
                        left: `${(cursorPos.x / 520) * 100}%`,
                        top: `${(cursorPos.y / 220) * 100}%`,
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                    </div>

                    {/* LEVEL 1: RADAR TARGET BEACONS */}
                    {level === 1 && (
                      <div className="absolute inset-0 pointer-events-none z-20">
                        {RADAR_TARGETS.map((beacon, i) => {
                          const isUnlocked = beaconsHit.includes(beacon.id);
                          const isCurrent = beaconsHit.length === i;
                          return (
                            <div
                              key={beacon.id}
                              style={{
                                left: `${(beacon.x / 520) * 100}%`,
                                top: `${(beacon.y / 220) * 100}%`,
                              }}
                              className={`absolute -ml-5 -mt-5 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                                isUnlocked
                                  ? "bg-[#059669] border-[#34d399] text-[#ecfdf5] scale-90"
                                  : isCurrent
                                  ? "bg-[#ea580c]/30 border-[#ea580c] text-[#7c2d12] animate-bounce scale-110 shadow-lg"
                                  : "opacity-40 border-[#b45309]"
                              }`}
                            >
                              <Target size={16} />
                              <span className="absolute -bottom-4 whitespace-nowrap text-[8px] font-mono font-black text-[#78350f]">
                                {beacon.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* LEVEL 3: DOCKING BAY DROP ZONES */}
                    {level === 3 && (
                      <div className="absolute inset-0 pointer-events-none z-0 p-2 flex justify-between">
                        <div className="w-36 h-28 rounded-xl border-2 border-dashed border-[#0284c7] bg-[#0284c7]/15 p-2 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] font-mono font-black text-[#0284c7]">LEFT DOCK BAY</span>
                          <span className="text-[9px] text-[#0369a1]">Drop window here</span>
                        </div>
                        <div className="w-36 h-28 rounded-xl border-2 border-dashed border-[#db2777] bg-[#db2777]/15 p-2 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] font-mono font-black text-[#db2777]">RIGHT DOCK BAY</span>
                          <span className="text-[9px] text-[#9d174d]">Drop window here</span>
                        </div>
                      </div>
                    )}

                    {/* THE 3 DESKTOP WINDOWS */}
                    {windows.map((win) => {
                      const isHovered = hoveredWindow?.id === win.id;
                      const isTop = topWindow.id === win.id;
                      const isDragging = activeDragId === win.id;
                      const WinIcon = win.icon;

                      return (
                        <div
                          key={win.id}
                          style={{
                            left: `${(win.x / 520) * 100}%`,
                            top: `${(win.y / 220) * 100}%`,
                            width: `${(win.w / 520) * 100}%`,
                            height: `${(win.h / 220) * 100}%`,
                            zIndex: win.zIndex,
                          }}
                          className={`absolute rounded-xl border-2 ${win.borderColor} ${win.bgGradient} shadow-md transition-shadow flex flex-col overflow-hidden ${
                            isDragging
                              ? "ring-4 ring-[#ea580c] shadow-2xl scale-[1.02] cursor-grabbing"
                              : isHovered
                              ? "ring-2 ring-[#ea580c] cursor-pointer"
                              : ""
                          }`}
                        >
                          {/* Draggable Titlebar */}
                          <div
                            onMouseDown={(e) => handleWindowPointerDown(win.id, e)}
                            className={`px-2 py-0.5 flex items-center justify-between ${win.titleBg} text-white cursor-grab active:cursor-grabbing border-b ${win.borderColor}`}
                          >
                            <div className="flex items-center gap-1">
                              <WinIcon size={11} className="stroke-[2.5]" />
                              <span className="text-[9px] font-black tracking-wide truncate">
                                {win.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[8px] font-mono">
                              <span className="bg-black/20 px-1 rounded">Z:{win.zIndex}</span>
                              <div className="flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#fca5a5]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#fde047]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#86efac]" />
                              </div>
                            </div>
                          </div>

                          {/* Window App Body */}
                          <div className={`p-1.5 text-[9px] font-bold leading-tight flex-1 flex flex-col justify-between ${win.textColor}`}>
                            <p className="line-clamp-2">{win.desc}</p>
                            <div className="flex items-center justify-between text-[8px] font-mono pt-0.5 border-t border-black/10">
                              <span className="flex items-center gap-1">
                                <Move size={9} /> X:{win.x}, Y:{win.y}
                              </span>
                              <span className="font-black">
                                {isTop ? "ACTIVE FRONT" : "CLICK TAB TO RAISE"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Taskbar */}
                  <div className="flex items-center justify-between px-3 py-0.5 bg-[#020617] rounded-lg border border-[#1e293b] text-[8px] text-[#94a3b8]">
                    <div className="flex items-center gap-2">
                      <Disc size={11} className="text-[#38bdf8]" />
                      <span className="font-mono font-bold text-[#f1f5f9]">Desktop Taskbar:</span>
                      <div className="flex items-center gap-1.5 ml-2">
                        {windows.map((w) => {
                          const isFront = w.id === topWindow.id;
                          return (
                            <div
                              key={w.id}
                              className={`px-2 py-0.5 rounded text-[8px] font-bold flex items-center gap-1 ${
                                isFront ? "bg-[#0284c7] text-white" : "bg-[#1e293b] text-[#94a3b8]"
                              }`}
                            >
                              <span>{w.title.split(" ")[0]}</span>
                              {isFront && <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <span className="font-mono text-[#fde047]">
                      {level === 1 ? "CALIBRATING MOUSE SENSOR" : level === 2 ? "TESTING Z-INDEX HIT-TESTS" : "DOCKING CHALLENGE"}
                    </span>
                  </div>
                </div>

                {/* Monitor Stand Neck (Connecting Screen down to Tabletop) */}
                <div className="w-10 h-4 bg-gradient-to-b from-[#334155] to-[#1e293b] border-x border-[#475569] shadow-md z-10" />
              </div>

              {/* 2. SOLID WOOD TABLETOP (Starts Above Monitor Stand Base - Monitor Rests ON the Table!) */}
              <div className="relative z-10 w-full max-w-4xl -mt-2 bg-gradient-to-b from-[#a14507] via-[#853406] to-[#692404] rounded-t-2xl border-t-4 border-[#d97706]/90 pt-1.5 pb-3 px-3 sm:px-4 shadow-2xl flex flex-col items-center gap-2">
                {/* Monitor Stand Base (Resting Flat ON the Tabletop Surface!) */}
                <div className="w-36 h-4 rounded-full bg-gradient-to-r from-[#1e293b] via-[#475569] to-[#1e293b] border border-[#64748b] shadow-xl shadow-black/80 flex items-center justify-center -mt-2 mb-0.5">
                  <div className="w-24 h-1.5 bg-[#0f172a] rounded-full" />
                </div>

                {/* 2. EXPANSIVE STITCHED SADDLE LEATHER DESK MAT */}
                <div className="relative w-full max-w-3xl h-[105px] sm:h-[115px] bg-gradient-to-br from-[#451a03] via-[#5c2409] to-[#3a1302] rounded-2xl border-2 border-[#d97706] p-1.5 sm:p-2 flex items-center justify-between shadow-xl shadow-black/80">
                  {/* Stitched Gold Border */}
                  <div className="absolute inset-1 rounded-xl border border-dashed border-[#fbbf24]/50 pointer-events-none" />

                  {/* FREESTANDING MECHANICAL 60% KEYBOARD (Left Side of Mat) */}
                  <div className="w-[62%] h-full bg-[#292524] rounded-xl border-2 border-[#78350f] p-1.5 flex flex-col justify-between shadow-md relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-[#44403c] rounded-full" />

                    <div className="flex items-center justify-between text-[8px] font-mono text-[#fde68a]">
                      <span className="flex items-center gap-1">
                        <KeyboardIcon size={11} className="text-[#fbbf24]" />
                        <span>Mechanical 60% Keyboard</span>
                      </span>
                      <span className="text-[#a7f3d0]">USB: 1000Hz</span>
                    </div>

                    {/* Keycap Rows */}
                    <div className="space-y-0.5">
                      <div className="flex gap-1 justify-center">
                        {["Esc", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((k) => (
                          <div
                            key={k}
                            className="flex-1 py-0.5 text-center font-mono text-[7px] font-black bg-[#fef3c7] text-[#78350f] rounded-xs shadow-xs border border-[#ca8a04]/40"
                          >
                            {k}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1 justify-center px-2">
                        {["Tab", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Enter"].map((k) => (
                          <div
                            key={k}
                            className="flex-1 py-0.5 text-center font-mono text-[7px] font-black bg-[#fef3c7] text-[#78350f] rounded-xs shadow-xs border border-[#ca8a04]/40"
                          >
                            {k}
                          </div>
                        ))}
                      </div>
                      {/* Spacebar Row */}
                      <div className="flex gap-1 items-center px-4">
                        <div className="px-1.5 py-0.5 font-mono text-[7px] bg-[#d97706] text-[#fef3c7] rounded-xs">
                          Ctrl
                        </div>
                        <button
                          type="button"
                          onPointerDown={(e) => handlePhysicalMouseDown(e)}
                          className={`flex-1 py-0.5 text-center font-mono text-[8px] font-black rounded-xs border transition-all cursor-pointer ${
                            isMouseDown
                              ? "bg-[#10b981] text-[#ecfdf5] border-[#34d399] shadow-sm shadow-[#10b981]"
                              : "bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border-[#ca8a04]/40"
                          }`}
                        >
                          SPACEBAR {isMouseDown ? "(CLICK ACTIVE)" : ""}
                        </button>
                        <div className="px-1.5 py-0.5 font-mono text-[7px] bg-[#d97706] text-[#fef3c7] rounded-xs">
                          Alt
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MOUSE GLIDE ARENA & OPTICAL MOUSE (Warm Saddle Pad with Direct Hit-Test Dispatch) */}
                  <div
                    ref={mouseGlideRef}
                    onMouseMove={handleMouseGlideMove}
                    onPointerDown={(e) => {
                      if (!mouseGlideRef.current) return;
                      const rect = mouseGlideRef.current.getBoundingClientRect();
                      const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                      const curX = Math.round(normX * 520);
                      const curY = Math.round(normY * 220);
                      updatePointer(curX, curY);
                      handlePhysicalMouseDown(e);
                    }}
                    className="relative w-[34%] h-full bg-gradient-to-br from-[#260c01] via-[#3d1302] to-[#1f0901] rounded-xl border-2 border-[#f59e0b] p-1 flex flex-col justify-between overflow-hidden cursor-crosshair shadow-inner"
                  >
                    {/* Stitched Pad Border Accent */}
                    <div className="absolute inset-0.5 rounded-lg border border-dashed border-[#fbbf24]/40 pointer-events-none" />

                    <div className="flex items-center justify-between text-[7px] font-mono text-[#fde68a] relative z-10 pointer-events-none">
                      <span className="flex items-center gap-1 font-bold">
                        <MousePointer size={9} className="text-[#f59e0b]" /> Mouse Pad
                      </span>
                      <span className="text-[#fde047] font-semibold">Click / Drag</span>
                    </div>

                    {/* PHYSICAL MOUSE (Interactive & Locked 1:1 with Screen Reticle) */}
                    <div
                      style={{
                        left: `${padPos.x}%`,
                        top: `${padPos.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        handlePhysicalMouseDown(e);
                      }}
                      className="absolute w-10 h-14 rounded-2xl bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] border-2 border-[#38bdf8] shadow-2xl shadow-black/90 transition-transform active:scale-95 flex flex-col justify-between p-1 z-20 cursor-grab active:cursor-grabbing"
                    >
                      {/* Left & Right Buttons */}
                      <div className="flex gap-0.5 h-3.5">
                        <button
                          type="button"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            handlePhysicalMouseDown(e);
                          }}
                          className={`flex-1 rounded-t-lg font-mono text-[6px] font-black border flex items-center justify-center transition-all cursor-pointer ${
                            isMouseDown
                              ? "bg-[#10b981] text-[#ecfdf5] border-[#34d399] shadow-sm shadow-[#10b981]"
                              : "bg-[#0284c7] hover:bg-[#0369a1] text-white border-[#38bdf8]"
                          }`}
                        >
                          L
                        </button>
                        <div className="w-1.5 h-2.5 my-auto rounded-full bg-[#f59e0b] border border-[#78350f]" />
                        <button
                          type="button"
                          className="flex-1 rounded-t-lg font-mono text-[6px] font-black bg-[#1e293b] text-[#94a3b8] border border-[#475569] flex items-center justify-center cursor-default"
                        >
                          R
                        </button>
                      </div>

                      {/* Optical Red Sensor Glow */}
                      <div className="flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#ef4444] shadow-md shadow-[#ef4444] animate-pulse" />
                      </div>

                      <div className="text-center font-mono text-[5px] text-[#64748b]">
                        OPTICAL
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABLE FRONT BEVELED RAIL & STEEL LEGS (Underneath the Table!) */}
              <div className="w-full h-3 bg-[#5a1e06] border-t border-[#451a03] rounded-b-md shadow-md flex items-center justify-between px-6" />
              <div className="w-full flex justify-between px-10 sm:px-20 -mt-0.5 pointer-events-none">
                <div className="w-4 h-8 sm:h-12 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-b-sm border-x border-[#334155] shadow-lg" />
                <div className="w-4 h-8 sm:h-12 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-b-sm border-x border-[#334155] shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      <Celebration
        isActive={hasWon}
        title="Window Hit-Testing Mastered!"
        message="You explored how operating systems translate raw mouse interrupts into screen coordinates, hit-test overlapping Z-layers, and dispatch window drag & click events!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
