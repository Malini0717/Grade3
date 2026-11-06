"use client";

import { useState } from "react";
import { Fingerprint, ShieldCheck, AlertTriangle, RotateCcw, CheckCircle2, Play } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function CryptographicChecksumVerifier() {
  const [isCorrupted, setIsCorrupted] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("cryptographic-checksum-verifier");

  const cleanChecksum = "e7f8a92b4c3d1e0f8a9b2c3d4e5f6a7b";
  const corruptedChecksum = "9c12b4e87f6a5b4c3d2e1f0a9b8c7d6e";

  const currentChecksum = isCorrupted ? corruptedChecksum : cleanChecksum;
  const isMatch = !isCorrupted;

  const handleRunHash = () => {
    setIsHashing(true);
    playZap();

    setTimeout(() => {
      playPop();
      setIsHashing(false);
      setHasScanned(true);

      if (isMatch && !hasWon) {
        playSuccess();
        setHasWon(true);
        reportComplete({ labId: "cryptographic-checksum-verifier" });
      }
    }, 600);
  };

  const handleToggleCorruption = () => {
    playClick();
    setIsCorrupted((prev) => !prev);
    setHasScanned(false);
  };

  const handleReset = () => {
    playClick();
    setIsCorrupted(false);
    setHasScanned(false);
    setIsHashing(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "Checksum Integrity Mastered! The file fingerprint matched the official security hash, proving zero tampering!"
          : !hasScanned
          ? "Step 1: Feed the game download into the hash scanner to compute its cryptographic checksum fingerprint!"
          : isMatch
          ? "Checksum matches perfectly! Click 'Inject Corrupted Byte' to test how changing 1 single letter completely scrambles the hash!"
          : "Corrupted byte detected! Notice how the cryptographic hash avalanched, immediately catching the error!"
      }
      currentStep={hasScanned ? 1 : 0}
      totalSteps={1}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleRunHash}
              disabled={isHashing}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-[#fef3c7] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer border-2 border-[#fef08a]"
            >
              <Fingerprint size={16} className={isHashing ? "animate-spin" : ""} />
              <span>{isHashing ? "Calculating SHA-256 Hash..." : "Run Cryptographic Hash Scanner"}</span>
            </button>

            <button
              onClick={handleToggleCorruption}
              className={`px-3.5 py-2 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border ${
                isCorrupted
                  ? "bg-[#dc2626] text-[#fef2f2] border-[#fecaca] shadow-md ring-2 ring-[#fca5a5]"
                  : "bg-[#fef3c7] text-[#92400e] border-[#d97706]/40 hover:bg-[#fde68a]"
              }`}
            >
              <AlertTriangle size={15} />
              <span>{isCorrupted ? "Corrupted Byte Injected (Tampered)" : "Inject Corrupted Byte (Test Tampering)"}</span>
            </button>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              Integrity: {hasScanned ? (isMatch ? "VERIFIED AUTHENTIC ✓" : "TAMPER DETECTED ✗") : "READY TO SCAN"}
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset File
            </button>
          </div>
        </div>
      }
    >
      {/* SOFTWARE VAULT INSPECTION DECK */}
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

        {/* Vault Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md">
          <div className="flex items-center gap-2">
            <Fingerprint size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              Cryptographic Checksum Verifier • Digital Fingerprint Authentication
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03]">
            HASH ALGORITHM: SHA-256 (32 BYTES)
          </span>
        </div>

        {/* MAIN VISUAL ZONE: FILE PACKAGE & DUAL HASH COMPARISON */}
        <div className="grid grid-cols-12 gap-4 my-2 items-center px-2">
          {/* LEFT: INCOMING FILE PACKAGE (Cols 5) */}
          <div className="col-span-5 bg-[#292524] p-3 rounded-2xl border-3 border-[#d97706] shadow-lg flex flex-col justify-between h-52">
            <div className="flex items-center justify-between pb-1 border-b border-[#78350f]">
              <span className="font-baloo font-black text-xs text-[#fef3c7] uppercase">
                Software Download Package
              </span>
              <span className="font-mono text-[10px] text-[#fbbf24]">Target File</span>
            </div>

            <div className="my-1 flex-1 bg-[#1c1917] rounded-xl border border-[#78350f] p-3 flex flex-col justify-between">
              <div>
                <div className="font-baloo font-black text-sm text-[#fef3c7]">
                  SuperQuest_Installer_v2.0.zip
                </div>
                <div className="font-mono text-xs text-[#fde68a] mt-1 p-2 rounded bg-[#292524] border border-[#78350f]">
                  Payload: &quot;SUPERQUEST_v2.0_{isCorrupted ? "X" : "C"}LEAN_DATA&quot;
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#fde68a]">
                {isCorrupted ? "1 single letter modified (Corrupted)" : "Original uncorrupted bytes"}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#fde68a]">
              <span>Status:</span>
              <span className={isCorrupted ? "text-[#f87171] font-bold" : "text-[#6ee7b7] font-bold"}>
                {isCorrupted ? "MODIFIED (TAMPERED)" : "CLEAN ORIGINAL"}
              </span>
            </div>
          </div>

          {/* RIGHT: DUAL CHECKSUM COMPARISON HASH READOUT (Cols 7) */}
          <div className="col-span-7 bg-[#064e3b] p-3 rounded-2xl border-3 border-[#10b981] shadow-lg flex flex-col justify-between h-52">
            <div className="flex items-center justify-between pb-1 border-b border-[#10b981]/40">
              <span className="font-baloo font-black text-xs text-[#a7f3d0] uppercase">
                Fingerprint Hash Verification
              </span>
              <span className="font-mono text-[10px] text-[#fef08a]">
                {hasScanned ? (isMatch ? "MATCH (100%)" : "MISMATCH (0%)") : "WAITING SCAN"}
              </span>
            </div>

            <div className="my-1 flex-1 bg-[#022c22] rounded-xl border border-[#047857] p-2.5 flex flex-col justify-between font-mono text-xs">
              {/* Official Hash */}
              <div>
                <div className="text-[10px] text-[#34d399] uppercase font-bold">
                  Official Publisher Hash (Certificate):
                </div>
                <div className="text-xs font-black text-[#fef08a] mt-0.5 break-all bg-[#064e3b] p-1.5 rounded border border-[#10b981]/50">
                  {cleanChecksum}
                </div>
              </div>

              {/* Scanned Hash */}
              <div className="mt-1">
                <div className="text-[10px] text-[#34d399] uppercase font-bold">
                  Scanned Download Hash:
                </div>
                <div
                  className={`text-xs font-black mt-0.5 break-all p-1.5 rounded border transition-all ${
                    !hasScanned
                      ? "text-[#a7f3d0]/60 bg-[#064e3b]/50 border-dashed border-[#047857]"
                      : isMatch
                      ? "text-[#a7f3d0] bg-[#059669] border-[#34d399]"
                      : "text-[#fef2f2] bg-[#dc2626] border-[#fecaca] animate-pulse"
                  }`}
                >
                  {hasScanned ? currentChecksum : "Click 'Run Cryptographic Hash Scanner'"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#a7f3d0]">
              <span>Result:</span>
              <span className="font-bold text-[#fef08a]">
                {hasScanned ? (isMatch ? "AUTHENTIC • SAFE TO RUN ✓" : "CORRUPTED • BLOCKED ✗") : "Ready"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7]">
          <span>
            A cryptographic hash creates a unique fingerprint. Changing even 1 character completely scrambles the hash!
          </span>
          <span className="font-mono text-[#fbbf24]">
            INTEGRITY: {hasScanned && isMatch ? "CONFIRMED" : "TESTING"}
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="Checksum Verification Mastered!"
        message="You discovered how cryptographic checksums produce unique fingerprints that instantly detect corrupted or tampered files!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}

