"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Binary, Wind, Thermometer, RotateCcw, Box, Eye } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D WEATHER STATION PROBE & FLASH ADC CHIP ──
function WeatherAdcScene({
  analogSignal,
  binaryString,
}: {
  analogSignal: number;
  binaryString: string;
}) {
  const anemometerRef = useRef<THREE.Group>(null);
  const mercuryRef = useRef<THREE.Mesh>(null);

  // Rotor spin speed proportional to voltage (0V to 5V)
  const rotorSpeed = analogSignal * 4;

  useFrame((_, delta) => {
    if (anemometerRef.current) {
      anemometerRef.current.rotation.y += delta * rotorSpeed;
    }
    if (mercuryRef.current) {
      const targetHeight = (analogSignal / 5.0) * 1.6 + 0.1;
      mercuryRef.current.scale.y = THREE.MathUtils.lerp(
        mercuryRef.current.scale.y,
        targetHeight,
        0.1
      );
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Wooden Weather Platform */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[6.8, 0.25, 4.4]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} />
      </mesh>

      {/* 3D ROTATING WIND TURBINE ANEMOMETER (Left Side) */}
      <group position={[-2.2, 0, 0]}>
        {/* Mast Base */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 1.2, 16]} />
          <meshStandardMaterial color="#78350f" metalness={0.7} />
        </mesh>
        {/* 3-Cup Rotor Assembly */}
        <group ref={anemometerRef} position={[0, 1.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#b45309" metalness={0.9} />
          </mesh>
          {/* 3 Arms with Hemispherical Cups */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rad, i) => (
            <group key={i} rotation={[0, rad, 0]}>
              <mesh position={[0.4, 0, 0]}>
                <boxGeometry args={[0.8, 0.04, 0.04]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
              <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <sphereGeometry args={[0.18, 16, 16, 0, Math.PI]} />
                <meshStandardMaterial color="#d97706" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 3D MERCURY TEMPERATURE SENSOR (Center) */}
      <group position={[-0.4, 0.8, 0]}>
        {/* Glass Outer Shield */}
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent={true}
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>
        {/* Liquid Mercury Cylinder */}
        <mesh ref={mercuryRef} position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 1.0, 16]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive="#ef4444"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Bottom Bulb */}
        <mesh position={[0, -0.85, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 3D ADC FLASH CONVERTER CHIP & 4 LED BITS (Right Side) */}
      <group position={[1.8, 0.2, 0]}>
        {/* Silicon DIP Chip */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 0.25, 2.4]} />
          <meshStandardMaterial color="#1c1917" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* 4 Glowing Binary Output LEDs */}
        {[3, 2, 1, 0].map((bitIdx) => {
          const bitVal = binaryString[3 - bitIdx];
          const isOn = bitVal === "1";
          const zPos = -0.75 + bitIdx * 0.5;
          return (
            <group key={bitIdx} position={[1.05, 0.1, zPos]}>
              <mesh>
                <sphereGeometry args={[0.14, 16, 16]} />
                <meshStandardMaterial
                  color={isOn ? "#fef08a" : "#064e3b"}
                  emissive={isOn ? "#10b981" : "#000000"}
                  emissiveIntensity={isOn ? 1.5 : 0}
                />
              </mesh>
              <pointLight color="#10b981" intensity={isOn ? 1.8 : 0} distance={1.2} />
            </group>
          );
        })}
      </group>
    </group>
  );
}

export default function AnalogToDigitalConverter() {
  const [analogSignal, setAnalogSignal] = useState<number>(3.2);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hasSampledHigh, setHasSampledHigh] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess } = useLabAudio();
  const { reportComplete } = useLMSBridge("analog-to-digital-converter");

  const digitalValue = Math.min(15, Math.floor((analogSignal / 5.0) * 16));
  const binaryString = digitalValue.toString(2).padStart(4, "0");

  const handleSignalChange = (val: number) => {
    playPop();
    setAnalogSignal(val);
    if (val >= 4.2 && !hasSampledHigh) {
      setHasSampledHigh(true);
      if (!hasWon) {
        playSuccess();
        setHasWon(true);
        reportComplete({ labId: "analog-to-digital-converter" });
      }
    }
  };

  const handleReset = () => {
    playClick();
    setAnalogSignal(3.2);
    setHasSampledHigh(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D ADC Conversion Mastered! The 3D wind rotor and temperature probe converted smooth voltages into 4-bit binary LEDs!"
          : !hasSampledHigh
          ? "Step 1: Slide the natural voltage probe above 4.2V to accelerate the 3D turbine and illuminate the binary LEDs!"
          : "ADC active! Notice how continuous physical nature becomes discrete digital numbers!"
      }
      currentStep={hasSampledHigh ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
                Analog Voltage:
              </span>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={analogSignal}
                onChange={(e) => handleSignalChange(parseFloat(e.target.value))}
                className="w-32 accent-[#d97706] cursor-pointer"
              />
              <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#d97706]/40">
                {analogSignal.toFixed(1)}V
              </span>
            </div>

            {/* Viewport Mode Switcher Pill */}
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
                <Box size={13} /> 3D Station
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
                <Eye size={13} /> 2D Bits
              </button>
            </div>

            <span className="font-mono text-xs font-black text-[#059669] bg-[#ecfdf5] px-3 py-1 rounded-xl border border-[#34d399]/40">
              Binary: [{binaryString}] ({digitalValue}/15)
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Probe
            </button>
          </div>
        </div>
      }
    >
      {/* WEATHER ADC BENCH */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <Binary size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Analog-to-Digital Converter (ADC) • Environmental Sensor Interface
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
            QUANTIZED: 4-BIT WORD [{binaryString}]
          </span>
        </div>

        {/* MAIN VIEWPORT: 3D FIELD STATION OR 2D BIT LADDER */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          {viewMode === "3d" ? (
            /* 3D WEBGL WEATHER PROBE CANVAS */
            <Canvas camera={{ position: [0, 2.5, 5.2], fov: 44 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fef08a" />
              <pointLight position={[-2.5, 3, 2]} intensity={1.2} color="#38bdf8" />
              <pointLight position={[2.5, 3, 2]} intensity={1.2} color="#10b981" />

              <WeatherAdcScene analogSignal={analogSignal} binaryString={binaryString} />

              <OrbitControls
                enableZoom={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
          ) : (
            /* 2D COMPARATOR BIT LADDER */
            <div className="w-full h-full p-4 flex flex-col justify-between">
              <div className="grid grid-cols-4 gap-3">
                {[3, 2, 1, 0].map((bitIdx) => {
                  const bitVal = binaryString[3 - bitIdx];
                  const isOn = bitVal === "1";
                  return (
                    <div
                      key={bitIdx}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        isOn
                          ? "bg-[#064e3b] border-[#10b981] text-[#a7f3d0] shadow-md"
                          : "bg-[#1c1917] border-[#78350f] text-[#fef3c7]"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full mb-1 ${isOn ? "bg-[#fef08a] shadow-sm animate-pulse" : "bg-[#451a03]"}`} />
                      <span className="font-mono text-xs font-black">Bit {bitIdx}</span>
                      <span className="font-mono text-2xl font-black">{bitVal}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-[11px] font-mono text-[#fde68a] bg-[#1c1917] p-2 rounded-xl border border-[#78350f] text-center">
                Natural signals have infinite smooth variation (analog). Computers sample them into discrete binary numbers (digital)!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7] z-10">
          <span>
            {viewMode === "3d"
              ? "Drag in 3D to orbit the weather station. Slide the voltage slider to see the turbine spin and the 4-bit LEDs update!"
              : "Review 4-bit binary comparator ladder decoding continuous voltages!"}
          </span>
          <span className="font-mono text-[#fbbf24]">
            CONVERTER: ACTIVE
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D ADC Conversion Mastered!"
        message="You discovered how physical sensors translate smooth nature into discrete binary numbers through 3D rotors and comparator chips!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
