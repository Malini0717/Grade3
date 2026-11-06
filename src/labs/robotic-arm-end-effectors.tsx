"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Wrench, RotateCcw, Magnet, CircleDot, Hand } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

// ── 3D ARTICULATED ROBOT ARM WITH INTERCHANGEABLE END-EFFECTOR ──
function RobotArmAssembly({
  selectedTool,
  targetItem,
  isLifting,
}: {
  selectedTool: "suction" | "magnet" | "claw";
  targetItem: "glass" | "steel" | "egg" | null;
  isLifting: boolean;
}) {
  const armGroupRef = useRef<THREE.Group>(null);
  const elbowRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (armGroupRef.current) {
      // Rotate base toward active item target
      const targetAngle = targetItem === "glass" ? -0.6 : targetItem === "steel" ? 0 : targetItem === "egg" ? 0.6 : 0;
      armGroupRef.current.rotation.y = THREE.MathUtils.lerp(armGroupRef.current.rotation.y, targetAngle, 0.08);
    }
    if (elbowRef.current) {
      // Dip down when lifting
      const dipAngle = isLifting ? 0.7 : 0.2;
      elbowRef.current.rotation.x = THREE.MathUtils.lerp(elbowRef.current.rotation.x, dipAngle, 0.1);
    }
  });

  return (
    <group position={[0, -1.0, 0]}>
      {/* Heavy Base Flange */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
        <meshStandardMaterial color="#1c1917" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rotating Turntable Base */}
      <group ref={armGroupRef} position={[0, 0.2, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
          <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Shoulder Joint Pivot */}
        <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.9, 24]} />
          <meshStandardMaterial color="#78350f" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Lower Arm Boom */}
        <mesh position={[0, 1.5, 0.3]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.4, 1.6, 0.35]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Elbow Joint & Forearm */}
        <group ref={elbowRef} position={[0, 2.2, 0.6]}>
          {/* Elbow Joint Cylinders */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.7, 24]} />
            <meshStandardMaterial color="#78350f" metalness={0.9} />
          </mesh>

          {/* Forearm Boom */}
          <mesh position={[0, 0.6, 0.4]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.3, 1.2, 0.25]} />
            <meshStandardMaterial color="#d97706" metalness={0.7} />
          </mesh>

          {/* Wrist Quick-Disconnect Chuck */}
          <group position={[0, 1.1, 0.8]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.2, 16]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} />
            </mesh>

            {/* ATTACHED 3D END-EFFECTOR TOOL */}
            {selectedTool === "suction" && (
              /* Vacuum Suction Cup Tool */
              <group position={[0, 0, 0.25]}>
                <mesh position={[0, 0, 0.05]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.25, 16]} />
                  <meshStandardMaterial color="#0284c7" />
                </mesh>
                <mesh position={[0, 0, 0.2]}>
                  <cylinderGeometry args={[0.35, 0.15, 0.18, 24]} />
                  <meshStandardMaterial color="#38bdf8" roughness={0.7} />
                </mesh>
              </group>
            )}

            {selectedTool === "magnet" && (
              /* Heavy Electromagnet Tool */
              <group position={[0, 0, 0.25]}>
                <mesh position={[0, 0, 0.08]}>
                  <cylinderGeometry args={[0.35, 0.35, 0.2, 24]} />
                  <meshStandardMaterial color="#dc2626" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.2]}>
                  <cylinderGeometry args={[0.25, 0.25, 0.1, 24]} />
                  <meshStandardMaterial color="#b45309" metalness={0.95} />
                </mesh>
              </group>
            )}

            {selectedTool === "claw" && (
              /* Soft Silicone Gripper Claw Tool */
              <group position={[0, 0, 0.25]}>
                {/* Left Finger */}
                <mesh position={[-0.2, 0, 0.2]} rotation={[0, 0.3, 0]}>
                  <boxGeometry args={[0.08, 0.12, 0.4]} />
                  <meshStandardMaterial color="#059669" roughness={0.6} />
                </mesh>
                {/* Right Finger */}
                <mesh position={[0.2, 0, 0.2]} rotation={[0, -0.3, 0]}>
                  <boxGeometry args={[0.08, 0.12, 0.4]} />
                  <meshStandardMaterial color="#059669" roughness={0.6} />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>

      {/* 3 WORKCELL CONVEYOR TRAYS & OBJECTS */}
      {/* Target 1: Glass Plate */}
      <group position={[-2.2, 0.15, 1.2]}>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 24]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.9, 0.08, 0.9]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent={true}
            opacity={0.7}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Target 2: Steel I-Beam */}
      <group position={[0, 0.15, 1.8]}>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 24]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.3, 0.25, 0.35]} />
          <meshStandardMaterial color="#78716c" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Target 3: Delicate Egg */}
      <group position={[2.2, 0.15, 1.2]}>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 24]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 0.2, 0]} scale={[1, 1.3, 1]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color="#fef08a" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export default function RoboticArmEndEffectors() {
  const [selectedTool, setSelectedTool] = useState<"suction" | "magnet" | "claw">("suction");
  const [targetItem, setTargetItem] = useState<"glass" | "steel" | "egg" | null>(null);
  const [isLifting, setIsLifting] = useState(false);
  const [liftedItems, setLiftedItems] = useState<{ glass: boolean; steel: boolean; egg: boolean }>({
    glass: false,
    steel: false,
    egg: false,
  });
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("robotic-arm-end-effectors");

  const handleLiftItem = (item: "glass" | "steel" | "egg") => {
    setTargetItem(item);
    setIsLifting(true);

    const isMatch =
      (item === "glass" && selectedTool === "suction") ||
      (item === "steel" && selectedTool === "magnet") ||
      (item === "egg" && selectedTool === "claw");

    setTimeout(() => {
      setIsLifting(false);
      if (isMatch) {
        playSuccess();
        const next = { ...liftedItems, [item]: true };
        setLiftedItems(next);

        if (next.glass && next.steel && next.egg && !hasWon) {
          setHasWon(true);
          reportComplete({ labId: "robotic-arm-end-effectors" });
        }
      } else {
        playZap();
      }
    }, 600);
  };

  const completedCount =
    (liftedItems.glass ? 1 : 0) + (liftedItems.steel ? 1 : 0) + (liftedItems.egg ? 1 : 0);

  const handleReset = () => {
    playClick();
    setSelectedTool("suction");
    setTargetItem(null);
    setIsLifting(false);
    setLiftedItems({ glass: false, steel: false, egg: false });
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "3D Robotic Gripping Mastered! The robot articulated in 3D and swapped suction, magnet, and soft claw tools to lift each material safely!"
          : completedCount === 0
          ? "Step 1: Choose a 3D End-Effector Tool from the tray, then click an item to command the 3D arm to lift it!"
          : completedCount < 3
          ? `Step ${completedCount + 1}: Swap the tool attachment to lift the remaining materials without cracking or dropping them!`
          : "All materials sorted! Swappable end-effectors allow robots to adapt to different physical properties!"
      }
      currentStep={completedCount}
      totalSteps={3}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          {/* Tool Swapper Controls */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
              Tool Attachment:
            </span>
            <button
              onClick={() => {
                playPop();
                setSelectedTool("suction");
              }}
              className={`px-3 py-1.5 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTool === "suction"
                  ? "bg-[#0284c7] text-[#f0f9ff] shadow-md ring-2 ring-[#7dd3fc]"
                  : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
              }`}
            >
              <CircleDot size={14} /> 3D Vacuum Suction (Glass)
            </button>

            <button
              onClick={() => {
                playPop();
                setSelectedTool("magnet");
              }}
              className={`px-3 py-1.5 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTool === "magnet"
                  ? "bg-[#dc2626] text-[#fef2f2] shadow-md ring-2 ring-[#fca5a5]"
                  : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
              }`}
            >
              <Magnet size={14} /> 3D Electromagnet (Steel)
            </button>

            <button
              onClick={() => {
                playPop();
                setSelectedTool("claw");
              }}
              className={`px-3 py-1.5 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTool === "claw"
                  ? "bg-[#059669] text-[#ecfdf5] shadow-md ring-2 ring-[#34d399]"
                  : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
              }`}
            >
              <Hand size={14} /> 3D Soft Claw (Egg)
            </button>

            {/* Target Item Lift Buttons */}
            <div className="flex items-center gap-1.5 ml-2 border-l border-[#d97706]/40 pl-3">
              <button
                onClick={() => handleLiftItem("glass")}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  liftedItems.glass
                    ? "bg-[#059669] text-[#ecfdf5]"
                    : "bg-[#fef3c7] text-[#78350f] border border-[#d97706]/40 hover:bg-[#fde68a]"
                }`}
              >
                Lift Glass {liftedItems.glass ? "✓" : ""}
              </button>
              <button
                onClick={() => handleLiftItem("steel")}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  liftedItems.steel
                    ? "bg-[#059669] text-[#ecfdf5]"
                    : "bg-[#fef3c7] text-[#78350f] border border-[#d97706]/40 hover:bg-[#fde68a]"
                }`}
              >
                Lift Steel {liftedItems.steel ? "✓" : ""}
              </button>
              <button
                onClick={() => handleLiftItem("egg")}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  liftedItems.egg
                    ? "bg-[#059669] text-[#ecfdf5]"
                    : "bg-[#fef3c7] text-[#78350f] border border-[#d97706]/40 hover:bg-[#fde68a]"
                }`}
              >
                Lift Egg {liftedItems.egg ? "✓" : ""}
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Arm
            </button>
          </div>
        </div>
      }
    >
      {/* 3D INDUSTRIAL ROBOT WORKCELL */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Factory Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md z-10">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              3D Robotics Workcell • Articulated Arm & Swappable End-Effectors
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#b45309]/50">
            CHUCK: {selectedTool.toUpperCase()} ({completedCount}/3 LIFTED)
          </span>
        </div>

        {/* 3D WEBGL ROBOT CANVAS */}
        <div className="relative flex-1 w-full my-1.5 rounded-2xl bg-gradient-to-b from-[#292524] via-[#1c1917] to-[#292524] border-3 border-[#fbbf24] shadow-inner overflow-hidden">
          <Canvas camera={{ position: [0, 2.8, 5.8], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fef08a" />
            <pointLight position={[-3, 4, 2]} intensity={1.2} color="#38bdf8" />
            <pointLight position={[3, 4, 2]} intensity={1.2} color="#fbbf24" />

            <RobotArmAssembly
              selectedTool={selectedTool}
              targetItem={targetItem}
              isLifting={isLifting}
            />

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
            Drag in 3D to orbit the articulated robot arm. Swap the right tool to lift glass, steel, and eggs safely!
          </span>
          <span className="font-mono text-[#fbbf24]">
            CELL: {completedCount === 3 ? "ALL ITEMS SORTED ✓" : `${completedCount}/3 COMPLETED`}
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="3D Robotic End-Effectors Mastered!"
        message="You manipulated a 3D articulated robot arm and discovered how specialized end-effector tool heads handle materials with different fragility and magnetism!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
