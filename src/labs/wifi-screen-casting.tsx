"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Cast, Wifi, RotateCcw, Box, Eye } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D PHONE, TV & FLYING PACKET SYSTEM ──
function ScreenCastingScene({
  isCasting,
  streamedFrames,
}: {
  isCasting: boolean;
  streamedFrames: number;
}) {
  const packetRef = useRef<THREE.Group>(null);
  const tvScreenRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // Animate packet cubes flying from phone (x: -2.5) to TV (x: 2.2)
    if (packetRef.current) {
      if (isCasting) {
        packetRef.current.position.x += delta * 7;
        packetRef.current.position.y = Math.sin(packetRef.current.position.x * 1.5) * 0.4 + 0.5;
        if (packetRef.current.position.x > 2.2) {
          packetRef.current.position.x = -2.5;
        }
      } else {
        packetRef.current.position.x = -2.5;
      }
    }
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* 3D SMARTPHONE MODEL (Left Side) */}
      <group position={[-2.4, 0.4, 0]} rotation={[0, 0.4, 0]}>
        {/* Phone Body */}
        <mesh>
          <boxGeometry args={[1.2, 2.2, 0.12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Phone Glowing Screen */}
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[1.05, 1.95, 0.02]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#38bdf8"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Camera Lens Bump */}
        <mesh position={[0, 0.9, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* 3D SMART TELEVISION (Right Side) */}
      <group position={[2.0, 0.6, 0]} rotation={[0, -0.25, 0]}>
        {/* TV Outer Bezel */}
        <mesh>
          <boxGeometry args={[3.6, 2.3, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* TV Display Screen */}
        <mesh ref={tvScreenRef} position={[0, 0, 0.09]}>
          <boxGeometry args={[3.4, 2.1, 0.02]} />
          <meshStandardMaterial
            color={streamedFrames > 0 ? "#059669" : "#1e293b"}
            emissive={streamedFrames > 0 ? "#10b981" : "#0f172a"}
            emissiveIntensity={streamedFrames > 0 ? 0.7 : 0.1}
            roughness={0.2}
          />
        </mesh>
        {/* TV Table Stand Feet */}
        <mesh position={[-1.2, -1.25, 0.1]}>
          <boxGeometry args={[0.15, 0.35, 0.8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh position={[1.2, -1.25, 0.1]}>
          <boxGeometry args={[0.15, 0.35, 0.8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* 3D FLYING WI-FI PACKET CUBES */}
      <group ref={packetRef} position={[-2.5, 0.5, 0]}>
        <mesh visible={isCasting}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#67e8f9"
            emissiveIntensity={1.2}
            transparent={true}
            opacity={0.85}
          />
        </mesh>
        <pointLight color="#38bdf8" intensity={isCasting ? 2.5 : 0} distance={1.8} />
      </group>
    </group>
  );
}

export default function WifiScreenCasting() {
  const [streamedFrames, setStreamedFrames] = useState<number>(0);
  const [isCasting, setIsCasting] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("wifi-screen-casting");

  const frames = [
    { title: "Stage 1: Rocket Liftoff", scene: "Flame Boost" },
    { title: "Stage 2: Space Orbit", scene: "Earth Horizon" },
    { title: "Stage 3: Moon Landing", scene: "Crater Touchdown" },
  ];

  const handleCastNextFrame = () => {
    if (streamedFrames >= 3 || isCasting) return;

    setIsCasting(true);
    playZap();

    setTimeout(() => {
      playPop();
      const nextCount = streamedFrames + 1;
      setStreamedFrames(nextCount);
      setIsCasting(false);

      if (nextCount === 3 && !hasWon) {
        playSuccess();
        setHasWon(true);
        reportComplete({ labId: "wifi-screen-casting" });
      }
    }, 700);
  };

  const handleReset = () => {
    playClick();
    setStreamedFrames(0);
    setIsCasting(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D Screen Casting Mastered! 3D Wi-Fi packet cubes flew through the air and decoded onto the 3D television!"
          : streamedFrames === 0
          ? "Step 1: Press 'CAST 3D PACKET' to watch compressed video packets fly through 3D space from phone to TV!"
          : streamedFrames < 3
          ? `Step ${streamedFrames + 1}: Cast Frame #${streamedFrames + 1} over the wireless network to beam it to the big TV screen!`
          : "Full motion broadcast active! You streamed video wirelessly over Wi-Fi packets!"
      }
      currentStep={streamedFrames}
      totalSteps={3}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCastNextFrame}
              disabled={streamedFrames >= 3 || isCasting}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer border-2 transition-all ${
                streamedFrames >= 3
                  ? "bg-[#059669] text-[#ecfdf5] border-[#34d399]"
                  : "bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#38bdf8] hover:to-[#0284c7] text-[#f0f9ff] border-[#bae6fd] ring-2 ring-[#7dd3fc]"
              }`}
            >
              <Cast size={17} className={isCasting ? "animate-pulse" : ""} />
              <span>
                {isCasting
                  ? "Beaming 3D Packet..."
                  : streamedFrames >= 3
                  ? "3D Cast Stream Complete ✓"
                  : `Cast Frame ${streamedFrames + 1} over Wi-Fi`}
              </span>
            </button>

            {/* View Mode Switcher Pill */}
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
                <Box size={13} /> 3D Space
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
                <Eye size={13} /> 2D Packets
              </button>
            </div>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              Wi-Fi 5GHz • Stream {streamedFrames}/3 Frames
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Stream
            </button>
          </div>
        </div>
      }
    >
      {/* SCREEN CASTING LIVING ROOM CONSOLE */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <Wifi size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Screen Casting Space • Wireless Video Packet Transmission
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
            RECEIVER: 1080P SMART TELEVISION
          </span>
        </div>

        {/* MAIN VIEWPORT: 3D SPACE OR 2D PACKET TELEMETRY */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          {viewMode === "3d" ? (
            /* 3D WEBGL PHONE & TV SPACE */
            <Canvas camera={{ position: [0, 2.2, 5.8], fov: 44 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fef08a" />
              <pointLight position={[-2.5, 3, 2]} intensity={1.2} color="#38bdf8" />
              <pointLight position={[2.5, 3, 2]} intensity={1.2} color="#34d399" />

              <ScreenCastingScene isCasting={isCasting} streamedFrames={streamedFrames} />

              <OrbitControls
                enableZoom={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
          ) : (
            /* 2D PACKET TELEMETRY */
            <div className="w-full h-full p-4 flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-3">
                {frames.map((f, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      streamedFrames > i
                        ? "bg-[#064e3b] border-[#10b981] text-[#a7f3d0]"
                        : "bg-[#292524] border-[#78350f] text-[#fef3c7]"
                    }`}
                  >
                    <div className="font-mono text-[10px] text-[#fbbf24] font-bold">
                      Packet Slice #{i + 1}
                    </div>
                    <div className="font-baloo font-black text-sm mt-1">{f.title}</div>
                    <div className="text-[10px] font-mono mt-2">
                      {streamedFrames > i ? "STATUS: DECODED ON TV ✓" : "STATUS: IN QUEUE"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] font-mono text-[#fde68a] bg-[#1c1917] p-2 rounded-xl border border-[#78350f] text-center">
                Screen casting splits video frames into compressed network packets streamed wirelessly over Wi-Fi radio waves!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7] z-10">
          <span>
            {viewMode === "3d"
              ? "Drag in 3D to orbit the room! Watch the glowing packet cubes fly from phone to TV!"
              : "Review packet compression queues and H.264 wireless streaming protocol!"}
          </span>
          <span className="font-mono text-[#fbbf24]">
            STREAM: {streamedFrames}/3 FRAMES (60 FPS)
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D Screen Casting Mastered!"
        message="You observed how video frames are split into 3D wireless packet cubes that travel through the air to reassemble seamlessly on TV screens!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
