"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Gauge, Play, RotateCcw } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D MECHANICAL HARD DISK DRIVE MODEL ──
function MechanicalHddMesh({ isRacing }: { isRacing: boolean }) {
  const platterRef = useRef<THREE.Mesh>(null);
  const armRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (isRacing) {
      // High-speed platter spin (7200 RPM simulation)
      if (platterRef.current) {
        platterRef.current.rotation.y += delta * 25;
      }
      // Mechanical head seeking back and forth across tracks
      if (armRef.current) {
        armRef.current.rotation.y = Math.sin(Date.now() * 0.012) * 0.35 + 0.2;
      }
    }
  });

  return (
    <group position={[-2.4, 0, 0]}>
      {/* HDD Aluminum Base Casting */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[3.2, 0.2, 3.8]} />
        <meshStandardMaterial color="#44403c" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Spindle Motor Center Base */}
      <mesh position={[0, 0.02, 0.4]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
        <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Mirror-Finish Magnetic Platter Disk */}
      <mesh ref={platterRef} position={[0, 0.1, 0.4]}>
        <cylinderGeometry args={[1.35, 1.35, 0.04, 48]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.98}
          roughness={0.08}
        />
      </mesh>

      {/* Center Clamp Ring */}
      <mesh position={[0, 0.13, 0.4]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 24]} />
        <meshStandardMaterial color="#1c1917" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Actuator Voice-Coil Pivot & Swing Arm */}
      <group ref={armRef} position={[1.0, 0.14, -1.0]}>
        {/* Voice-Coil Magnet Arch */}
        <mesh position={[0, 0.05, -0.2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.12, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Arm Body */}
        <mesh position={[-0.6, 0.02, 0.6]} rotation={[0, -0.45, 0]}>
          <boxGeometry args={[0.12, 0.03, 1.4]} />
          <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Read/Write Slider Head */}
        <mesh position={[-1.1, 0.02, 1.1]}>
          <boxGeometry args={[0.1, 0.04, 0.12]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ── 3D SOLID-STATE DRIVE FLASH CHIP MODEL ──
function SolidStateSsdMesh({ isRacing }: { isRacing: boolean }) {
  const flashLedRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (flashLedRef.current) {
      flashLedRef.current.intensity = isRacing ? (Math.sin(Date.now() * 0.03) > 0 ? 3.5 : 0.5) : 0.5;
    }
  });

  return (
    <group position={[2.4, 0, 0]}>
      {/* Matte Jade Silicon PCB Substrate */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[3.2, 0.15, 3.8]} />
        <meshStandardMaterial color="#064e3b" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Gold PCIe / SATA Edge Connector Fingers */}
      <mesh position={[0, -0.1, 1.95]}>
        <boxGeometry args={[2.2, 0.08, 0.2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 4 Ceramic NAND Flash Memory Packages */}
      {[
        [-0.7, -0.6],
        [0.7, -0.6],
        [-0.7, 0.6],
        [0.7, 0.6],
      ].map(([x, z], i) => (
        <group key={i} position={[x, -0.02, z]}>
          <mesh>
            <boxGeometry args={[1.0, 0.12, 0.9]} />
            <meshStandardMaterial
              color="#1c1917"
              roughness={0.3}
              metalness={0.5}
              emissive={isRacing ? "#059669" : "#000000"}
              emissiveIntensity={isRacing ? 0.4 : 0}
            />
          </mesh>
          {/* Gold Pin Accents */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[1.08, 0.03, 0.98]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* SSD Controller Microprocessor */}
      <mesh position={[0, -0.01, -1.2]}>
        <boxGeometry args={[0.8, 0.14, 0.8]} />
        <meshStandardMaterial color="#78350f" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Blinking Data Activity LED */}
      <mesh position={[1.1, 0.02, -1.5]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#10b981"
          emissiveIntensity={isRacing ? 2 : 0.2}
        />
      </mesh>
      <pointLight ref={flashLedRef} position={[1.1, 0.3, -1.5]} color="#34d399" distance={2} />
    </group>
  );
}

export default function HddVsSsdSpeedRace() {
  const [isRacing, setIsRacing] = useState(false);
  const [hddProgress, setHddProgress] = useState(0);
  const [ssdProgress, setSsdProgress] = useState(0);
  const [raceFinished, setRaceFinished] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("hdd-vs-ssd-speed-race");

  const startRace = () => {
    if (isRacing || raceFinished) return;

    playZap();
    setIsRacing(true);
    setHddProgress(0);
    setSsdProgress(0);

    // SSD loads instantly through electronic NAND flash
    const ssdInterval = setInterval(() => {
      setSsdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(ssdInterval);
          return 100;
        }
        return prev + 25;
      });
    }, 150);

    // HDD is slow because actuator arm must mechanically move & platters must spin
    const hddInterval = setInterval(() => {
      setHddProgress((prev) => {
        if (prev >= 100) {
          clearInterval(hddInterval);
          setIsRacing(false);
          setRaceFinished(true);
          playSuccess();
          setHasWon(true);
          reportComplete({ labId: "hdd-vs-ssd-speed-race" });
          return 100;
        }
        return prev + 7;
      });
    }, 200);
  };

  const handleReset = () => {
    playClick();
    setIsRacing(false);
    setHddProgress(0);
    setSsdProgress(0);
    setRaceFinished(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D Speed Race Mastered! The 3D SSD flash chips transferred the file instantly while the 3D HDD platters had to physically spin!"
          : !isRacing && !raceFinished
          ? "Step 1: Press 'START 3D SPEED RACE' to watch the 3D spinning magnetic platter race against the flash memory!"
          : isRacing
          ? "Observe the physical moving parts: HDD platter spinning & arm seeking vs instant silent SSD electronic pulses!"
          : "Benchmark complete! Solid-state memory eliminates mechanical moving parts for 10x speed!"
      }
      currentStep={raceFinished ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <button
              onClick={startRace}
              disabled={isRacing || raceFinished}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer border-2 transition-all ${
                raceFinished
                  ? "bg-[#059669] text-[#ecfdf5] border-[#34d399]"
                  : "bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-[#fef3c7] border-[#fef08a] ring-2 ring-[#fbbf24]"
              }`}
            >
              <Play size={16} className={isRacing ? "animate-spin" : "fill-[#fef08a]"} />
              <span>
                {isRacing
                  ? "Benchmarking 3D Storage..."
                  : raceFinished
                  ? "3D Race Complete ✓"
                  : "Start 3D Speed Race (500MB Asset)"}
              </span>
            </button>

            {/* Live Progress Bar Readouts */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-2.5 py-1 rounded-xl border border-[#d97706]/40">
                <span>HDD:</span>
                <span className="text-[#b45309]">{hddProgress}%</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#059669] bg-[#ecfdf5] px-2.5 py-1 rounded-xl border border-[#34d399]/40">
                <span>SSD:</span>
                <span className="text-[#059669]">{ssdProgress}%</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Test
            </button>
          </div>
        </div>
      }
    >
      {/* 3D HARDWARE DIAGNOSTIC ARENA */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Brass Header Plate */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <Gauge size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Storage Bench • Mechanical Spinning HDD vs Solid-State SSD
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] font-black text-[#451a03]">
            <span className="bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
              LEFT: 3D HDD (7200 RPM)
            </span>
            <span className="bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
              RIGHT: 3D SSD (NAND FLASH)
            </span>
          </div>
        </div>

        {/* 3D WEBGL CANVAS VIEWPORT */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          <Canvas camera={{ position: [0, 4.2, 5.5], fov: 42 }}>
            <ambientLight intensity={1.4} />
            <directionalLight position={[5, 10, 5]} intensity={1.8} color="#fef08a" />
            <pointLight position={[-3, 4, 2]} intensity={1.2} color="#38bdf8" />
            <pointLight position={[3, 4, 2]} intensity={1.2} color="#34d399" />

            {/* 3D Models */}
            <MechanicalHddMesh isRacing={isRacing} />
            <SolidStateSsdMesh isRacing={isRacing} />

            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 4}
            />
          </Canvas>
        </div>

        {/* Console Bottom Banner */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7] z-10">
          <span>
            Drag in the 3D scene to inspect the spinning platter and silicon NAND chips from any angle!
          </span>
          <span className="font-mono text-[#fbbf24]">
            LATENCY: {isRacing ? "BENCHMARKING..." : ssdProgress === 100 ? "SSD 0.05ms (10x FASTER)" : "READY"}
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D Storage Drive Mastered!"
        message="You explored the real 3D mechanics of spinning magnetic platters vs silent solid-state flash chips to understand why SSDs are so much faster!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
