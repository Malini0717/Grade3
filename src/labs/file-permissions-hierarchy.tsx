"use client";

import { useState } from "react";
import { FolderLock, ShieldCheck, Lock, Unlock, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function FilePermissionsHierarchy() {
  // Folder permissions: Read, Write, Execute
  const [systemWrite, setSystemWrite] = useState(true); // Starts dangerously unlocked!
  const [studentWrite, setStudentWrite] = useState(true);
  const [hasSecuredSystem, setHasSecuredSystem] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("file-permissions-hierarchy");

  const isSystemSecure = !systemWrite; // System must have write disabled

  const toggleSystemWrite = () => {
    playClick();
    const nextVal = !systemWrite;
    setSystemWrite(nextVal);

    if (!nextVal && !hasSecuredSystem) {
      setHasSecuredSystem(true);
      if (!hasWon) {
        playSuccess();
        setHasWon(true);
        reportComplete({ labId: "file-permissions-hierarchy" });
      }
    }
  };

  const toggleStudentWrite = () => {
    playClick();
    setStudentWrite((prev) => !prev);
  };

  const handleReset = () => {
    playClick();
    setSystemWrite(true);
    setStudentWrite(true);
    setHasSecuredSystem(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "File Permissions Mastered! The critical System folder Write lock is secured (R-X), preventing accidental OS crashes!"
          : !isSystemSecure
          ? "Step 1: The /System/ folder has Write permission enabled (DANGER!). Click to LOCK Write permission and protect the OS!"
          : "System files protected! Notice how permissions prevent students from accidentally deleting operating system files!"
      }
      currentStep={hasSecuredSystem ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSystemWrite}
              className={`px-4 py-2 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSystemSecure
                  ? "bg-[#059669] text-[#ecfdf5] border-[#34d399] shadow-md ring-2 ring-[#a7f3d0]"
                  : "bg-[#dc2626] text-[#fef2f2] border-[#fecaca] shadow-md ring-2 ring-[#fca5a5] animate-pulse"
              }`}
            >
              {isSystemSecure ? <Lock size={15} /> : <Unlock size={15} />}
              <span>{isSystemSecure ? "/System/ Write: LOCKED (Protected ✓)" : "LOCK /System/ WRITE (CRITICAL DANGER)"}</span>
            </button>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              OS Security Level: {isSystemSecure ? "SECURE (R-X) ✓" : "VULNERABLE (RWX) ✗"}
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Permissions
            </button>
          </div>
        </div>
      }
    >
      {/* MAHOGANY OS FILE DIRECTORY CABINET */}
      <div className="relative w-full h-full max-w-4xl max-h-[385px] bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] rounded-3xl border-4 border-[#b45309] shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
        {/* Brass Screws at Corners */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] border border-[#78350f] flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03]" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] border border-[#78350f] flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03]" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] border border-[#78350f] flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03]" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] border border-[#78350f] flex items-center justify-center">
          <div className="w-2.5 h-[1.5px] bg-[#451a03]" />
        </div>

        {/* Directory Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md">
          <div className="flex items-center gap-2">
            <FolderLock size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              Operating System File Permissions • Read / Write / Execute (rwx)
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03]">
            POSIX PERMISSION BITS (chmod 555 vs 777)
          </span>
        </div>

        {/* 2 FOLDER DIRECTORY CARDS (SYSTEM VS USER) */}
        <div className="grid grid-cols-2 gap-5 my-2 px-2">
          {/* FOLDER 1: /System/Core_Kernel/ */}
          <div
            className={`p-3 rounded-2xl border-3 flex flex-col justify-between transition-all ${
              isSystemSecure
                ? "bg-[#064e3b] border-[#10b981] shadow-lg shadow-[#10b981]/30"
                : "bg-[#431407] border-[#ef4444] shadow-lg shadow-[#ef4444]/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-1 border-b border-[#fef08a]/30">
                <span className="font-baloo font-black text-xs text-[#fef3c7] uppercase flex items-center gap-1.5">
                  <FolderLock size={15} /> /System/Kernel/
                </span>
                <span className="font-mono text-[10px] text-[#fbbf24]">Critical OS</span>
              </div>

              <div className="text-[11px] font-semibold text-[#fde68a] my-2">
                Core operating system files required to boot the computer:
              </div>

              {/* R-W-X Badges */}
              <div className="flex items-center gap-2 my-1">
                <span className="px-2.5 py-1 rounded-lg bg-[#059669] text-[#ecfdf5] font-mono text-xs font-black border border-[#a7f3d0]">
                  R (Read): ON
                </span>
                <button
                  onClick={toggleSystemWrite}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black border cursor-pointer transition-all ${
                    systemWrite
                      ? "bg-[#dc2626] text-[#fef2f2] border-[#fecaca] animate-bounce"
                      : "bg-[#78350f] text-[#fde68a] border-[#b45309]"
                  }`}
                >
                  W (Write): {systemWrite ? "ON (DANGER!)" : "OFF (LOCKED)"}
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-[#059669] text-[#ecfdf5] font-mono text-xs font-black border border-[#a7f3d0]">
                  X (Exec): ON
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#fef08a]/30 flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#fef3c7]">Protection:</span>
              <span className={`font-bold ${isSystemSecure ? "text-[#a7f3d0]" : "text-[#f87171]"}`}>
                {isSystemSecure ? "WRITE PROTECTED (SAFE) ✓" : "ACCIDENTAL DELETION RISK! ✗"}
              </span>
            </div>
          </div>

          {/* FOLDER 2: /Students/My_Projects/ */}
          <div className="bg-[#292524] p-3 rounded-2xl border-3 border-[#d97706] shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1 border-b border-[#78350f]">
                <span className="font-baloo font-black text-xs text-[#fef3c7] uppercase flex items-center gap-1.5">
                  <FolderLock size={15} /> /Students/Projects/
                </span>
                <span className="font-mono text-[10px] text-[#fbbf24]">User Space</span>
              </div>

              <div className="text-[11px] font-semibold text-[#fde68a] my-2">
                Student drawing and code project save directory:
              </div>

              {/* R-W-X Badges */}
              <div className="flex items-center gap-2 my-1">
                <span className="px-2.5 py-1 rounded-lg bg-[#059669] text-[#ecfdf5] font-mono text-xs font-black border border-[#a7f3d0]">
                  R (Read): ON
                </span>
                <button
                  onClick={toggleStudentWrite}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black border cursor-pointer transition-all ${
                    studentWrite
                      ? "bg-[#059669] text-[#ecfdf5] border-[#a7f3d0]"
                      : "bg-[#78350f] text-[#fde68a] border-[#b45309]"
                  }`}
                >
                  W (Write): {studentWrite ? "ON (CAN SAVE)" : "OFF"}
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-[#78350f] text-[#fde68a] font-mono text-xs font-black border border-[#b45309]">
                  X (Exec): OFF
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#78350f] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#fef3c7]">User Access:</span>
              <span className="text-[#a7f3d0] font-bold">
                {studentWrite ? "PERMITTED TO CREATE FILES ✓" : "READ ONLY"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7]">
          <span>
            Read lets you view, Write lets you edit or delete, and Execute runs software programs!
          </span>
          <span className="font-mono text-[#fbbf24]">
            HIERARCHY: {isSystemSecure ? "PROTECTED" : "UNSAFE"}
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="File Permissions Mastered!"
        message="You discovered how setting Read, Write, and Execute rights protects critical operating system files from accidental deletion!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}

