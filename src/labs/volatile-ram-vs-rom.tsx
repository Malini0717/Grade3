"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  HardDrive,
  Power,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Volume2,
  Sliders,
  Plane,
  Gauge,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  Radio,
  FileCode,
  RadioTower,
  Cpu,
  AlertTriangle,
  Layers,
} from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D REALISTIC MOTHERBOARD (SEPARATED RAM & ROM, FLAT CABLES, DIRECT INTERACTION) ──
// Topology:
// • Power Switch & ATX flat cables: Far Left [-2.8, 0, 0]
// • CPU Socket & Heatsink Cooler: Center-Top [-0.5, 0, -0.8]
// • RAM DIMM Slots (Standing Tall): Upper-Right Quadrant [1.8, 0, -0.8]
// • ROM BIOS Chip (Compact DIP): Lower-Left Quadrant [-0.8, 0, 1.3] (COMPLETELY SEPARATE FROM RAM!)
// • CMOS Battery CR2032: Lower-Center [-0.8, 0, 0.4]
// • PCIe Expansion Slots: Lower-Right Quadrant [1.3, 0, 1.2]
function RealisticMotherboardModel({
  powerOn,
  level,
  onTogglePower,
  onRamClick,
  onRomClick,
  feedbackTarget,
  feedbackType,
}: {
  powerOn: boolean;
  level: number;
  onTogglePower: () => void;
  onRamClick: () => void;
  onRomClick: () => void;
  feedbackTarget?: "ram" | "rom" | null;
  feedbackType?: "correct" | "error" | null;
}) {
  const switchRockerRef = useRef<THREE.Mesh>(null);
  const ramGlowLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    // Smooth rocker switch tilt animation
    if (switchRockerRef.current) {
      const targetTilt = powerOn ? -0.4 : 0.4;
      switchRockerRef.current.rotation.x = THREE.MathUtils.lerp(
        switchRockerRef.current.rotation.x,
        targetTilt,
        0.2
      );
    }
    // Dynamic RAM cyan glow
    if (ramGlowLightRef.current) {
      ramGlowLightRef.current.intensity = powerOn ? 2.6 : 0;
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      {/* ── 1. MOTHERBOARD PCB SUBSTRATE (Dark Emerald Glass-Fiber) ── */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[8.0, 0.1, 5.2]} />
        <meshStandardMaterial color="#044d32" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Silver Corner Standoff Screws */}
      {[
        [-3.7, -2.3],
        [3.7, -2.3],
        [-3.7, 2.3],
        [3.7, 2.3],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.01, z]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* ── 2. CONDUCTIVE GOLD & COPPER PCB BUS TRACES (FLAT ON SURFACE) ── */}
      {/* Power Bus from Switch to CPU and RAM */}
      <mesh position={[-0.4, 0.005, -0.6]}>
        <boxGeometry args={[4.2, 0.01, 0.07]} />
        <meshStandardMaterial
          color={powerOn ? "#fbbf24" : "#78350f"}
          emissive={powerOn ? "#f59e0b" : "#000000"}
          emissiveIntensity={powerOn ? 0.8 : 0}
          metalness={0.8}
        />
      </mesh>
      {/* Power Bus Branch to ROM in Lower-Left */}
      <mesh position={[-1.2, 0.005, 0.6]}>
        <boxGeometry args={[0.07, 0.01, 2.2]} />
        <meshStandardMaterial
          color={powerOn ? "#fbbf24" : "#78350f"}
          emissive={powerOn ? "#f59e0b" : "#000000"}
          emissiveIntensity={powerOn ? 0.8 : 0}
          metalness={0.8}
        />
      </mesh>
      {/* Memory Data Bus between CPU and RAM DIMM */}
      <mesh position={[0.7, 0.005, -0.8]}>
        <boxGeometry args={[1.6, 0.01, 0.06]} />
        <meshStandardMaterial
          color={powerOn ? "#38bdf8" : "#334155"}
          emissive={powerOn ? "#0284c7" : "#000000"}
          emissiveIntensity={powerOn ? 0.6 : 0}
          metalness={0.8}
        />
      </mesh>
      {/* ROM Read-Only Bus from Lower-Left to CPU */}
      <mesh position={[-0.6, 0.005, 0.3]}>
        <boxGeometry args={[0.06, 0.01, 1.8]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.9} />
      </mesh>

      {/* ── 3. CPU PROCESSOR SOCKET & COOLING HEATSINK (Center-Top) ── */}
      <group position={[-0.5, 0.01, -0.8]}>
        {/* Socket Base Frame */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.8, 0.08, 1.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Silver Metal Retention Arm & Bracket */}
        <mesh position={[0.95, 0.08, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
        {/* Nickel-Plated Copper Heat Spreader (IHS) */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[1.4, 0.08, 1.4]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Aluminum Finned Heatsink Cooler */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.5, 0.38, 1.5]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Heatsink Cooling Fins */}
        {[-0.55, -0.35, -0.15, 0.05, 0.25, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0.58, 0]}>
            <boxGeometry args={[0.06, 0.16, 1.48]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        ))}
        {/* Central Fan Hub Accent */}
        <mesh position={[0, 0.67, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.04, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} />
        </mesh>
      </group>

      {/* ── 4. VERTICAL RAM DIMM SLOTS & STICK (Upper-Right Quadrant) ── */}
      {/* DIRECT TOUCH: In Level 5, clicking this submits RAM! */}
      <group
        position={[1.8, 0.01, -0.8]}
        onClick={(e) => {
          e.stopPropagation();
          onRamClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        {/* Slot 1: Empty Black Channel */}
        <mesh position={[-0.35, 0.06, 0]}>
          <boxGeometry args={[0.22, 0.12, 3.2]} />
          <meshStandardMaterial color="#090d16" roughness={0.5} />
        </mesh>
        {/* White End Retainer Latches for Slot 1 */}
        <mesh position={[-0.35, 0.14, -1.65]}>
          <boxGeometry args={[0.2, 0.18, 0.14]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[-0.35, 0.14, 1.65]}>
          <boxGeometry args={[0.2, 0.18, 0.14]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>

        {/* Slot 2: Occupied RAM Socket Channel */}
        <mesh position={[0.35, 0.06, 0]}>
          <boxGeometry args={[0.22, 0.12, 3.2]} />
          <meshStandardMaterial color="#090d16" roughness={0.5} />
        </mesh>
        {/* White End Retainer Latches for Slot 2 */}
        <mesh position={[0.35, 0.14, -1.65]}>
          <boxGeometry args={[0.2, 0.18, 0.14]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0.35, 0.14, 1.65]}>
          <boxGeometry args={[0.2, 0.18, 0.14]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>

        {/* ── THE RAM MODULE STICK (Vertical in Slot 2) ── */}
        <group position={[0.35, 0.18, 0]}>
          {/* Blue/Cyan High-Speed RAM PCB */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.08, 0.9, 3.0]} />
            <meshStandardMaterial
              color={
                feedbackTarget === "ram"
                  ? feedbackType === "correct"
                    ? "#10b981"
                    : "#ef4444"
                  : "#0284c7"
              }
              roughness={0.35}
            />
          </mesh>
          {/* Gold Contact Edge Pins */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.09, 0.08, 2.9]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} />
          </mesh>
          {/* 4 Distinct Memory IC Chip Packages (Glow cyan when energized!) */}
          {[-1.0, -0.33, 0.33, 1.0].map((z, i) => (
            <group key={i} position={[0.05, 0.5, z]}>
              <mesh>
                <boxGeometry args={[0.04, 0.42, 0.46]} />
                <meshStandardMaterial
                  color={powerOn ? "#0284c7" : "#0f172a"}
                  emissive={
                    feedbackTarget === "ram"
                      ? feedbackType === "correct"
                        ? "#34d399"
                        : "#f87171"
                      : powerOn
                      ? "#38bdf8"
                      : "#000000"
                  }
                  emissiveIntensity={powerOn || feedbackTarget === "ram" ? 1.0 : 0}
                  roughness={0.2}
                />
              </mesh>
              {/* Internal Active Memory Register Strip */}
              {powerOn && (
                <mesh position={[0.025, 0, 0]}>
                  <boxGeometry args={[0.01, 0.18, 0.32]} />
                  <meshStandardMaterial color="#e0f2fe" emissive="#38bdf8" emissiveIntensity={1.5} />
                </mesh>
              )}
            </group>
          ))}
          {/* RAM Point Light */}
          <pointLight ref={ramGlowLightRef} position={[0.5, 0.6, 0]} color="#38bdf8" distance={2.8} />
        </group>
      </group>

      {/* ── 5. PERMANENT ROM BIOS CHIP (Lower-Left Quadrant, Away from RAM!) ── */}
      {/* DIRECT TOUCH: In Level 5, clicking this submits ROM! */}
      <group
        position={[-0.8, 0.01, 1.3]}
        onClick={(e) => {
          e.stopPropagation();
          onRomClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        {/* Ceramic Black IC Chip Body */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.0, 0.16, 0.7]} />
          <meshStandardMaterial
            color={
              feedbackTarget === "rom"
                ? feedbackType === "correct"
                  ? "#059669"
                  : "#b91c1c"
                : "#1e293b"
            }
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        {/* Laser-Etched Gold Autopilot Firmware Seal */}
        <mesh position={[0, 0.19, 0]}>
          <boxGeometry args={[0.75, 0.02, 0.48]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive={
              feedbackTarget === "rom"
                ? feedbackType === "correct"
                  ? "#34d399"
                  : "#f87171"
                : "#f59e0b"
            }
            emissiveIntensity={0.75}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
        {/* Dual Rows of Silver DIP Pins (Soldered flush to board) */}
        {[-0.3, -0.15, 0, 0.15, 0.3].map((z, i) => (
          <group key={i}>
            <mesh position={[-0.55, 0.05, z]}>
              <boxGeometry args={[0.12, 0.1, 0.06]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
            </mesh>
            <mesh position={[0.55, 0.05, z]}>
              <boxGeometry args={[0.12, 0.1, 0.06]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
            </mesh>
          </group>
        ))}
        {/* Constant Non-Volatile Amber Light (Never goes dark!) */}
        <pointLight position={[0, 0.4, 0]} color="#f59e0b" intensity={0.9} distance={1.8} />
      </group>

      {/* ── 6. CMOS CR2032 COIN BATTERY (Lower-Center, Next to ROM) ── */}
      <group position={[-0.8, 0.01, 0.35]}>
        {/* Black Plastic Cradle Holder */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 24]} />
          <meshStandardMaterial color="#090d16" roughness={0.5} />
        </mesh>
        {/* Silver Lithium Battery Coin */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.06, 24]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.1} />
        </mesh>
      </group>

      {/* ── 7. PCIE EXPANSION SLOTS (Lower-Right Quadrant) ── */}
      <group position={[1.3, 0.01, 1.2]}>
        {/* PCIe Slot 1 (White Connector) */}
        <mesh position={[0, 0.09, -0.32]}>
          <boxGeometry args={[2.2, 0.16, 0.2]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.14, -0.32]}>
          <boxGeometry args={[2.0, 0.08, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* PCIe Slot 2 (White Connector) */}
        <mesh position={[0, 0.09, 0.32]}>
          <boxGeometry args={[2.2, 0.16, 0.2]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.14, 0.32]}>
          <boxGeometry args={[2.0, 0.08, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* ── 8. CAPACITOR BANK & POWER CHOKES (Top-Left) ── */}
      {[
        [-1.8, -1.8],
        [-1.4, -1.8],
        [-1.0, -1.8],
        [-0.6, -1.8],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.01, z]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.41, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* ── 9. HEAVY INDUSTRIAL ROCKER POWER SWITCH (Far-Left) ── */}
      {/* Clickable Switch Assembly */}
      <group
        position={[-2.8, 0.01, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          onTogglePower();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        {/* Metal Heavy Switch Mounting Box */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[1.2, 0.28, 1.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Inner Bezel Frame */}
        <mesh position={[0, 0.29, 0]}>
          <boxGeometry args={[0.85, 0.05, 1.05]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Pivoting Rocker Paddle (Tilts realistically!) */}
        <mesh ref={switchRockerRef} position={[0, 0.35, 0]}>
          <boxGeometry args={[0.65, 0.14, 0.85]} />
          <meshStandardMaterial
            color={powerOn ? "#ef4444" : "#475569"}
            emissive={powerOn ? "#dc2626" : "#000000"}
            emissiveIntensity={powerOn ? 0.5 : 0}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
        {/* Status Pilot LED (Green when powered ON, Red when cut) */}
        <mesh position={[0.42, 0.3, -0.45]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color={powerOn ? "#22c55e" : "#ef4444"}
            emissive={powerOn ? "#10b981" : "#dc2626"}
            emissiveIntensity={1.8}
          />
        </mesh>
      </group>

      {/* ── 10. FLAT ATX POWER WIRING HARNESS (LAYS COMPLETELY FLAT ON THE PCB) ── */}
      <group position={[-2.8, 0.01, -1.2]}>
        {/* Low-Profile ATX 24-Pin Socket Header */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.45, 0.18, 1.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>

        {/* 4 Colored Flat Power Ribbons laying flat along board surface */}
        {[
          { color: "#ea580c", z: -0.48 },
          { color: "#eab308", z: -0.16 },
          { color: "#dc2626", z: 0.16 },
          { color: "#0284c7", z: 0.48 },
        ].map((w, i) => (
          <group key={i} position={[-0.45, 0.035, w.z]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.55, 0.04, 0.18]} />
              <meshStandardMaterial color={w.color} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ── BESPOKE HIGH-END REALISTIC AIRPLANE SVG ──
function RealisticAirplaneSVG({
  powerOn,
  pitchAngle,
  altitude,
}: {
  powerOn: boolean;
  pitchAngle: number;
  altitude: number;
}) {
  return (
    <div
      className="relative z-10 transition-transform duration-700 ease-out"
      style={{
        transform: `translateY(${pitchAngle > 0 ? 26 : pitchAngle < 0 ? -12 : 0}px) rotate(${pitchAngle}deg)`,
      }}
    >
      <svg width="190" height="70" viewBox="0 0 190 70" className="drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f8fafc" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="cockpitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>

          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* 1. Engine Contrail */}
        {powerOn ? (
          <g className="opacity-80">
            <path
              d="M 45 42 Q 20 40, 0 41"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 3"
              className="animate-pulse"
            />
            <ellipse cx="46" cy="42" rx="4" ry="2" fill="#38bdf8" />
          </g>
        ) : (
          <g className="opacity-70 animate-pulse">
            <circle cx="36" cy="42" r="5" fill="#475569" opacity="0.6" />
            <circle cx="22" cy="40" r="7" fill="#64748b" opacity="0.4" />
            <circle cx="6" cy="38" r="9" fill="#94a3b8" opacity="0.2" />
          </g>
        )}

        {/* 2. Vertical Stabilizer (Tail Fin) */}
        <polygon points="26,30 14,8 30,8 44,30" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
        <polygon points="17,10 28,10 39,26 28,26" fill="#f59e0b" />

        {/* 3. Horizontal Stabilizer */}
        <polygon points="18,34 6,36 10,40 24,37" fill="#64748b" />

        {/* 4. Streamlined Jet Fuselage */}
        <path
          d="M 22,35 Q 20,30 30,28 L 138,28 Q 168,28 178,35 Q 168,43 138,43 L 30,43 Q 20,40 22,35 Z"
          fill="url(#fuselageGrad)"
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* Airline Cheatline Stripe */}
        <path d="M 32,36 L 160,36 Q 166,36 170,38 L 32,38 Z" fill="#0284c7" />
        <path d="M 32,38 L 155,38 L 152,39.5 L 32,39.5 Z" fill="#f59e0b" />

        {/* 5. Cockpit Windshield */}
        <path
          d="M 152,31 L 166,34 L 160,37 L 150,35 Z"
          fill="url(#cockpitGrad)"
          stroke="#0f172a"
          strokeWidth="0.8"
        />
        <line x1="156" y1="32" x2="162" y2="35" stroke="white" strokeWidth="1" strokeLinecap="round" />

        {/* 6. Cabin Windows */}
        {[55, 68, 81, 94, 107, 120, 133].map((x, i) => (
          <rect
            key={i}
            x={x}
            y="32.5"
            width="5"
            height="3.2"
            rx="1.5"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="0.5"
          />
        ))}

        {/* 7. Swept Main Wing & Turbofan Engine */}
        <polygon
          points="88,38 72,55 94,55 120,38"
          fill="url(#wingGrad)"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <polygon points="72,55 70,50 74,51 75,55" fill="#f59e0b" />

        <g transform="translate(68, 42)">
          <rect x="8" y="-4" width="4" height="5" fill="#475569" />
          <rect x="0" y="0" width="22" height="11" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
          <ellipse cx="21" cy="5.5" rx="2" ry="5" fill="#334155" />
          <ellipse cx="20.5" cy="5.5" rx="1.2" ry="3.5" fill="#0f172a" />
          <polygon points="21,5.5 18,4 18,7" fill="#cbd5e1" />
          <rect x="-3" y="1.5" width="4" height="8" rx="1.5" fill="#334155" />
        </g>
      </svg>
    </div>
  );
}

export default function VolatileRamVsRom() {
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Electrical Bus Power: true = 28V DC Energized, false = 0V Blackout
  const [powerOn, setPowerOn] = useState<boolean>(true);

  // Level 1: Aircraft Throttle Speed (400 to 750 Kts)
  const [throttleSpeed, setThrottleSpeed] = useState<number>(400);
  const [romLockAttempted, setRomLockAttempted] = useState<boolean>(false);
  const [level1Completed, setLevel1Completed] = useState<boolean>(false);

  // Level 2 & 3: Crash Dive & Recovery State
  const [hasCutPower, setHasCutPower] = useState<boolean>(false);
  const [hasRebooted, setHasRebooted] = useState<boolean>(false);

  // Level 4: Re-dialing Altitude into Empty RAM
  const [dialedAltitude, setDialedAltitude] = useState<number>(0);
  const [ramReprogrammed, setRamReprogrammed] = useState<boolean>(false);

  // Level 5: Single-Card Non-Scrollable Step-Through Flow
  const [packetIndex, setPacketIndex] = useState<number>(0);
  const [sortedCount, setSortedCount] = useState<number>(0);
  const [sorterError, setSorterError] = useState<string | null>(null);

  // Visual 3D Feedback on clicked chip
  const [feedbackTarget, setFeedbackTarget] = useState<"ram" | "rom" | null>(null);
  const [feedbackType, setFeedbackType] = useState<"correct" | "error" | null>(null);
  const [inspectMessage, setInspectMessage] = useState<string | null>(null);

  const [hasWon, setHasWon] = useState<boolean>(false);

  const { playClick, playPop, playSuccess, playZap, speakInstructions, isSpeaking } = useLabAudio();
  const { reportComplete } = useLMSBridge("volatile-ram-vs-rom");

  // In-world Directive per Level
  const currentDirective =
    hasWon
      ? "Triumph! You mastered Computer Memory: temporary RAM erases without power, while permanent ROM keeps flight code safe!"
      : level === 1
      ? !level1Completed
        ? "Level 1: Push the Throttle to write new speed into RAM, then tap the ROM Lock to see why ROM is Read-Only!"
        : "RAM updated its live numbers while ROM stayed locked! Tap 'Next Mission →'"
      : level === 2
      ? "Level 2: Emergency Blackout! Click the 3D Rocker Switch on the motherboard to cut power and watch the jet dive!"
      : level === 3
      ? "Level 3: The jet is in a steep dive! Click the 3D Switch on the motherboard to restore power and let ROM save the plane!"
      : level === 4
      ? "Level 4: Power is restored, but RAM woke up completely blank! Dial in 30,000 FT to re-enter flight data into RAM!"
      : `Level 5: Click the 3D RAM Stick or 3D ROM Chip on the motherboard for "${
          [
            "Live GPS Coordinates",
            "Autopilot Boot Firmware",
            "Live Cockpit Radio Audio",
            "Emergency Oxygen Laws",
          ][packetIndex] || "Data Packet"
        }"!`;

  // ── LEVEL 1: SPEED THROTTLE HANDLER ──
  const handleThrottleChange = (spd: number) => {
    playClick();
    setThrottleSpeed(spd);
    if (spd >= 700 && romLockAttempted && !level1Completed) {
      playSuccess();
      setLevel1Completed(true);
    }
  };

  const handleAttemptRomEdit = () => {
    playZap();
    setRomLockAttempted(true);
    if (throttleSpeed >= 600 && !level1Completed) {
      playSuccess();
      setLevel1Completed(true);
    }
  };

  // ── LEVEL 2 & 3: 3D POWER SWITCH TOGGLE (DIEGETIC DIRECT INTERACTION) ──
  const handleTogglePower = () => {
    if (powerOn) {
      // Cut power (Level 2)
      playZap();
      setPowerOn(false);
      setHasCutPower(true);
      if (level === 2) {
        setTimeout(() => {
          playSuccess();
          setLevel(3);
        }, 1500);
      }
    } else {
      // Restore power (Level 3)
      playPop();
      setPowerOn(true);
      if (level === 3 && hasCutPower) {
        setHasRebooted(true);
        setTimeout(() => {
          playSuccess();
          setLevel(4);
        }, 1500);
      }
    }
  };

  // ── LEVEL 4: RE-ENTERING ALTITUDE INTO RAM ──
  const handleDialAltitude = (alt: number) => {
    playClick();
    setDialedAltitude(alt);
    if (alt >= 30000 && !ramReprogrammed) {
      setRamReprogrammed(true);
      playSuccess();
      setTimeout(() => {
        setLevel(5);
      }, 1000);
    }
  };

  // ── LEVEL 5: 4 PACKET DEFINITIONS ──
  const packetDefinitions = [
    {
      id: "gps",
      title: "Live GPS Coordinates",
      desc: "Changes every split-second during high-speed flight",
      correct: "ram" as const,
      category: "Real-Time Telemetry",
    },
    {
      id: "boot",
      title: "Autopilot Boot Firmware",
      desc: "Permanent factory startup program required to start flight computers",
      correct: "rom" as const,
      category: "System Firmware",
    },
    {
      id: "radio",
      title: "Live Cockpit Radio Audio",
      desc: "Temporary voice transmission stream from air traffic control",
      correct: "ram" as const,
      category: "Temporary Audio Stream",
    },
    {
      id: "oxygen",
      title: "Emergency Oxygen Laws",
      desc: "Vital safety rules that must NEVER be erased even during a crash",
      correct: "rom" as const,
      category: "Permanent Safety Rules",
    },
  ];

  const currentPacket = packetDefinitions[packetIndex] || packetDefinitions[0];

  // ── DIEGETIC CHIP CLICKS IN 3D MOTHERBOARD ──
  // Rule: ONLY the RED SWITCH toggles master power!
  // RAM click inspects volatile memory; ROM click inspects permanent locked memory.
  // In Level 5, clicks answer the active question.
  const handleChipClick = (selectedChip: "ram" | "rom") => {
    if (level === 5) {
      setFeedbackTarget(selectedChip);

      if (selectedChip === currentPacket.correct) {
        // CORRECT CHIP CLICKED!
        playSuccess();
        setFeedbackType("correct");
        setSorterError(null);
        const nextCount = sortedCount + 1;
        setSortedCount(nextCount);

        setTimeout(() => {
          setFeedbackTarget(null);
          setFeedbackType(null);

          if (packetIndex + 1 < packetDefinitions.length) {
            // Advance to next question ONLY after clicking the correct part!
            setPacketIndex(packetIndex + 1);
          } else {
            // All 4 questions answered correctly!
            playSuccess();
            setHasWon(true);
            reportComplete({ points: 100 });
          }
        }, 600);
      } else {
        // INCORRECT CHIP CLICKED! DO NOT ADVANCE!
        playZap();
        setFeedbackType("error");
        setSorterError(
          currentPacket.correct === "ram"
            ? `Incorrect: ${currentPacket.title} changes constantly in flight! It belongs in Temporary RAM, not ROM. Click the RAM Stick!`
            : `Incorrect: ${currentPacket.title} is permanent safety code! It belongs in Permanent ROM, not RAM. Click the ROM Chip!`
        );

        setTimeout(() => {
          setFeedbackTarget(null);
          setFeedbackType(null);
        }, 800);
      }
      return;
    }

    // In Levels 1 to 4: Independent Component Inspection
    if (selectedChip === "ram") {
      playClick();
      setFeedbackTarget("ram");
      setFeedbackType("correct");
      setInspectMessage(
        powerOn
          ? `⚡ RAM Module Active: Temporary memory storing live airspeed (${throttleSpeed} KTS). If master power cuts, this erases to 0000!`
          : "⚡ RAM Module Blank: 0V power! Temporary RAM has completely erased to 0000."
      );
      setTimeout(() => {
        setFeedbackTarget(null);
        setFeedbackType(null);
        setInspectMessage(null);
      }, 2500);
    } else {
      // ROM clicked
      playPop();
      setFeedbackTarget("rom");
      setFeedbackType("correct");
      if (level === 1) {
        setRomLockAttempted(true);
        if (throttleSpeed >= 600 && !level1Completed) {
          playSuccess();
          setLevel1Completed(true);
        }
      }
      setInspectMessage(
        "🔒 ROM Chip Safe: Permanent Read-Only Memory! Autopilot software is physically locked in silicon. It NEVER turns off or erases!"
      );
      setTimeout(() => {
        setFeedbackTarget(null);
        setFeedbackType(null);
        setInspectMessage(null);
      }, 2500);
    }
  };

  const handleReset = () => {
    playPop();
    setLevel(1);
    setPowerOn(true);
    setThrottleSpeed(400);
    setRomLockAttempted(false);
    setLevel1Completed(false);
    setHasCutPower(false);
    setHasRebooted(false);
    setDialedAltitude(0);
    setRamReprogrammed(false);
    setPacketIndex(0);
    setSortedCount(0);
    setSorterError(null);
    setFeedbackTarget(null);
    setFeedbackType(null);
    setHasWon(false);
  };

  const handleSpeak = () => {
    playPop();
    speakInstructions(currentDirective);
  };

  // Dynamic Airplane Pitch Angle based on state
  const airplanePitch = !powerOn ? 32 : level === 3 && hasRebooted ? -12 : 0;
  const currentAltitude = powerOn
    ? level === 4
      ? dialedAltitude > 0
        ? dialedAltitude
        : 0
      : 32000
    : 8400;

  return (
    <GradeThreeScaffold
      fullBleed={true}
      hideHeader={true}
      instruction={currentDirective}
      currentStep={level - 1}
      totalSteps={5}
      onReset={handleReset}
      tray={
        /* ── CLEAN STATUS HUD DOCK ── */
        <div className="flex items-center justify-between w-full px-3 sm:px-6 text-[#451a03]">
          {/* Level Progress Badge & Directive */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-[#f59e0b] text-[#451a03] font-mono text-xs font-black shadow-xs">
              LEVEL {level} OF 5
            </span>
            <span className="text-xs font-black text-[#78350f] hidden sm:inline truncate max-w-[380px] md:max-w-[540px]">
              {currentDirective}
            </span>
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-[#d1fae5] border-[#10b981] text-[#065f46] animate-pulse"
                  : "bg-[#fef3c7] hover:bg-[#fde68a] border-[#fcd34d] text-[#78350f]"
              }`}
              title="Read Directive Aloud"
            >
              <Volume2 size={14} />
            </button>
          </div>

          {/* Electrical Bus Status Indicator */}
          <div className="flex items-center gap-3 text-xs font-black">
            <span className="text-[#92400e] hidden md:inline">Electrical Bus:</span>
            <span
              className={`px-2.5 py-1 rounded-xl font-mono text-[11px] font-black border shadow-xs ${
                powerOn
                  ? "bg-[#d1fae5] text-[#065f46] border-[#10b981]"
                  : "bg-[#fee2e2] text-[#991b1b] border-[#ef4444] animate-pulse"
              }`}
            >
              {powerOn ? "28V DC ENERGIZED ✓" : "0V DC BLACKOUT ✗"}
            </span>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border border-[#fcd34d] cursor-pointer shadow-xs transition-all"
              title="Restart Discovery"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      }
    >
      {/* ── FULL-BLEED WORKSPACE (Zero Dead Void, Top Panel Removed) ── */}
      <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-1.5 sm:p-2.5">
        
        {/* ── MAIN WORKSPACE: 3D REALISTIC MOTHERBOARD & FLIGHT SIMULATOR PANEL ── */}
        <div className="relative z-10 flex-1 min-h-0 w-full flex flex-col md:flex-row items-stretch justify-between gap-2 sm:gap-3 my-0.5">
          
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* ── 3D MOTHERBOARD BAY (LIGHT DRAFTING BACKGROUND) ─────────── */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col justify-between bg-gradient-to-br from-[#fef3c7] via-[#fffbeb] to-[#fde68a] rounded-2xl border-3 border-amber-500 shadow-xl p-2 relative overflow-hidden min-h-0">
            {/* 3D Bay Header Bar */}
            <div className="w-full flex items-center justify-between pb-1 border-b border-amber-300 z-10 shrink-0">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white border border-amber-400 text-amber-100 font-mono text-[9px] sm:text-[10px] font-black shadow-xs">
                <Cpu size={12} className="text-yellow-300" />
                <span>3D AVIONICS MOTHERBOARD (RAM & ROM BENCH)</span>
              </div>
              <span className="text-[9px] font-mono text-amber-900 font-bold">
                {level === 5
                  ? "👉 Level 5: Click 3D RAM Stick or 3D ROM Chip to Answer!"
                  : "Red Switch = Power • Blue = RAM • Gold = ROM"}
              </span>
            </div>

            {/* 3D WebGL Canvas Viewport with Light Sunlit Drafting Tone (Not White) */}
            <div className="relative w-full flex-1 min-h-0 my-1 rounded-xl bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fed7aa] border-2 border-amber-400 overflow-hidden shadow-inner">
              <Canvas camera={{ position: [0, 3.8, 5.0], fov: 42 }}>
                {/* Light non-white warm drafting background color in Three.js */}
                <color attach="background" args={["#fef3c7"]} />

                <ambientLight intensity={1.8} />
                <directionalLight position={[4, 8, 4]} intensity={2.0} color="#ffffff" />
                <pointLight position={[-2.8, 3, 0.2]} intensity={powerOn ? 1.6 : 0.4} color={powerOn ? "#ef4444" : "#64748b"} />
                <pointLight position={[-0.8, 2.5, 1.3]} intensity={1.4} color="#f59e0b" />

                <RealisticMotherboardModel
                  powerOn={powerOn}
                  level={level}
                  onTogglePower={handleTogglePower}
                  onRamClick={() => handleChipClick("ram")}
                  onRomClick={() => handleChipClick("rom")}
                  feedbackTarget={feedbackTarget}
                  feedbackType={feedbackType}
                />

                <OrbitControls
                  enableZoom={false}
                  maxPolarAngle={Math.PI / 2.1}
                  minPolarAngle={Math.PI / 6}
                />
              </Canvas>

              {/* Direct Click Callout on 3D Red Power Switch */}
              <button
                onClick={handleTogglePower}
                className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-[9.5px] font-black cursor-pointer shadow-md active:scale-95 transition-all border bg-slate-900/90 backdrop-blur-xs text-white"
                style={{
                  borderColor: powerOn ? "#ef4444" : "#10b981",
                }}
              >
                <Power size={13} className={powerOn ? "text-red-400 animate-pulse" : "text-emerald-400"} />
                <span>{powerOn ? "RED SWITCH (CUT 28V DC)" : "RED SWITCH (RESTORE POWER)"}</span>
              </button>

              {/* Real-time Component Inspection Banner */}
              {inspectMessage && (
                <div className="absolute top-11 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-xl bg-slate-900/95 text-amber-200 border-2 border-amber-400 shadow-2xl text-[9.5px] font-mono font-bold max-w-[90%] text-center animate-bounce backdrop-blur-xs">
                  {inspectMessage}
                </div>
              )}

              {/* 3D Model Educational Description for RAM (Upper-Right) */}
              <div className="absolute top-2 right-2 z-20 pointer-events-none">
                <div className="bg-slate-900/90 border-2 border-cyan-400 text-cyan-300 px-2.5 py-1.5 rounded-xl shadow-xl text-right backdrop-blur-xs">
                  <div className="font-mono text-[10.5px] font-black flex items-center justify-end gap-1">
                    <Zap size={12} className="text-cyan-400" />
                    <span>RAM (Random Access Memory)</span>
                  </div>
                  <div className="text-[9px] text-cyan-100 font-bold">
                    Temporary Memory • Erases at 0V Power
                  </div>
                  <div className="text-[8px] font-mono text-cyan-400/80 font-bold">▲ Upper-Right Quadrant</div>
                </div>
              </div>

              {/* 3D Model Educational Description for ROM (Lower-Left) */}
              <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
                <div className="bg-slate-900/90 border-2 border-amber-400 text-amber-300 px-2.5 py-1.5 rounded-xl shadow-xl text-left backdrop-blur-xs">
                  <div className="font-mono text-[10.5px] font-black flex items-center gap-1">
                    <ShieldCheck size={12} className="text-amber-400" />
                    <span>ROM (Read-Only Memory)</span>
                  </div>
                  <div className="text-[9px] text-amber-100 font-bold">
                    Permanent Memory • Safe Forever
                  </div>
                  <div className="text-[8px] font-mono text-amber-400/80 font-bold">▼ Lower-Left Quadrant</div>
                </div>
              </div>

              {/* Blackout Alert Banner */}
              {!powerOn && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-red-600/95 text-white font-mono text-[9px] font-black shadow-lg border border-red-300 animate-bounce text-center">
                  RAM WIPED BLANK AT 0V! ROM AUTOPILOT CODE SAFE!
                </div>
              )}
            </div>

            {/* Motherboard Anatomy Diagram Labels matching New Separated Layout */}
            <div className="w-full flex items-center justify-between px-2 pt-0.5 text-[8.5px] font-mono text-amber-950 font-bold shrink-0">
              <span className="text-red-700 font-black">◄ Left: Red Power Switch</span>
              <span className="text-amber-800 font-black">▼ Bottom-Left: Gold ROM</span>
              <span className="text-slate-700 font-black">Center: CPU Cooler</span>
              <span className="text-cyan-700 font-black">▲ Top-Right: Blue RAM</span>
              <span className="text-amber-900 font-black">PCIe Slots ►</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* ── RIGHT PANEL: DYNAMIC JET SIMULATOR & INTERACTION STAGE ─── */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div className="w-full md:w-96 flex flex-col justify-between bg-white rounded-2xl border-3 border-amber-600 shadow-xl p-2.5 shrink-0 overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col justify-between min-h-0">
              {/* Simulator Header */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 shrink-0">
                <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <Plane size={14} className="text-amber-600" />
                  <span>JET FLIGHT ATTITUDE SIMULATOR</span>
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    powerOn ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800 animate-pulse"
                  }`}
                >
                  {powerOn ? "AUTOPILOT ACTIVE" : "EMERGENCY DIVE"}
                </span>
              </div>

              {/* ── HIGH-END DYNAMIC FLIGHT ATTITUDE SIMULATOR VIEWPORT ── */}
              <div className="relative w-full h-32 rounded-xl border-2 border-slate-800 bg-slate-950 overflow-hidden my-1 flex items-center justify-center shadow-inner shrink-0">
                {/* Sky & Mountain Terrain Profile SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Sky Gradient */}
                  <rect width="100%" height="65%" fill={powerOn ? "#0284c7" : "#0f172a"} />
                  {/* Subtle Clouds */}
                  {powerOn && (
                    <g fill="white" opacity="0.4">
                      <ellipse cx="25%" cy="30%" rx="35" ry="9" />
                      <ellipse cx="80%" cy="20%" rx="45" ry="12" />
                    </g>
                  )}
                  {/* Mountain Terrain Hazard */}
                  <polygon points="0,128 45,90 90,115 150,80 210,120 275,85 340,128" fill="#3b1b05" />
                  <polygon points="40,93 45,90 50,96" fill="#fef08a" />
                  <polygon points="145,83 150,80 155,85" fill="#fef08a" />
                </svg>

                {/* THE REALISTIC AIRPLANE (Tilts & Dives dynamically!) */}
                <RealisticAirplaneSVG
                  powerOn={powerOn}
                  pitchAngle={airplanePitch}
                  altitude={currentAltitude}
                />

                {/* Simulator Altitude & Attitude Overlay */}
                <div className="absolute top-1.5 left-2 z-20 font-mono text-[8.5px] font-black text-cyan-300 bg-slate-900/85 px-2 py-0.5 rounded border border-cyan-500/40">
                  {powerOn
                    ? level === 4
                      ? `ALT: ${dialedAltitude > 0 ? `${dialedAltitude.toLocaleString()} FT` : "BLANK (---)"}`
                      : "ALT: 32,000 FT (CRUISING)"
                    : "ALT: 8,400 FT ➔ CRASH DIVE!"}
                </div>

                {!powerOn && (
                  <div className="absolute bottom-1.5 right-2 z-20 font-mono text-[8.5px] font-black text-red-300 bg-red-950/90 px-2 py-0.5 rounded border border-red-500 animate-pulse flex items-center gap-1">
                    <AlertTriangle size={11} className="text-red-400" />
                    <span>PULL UP! TERRAIN HAZARD!</span>
                  </div>
                )}
              </div>

              {/* ══════════════════════════════════════════════════════════ */}
              {/* ── LEVEL 1 INTERACTION: THROTTLE (RAM) vs ROM LOCK ───── */}
              {/* ══════════════════════════════════════════════════════════ */}
              {level === 1 && (
                <div className="space-y-1.5 my-auto">
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center justify-between text-xs font-black text-amber-900 mb-1">
                      <span className="flex items-center gap-1">
                        <Gauge size={13} className="text-amber-600" />
                        Airspeed Throttle (Writes to RAM):
                      </span>
                      <span className="font-mono text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                        {throttleSpeed} KTS
                      </span>
                    </div>
                    <input
                      type="range"
                      min={400}
                      max={750}
                      step={25}
                      value={throttleSpeed}
                      onChange={(e) => handleThrottleChange(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                    />
                    <div className="text-[9px] font-mono text-cyan-800 mt-1 font-bold">
                      ✔ RAM memory constantly overwrites with live airspeed!
                    </div>
                  </div>

                  {/* ROM Lock Check Button */}
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-xs font-black text-amber-900 mb-1 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-amber-600" />
                      Permanent ROM Chip (Autopilot Software):
                    </div>
                    <button
                      onClick={handleAttemptRomEdit}
                      className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                        romLockAttempted
                          ? "bg-amber-100 border-2 border-amber-500 text-amber-900"
                          : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:brightness-105 active:scale-95"
                      }`}
                    >
                      {romLockAttempted ? <Lock size={14} className="text-amber-700" /> : <Unlock size={14} />}
                      <span>
                        {romLockAttempted
                          ? "HARDWARE LOCKED! ROM is Read-Only!"
                          : "Try to Overwrite ROM Autopilot Code"}
                      </span>
                    </button>
                    {romLockAttempted && (
                      <p className="text-[9px] font-mono text-amber-800 mt-1 font-bold">
                        Hardware safety lock active! ROM cannot be overwritten in flight.
                      </p>
                    )}
                  </div>

                  {level1Completed && (
                    <button
                      onClick={() => {
                        playPop();
                        setLevel(2);
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-md hover:brightness-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
                    >
                      <span>Next Mission: Mid-Air Power Crisis</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* ── LEVEL 2 INTERACTION: DIEGETIC 3D SWITCH POWER CUT ──── */}
              {/* ══════════════════════════════════════════════════════════ */}
              {level === 2 && (
                <div className="space-y-2 p-3 rounded-xl bg-red-50 border border-red-200 my-auto text-center">
                  <div className="text-xs font-black text-red-950 flex items-center justify-center gap-1.5">
                    <Power size={15} className="text-red-600 animate-pulse" />
                    <span>Cut Power Directly On Motherboard</span>
                  </div>
                  <p className="text-[11px] text-red-900 leading-normal font-bold">
                    Interact directly with the 3D scene!
                  </p>
                  <div className="p-2.5 rounded-lg bg-white border border-red-300 shadow-inner text-[10px] text-red-800 space-y-1">
                    <p>👉 <strong>Click the 3D Switch</strong> on the left side of the motherboard,</p>
                    <p>— OR —</p>
                    <p>👉 <strong>Click the glowing 3D RAM Stick</strong> directly to cut power!</p>
                  </div>
                  <p className="text-[9.5px] font-mono text-red-700 font-bold">
                    Notice how temporary RAM erases instantly to 0000 while the jet dives!
                  </p>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* ── LEVEL 3 INTERACTION: DIEGETIC 3D SWITCH RESTORE ───── */}
              {/* ══════════════════════════════════════════════════════════ */}
              {level === 3 && (
                <div className="space-y-2 p-3 rounded-xl bg-amber-50 border border-amber-300 my-auto text-center">
                  <div className="text-xs font-black text-amber-950 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={15} className="text-emerald-600" />
                    <span>Restore Power Directly On Motherboard</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-normal font-bold">
                    The jet is diving! Turn 28V DC back on directly in 3D:
                  </p>
                  <div className="p-2.5 rounded-lg bg-white border border-amber-300 shadow-inner text-[10px] text-amber-900 space-y-1">
                    <p>👉 <strong>Click the 3D Switch</strong> on the motherboard,</p>
                    <p>— OR —</p>
                    <p>👉 <strong>Click the 3D RAM Module</strong> to restore power!</p>
                  </div>
                  <p className="text-[9.5px] font-mono text-amber-800 font-bold">
                    Watch Permanent ROM inject recovery code to pull out of the dive!
                  </p>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* ── LEVEL 4 INTERACTION: RE-ENTERING BLANK RAM DATA ───── */}
              {/* ══════════════════════════════════════════════════════════ */}
              {level === 4 && (
                <div className="space-y-2 p-2.5 rounded-xl bg-sky-50 border border-sky-200 my-auto">
                  <div className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                    <HardDrive size={14} className="text-sky-600" />
                    <span>Re-enter Cruising Altitude into Blank RAM</span>
                  </div>
                  <p className="text-[10px] text-sky-800 leading-snug">
                    Because RAM is <strong>volatile</strong>, all numbers erased during blackout. Dial in <strong>30,000 FT</strong> to re-program RAM!
                  </p>
                  <div className="flex items-center justify-between text-xs font-black text-slate-800">
                    <span>Target Altitude:</span>
                    <span className="font-mono text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      {dialedAltitude.toLocaleString()} FT
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={35000}
                    step={5000}
                    value={dialedAltitude}
                    onChange={(e) => handleDialAltitude(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                  <div className="flex justify-between text-[8.5px] font-mono text-slate-500 font-bold">
                    <span>0 FT (Wiped)</span>
                    <span>15,000 FT</span>
                    <span className="text-sky-700 font-black">30,000 FT (Goal)</span>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* ── LEVEL 5: 100% DIEGETIC (CLICK 3D RAM OR 3D ROM!) ──── */}
              {/* ══════════════════════════════════════════════════════════ */}
              {level === 5 && (
                <div className="my-auto space-y-2">
                  {/* Progress Header & Pips */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                      <Layers size={13} className="text-amber-600" />
                      <span>Packet {packetIndex + 1} of 4</span>
                    </span>
                    {/* 4 Clean Progress Dots */}
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            idx < sortedCount
                              ? "bg-emerald-500 scale-100"
                              : idx === packetIndex
                              ? "bg-amber-500 ring-2 ring-amber-300 scale-110"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sorter Error Hint Banner (If misclassified) */}
                  {sorterError && (
                    <div className="p-1.5 rounded-xl bg-red-100 text-red-900 font-mono text-[9.5px] font-black border border-red-300 animate-shake text-center">
                      {sorterError}
                    </div>
                  )}

                  {/* The Single Active Data Packet Card */}
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-2 border-amber-300 shadow-sm space-y-1">
                    <div className="text-[9px] font-mono font-bold text-amber-700 uppercase tracking-wider">
                      {currentPacket.category}
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {currentPacket.title}
                    </div>
                    <p className="text-[10px] text-slate-600 leading-snug">
                      {currentPacket.desc}
                    </p>
                  </div>

                  {/* ── DIEGETIC CALLOUT PROMPT: NO HTML BUTTONS, CLICK 3D MESH! ── */}
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/70 shadow-md text-center space-y-1.5">
                    <div className="text-xs font-black text-amber-300 flex items-center justify-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400 animate-spin" />
                      <span>Tap the Chip in the 3D Motherboard:</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-black pt-0.5">
                      <div className="p-1.5 rounded-xl bg-cyan-950/80 text-cyan-200 border border-cyan-400/80 flex flex-col items-center">
                        <span className="text-cyan-400">▲ 3D RAM STICK</span>
                        <span className="text-[8px] text-cyan-200/80 font-normal">Upper-Right (Temporary)</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-amber-950/80 text-amber-200 border border-amber-400/80 flex flex-col items-center">
                        <span className="text-amber-400">▼ 3D ROM CHIP</span>
                        <span className="text-[8px] text-amber-200/80 font-normal">Lower-Left (Permanent)</span>
                      </div>
                    </div>

                    <p className="text-[8.5px] font-mono text-slate-400 font-bold">
                      Click directly on either chip in 3D to answer! (Moves forward on correct click only)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Educational Memory Rule */}
            <div className="text-[9px] font-mono text-center text-slate-600 font-bold pt-1 border-t border-slate-200 shrink-0">
              RAM is temporary (wipes at 0V). ROM is permanent (keeps flight software safe)!
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Celebration Modal */}
      <Celebration isActive={hasWon} onReplay={handleReset} />
    </GradeThreeScaffold>
  );
}
