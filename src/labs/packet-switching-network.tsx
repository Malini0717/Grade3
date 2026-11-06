"use client";

import { useState } from "react";
import { Share2, Scissors, CheckCircle2, RotateCcw, Send, AlertTriangle } from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function PacketSwitchingNetwork() {
  const [isCableASevered, setIsCableASevered] = useState(false);
  const [transmittedPackets, setTransmittedPackets] = useState<number>(0);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const { playClick, playPop, playSuccess, playZap } = useLabAudio();
  const { reportComplete } = useLMSBridge("packet-switching-network");

  const packets = [
    { id: 1, label: "PKT #1 (Rover Head)", route: isCableASevered ? "Route B (Rerouted)" : "Route A (Direct)" },
    { id: 2, label: "PKT #2 (Solar Panel)", route: isCableASevered ? "Route B (Rerouted)" : "Route A (Direct)" },
    { id: 3, label: "PKT #3 (Wheels)", route: isCableASevered ? "Route B (Rerouted)" : "Route A (Direct)" },
    { id: 4, label: "PKT #4 (Antenna)", route: isCableASevered ? "Route B (Rerouted)" : "Route A (Direct)" },
  ];

  const handleToggleSeverCable = () => {
    playClick();
    setIsCableASevered((prev) => !prev);
  };

  const handleTransmit = () => {
    if (isTransmitting) return;

    setIsTransmitting(true);
    playZap();
    setTransmittedPackets(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setTransmittedPackets(count);
      playPop();

      if (count >= 4) {
        clearInterval(interval);
        setIsTransmitting(false);

        if (isCableASevered && !hasWon) {
          playSuccess();
          setHasWon(true);
          reportComplete({ labId: "packet-switching-network" });
        }
      }
    }, 400);
  };

  const handleReset = () => {
    playClick();
    setIsCableASevered(false);
    setTransmittedPackets(0);
    setIsTransmitting(false);
    setHasWon(false);
  };

  return (
    <GradeThreeScaffold
      instruction={
        hasWon
          ? "Network Resilience Mastered! Even with Cable A cut, packets automatically rerouted through Cable B and reassembled 100%!"
          : !isCableASevered
          ? "Step 1: Click 'CUT CABLE A' to test what happens when a network wire breaks!"
          : transmittedPackets < 4
          ? "Step 2: Press 'TRANSMIT 4 PACKETS' to watch packet switching dynamically reroute data through Cable B!"
          : "Photo completely reassembled! Packet switching makes the internet immune to broken wires!"
      }
      currentStep={transmittedPackets === 4 && isCableASevered ? 2 : isCableASevered ? 1 : 0}
      totalSteps={2}
      onReset={handleReset}
      tray={
        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleSeverCable}
              className={`px-4 py-2 rounded-xl font-baloo text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border ${
                isCableASevered
                  ? "bg-[#dc2626] text-[#fef2f2] border-[#fecaca] shadow-md ring-2 ring-[#fca5a5]"
                  : "bg-[#fef3c7] text-[#92400e] border-[#d97706]/40 hover:bg-[#fde68a]"
              }`}
            >
              <Scissors size={15} />
              <span>{isCableASevered ? "Cable A is SEVERED (Test Mode)" : "Cut Cable A (Test Failure)"}</span>
            </button>

            <button
              onClick={handleTransmit}
              disabled={isTransmitting}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#38bdf8] hover:to-[#0284c7] text-[#f0f9ff] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer border-2 border-[#bae6fd]"
            >
              <Send size={15} className={isTransmitting ? "animate-pulse" : ""} />
              <span>{isTransmitting ? "Routing Packets..." : "Transmit 4 Packets"}</span>
            </button>

            <span className="font-mono text-xs font-black text-[#78350f] bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#d97706]/40">
              Arrival: {transmittedPackets}/4 Packets Reassembled
            </span>
          </div>

          <div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-xs font-black border border-[#d97706]/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Reset Network
            </button>
          </div>
        </div>
      }
    >
      {/* CITY TOPOLOGICAL FIBER ROUTING MAP */}
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
            <Share2 size={18} className="text-[#451a03]" />
            <span className="font-baloo font-black text-xs uppercase tracking-wider text-[#451a03]">
              Packet Switching Network Routing • Dynamic Fault-Tolerance
            </span>
          </div>
          <span className="font-mono text-[11px] font-black text-[#451a03]">
            IP PROTOCOL: DYNAMIC SHORTEST PATH
          </span>
        </div>

        {/* MAIN VISUAL ZONE: SOURCE ROVER → CABLE MAP → DESTINATION REASSEMBLER */}
        <div className="grid grid-cols-12 gap-3 my-2 items-center px-1">
          {/* SOURCE PACKET QUEUE (Cols 4) */}
          <div className="col-span-4 bg-[#292524] p-3 rounded-2xl border-3 border-[#d97706] shadow-lg flex flex-col justify-between h-52">
            <div className="flex items-center justify-between pb-1 border-b border-[#78350f]">
              <span className="font-baloo font-black text-xs text-[#fef3c7] uppercase">
                Source Photo (Rover)
              </span>
              <span className="font-mono text-[10px] text-[#fbbf24]">4 Slices</span>
            </div>

            <div className="space-y-1 my-1">
              {packets.map((pkt) => (
                <div
                  key={pkt.id}
                  className={`p-1.5 rounded-lg border font-mono text-[10px] font-bold flex items-center justify-between ${
                    transmittedPackets >= pkt.id
                      ? "bg-[#064e3b] text-[#a7f3d0] border-[#34d399]"
                      : "bg-[#1c1917] text-[#fef08a] border-[#78350f]"
                  }`}
                >
                  <span>{pkt.label}</span>
                  <span className="text-[9px] text-[#fbbf24]">{pkt.route}</span>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-[#fde68a]">
              Sender splits file into addressed pieces
            </div>
          </div>

          {/* ROUTING NETWORK SVG MAP (Cols 4) */}
          <div className="col-span-4 bg-[#082f49] p-2 rounded-2xl border-3 border-[#38bdf8] shadow-lg flex flex-col justify-between h-52 relative overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-[#0c4a6e]">
              <span className="font-baloo font-black text-xs text-[#bae6fd] uppercase">
                Relay Router Cables
              </span>
              <span className="font-mono text-[10px] text-[#38bdf8]">
                {isCableASevered ? "Cable A Broken!" : "Cables Active"}
              </span>
            </div>

            {/* Cable Map SVG */}
            <svg className="w-full h-32" viewBox="0 0 200 120">
              {/* Route A (Top) */}
              <path
                d="M 20 60 Q 100 15, 180 60"
                fill="none"
                stroke={isCableASevered ? "#ef4444" : "#38bdf8"}
                strokeWidth="4"
                strokeDasharray={isCableASevered ? "4 4" : "none"}
              />
              <text x="90" y="24" fill={isCableASevered ? "#f87171" : "#38bdf8"} fontSize="9" fontWeight="bold">
                {isCableASevered ? "CUT ✗" : "Cable A"}
              </text>

              {/* Route B (Bottom Alternate) */}
              <path
                d="M 20 60 Q 100 105, 180 60"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
              />
              <text x="80" y="105" fill="#34d399" fontSize="9" fontWeight="bold">
                Cable B (Backup)
              </text>

              {/* Nodes */}
              <circle cx="20" cy="60" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
              <circle cx="180" cy="60" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
            </svg>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#7dd3fc]">
              <span>Routers</span>
              <span className="text-[#a7f3d0]">Auto-Detecting Path</span>
            </div>
          </div>

          {/* DESTINATION RECEIVER REASSEMBLER (Cols 4) */}
          <div className="col-span-4 bg-[#064e3b] p-3 rounded-2xl border-3 border-[#10b981] shadow-lg flex flex-col justify-between h-52">
            <div className="flex items-center justify-between pb-1 border-b border-[#10b981]/40">
              <span className="font-baloo font-black text-xs text-[#a7f3d0] uppercase">
                Destination Reassembly
              </span>
              <span className="font-mono text-[10px] text-[#fef08a]">{transmittedPackets}/4</span>
            </div>

            {/* Reassembled Photo Display */}
            <div className="my-1 flex-1 bg-[#022c22] rounded-xl border border-[#047857] p-2 flex flex-col items-center justify-center font-mono">
              {transmittedPackets === 0 ? (
                <div className="text-center text-[#6ee7b7] text-xs">Waiting for packets...</div>
              ) : (
                <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
                  {[1, 2, 3, 4].map((id) => (
                    <div
                      key={id}
                      className={`rounded-md flex items-center justify-center text-[10px] font-black transition-all ${
                        transmittedPackets >= id
                          ? "bg-[#059669] text-[#ecfdf5] border border-[#a7f3d0]"
                          : "bg-[#064e3b] text-[#34d399]/40 border border-dashed border-[#047857]"
                      }`}
                    >
                      {transmittedPackets >= id ? `PKT #${id} ✓` : `Missing #${id}`}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#a7f3d0]">
              <span>File Integrity</span>
              <span className="text-[#fef08a] font-bold">
                {transmittedPackets === 4 ? "100% COMPLETE ✓" : "In Progress"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#451a03] border border-[#b45309] rounded-xl text-[11px] font-baloo font-bold text-[#fef3c7]">
          <span>
            Packet switching breaks files into addressed chunks. If a cable breaks, packets instantly take other paths!
          </span>
          <span className="font-mono text-[#fbbf24]">
            RELIABILITY: 100%
          </span>
        </div>
      </div>

      <Celebration
        isActive={hasWon}
        title="Packet Switching Mastered!"
        message="You discovered how network routers automatically steer packets around damaged cables to assemble files seamlessly!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}

