"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { HeartPulse, Zap, RotateCcw, Box, Eye } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D SMARTWATCH SENSOR & PULSING BLOOD VESSEL ──
function PpgOpticalScene({
  ledActive,
  heartMode,
}: {
  ledActive: boolean;
  heartMode: "resting" | "active";
}) {
  const bloodVesselRef = useRef<THREE.Mesh>(null);
  const greenLightRef = useRef<THREE.PointLight>(null);

  // Pulse frequency: Resting = 1.2 Hz, Active = 2.1 Hz
  const pulseFreq = heartMode === "resting" ? 1.2 : 2.1;

  useFrame(() => {
    if (bloodVesselRef.current && ledActive) {
      // Systolic pulse expansion
      const pulseScale = 1.0 + Math.sin(Date.now() * 0.005 * pulseFreq) * 0.25;
      bloodVesselRef.current.scale.set(1.0, pulseScale, pulseScale);
    }
    if (greenLightRef.current) {
      greenLightRef.current.intensity = ledActive ? 2.5 : 0;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* 3D SMARTWATCH PUCK (Top Hanging Sensor) */}
      <group position={[0, 1.2, 0]} rotation={[Math.PI, 0, 0]}>
        {/* Titanium Case */}
        <mesh>
          <cylinderGeometry args={[1.5, 1.6, 0.35, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Central Glass Sensor Window */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.04, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>

        {/* Dual Green LED Diodes (525nm) */}
        {[-0.45, 0.45].map((x, i) => (
          <group key={i} position={[x, 0.2, 0]}>
            <mesh>
              <boxGeometry args={[0.18, 0.04, 0.18]} />
              <meshStandardMaterial
                color={ledActive ? "#34d399" : "#064e3b"}
                emissive={ledActive ? "#10b981" : "#000000"}
                emissiveIntensity={ledActive ? 2.0 : 0}
              />
            </mesh>
            {/* Downward Green Light Cone */}
            {ledActive && (
              <mesh position={[0, 0.6, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.4, 1.2, 16, 1, true]} />
                <meshStandardMaterial
                  color="#34d399"
                  transparent={true}
                  opacity={0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        ))}
        <pointLight ref={greenLightRef} position={[0, 0.8, 0]} color="#34d399" distance={2} />

        {/* Center Silicon Photodiode Sensor */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.22, 0.05, 0.22]} />
          <meshStandardMaterial color="#1c1917" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 3D SKIN TISSUE LAYER */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[4.8, 0.3, 3.2]} />
        <meshStandardMaterial
          color="#92400e"
          roughness={0.6}
          transparent={true}
          opacity={0.7}
        />
      </mesh>

      {/* 3D PULSING CAPILLARY BLOOD VESSEL (Subcutaneous) */}
      <mesh ref={bloodVesselRef} position={[0, -0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 4.4, 24]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#ef4444"
          emissiveIntensity={ledActive ? 0.6 : 0.2}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

export default function PpgHeartRateSensor() {
  const [ledActive, setLedActive] = useState(false);
  const [heartMode, setHeartMode] = useState<"resting" | "active">("resting");
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("ppg-heart-rate-sensor");

  const bpm = heartMode === "resting" ? 72 : 128;

  const toggleLed = () => {
    if (!ledActive) {
      playZap();
      setLedActive(true);
      if (!hasWon) {
        setTimeout(() => {
          playSuccess();
          setHasWon(true);
          reportComplete({ labId: "ppg-heart-rate-sensor" });
        }, 700);
      }
    } else {
      playClick();
      setLedActive(false);
    }
  };

  const handleToggleMode = (mode: "resting" | "active") => {
    playPop();
    setHeartMode(mode);
  };

  const handleReset = () => {
    playClick();
    setLedActive(false);
    setHeartMode("resting");
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D PPG Optical Sensor Mastered! In 3D, the green LEDs illuminated the skin and the pulsing blood vessel absorbed light with each beat!"
          : !ledActive
          ? "Step 1: Press 'ACTIVATE 3D GREEN LED' to shine optical light through the skin layer into the blood vessel!"
          : "3D green light beams active! Watch the 3D blood vessel pulse and absorb light synchronously with the heart rate!"
      }
      currentStep={ledActive ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLed}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer border-2 transition-all ${
                ledActive
                  ? "bg-[#059669] text-[#ecfdf5] border-[#34d399] ring-2 ring-[#a7f3d0]"
                  : "bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-[#fef3c7] border-[#fef08a]"
              }`}
            >
              <Zap size={16} className={ledActive ? "text-[#fef08a] fill-[#fef08a]" : ""} />
              <span>{ledActive ? "3D Green LEDs Active" : "Activate 3D Green LED (525nm)"}</span>
            </button>

            {/* Heart Mode Selector */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleToggleMode("resting")}
                className={`px-3 py-1.5 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer ${
                  heartMode === "resting"
                    ? "bg-[#059669] text-[#ecfdf5] shadow-xs"
                    : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40"
                }`}
              >
                Resting (72 BPM)
              </button>
              <button
                onClick={() => handleToggleMode("active")}
                className={`px-3 py-1.5 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer ${
                  heartMode === "active"
                    ? "bg-[#dc2626] text-[#fef2f2] shadow-xs"
                    : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40"
                }`}
              >
                Running (128 BPM)
              </button>
            </div>

            {/* Viewport Switcher Pill */}
            <div className="flex items-center gap-1 bg-[#fef3c7] p-1 rounded-xl border border-[#d97706]/40">
              <button
                onClick={() => {
                  playPop();
                  setViewMode("3d");
                }}
                className={`px-3 py-1 rounded-lg font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "3d"
                    ? "bg-[#d97706] text-[#451a03] shadow-xs"
                    : "text-[#92400e] hover:bg-[#fde68a]"
                }`}
              >
                <Box size={13} /> 3D Tissue
              </button>
              <button
                onClick={() => {
                  playPop();
                  setViewMode("2d");
                }}
                className={`px-3 py-1 rounded-lg font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "2d"
                    ? "bg-[#d97706] text-[#451a03] shadow-xs"
                    : "text-[#92400e] hover:bg-[#fde68a]"
                }`}
              >
                <Eye size={13} /> 2D Wave
              </button>
            </div>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1 rounded-xl border border-[#d97706]/40">
              Rate: {ledActive ? `${bpm} BPM (LIVE)` : "-- BPM (OFF)"}
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Sensor
            </button>
          </div>
        </div>
      }
    >
      {/* 3D PPG OPTICAL SENSOR BENCH */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <HeartPulse size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Wearable PPG Optical Heart Sensor • Subcutaneous Light Absorption
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
            OPTICAL EMISSION: 525nm GREEN
          </span>
        </div>

        {/* MAIN VIEWPORT: 3D TISSUE MODEL OR 2D CARDIAC WAVE */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          {viewMode === "3d" ? (
            /* 3D WEBGL PPG TISSUE CANVAS */
            <Canvas camera={{ position: [0, 1.8, 4.8], fov: 44 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fef08a" />
              <pointLight position={[-3, 3, 2]} intensity={1.2} color="#34d399" />
              <pointLight position={[3, 3, 2]} intensity={1.2} color="#f87171" />

              <PpgOpticalScene ledActive={ledActive} heartMode={heartMode} />

              <OrbitControls
                enableZoom={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
          ) : (
            /* 2D CARDIAC OSCILLOSCOPE */
            <div className="w-full h-full p-4 flex flex-col justify-between">
              <div className="p-3 rounded-xl bg-[#022c22] border-2 border-[#059669]">
                <div className="flex justify-between font-mono text-xs text-[#a7f3d0] pb-1 border-b border-[#047857]">
                  <span>Photodiode Waveform</span>
                  <span className="font-bold text-[#fef08a]">{ledActive ? `${bpm} BPM` : "IDLE"}</span>
                </div>
                <div className="h-20 flex items-center justify-center font-mono text-xs text-[#34d399]">
                  {ledActive
                    ? `Pulse Frequency: ${heartMode === "resting" ? "1.2 Hz" : "2.1 Hz"} • Hemoglobin Absorption Peak Active`
                    : "Activate green LEDs to measure reflectance wave"}
                </div>
              </div>
              <div className="text-[11px] font-mono text-[#fde68a] bg-[#1c1917] p-2 rounded-xl border border-[#78350f] text-center">
                Oxygenated blood absorbs green light. Every pulse of the heart changes reflected light levels!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7] z-10">
          <span>
            {viewMode === "3d"
              ? "Drag in 3D to orbit the smartwatch sensor and pulsing artery! Notice how blood absorbs the green light cones!"
              : "Review live cardiac pulse waveform and optical reflectance calculations!"}
          </span>
          <span className="font-mono text-[#fbbf24]">
            SENSOR: {ledActive ? "ONLINE" : "STANDBY"}
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D PPG Sensor Mastered!"
        message="You discovered how smartwatches shine green light into blood vessels to calculate live heart rate from optical absorption!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
