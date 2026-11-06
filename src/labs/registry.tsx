"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

function LoadingLabState() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#fef3c7] to-[#fde68a]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#d97706] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#78350f] text-sm font-black uppercase tracking-wider font-baloo">
          Loading Computing Lab...
        </span>
      </div>
    </div>
  );
}

// ── BATCH 1 DYNAMIC LAB LOADERS (Labs 1–7) ──
const WindowHitTester = dynamic(() => import("./window-hit-tester"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const PublicPrivateKeyShield = dynamic(() => import("./public-private-key-shield"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const RasterVsVectorZoom = dynamic(() => import("./raster-vs-vector-zoom"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const AiDecisionBoundary = dynamic(() => import("./ai-decision-boundary"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const DigitalAudioSampler = dynamic(() => import("./digital-audio-sampler"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const CpuFetchDecodeExecute = dynamic(() => import("./cpu-fetch-decode-execute"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const LogicGatesTransistors = dynamic(() => import("./logic-gates-transistors"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

// ── BATCH 2 DYNAMIC LAB LOADERS (Labs 8–14) ──
const VolatileRamVsRom = dynamic(() => import("./volatile-ram-vs-rom"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const WifiScreenCasting = dynamic(() => import("./wifi-screen-casting"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const HddVsSsdSpeedRace = dynamic(() => import("./hdd-vs-ssd-speed-race"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const BarcodeVsQrCode = dynamic(() => import("./barcode-vs-qr-code"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const DiffusionDenoisingArt = dynamic(() => import("./diffusion-denoising-art"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const ThermalThrottlingProtection = dynamic(() => import("./thermal-throttling-protection"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const PacketSwitchingNetwork = dynamic(() => import("./packet-switching-network"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

// ── BATCH 3 DYNAMIC LAB LOADERS (Labs 15–23) ──
const DifferentialGearCalculator = dynamic(() => import("./differential-gear-calculator"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const AnalogToDigitalConverter = dynamic(() => import("./analog-to-digital-converter"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const SevenSegmentDisplay = dynamic(() => import("./seven-segment-display"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const CryptographicChecksumVerifier = dynamic(() => import("./cryptographic-checksum-verifier"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const MicrophoneArrayBeamforming = dynamic(() => import("./microphone-array-beamforming"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const FilePermissionsHierarchy = dynamic(() => import("./file-permissions-hierarchy"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const RoboticArmEndEffectors = dynamic(() => import("./robotic-arm-end-effectors"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const PpgHeartRateSensor = dynamic(() => import("./ppg-heart-rate-sensor"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

const CapacitiveFingerprintMinutiae = dynamic(() => import("./capacitive-fingerprint-minutiae"), {
  ssr: false,
  loading: () => <LoadingLabState />,
});

// Master Registry Map for Grade 3 interactive computing labs (All 23 Labs)
export const LAB_COMPONENTS: Record<string, ComponentType> = {
  // Batch 1 (1–7)
  "window-hit-tester": WindowHitTester,
  "public-private-key-shield": PublicPrivateKeyShield,
  "raster-vs-vector-zoom": RasterVsVectorZoom,
  "ai-decision-boundary": AiDecisionBoundary,
  "digital-audio-sampler": DigitalAudioSampler,
  "cpu-fetch-decode-execute": CpuFetchDecodeExecute,
  "logic-gates-transistors": LogicGatesTransistors,

  // Batch 2 (8–14)
  "volatile-ram-vs-rom": VolatileRamVsRom,
  "wifi-screen-casting": WifiScreenCasting,
  "hdd-vs-ssd-speed-race": HddVsSsdSpeedRace,
  "barcode-vs-qr-code": BarcodeVsQrCode,
  "diffusion-denoising-art": DiffusionDenoisingArt,
  "thermal-throttling-protection": ThermalThrottlingProtection,
  "packet-switching-network": PacketSwitchingNetwork,

  // Batch 3 (15–23)
  "differential-gear-calculator": DifferentialGearCalculator,
  "analog-to-digital-converter": AnalogToDigitalConverter,
  "seven-segment-display": SevenSegmentDisplay,
  "cryptographic-checksum-verifier": CryptographicChecksumVerifier,
  "microphone-array-beamforming": MicrophoneArrayBeamforming,
  "file-permissions-hierarchy": FilePermissionsHierarchy,
  "robotic-arm-end-effectors": RoboticArmEndEffectors,
  "ppg-heart-rate-sensor": PpgHeartRateSensor,
  "capacitive-fingerprint-minutiae": CapacitiveFingerprintMinutiae,
};
