"use client";

import { useState } from "react";
import { QrCode, Barcode, Scan, CheckCircle2, RotateCcw } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function BarcodeVsQrCode() {
  const [selectedCode, setSelectedCode] = useState<"1d" | "2d">("1d");
  const [hasScanned1D, setHasScanned1D] = useState(false);
  const [hasScanned2D, setHasScanned2D] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("barcode-vs-qr-code");

  const handleScan = () => {
    setIsScanning(true);
    playZap();

    setTimeout(() => {
      playPop();
      setIsScanning(false);
      if (selectedCode === "1d") {
        setHasScanned1D(true);
      } else {
        setHasScanned2D(true);
      }

      if ((selectedCode === "2d" && hasScanned1D) || (selectedCode === "1d" && hasScanned2D)) {
        if (!hasWon) {
          playSuccess();
          setHasWon(true);
          reportComplete({ labId: "barcode-vs-qr-code" });
        }
      }
    }, 600);
  };

  const handleReset = () => {
    playClick();
    setSelectedCode("1d");
    setHasScanned1D(false);
    setHasScanned2D(false);
    setIsScanning(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "Optical Codes Mastered! 1D barcodes hold only 12 numbers along a line, while 2D QR grids pack thousands of letters across X and Y!"
          : !hasScanned1D
          ? "Step 1: Aim the red laser at the 1D Barcode and press 'FIRE OPTICAL LASER SCAN'!"
          : !hasScanned2D
          ? "Step 2: Switch to the 2D QR Code and scan to see how data multiplies across two dimensions!"
          : "Both optical codes decoded! Notice how 2D holds full websites and multimedia!"
      }
      currentStep={hasScanned1D && hasScanned2D ? 2 : hasScanned1D || hasScanned2D ? 1 : 0}
      totalSteps={2}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          {/* Code Selection & Scan Trigger */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
                Select Code:
              </span>
              <button
                onClick={() => {
                  playPop();
                  setSelectedCode("1d");
                }}
                className={`px-3 py-1.5 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCode === "1d"
                    ? "bg-[#d97706] text-[#451a03] shadow-md ring-2 ring-[#fbbf24]"
                    : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
                }`}
              >
                <Barcode size={15} /> 1D Barcode (Stripes)
              </button>
              <button
                onClick={() => {
                  playPop();
                  setSelectedCode("2d");
                }}
                className={`px-3 py-1.5 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCode === "2d"
                    ? "bg-[#059669] text-[#ecfdf5] shadow-md ring-2 ring-[#34d399]"
                    : "bg-[#fef3c7] text-[#92400e] border border-[#d97706]/40 hover:bg-[#fde68a]"
                }`}
              >
                <QrCode size={15} /> 2D QR Code (Grid)
              </button>
            </div>

            <button
              onClick={handleScan}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-[#fef2f2] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer border border-[#fecaca]"
            >
              <Scan size={15} className={isScanning ? "animate-spin" : ""} />
              {isScanning ? "Scanning Optical Beam..." : "Fire Optical Laser Scan"}
            </button>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Scanner
            </button>
          </div>
        </div>
      }
    >
      {/* SUPERMARKET CHECKOUT CONVEYER & OPTICAL LAB BENCH */}
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

        {/* Bench Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#fef08a] to-[#b45309] px-4 py-1.5 rounded-xl border border-[#78350f] shadow-md">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              Optical Data Density Lab • 1D Stripes vs. 2D Pixel Grids
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03]">
            LASER DIODE: 650nm RED
          </span>
        </div>

        {/* MAIN VISUAL ZONE: PACKAGING ITEM & LASER SCAN LINE */}
        <div className="grid grid-cols-12 gap-4 my-2 items-center px-2">
          {/* LEFT: PRODUCT PACKAGING WITH OPTICAL CODE (Cols 7) */}
          <div className="col-span-7 bg-[#292524] p-3 rounded-2xl border-3 border-[#d97706] shadow-lg flex flex-col justify-between h-52 relative overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-[#78350f]">
              <span className="font-baloo font-black text-xs text-[#fef3c7] uppercase">
                {selectedCode === "1d" ? "Crispy Crunch Cereal Box (1D)" : "Smart Nutrition Passport (2D)"}
              </span>
              <span className="font-mono text-[10px] text-[#fbbf24]">
                Target: {selectedCode === "1d" ? "1-Dimensional Stripes" : "2-Dimensional Matrix"}
              </span>
            </div>

            {/* Code Graphic Area */}
            <div className="relative my-1 flex-1 bg-[#fef3c7] rounded-xl border-2 border-[#b45309] p-3 flex items-center justify-center overflow-hidden">
              {/* Laser Scanning Red Beam Line */}
              <div
                className={`absolute inset-x-0 h-1 bg-[#ef4444] shadow-lg shadow-[#ef4444] z-20 pointer-events-none transition-all duration-500 ${
                  isScanning ? "top-3/4 animate-bounce" : "top-1/2 opacity-70"
                }`}
              />

              {selectedCode === "1d" ? (
                /* 1D Barcode Stripes */
                <div className="flex items-center justify-center gap-1">
                  {[2, 4, 1, 3, 2, 5, 2, 1, 4, 2, 3, 1, 4, 2, 1, 3, 2].map((w, i) => (
                    <div
                      key={i}
                      style={{ width: `${w * 3}px` }}
                      className="h-24 bg-[#1c1917] rounded-xs"
                    />
                  ))}
                </div>
              ) : (
                /* 2D QR Code Matrix */
                <div className="grid grid-cols-6 gap-1 p-1 bg-[#1c1917] rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-xs ${
                        i % 2 === 0 || i % 7 === 0 ? "bg-[#fef3c7]" : "bg-[#1c1917]"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#fde68a]">
              <span>Geometry: {selectedCode === "1d" ? "Horizontal Width Only (1 Axis)" : "Rows & Columns (X + Y Axes)"}</span>
              <span className="text-[#6ee7b7] font-bold">
                {selectedCode === "1d" ? (hasScanned1D ? "Scanned ✓" : "Ready") : (hasScanned2D ? "Scanned ✓" : "Ready")}
              </span>
            </div>
          </div>

          {/* RIGHT: DECODED DATA READOUT DISPLAY (Cols 5) */}
          <div className="col-span-5 bg-[#064e3b] p-3 rounded-2xl border-3 border-[#10b981] shadow-lg flex flex-col justify-between h-52">
            <div className="flex items-center justify-between pb-1 border-b border-[#10b981]/40">
              <span className="font-baloo font-black text-xs text-[#a7f3d0] uppercase">
                Scanner Terminal Readout
              </span>
              <span className="font-mono text-[10px] text-[#fef08a]">
                {selectedCode === "1d" ? "12 NUMBERS" : "3,000 BYTES"}
              </span>
            </div>

            {/* Readout Terminal Box */}
            <div className="my-1 flex-1 bg-[#022c22] rounded-xl border border-[#047857] p-2.5 flex flex-col justify-between font-mono text-xs overflow-hidden">
              {selectedCode === "1d" ? (
                <div>
                  <div className="text-[10px] text-[#34d399] uppercase font-bold">1D Barcode Output:</div>
                  <div className="text-sm font-black text-[#fef08a] mt-1 tracking-wider">
                    {hasScanned1D ? "4901 2345 6789" : "--- ---- ----"}
                  </div>
                  <div className="text-[10px] text-[#6ee7b7] mt-2">
                    Stores: Product SKU ID only
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] text-[#34d399] uppercase font-bold">2D QR Code Output:</div>
                  <div className="text-xs font-black text-[#67e8f9] mt-1 break-all">
                    {hasScanned2D
                      ? "https://cereal.kids/berry?vitamins=A,C,D&fiber=5g&expiry=2028"
                      : "Scanning matrix grid..."}
                  </div>
                  <div className="text-[10px] text-[#fde047] mt-1">
                    Stores: Full Website URL + Ingredients
                  </div>
                </div>
              )}

              <div className="pt-1 border-t border-[#047857] text-[10px] text-[#a7f3d0]">
                Data multiplier: {selectedCode === "1d" ? "1x capacity" : "250x capacity! ✓"}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#a7f3d0]">
              <span>Status</span>
              <span className="text-[#fef08a] font-bold">
                {hasScanned1D && hasScanned2D ? "Both Compared ✓" : "1 More Code Needed"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7]">
          <span>
            1D barcodes only encode along a single horizontal axis. 2D QR grids store bits in both rows and columns!
          </span>
          <span className="font-mono text-[#fbbf24]">
            DENSITY: 2D WINS
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="Optical Codes Mastered!"
        message="You discovered how optical data density multiplies when data is arranged across a 2D pixel grid instead of 1D vertical stripes!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}

