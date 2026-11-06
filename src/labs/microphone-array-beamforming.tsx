"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Mic, RotateCcw, Box, Eye } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D SMART SPEAKER ACOUSTIC BEAMFORMING CONE ──
function SmartSpeakerScene({
  beamAngle,
  isAimedAtVoice,
}: {
  beamAngle: number;
  isAimedAtVoice: boolean;
}) {
  const beamRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (beamRef.current) {
      // Rotate beam cone around Y-axis
      const rad = (beamAngle * Math.PI) / 180;
      beamRef.current.rotation.y = THREE.MathUtils.lerp(
        beamRef.current.rotation.y,
        rad,
        0.1
      );
    }
    if (ringRef.current) {
      (ringRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        isAimedAtVoice ? 1.5 : 0.2;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* Wooden Table Top */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[3.2, 3.4, 0.2, 32]} />
        <meshStandardMaterial color="#451a03" roughness={0.5} />
      </mesh>

      {/* 3D SMART SPEAKER PILLAR */}
      <group position={[0, 0.8, 0]}>
        {/* Acoustic Fabric Cylinder */}
        <mesh>
          <cylinderGeometry args={[0.9, 0.9, 1.6, 32]} />
          <meshStandardMaterial color="#292524" roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Top Control Bezel */}
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.88, 0.88, 0.05, 32]} />
          <meshStandardMaterial color="#1c1917" metalness={0.8} />
        </mesh>

        {/* Halo Wake-Word Glow Ring */}
        <mesh ref={ringRef} position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.78, 0.05, 16, 32]} />
          <meshStandardMaterial
            color={isAimedAtVoice ? "#34d399" : "#f59e0b"}
            emissive={isAimedAtVoice ? "#10b981" : "#d97706"}
            emissiveIntensity={isAimedAtVoice ? 1.5 : 0.2}
          />
        </mesh>

        {/* 4 Directional Microphone Capsules */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rad, i) => (
          <mesh
            key={i}
            position={[Math.cos(rad) * 0.6, 0.86, Math.sin(rad) * 0.6]}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </mesh>
        ))}

        {/* ROTATING 3D DIRECTIONAL ACOUSTIC BEAM CONE */}
        <group ref={beamRef}>
          <mesh position={[0, 0.4, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.2, 2.8, 24, 1, true]} />
            <meshStandardMaterial
              color={isAimedAtVoice ? "#34d399" : "#fbbf24"}
              transparent={true}
              opacity={0.45}
              side={THREE.DoubleSide}
              emissive={isAimedAtVoice ? "#10b981" : "#d97706"}
              emissiveIntensity={isAimedAtVoice ? 0.8 : 0.2}
            />
          </mesh>
        </group>
      </group>

      {/* Target Voice Marker Sphere (at 45°) */}
      <group position={[1.8, 1.2, 1.8]}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#34d399" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Background Noise Source Sphere (at 225°) */}
      <group position={[-1.8, 1.2, -1.8]}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#ea580c" emissive="#f87171" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export default function MicrophoneArrayBeamforming() {
  const [beamAngle, setBeamAngle] = useState<number>(180);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hasIsolatedVoice, setHasIsolatedVoice] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess } = useLabAudio();
  const { reportComplete } = useLMSBridge("microphone-array-beamforming");

  const isAimedAtVoice = Math.abs(beamAngle - 45) <= 15;
  const isAimedAtNoise = Math.abs(beamAngle - 225) <= 30;

  const handleAimBeam = (deg: number) => {
    playPop();
    setBeamAngle(deg);

    if (Math.abs(deg - 45) <= 15 && !hasIsolatedVoice) {
      setHasIsolatedVoice(true);
      if (!hasWon) {
        setTimeout(() => {
          playSuccess();
          setHasWon(true);
          reportComplete({ labId: "microphone-array-beamforming" });
        }, 500);
      }
    }
  };

  const handleReset = () => {
    playClick();
    setBeamAngle(180);
    setHasIsolatedVoice(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D Beamforming Mastered! The 3D microphone array cone locked onto the voice at 45°, illuminating the glowing green halo ring!"
          : !hasIsolatedVoice
          ? "Step 1: Steer the 3D acoustic cone to 45° to isolate the voice and trigger the smart speaker halo ring!"
          : "Voice locked! Notice how steering the acoustic beam in 3D amplifies speech while canceling room noise!"
      }
      currentStep={hasIsolatedVoice ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
              Steer 3D Beam:
            </span>
            {[0, 45, 90, 180, 225, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => handleAimBeam(deg)}
                className={`px-2.5 py-1 rounded-xl font-mono text-xs font-black transition-all cursor-pointer ${
                  beamAngle === deg
                    ? deg === 45
                      ? "bg-[#059669] text-[#ecfdf5] shadow-md ring-2 ring-[#34d399]"
                      : "bg-[#d97706] text-[#451a03] shadow-md ring-2 ring-[#fbbf24]"
                    : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
                }`}
              >
                {deg}° {deg === 45 ? "(Voice)" : deg === 225 ? "(Blender)" : ""}
              </button>
            ))}

            {/* Viewport Mode Switcher Pill */}
            <div className="flex items-center gap-1 bg-[#fef3c7] p-1 rounded-xl border border-[#d97706]/40 ml-2">
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
                <Box size={13} /> 3D Chamber
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
                <Eye size={13} /> 2D Polar
              </button>
            </div>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-2.5 py-1 rounded-xl border border-[#d97706]/40">
              SNR: {isAimedAtVoice ? "+24 dB (LOCKED)" : isAimedAtNoise ? "-18 dB (REJECTED)" : "+4 dB"}
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Beam
            </button>
          </div>
        </div>
      }
    >
      {/* 3D SMART SPEAKER ACOUSTIC BENCH */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <Mic size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Microphone Array Beamforming • Phased Acoustic Cone Steering
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
            RING STATUS: {isAimedAtVoice ? "WAKE-WORD ACTIVE ✓" : "LISTENING"}
          </span>
        </div>

        {/* MAIN VIEWPORT: 3D ACOUSTIC SPACE OR 2D POLAR DIAGRAM */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          {viewMode === "3d" ? (
            /* 3D WEBGL SMART SPEAKER CANVAS */
            <Canvas camera={{ position: [0, 2.8, 5.2], fov: 44 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fef08a" />
              <pointLight position={[-3, 4, 2]} intensity={1.2} color="#38bdf8" />
              <pointLight position={[3, 4, 2]} intensity={1.2} color="#10b981" />

              <SmartSpeakerScene
                beamAngle={beamAngle}
                isAimedAtVoice={isAimedAtVoice}
              />

              <OrbitControls
                enableZoom={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
          ) : (
            /* 2D POLAR RADAR PLOT */
            <div className="w-full h-full p-4 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[#1c1917] border border-[#78350f]">
                  <div className="font-baloo font-black text-xs text-[#a7f3d0]">Target Direction</div>
                  <div className="font-mono text-xl font-black text-[#fef08a] mt-1">45° (Voice Target)</div>
                  <div className="text-[10px] font-mono text-[#a7f3d0] mt-2">
                    {isAimedAtVoice ? "Beam aligned! Full acoustic amplification ✓" : "Steer beam to 45°"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#1c1917] border border-[#78350f]">
                  <div className="font-baloo font-black text-xs text-[#fca5a5]">Noise Rejection</div>
                  <div className="font-mono text-xl font-black text-[#f87171] mt-1">225° (Blender Noise)</div>
                  <div className="text-[10px] font-mono text-[#fde68a] mt-2">
                    Phase cancellation suppresses background noise
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-mono text-[#fde68a] bg-[#1c1917] p-2 rounded-xl border border-[#78350f] text-center">
                Microphone arrays measure tiny microsecond delays between capsules to digitally steer listening cones!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7] z-10">
          <span>
            {viewMode === "3d"
              ? "Drag in 3D to orbit the speaker. Notice how the glowing acoustic cone steers in 3D space to lock on the green voice sphere!"
              : "Review phased array time-of-arrival mathematical calculations!"}
          </span>
          <span className="font-mono text-[#fbbf24]">
            HEADING: {beamAngle}°
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D Beamforming Mastered!"
        message="You discovered how smart speaker microphone arrays use 3D acoustic cone steering to lock onto voices and cancel background noise!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
