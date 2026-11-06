"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Thermometer, RotateCcw, BatteryCharging, Box, Eye } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D THERMAL CPU & HEAT SINK FAN MODEL ──
function ThermalCpuCooler({
  temperature,
  isThrottlingActive,
}: {
  temperature: number;
  isThrottlingActive: boolean;
}) {
  const fanRef = useRef<THREE.Group>(null);
  const heatLidRef = useRef<THREE.Mesh>(null);

  // Fan spin speed proportional to temperature
  const fanSpeed = (temperature / 30) * 12;

  useFrame((_, delta) => {
    if (fanRef.current) {
      fanRef.current.rotation.y += delta * fanSpeed;
    }
    if (heatLidRef.current) {
      // Color lerp based on temperature
      const targetColor = new THREE.Color(
        temperature >= 70 ? "#ef4444" : temperature >= 50 ? "#f59e0b" : "#10b981"
      );
      (heatLidRef.current.material as THREE.MeshStandardMaterial).emissive.lerp(targetColor, 0.1);
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Motherboard Socket Platform */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[4.8, 0.2, 4.8]} />
        <meshStandardMaterial color="#064e3b" roughness={0.5} />
      </mesh>

      {/* CPU Silicon Substrate & Heat-Spreader */}
      <mesh ref={heatLidRef} position={[0, 0.1, 0]}>
        <boxGeometry args={[2.0, 0.2, 2.0]} />
        <meshStandardMaterial
          color="#1c1917"
          metalness={0.8}
          roughness={0.2}
          emissive={temperature >= 70 ? "#ef4444" : "#10b981"}
          emissiveIntensity={isThrottlingActive ? 1.0 : 0.4}
        />
      </mesh>

      {/* 4 Curved Polished Copper Heat Pipes */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <group key={i} position={[x, 0.3, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
            <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.8, 0.4]} rotation={[0.6, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.9, 16]} />
            <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Aluminum Radiator Fin Stack */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 0.6 + i * 0.12, 0.8]}>
          <boxGeometry args={[2.4, 0.04, 1.6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* 3D Axial Cooling Fan on the Radiator */}
      <group ref={fanRef} position={[0, 1.1, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Fan Hub */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 24]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* 6 Fan Blades */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <mesh key={deg} rotation={[0, (deg * Math.PI) / 180, 0.3]} position={[0, 0, 0]}>
            <boxGeometry args={[0.2, 0.04, 1.1]} />
            <meshStandardMaterial color="#334155" metalness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function ThermalThrottlingProtection() {
  const [chargingWattage, setChargingWattage] = useState<10 | 35 | 65>(10);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hasThrottled, setHasThrottled] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("thermal-throttling-protection");

  const temperature = chargingWattage === 10 ? 38 : chargingWattage === 35 ? 58 : 78;
  const isThrottlingActive = temperature >= 70;
  const cpuClockGhz = isThrottlingActive ? 1.4 : chargingWattage === 35 ? 2.8 : 3.2;

  const handleSetWattage = (watts: 10 | 35 | 65) => {
    playPop();
    setChargingWattage(watts);

    if (watts === 65) {
      playZap();
      setHasThrottled(true);
      if (!hasWon) {
        setTimeout(() => {
          playSuccess();
          setHasWon(true);
          reportComplete({ labId: "thermal-throttling-protection" });
        }, 600);
      }
    }
  };

  const handleReset = () => {
    playClick();
    setChargingWattage(10);
    setHasThrottled(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D Thermal Safety Mastered! Under 65W, the 3D CPU glowed red and the fan spun at max speed, prompting the governor to throttle clock speed to 1.4 GHz!"
          : !hasThrottled
          ? "Step 1: Increase Charging Power to '65W Superfast' to watch heat build up in 3D and trigger thermal throttling!"
          : "Thermal governor active! Clock speed throttled to cool the processor and protect the lithium battery!"
      }
      currentStep={hasThrottled ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
              Charging Power:
            </span>
            {([10, 35, 65] as const).map((w) => (
              <button
                key={w}
                onClick={() => handleSetWattage(w)}
                className={`px-3 py-1.5 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  chargingWattage === w
                    ? w === 65
                      ? "bg-[#dc2626] text-[#fef2f2] shadow-md ring-2 ring-[#fca5a5]"
                      : "bg-[#d97706] text-[#451a03] shadow-md ring-2 ring-[#fbbf24]"
                    : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
                }`}
              >
                <BatteryCharging size={14} /> {w}W {w === 65 ? "(Superfast)" : w === 35 ? "(Fast)" : "(Standard)"}
              </button>
            ))}

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
                <Box size={13} /> 3D Cooler
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
                <Eye size={13} /> 2D Gauges
              </button>
            </div>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              Clock: {cpuClockGhz} GHz {isThrottlingActive ? "(THROTTLED -56%)" : "(FULL SPEED)"}
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Cool to 10W
            </button>
          </div>
        </div>
      }
    >
      {/* THERMAL STRESS BENCH */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <Thermometer size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Thermal Chamber • Copper Heat Pipes & Dynamic Throttling Governor
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
            DIE TEMPERATURE: {temperature}°C
          </span>
        </div>

        {/* MAIN VIEWPORT: 3D HEAT SINK OR 2D GAUGES */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          {viewMode === "3d" ? (
            /* 3D WEBGL COOLER & FAN CANVAS */
            <Canvas camera={{ position: [0, 2.5, 4.8], fov: 44 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fef08a" />
              <pointLight position={[-3, 4, 2]} intensity={1.2} color="#f59e0b" />
              <pointLight position={[3, 4, 2]} intensity={1.2} color="#ef4444" />

              <ThermalCpuCooler
                temperature={temperature}
                isThrottlingActive={isThrottlingActive}
              />

              <OrbitControls
                enableZoom={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
          ) : (
            /* 2D TELEMETRY GAUGES */
            <div className="w-full h-full p-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#1c1917] border border-[#78350f] flex flex-col justify-between">
                <div className="font-baloo font-black text-xs text-[#fef3c7]">Core Heat Sensor</div>
                <div className="font-mono text-3xl font-black text-[#fef08a]">{temperature}°C</div>
                <div className="text-[10px] font-mono text-[#fde68a]">
                  {temperature >= 70 ? "CRITICAL HEAT SPIKE" : "NORMAL TEMPERATURE"}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#1c1917] border border-[#78350f] flex flex-col justify-between">
                <div className="font-baloo font-black text-xs text-[#a7f3d0]">Clock Governor</div>
                <div className="font-mono text-3xl font-black text-[#6ee7b7]">{cpuClockGhz} GHz</div>
                <div className="text-[10px] font-mono text-[#a7f3d0]">
                  {isThrottlingActive ? "THROTTLED (-56%)" : "BOOST PROFILE"}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#1c1917] border border-[#78350f] flex flex-col justify-between">
                <div className="font-baloo font-black text-xs text-[#fef3c7]">Battery Health</div>
                <div className="font-mono text-xl font-black text-[#fef08a]">
                  {isThrottlingActive ? "PROTECTED ✓" : "CHARGING"}
                </div>
                <div className="text-[10px] font-mono text-[#fde68a]">
                  Throttling protects lithium-ion chemistry
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7] z-10">
          <span>
            {viewMode === "3d"
              ? "Drag in 3D to orbit the copper heat pipes! Watch the CPU glow red and the cooler fan speed up under 65W!"
              : "Review core thermistor telemetry and battery protection limits!"}
          </span>
          <span className="font-mono text-[#fbbf24]">
            GOVERNOR: {isThrottlingActive ? "ENGAGED" : "MONITORING"}
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D Thermal Throttling Mastered!"
        message="You explored the 3D physics of copper heat pipes, cooler fan RPM, and CPU clock throttling designed to protect battery cells from heat damage!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
