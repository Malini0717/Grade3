"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ScanLine, RotateCcw, Box, Eye } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D CAPACITIVE PLATEN, DESCENDING FINGER & MINUTIAE BEACONS ──
function BiometricScannerScene({
  isPressingThumb,
  hasScannedMinutiae,
}: {
  isPressingThumb: boolean;
  hasScannedMinutiae: boolean;
}) {
  const fingerRef = useRef<THREE.Group>(null);
  const gridGlowRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (fingerRef.current) {
      // Finger descends down onto the glass when pressing
      const targetY = isPressingThumb ? 0.35 : 1.5;
      fingerRef.current.position.y = THREE.MathUtils.lerp(
        fingerRef.current.position.y,
        targetY,
        0.12
      );
    }
    if (gridGlowRef.current) {
      gridGlowRef.current.intensity = isPressingThumb ? 2.5 : 0.5;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Heavy Bronze Pedestal Base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[4.8, 0.5, 4.4]} />
        <meshStandardMaterial color="#451a03" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Capacitive Glass Platen Sensor */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.2, 0.08, 3.2]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Gold Conductive Grid Border Frame */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[3.3, 0.04, 3.3]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
      </mesh>
      <pointLight ref={gridGlowRef} position={[0, 0.5, 0]} color="#fbbf24" distance={2} />

      {/* 3D DESCENDING FINGER MODEL */}
      <group ref={fingerRef} position={[0, 1.5, 0]} rotation={[0.4, 0, 0]}>
        {/* Main Finger Segment */}
        <mesh position={[0, 0.8, -0.4]}>
          <capsuleGeometry args={[0.5, 1.4, 16, 16]} />
          <meshStandardMaterial color="#d97706" roughness={0.8} />
        </mesh>
        {/* Fingernail Plate */}
        <mesh position={[0, 0.9, -0.85]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.45, 0.6, 0.04]} />
          <meshStandardMaterial color="#fef08a" roughness={0.4} />
        </mesh>
      </group>

      {/* 4 3D FLOATING MINUTIAE TARGET BEACONS */}
      {hasScannedMinutiae && (
        <group position={[0, 0.1, 0]}>
          {[
            { x: -0.6, z: -0.5, color: "#f87171" }, // Ending
            { x: 0.5, z: -0.2, color: "#38bdf8" }, // Bifurcation
            { x: -0.7, z: 0.6, color: "#38bdf8" },  // Bifurcation
            { x: 0.6, z: 0.7, color: "#f87171" },   // Ending
          ].map((pt, i) => (
            <group key={i} position={[pt.x, 0, pt.z]}>
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
                <meshStandardMaterial color={pt.color} emissive={pt.color} emissiveIntensity={1.2} />
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={pt.color} emissive={pt.color} emissiveIntensity={1.5} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}

export default function CapacitiveFingerprintMinutiae() {
  const [isPressingThumb, setIsPressingThumb] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hasScannedMinutiae, setHasScannedMinutiae] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("capacitive-fingerprint-minutiae");

  const minutiaePoints = [
    { id: 1, x: 80, y: 55, type: "Ending", color: "#f87171" },
    { id: 2, x: 120, y: 70, type: "Bifurcation", color: "#38bdf8" },
    { id: 3, x: 70, y: 110, type: "Bifurcation", color: "#38bdf8" },
    { id: 4, x: 135, y: 125, type: "Ending", color: "#f87171" },
  ];

  const handlePressThumb = () => {
    setIsPressingThumb(true);
    playZap();

    setTimeout(() => {
      playPop();
      setHasScannedMinutiae(true);
      if (!hasWon) {
        playSuccess();
        setHasWon(true);
        reportComplete({ labId: "capacitive-fingerprint-minutiae" });
      }
    }, 700);
  };

  const handleReset = () => {
    playClick();
    setIsPressingThumb(false);
    setHasScannedMinutiae(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D Minutiae Biometrics Mastered! The 3D finger descended onto the capacitive platen, mapping ridge ending and bifurcation coordinates without saving raw photos!"
          : !hasScannedMinutiae
          ? "Step 1: Press 'PLACE 3D THUMB ON GLASS' to watch the finger descend and discharge the micro-capacitors!"
          : "3D minutiae beacons extracted! Notice how biometric systems store coordinate points rather than finger images for privacy!"
      }
      currentStep={hasScannedMinutiae ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePressThumb}
              disabled={isPressingThumb && hasScannedMinutiae}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer border-2 transition-all ${
                hasScannedMinutiae
                  ? "bg-[#059669] text-[#ecfdf5] border-[#34d399]"
                  : "bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-[#fef3c7] border-[#fef08a]"
              }`}
            >
              <ScanLine size={16} className={isPressingThumb ? "animate-pulse" : ""} />
              <span>{hasScannedMinutiae ? "3D Minutiae Vectors Extracted ✓" : "Place 3D Thumb on Glass"}</span>
            </button>

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
                <Box size={13} /> 3D Scanner
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
                <Eye size={13} /> 2D Vector Map
              </button>
            </div>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              Security: {hasScannedMinutiae ? "4 MINUTIAE VECTORS (PRIVATE) ✓" : "CAPACITANCE IDLE"}
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Clear Platen
            </button>
          </div>
        </div>
      }
    >
      {/* 3D CAPACITIVE SCANNER BENCH */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <ScanLine size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Capacitive Biometric Sensor • Skin Ridge Minutiae Extraction
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
            PRIVACY GUARANTEE: ZERO RAW IMAGES STORED
          </span>
        </div>

        {/* MAIN VIEWPORT: 3D PLATEN CANVAS OR 2D VECTOR TABLE */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          {viewMode === "3d" ? (
            /* 3D WEBGL BIOMETRIC SCANNER CANVAS */
            <Canvas camera={{ position: [0, 2.8, 5.0], fov: 44 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fef08a" />
              <pointLight position={[-3, 4, 2]} intensity={1.2} color="#fbbf24" />
              <pointLight position={[3, 4, 2]} intensity={1.2} color="#38bdf8" />

              <BiometricScannerScene
                isPressingThumb={isPressingThumb}
                hasScannedMinutiae={hasScannedMinutiae}
              />

              <OrbitControls
                enableZoom={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
          ) : (
            /* 2D MINUTIAE VECTOR TABLE */
            <div className="w-full h-full p-4 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-3">
                {minutiaePoints.map((pt) => (
                  <div
                    key={pt.id}
                    className="p-3 rounded-xl bg-[#1c1917] border border-[#78350f] flex justify-between items-center"
                  >
                    <div>
                      <div className="font-baloo font-black text-xs text-[#a7f3d0]">
                        Minutiae Point #{pt.id}
                      </div>
                      <div className="font-mono text-[10px] text-[#fbbf24]">
                        Type: {pt.type} (Ridge Feature)
                      </div>
                    </div>
                    <div className="font-mono text-sm font-black text-[#fef08a]">
                      ({pt.x}, {pt.y})
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] font-mono text-[#fde68a] bg-[#1c1917] p-2 rounded-xl border border-[#78350f] text-center">
                Capacitive sensors measure micro-charges where skin touches glass. Only coordinate minutiae are saved!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7] z-10">
          <span>
            {viewMode === "3d"
              ? "Drag in 3D to orbit the platen! Press the thumb button to watch the finger descend and the 3D beacons rise!"
              : "Review stored mathematical vector coordinate list maintaining user privacy!"}
          </span>
          <span className="font-mono text-[#fbbf24]">
            SCANNER: {hasScannedMinutiae ? "AUTHORIZED" : "STANDBY"}
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D Capacitive Minutiae Mastered!"
        message="You discovered how 3D capacitive sensors detect tiny electrical charge deltas to extract minutiae coordinates instead of storing raw photos!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
