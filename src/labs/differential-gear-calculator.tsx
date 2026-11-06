"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Cog, RotateCcw, Plus } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D BRONZE BEVEL GEAR COMPONENT ──
function BevelGear({
  radius = 1.0,
  teeth = 12,
  color = "#d97706",
  rotationSpeed = 0,
}: {
  radius?: number;
  teeth?: number;
  color?: string;
  rotationSpeed?: number;
}) {
  const gearRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gearRef.current && rotationSpeed !== 0) {
      gearRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={gearRef}>
      {/* Central Gear Disk */}
      <mesh>
        <cylinderGeometry args={[radius, radius * 0.9, 0.25, 32]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Center Shaft Bushing */}
      <mesh>
        <cylinderGeometry args={[radius * 0.35, radius * 0.35, 0.45, 16]} />
        <meshStandardMaterial color="#78350f" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Radial Teeth Blocks */}
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i / teeth) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.2, 0.2, 0.15]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── 3D DIFFERENTIAL GEAR MECHANISM ──
function DifferentialMechanism({
  rotationsA,
  rotationsB,
}: {
  rotationsA: number;
  rotationsB: number;
}) {
  const spiderRef = useRef<THREE.Group>(null);

  // Mechanical sum of turns drives the central spider gear assembly
  const outputSum = rotationsA + rotationsB;

  useFrame(() => {
    if (spiderRef.current) {
      spiderRef.current.rotation.y = THREE.MathUtils.lerp(
        spiderRef.current.rotation.y,
        outputSum * 0.5,
        0.05
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Bronze Machinery Mount Base */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[6.5, 0.4, 3.5]} />
        <meshStandardMaterial color="#451a03" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* LEFT INPUT GEAR (Axle A) */}
      <group position={[-2.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <BevelGear radius={1.1} teeth={14} color="#d97706" rotationSpeed={rotationsA * 0.6} />
        {/* Drive Axle Shaft */}
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.8} />
        </mesh>
      </group>

      {/* RIGHT INPUT GEAR (Axle B) */}
      <group position={[2.0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <BevelGear radius={1.1} teeth={14} color="#d97706" rotationSpeed={-rotationsB * 0.6} />
        {/* Drive Axle Shaft */}
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.8} />
        </mesh>
      </group>

      {/* CENTRAL DIFFERENTIAL CAGE & SPIDER PINION */}
      <group ref={spiderRef} position={[0, 0, 0]}>
        {/* Differential Cage Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.25, 0.12, 16, 32]} />
          <meshStandardMaterial color="#059669" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Top Spider Bevel Pinion */}
        <group position={[0, 0.85, 0]} rotation={[0, 0, 0]}>
          <BevelGear radius={0.65} teeth={10} color="#10b981" rotationSpeed={outputSum * 0.8} />
        </group>

        {/* Bottom Spider Bevel Pinion */}
        <group position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
          <BevelGear radius={0.65} teeth={10} color="#10b981" rotationSpeed={-outputSum * 0.8} />
        </group>

        {/* Vertical Output Indicator Pointer Dial */}
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[0.2, 0.6, 16]} />
          <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export default function DifferentialGearCalculator() {
  const [rotationsA, setRotationsA] = useState<number>(1);
  const [rotationsB, setRotationsB] = useState<number>(2);
  const [hasCalculatedTarget, setHasCalculatedTarget] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess } = useLabAudio();
  const { reportComplete } = useLMSBridge("differential-gear-calculator");

  const outputSum = rotationsA + rotationsB;
  const targetSum = 7;

  const handleTurnA = (delta: number) => {
    playPop();
    const nextA = Math.max(0, Math.min(6, rotationsA + delta));
    setRotationsA(nextA);
    checkGoal(nextA, rotationsB);
  };

  const handleTurnB = (delta: number) => {
    playPop();
    const nextB = Math.max(0, Math.min(6, rotationsB + delta));
    setRotationsB(nextB);
    checkGoal(rotationsA, nextB);
  };

  const checkGoal = (a: number, b: number) => {
    if (a + b === targetSum && !hasCalculatedTarget) {
      setHasCalculatedTarget(true);
      playSuccess();
      setHasWon(true);
      reportComplete({ labId: "differential-gear-calculator" });
    }
  };

  const handleReset = () => {
    playClick();
    setRotationsA(1);
    setRotationsB(2);
    setHasCalculatedTarget(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D Differential Addition Mastered! The 3D spider gears mechanically summed Axle A and B to reach exactly 7!"
          : !hasCalculatedTarget
          ? `Step 1: Turn 3D Axle A and Axle B so the central mechanical spider sums to exactly ${targetSum}! (Current Sum: ${outputSum})`
          : "Target reached! Watch how interlocking 3D gears calculate addition without electricity!"
      }
      currentStep={hasCalculatedTarget ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            {/* Axle A Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
                Axle A:
              </span>
              <button
                onClick={() => handleTurnA(-1)}
                className="w-7 h-7 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] font-black text-sm border border-[#d97706]/40 cursor-pointer flex items-center justify-center shadow-xs"
              >
                -
              </button>
              <span className="w-8 text-center font-mono text-sm font-black text-[#78350f] bg-[#fef3c7] py-0.5 rounded border border-[#d97706]/40">
                {rotationsA}
              </span>
              <button
                onClick={() => handleTurnA(1)}
                className="w-7 h-7 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] font-black text-sm border border-[#d97706]/40 cursor-pointer flex items-center justify-center shadow-xs"
              >
                +
              </button>
            </div>

            <Plus size={16} className="text-[#b45309]" />

            {/* Axle B Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
                Axle B:
              </span>
              <button
                onClick={() => handleTurnB(-1)}
                className="w-7 h-7 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] font-black text-sm border border-[#d97706]/40 cursor-pointer flex items-center justify-center shadow-xs"
              >
                -
              </button>
              <span className="w-8 text-center font-mono text-sm font-black text-[#78350f] bg-[#fef3c7] py-0.5 rounded border border-[#d97706]/40">
                {rotationsB}
              </span>
              <button
                onClick={() => handleTurnB(1)}
                className="w-7 h-7 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] font-black text-sm border border-[#d97706]/40 cursor-pointer flex items-center justify-center shadow-xs"
              >
                +
              </button>
            </div>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              Output: {rotationsA} + {rotationsB} = {outputSum}{" "}
              {outputSum === targetSum ? "✓ (TARGET MATCHED!)" : `(Goal: ${targetSum})`}
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Gears
            </button>
          </div>
        </div>
      }
    >
      {/* 3D MECHANICAL COMPUTING GEARBOX */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Gearbox Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <Cog size={18} className="text-[#451a03] animate-spin" style={{ animationDuration: "12s" }} />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Mechanical Calculating Engine • Differential Gear Spider
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
            SUM TARGET: {targetSum} ROTATIONS
          </span>
        </div>

        {/* 3D WEBGL GEARBOX CANVAS */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          <Canvas camera={{ position: [0, 2.5, 5.5], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[6, 8, 5]} intensity={1.8} color="#fef08a" />
            <pointLight position={[-4, 2, 2]} intensity={1.2} color="#f59e0b" />
            <pointLight position={[4, 2, 2]} intensity={1.2} color="#10b981" />

            <DifferentialMechanism rotationsA={rotationsA} rotationsB={rotationsB} />

            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={Math.PI / 6}
            />
          </Canvas>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7] z-10">
          <span>
            Drag around the 3D model to see how the interlocking bevel gears turn the central spider pinion!
          </span>
          <span className="font-mono text-[#fbbf24]">
            STATE: {outputSum === targetSum ? "SOLVED ✓" : "ROTATING"}
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D Differential Gears Mastered!"
        message="You manipulated real 3D interlocking bevel gears to discover how early mechanical computers calculated arithmetic with spider gears!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
