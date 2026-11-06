"use client";

import { useState } from "react";
import {
  Lock,
  Unlock,
  Key,
  Send,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  Battery,
  Radio,
  RotateCcw,
  Sparkles,
  Home,
  TowerControl,
  Volume2,
  CheckCircle2,
  Delete,
} from "lucide-react";
import GradeThreeScaffold from "@/components/grade3/GradeThreeScaffold";
import Celebration from "@/components/Celebration";
import { useLabAudio } from "@/hooks/useLabAudio";
import { useLMSBridge } from "@/hooks/useLMSBridge";

export default function PublicPrivateKeyShield() {
  // ── 5 COMPREHENSIVE CURRICULUM LEVELS ──
  // Level 1: Alice's Tablet - Select code & lock with Bob's Public Key (Public Key - BOB)
  // Level 2: Outdoor Street & 5G Relay Mast - Radio Snooper Van airwave interception attack
  // Level 3: Bob's Tablet - Type Bob's Private Key (BOB-99) on tablet keypad to decipher
  // Level 4: Bob's Tablet - Seal return reply using Alice's Public Key (Public Key - ALICE)
  // Level 5: Alice's Tablet - Decrypt Bob's return reply using Alice's Private Key (ALICE-77)
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Level 1 States (Alice's Tablet)
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [aliceLocked, setAliceLocked] = useState(false);
  const [aliceSent, setAliceSent] = useState(false);

  // Level 2 States (5G Tower & Snooper Van)
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [snooperTested, setSnooperTested] = useState(false);
  const [snooperLog, setSnooperLog] = useState<string | null>(null);

  // Level 3 States (Bob's Tablet Interactive Keypad)
  const [bobTypedKey, setBobTypedKey] = useState<string>("");
  const [bobKeypadError, setBobKeypadError] = useState<string | null>(null);
  const [isBobDeciphering, setIsBobDeciphering] = useState(false);
  const [bobDecrypted, setBobDecrypted] = useState(false);

  // Level 4 States (Bob's Return Reply Sealing)
  const [selectedReplyLock, setSelectedReplyLock] = useState<"bobs_lock" | "alices_public_lock" | null>(null);
  const [replyLockError, setReplyLockError] = useState<string | null>(null);
  const [replySent, setReplySent] = useState(false);

  // Level 5 States (Alice's Tablet Interactive Keypad Decryption)
  const [aliceTypedKey, setAliceTypedKey] = useState<string>("");
  const [aliceKeypadError, setAliceKeypadError] = useState<string | null>(null);
  const [isAliceDeciphering, setIsAliceDeciphering] = useState(false);
  const [aliceDecrypted, setAliceDecrypted] = useState(false);

  const [hasWon, setHasWon] = useState(false);

  // Message choices for Alice
  const messageChoices = [
    "Secret Treehouse Code: ACORN 99",
    "Robotics Club Password: CYBER 42",
    "Launch Secret Rocket at Sunset!",
  ];
  const activePlaintext = messageChoices[selectedWordIndex];
  const cipherText = "Ψ 9 # λ § @ ! * Ω β";

  // Secret Private Keys
  const correctBobPrivateKey = "BOB-99";
  const correctAlicePrivateKey = "ALICE-77";

  const bobReplyPlaintext = "Treehouse Mission Confirmed!";
  const bobReplyCipher = "Δ 7 * Ω β % # ~ Ψ 1";

  const { playClick, playPop, playSuccess, playZap, speakInstructions, isSpeaking } = useLabAudio();
  const { reportComplete } = useLMSBridge("public-private-key-shield");

  const currentDirective =
    hasWon
      ? "Triumph! You mastered two-way End-to-End Encryption across town through cell towers and airwaves!"
      : level === 1
      ? "Level 1: On Alice's tablet, tap 'Public Key - BOB' to lock her secret message before sending!"
      : level === 2
      ? "Level 2: 5G Airwaves transmitting! Tap the Street Snooper Van to test if eavesdroppers can read it!"
      : level === 3
      ? "Level 3: On Bob's tablet keypad, type Bob's Secret Key (BOB-99) to decipher Alice's message!"
      : level === 4
      ? "Level 4: On Bob's tablet, choose 'Public Key - ALICE' to safely lock his return reply for Alice!"
      : "Level 5: On Alice's tablet keypad, type Alice's Secret Key (ALICE-77) to decrypt Bob's return reply!";

  // ── LEVEL 1 HANDLERS (Alice) ──
  const handleSnapAliceLock = () => {
    playZap();
    setAliceLocked(true);
  };

  const handleAliceSend = () => {
    playPop();
    setAliceSent(true);
    setIsTransmitting(true);
    setTimeout(() => {
      setLevel(2);
    }, 700);
  };

  // ── LEVEL 2 HANDLERS (5G Tower & Snooper Van) ──
  const handleSnooperAttack = () => {
    playZap();
    setSnooperTested(true);
    setSnooperLog("INTERCEPTED: [Ψ 9 # λ § @] -> DECRYPTION FAILED! Private Key Required!");
    setTimeout(() => {
      playSuccess();
      setLevel(3);
    }, 1500);
  };

  // ── LEVEL 3 HANDLERS (Bob's Keypad Deciphering) ──
  const handleBobKeypadPress = (char: string) => {
    if (bobTypedKey.length >= 8) return;
    playClick();
    setBobKeypadError(null);
    setBobTypedKey((prev) => prev + char);
  };

  const handleBobKeypadClear = () => {
    playPop();
    setBobKeypadError(null);
    setBobTypedKey("");
  };

  const handleBobKeypadBackspace = () => {
    playClick();
    setBobKeypadError(null);
    setBobTypedKey((prev) => prev.slice(0, -1));
  };

  const handleBobKeypadSubmit = () => {
    if (bobTypedKey.trim().toUpperCase() === correctBobPrivateKey) {
      playSuccess();
      setIsBobDeciphering(true);
      setBobKeypadError(null);
      setTimeout(() => {
        setIsBobDeciphering(false);
        setBobDecrypted(true);
        setTimeout(() => {
          setLevel(4);
        }, 1200);
      }, 1000);
    } else {
      playZap();
      setBobKeypadError("Incorrect key! Look at Bob's card: BOB-99");
    }
  };

  // ── LEVEL 4 HANDLERS (Bob's Reply Sealing) ──
  const handleSelectReplyLock = (type: "bobs_lock" | "alices_public_lock") => {
    playClick();
    setSelectedReplyLock(type);
    if (type === "bobs_lock") {
      setReplyLockError("Wrong lock! If Bob locks with his own lock, Alice cannot open it!");
    } else {
      setReplyLockError(null);
    }
  };

  const handleSendBobReply = () => {
    if (selectedReplyLock !== "alices_public_lock") return;
    playPop();
    setReplySent(true);
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setLevel(5);
    }, 1200);
  };

  // ── LEVEL 5 HANDLERS (Alice's Keypad Deciphering) ──
  const handleAliceKeypadPress = (char: string) => {
    if (aliceTypedKey.length >= 10) return;
    playClick();
    setAliceKeypadError(null);
    setAliceTypedKey((prev) => prev + char);
  };

  const handleAliceKeypadClear = () => {
    playPop();
    setAliceKeypadError(null);
    setAliceTypedKey("");
  };

  const handleAliceKeypadBackspace = () => {
    playClick();
    setAliceKeypadError(null);
    setAliceTypedKey((prev) => prev.slice(0, -1));
  };

  const handleAliceKeypadSubmit = () => {
    if (aliceTypedKey.trim().toUpperCase() === correctAlicePrivateKey) {
      playSuccess();
      setIsAliceDeciphering(true);
      setAliceKeypadError(null);
      setTimeout(() => {
        setIsAliceDeciphering(false);
        setAliceDecrypted(true);
        setHasWon(true);
        reportComplete({ points: 100 });
      }, 1000);
    } else {
      playZap();
      setAliceKeypadError("Incorrect key! Look at Alice's card: ALICE-77");
    }
  };

  const handleReset = () => {
    playPop();
    setLevel(1);
    setSelectedWordIndex(0);
    setAliceLocked(false);
    setAliceSent(false);
    setIsTransmitting(false);
    setSnooperTested(false);
    setSnooperLog(null);
    setBobTypedKey("");
    setBobKeypadError(null);
    setIsBobDeciphering(false);
    setBobDecrypted(false);
    setSelectedReplyLock(null);
    setReplyLockError(null);
    setReplySent(false);
    setAliceTypedKey("");
    setAliceKeypadError(null);
    setIsAliceDeciphering(false);
    setAliceDecrypted(false);
    setHasWon(false);
  };

  const handleSpeak = () => {
    playPop();
    speakInstructions(currentDirective);
  };

  return (
    <GradeThreeScaffold
      fullBleed={true}
      hideHeader={true}
      instruction={currentDirective}
      currentStep={level - 1}
      totalSteps={5}
      onReset={handleReset}
      tray={
        /* ── CLEAN STATUS HUD (All interactive buttons live diegetically on tablets & van!) ── */
        <div className="flex items-center justify-between w-full px-3 sm:px-6 text-[#451a03]">
          {/* Level Progress Badge & Directive */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-[#f59e0b] text-[#451a03] font-mono text-xs font-black shadow-xs">
              LEVEL {level} OF 5
            </span>
            <span className="text-xs font-black text-[#78350f] hidden sm:inline truncate max-w-[380px] md:max-w-[540px]">
              {currentDirective}
            </span>
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-[#d1fae5] border-[#10b981] text-[#065f46] animate-pulse"
                  : "bg-[#fef3c7] hover:bg-[#fde68a] border-[#fcd34d] text-[#78350f]"
              }`}
              title="Read Directive Aloud"
            >
              <Volume2 size={14} />
            </button>
          </div>

          {/* Network Location & Stage Tracker */}
          <div className="flex items-center gap-3 text-xs font-black">
            <span className="text-[#92400e] hidden md:inline">Airwave Transit:</span>
            <span className="px-2.5 py-1 rounded-xl font-mono text-[11px] bg-[#fed7aa] text-[#9a3412] border border-[#ea580c] shadow-xs">
              {level === 1
                ? "House #1 (Alice Sealing Message)"
                : level === 2
                ? "5G Mobile Mast (Airwave Intercept)"
                : level === 3
                ? "House #2 (Bob Keypad Decrypting)"
                : level === 4
                ? "House #2 (Bob Sealing Return Reply)"
                : "House #1 (Alice Keypad Decrypting)"}
            </span>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border border-[#fcd34d] cursor-pointer shadow-xs transition-all"
              title="Restart Lab"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      }
    >
      {/* ── FULL-BLEED TWO-HOUSE & 5G MOBILE TOWER STAGE (Zero Side Margins) ── */}
      <div className="relative w-full h-full flex items-stretch overflow-hidden select-none">
        
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── HOUSE #1 (LEFT): ALICE'S LIVING ROOM ─────────────────── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="relative w-[34%] bg-[#fffbeb] border-r-4 border-[#b45309] flex flex-col justify-between p-2 sm:p-3 overflow-hidden shadow-lg">
          {/* Living Room Wallpaper Texture SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
            <defs>
              <pattern id="aliceWallPattern" width="28" height="28" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="28" stroke="#d97706" strokeWidth="0.8" />
                <circle cx="14" cy="14" r="2" fill="#f59e0b" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#aliceWallPattern)" />
          </svg>

          {/* Living Room Header & Wi-Fi Rooftop Emitter */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#ca8a04]/40 pb-1">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0284c7]/20 border border-[#0284c7]/40 text-[#0369a1] text-[10px] font-mono font-black">
              <Home size={11} className="text-[#0284c7]" />
              <span>HOUSE #1: ALICE&apos;S LIVING ROOM</span>
            </div>

            <div className="flex items-center gap-1 bg-[#fed7aa] border border-[#ea580c] px-2 py-0.5 rounded-md text-[8px] font-mono font-bold text-[#9a3412]">
              <Radio size={10} className="text-[#ea580c]" />
              <span>Wi-Fi Emitter</span>
            </div>
          </div>

          {/* Alice's Secret Key Certificate & Decor SVGs */}
          <div className="relative z-10 flex items-center justify-between px-2 my-0.5">
            {/* Alice's Official Secret Key Badge */}
            <div className="px-2 py-0.5 rounded-lg border-2 border-blue-500 bg-blue-50 flex items-center gap-1.5 text-[8.5px] font-mono font-black text-blue-900 shadow-xs ring-1 ring-blue-300">
              <Key size={11} className="text-blue-700" />
              <span>ALICE&apos;S SECRET KEY: {correctAlicePrivateKey}</span>
            </div>

            {/* Potted Indoor Succulent Plant SVG */}
            <svg width="24" height="26" viewBox="0 0 26 30" className="drop-shadow-xs pointer-events-none">
              <path d="M13 18 C11 12, 4 10, 6 6 C10 6, 12 12, 13 18 Z" fill="#10b981" />
              <path d="M13 18 C15 12, 22 10, 20 6 C16 6, 14 12, 13 18 Z" fill="#059669" />
              <polygon points="6,18 20,18 18,28 8,28" fill="#ea580c" stroke="#9a3412" strokeWidth="1" />
            </svg>
          </div>

          {/* ── ALICE'S MASSIVE REALISTIC TABLET ── */}
          <div className="relative z-20 mx-auto flex flex-col items-center flex-1 justify-center py-0.5 w-full max-w-[390px] min-h-0">
            {/* Tablet Chassis */}
            <div className="relative w-full flex-1 max-h-[460px] min-h-[340px] bg-[#0f172a] rounded-[28px] border-4 border-[#334155] shadow-2xl p-2.5 flex flex-col justify-between ring-1 ring-slate-700/50">
              
              {/* Glossy White Screen */}
              <div className="flex-1 w-full bg-white rounded-2xl flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200">
                
                {/* Status Bar */}
                <div className="w-full flex items-center justify-between px-3 py-1 text-[9px] font-mono text-slate-500 bg-slate-100 border-b border-slate-200">
                  <span className="font-bold">9:41 AM</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-black/80 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi size={12} className="text-blue-600" />
                    <span className="text-[8px] font-bold text-slate-600">5G</span>
                    <Battery size={13} className="text-emerald-600" />
                  </div>
                </div>

                {/* Chat App Header */}
                <div className="px-3 py-1.5 bg-blue-600 text-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200 shadow-xs">
                      B
                    </div>
                    <div>
                      <div className="text-[11px] font-black leading-tight">Bob (Friend)</div>
                      <span className="text-[8px] text-blue-200 flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active now
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-700 text-[8px] font-mono font-bold text-blue-100 border border-blue-400">
                    <Lock size={9} /> Bob&apos;s Lock: Public Key - BOB
                  </div>
                </div>

                {/* Chat Message Stream */}
                <div className="flex-1 p-3 flex flex-col justify-between bg-slate-50 text-[10px] overflow-hidden">
                  {/* Bob's Incoming Request Bubble */}
                  <div className="self-start max-w-[88%] bg-slate-200 text-slate-800 rounded-2xl rounded-tl-xs p-2.5 shadow-2xs leading-snug">
                    <span className="font-bold text-blue-700 block text-[9px]">Bob:</span>
                    <span>Hey Alice! Send me the secret treehouse code using my Public Padlock!</span>
                  </div>

                  {/* Alice's Outgoing Message Bubble */}
                  <div className="self-end max-w-[95%] flex flex-col items-end my-1">
                    <div
                      className={`p-3 rounded-2xl rounded-tr-xs border-2 transition-all duration-300 shadow-md ${
                        !aliceLocked
                          ? "bg-blue-600 border-blue-700 text-white"
                          : "bg-gradient-to-br from-amber-600 to-amber-700 border-amber-800 text-amber-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[9px] font-mono font-bold mb-1 opacity-90 border-b border-white/20 pb-0.5">
                        <span className="flex items-center gap-1">
                          {aliceLocked ? <Lock size={11} /> : <Unlock size={11} />}
                          <span>{aliceLocked ? "LOCKED CIPHERTEXT" : "PLAINTEXT MESSAGE"}</span>
                        </span>
                        {aliceLocked && <span className="text-emerald-300 font-black">SHIELDED ✓</span>}
                      </div>

                      {/* Large Readable Text */}
                      <p className={`font-mono text-xs sm:text-sm font-black leading-snug ${aliceLocked ? "tracking-widest" : ""}`}>
                        {!aliceLocked ? activePlaintext : cipherText}
                      </p>
                    </div>

                    <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                      {!aliceLocked ? "Readable plaintext draft" : aliceSent ? "Airwave transmission sent ✓" : "Locked with Public Key - BOB"}
                    </span>
                  </div>

                  {/* Level 4 & 5: Bob's Incoming Return Reply onto Alice's Screen */}
                  {level >= 4 && replySent && (
                    <div className="self-start max-w-[95%] animate-fade-in my-1">
                      <div
                        className={`p-2.5 rounded-2xl rounded-tl-xs border-2 shadow-md transition-all ${
                          aliceDecrypted
                            ? "bg-emerald-600 border-emerald-700 text-white"
                            : "bg-amber-600 border-amber-700 text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[8px] font-mono mb-1 border-b border-white/20 pb-0.5">
                          <span className="flex items-center gap-1">
                            {aliceDecrypted ? <Unlock size={10} /> : <Lock size={10} />}
                            <span>{aliceDecrypted ? "DECRYPTED WITH ALICE-77 ✓" : "BOB'S SEALED REPLY"}</span>
                          </span>
                          {aliceDecrypted && <Sparkles size={9} className="text-yellow-300 animate-spin" />}
                        </div>
                        <p className={`font-mono text-xs font-black ${!aliceDecrypted ? "tracking-widest" : ""}`}>
                          {isAliceDeciphering ? (
                            <span className="text-yellow-300 animate-pulse flex items-center gap-1">
                              <Sparkles size={11} className="animate-spin" />
                              Deciphering with Alice&apos;s Private Key...
                            </span>
                          ) : aliceDecrypted ? (
                            bobReplyPlaintext
                          ) : (
                            bobReplyCipher
                          )}
                        </p>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 mt-0.5 block">
                        {aliceDecrypted ? "Decrypted with Private Key - ALICE" : "Sealed with Public Key - ALICE"}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── ON-TABLET DIEGETIC INTERACTION DOCK (Alice's Actions) ── */}
                <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex flex-col gap-1.5">
                  {/* LEVEL 1: Select message & Snap Public Key - BOB */}
                  {level === 1 && !aliceLocked && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-1.5">
                        {messageChoices.map((msg, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              playClick();
                              setSelectedWordIndex(idx);
                            }}
                            className={`flex-1 py-1 px-1 rounded-lg text-[8px] font-mono font-bold truncate transition-all ${
                              selectedWordIndex === idx
                                ? "bg-blue-600 text-white shadow-xs"
                                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            }`}
                          >
                            Code #{idx + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleSnapAliceLock}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 ring-2 ring-blue-400 animate-pulse transition-all"
                      >
                        <Lock size={15} className="stroke-[2.5]" />
                        <span>Snap Public Key - BOB to Encrypt</span>
                      </button>
                    </div>
                  )}

                  {level === 1 && aliceLocked && !aliceSent && (
                    <button
                      onClick={handleAliceSend}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 ring-2 ring-amber-400 animate-bounce transition-all"
                    >
                      <Send size={15} className="stroke-[2.5]" />
                      <span>Transmit via Airwaves to Mobile Tower →</span>
                    </button>
                  )}

                  {level >= 2 && level < 5 && (
                    <div className="py-1 text-center font-mono text-[9px] text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={13} />
                      <span>Encrypted transmission in transit across town</span>
                    </div>
                  )}

                  {/* LEVEL 5: ALICE'S INTERACTIVE TOUCH KEYPAD */}
                  {level === 5 && !aliceDecrypted && (
                    <div className="flex flex-col gap-1 bg-white p-2 rounded-xl border border-slate-300 shadow-xs">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="font-black text-slate-700">Type Alice&apos;s Secret Key:</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[8px]">
                          Target: {correctAlicePrivateKey}
                        </span>
                      </div>

                      {/* Keypad Display */}
                      <div className="w-full h-8 px-2 bg-slate-900 rounded-lg text-blue-400 font-mono text-xs font-black flex items-center justify-between border border-slate-700">
                        <span className="tracking-widest">
                          {aliceTypedKey || <span className="text-slate-500 font-normal">Tap keys below...</span>}
                        </span>
                        <div className="w-1.5 h-4 bg-blue-400 animate-pulse" />
                      </div>

                      {aliceKeypadError && (
                        <div className="text-[8px] font-mono text-red-600 font-bold text-center leading-tight">
                          {aliceKeypadError}
                        </div>
                      )}

                      {/* Alice's Keypad Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {["A", "L", "I", "C", "E", "-", "7"].map((char) => (
                          <button
                            key={char}
                            onClick={() => handleAliceKeypadPress(char)}
                            className="py-1.5 rounded-lg bg-slate-50 hover:bg-slate-200 border border-slate-300 text-slate-800 font-mono font-black text-xs cursor-pointer active:scale-95 shadow-xs transition-all"
                          >
                            {char}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-1 mt-0.5">
                        <button
                          onClick={handleAliceKeypadBackspace}
                          className="flex-1 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-mono font-bold text-[10px] flex items-center justify-center cursor-pointer active:scale-95 shadow-xs transition-all"
                        >
                          <Delete size={12} className="mr-1" />
                          <span>DEL</span>
                        </button>
                        <button
                          onClick={handleAliceKeypadClear}
                          className="w-12 py-1 rounded-lg bg-red-100 hover:bg-red-200 border border-red-300 text-red-800 font-mono font-black text-[9px] cursor-pointer active:scale-95 shadow-xs transition-all"
                        >
                          CLR
                        </button>
                        <button
                          onClick={handleAliceKeypadSubmit}
                          className="flex-[2] py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono font-black text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs ring-2 ring-blue-400 animate-pulse transition-all"
                        >
                          <Unlock size={12} />
                          <span>DECRYPT MESSAGE</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {level === 5 && aliceDecrypted && (
                    <div className="py-1 text-center font-mono text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={13} />
                      <span>Two-way End-to-End Encryption cycle complete!</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Hardwood Living Room Table Base Under Tablet */}
            <div className="w-full max-w-[390px] h-4 bg-gradient-to-b from-[#a14507] to-[#78350f] rounded-b-md shadow-md -mt-1 border-t border-[#f59e0b]/40 flex items-center justify-center">
              <span className="text-[8px] font-mono text-[#fde68a] opacity-80">Hardwood Living Table</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── CENTER SECTION: OUTDOOR STREET & 5G MOBILE TOWER ─────── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="relative flex-1 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd] flex flex-col justify-between items-center overflow-hidden">
          {/* Outdoor Sky Clouds SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <ellipse cx="20%" cy="10%" rx="35" ry="14" fill="white" opacity="0.8" />
            <ellipse cx="80%" cy="18%" rx="45" ry="16" fill="white" opacity="0.8" />
          </svg>

          {/* Tower Top Banner */}
          <div className="relative z-10 mt-2 px-3 py-0.5 rounded-full bg-slate-900/70 text-white border border-slate-700 text-[8px] font-mono font-bold flex items-center gap-1.5 shadow-md">
            <TowerControl size={11} className="text-[#38bdf8]" />
            <span>OUTDOOR 5G RELAY MAST & STREET</span>
          </div>

          {/* ── 5G LATTICE MOBILE TOWER ── */}
          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-end">
            {/* Blinking Top Warning Beacon */}
            <div className="w-3 h-3 rounded-full bg-red-600 animate-ping border border-red-300 shadow-md shadow-red-500 mb-0.5" />
            
            {/* FULL-HEIGHT GROUNDED TOWER SVG */}
            <svg width="140" height="235" viewBox="0 0 140 235" className="drop-shadow-xl">
              <line x1="70" y1="0" x2="70" y2="30" stroke="#dc2626" strokeWidth="3.5" />
              <polygon points="66,30 74,30 72,40 68,40" fill="#dc2626" />

              {/* Microwave Drum Dishes */}
              <circle cx="50" cy="45" r="11" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
              <circle cx="90" cy="45" r="11" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
              <circle cx="70" cy="64" r="9" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />

              {/* Lattice Legs Grounded to Street */}
              <line x1="60" y1="30" x2="16" y2="222" stroke="#dc2626" strokeWidth="4" />
              <line x1="80" y1="30" x2="124" y2="222" stroke="#dc2626" strokeWidth="4" />
              <line x1="70" y1="30" x2="70" y2="222" stroke="#ef4444" strokeWidth="2" />

              {[50, 75, 102, 132, 162, 192, 218].map((y) => (
                <g key={y}>
                  <line x1={60 - (y - 30) * 0.22} y1={y} x2={80 + (y - 30) * 0.22} y2={y} stroke="#ef4444" strokeWidth="2.5" />
                </g>
              ))}

              <rect x="6" y="218" width="26" height="15" rx="3" fill="#64748b" stroke="#334155" strokeWidth="2" />
              <rect x="108" y="218" width="26" height="15" rx="3" fill="#64748b" stroke="#334155" strokeWidth="2" />

              <rect x="60" y="82" width="20" height="24" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <circle cx="70" cy="94" r="3.5" fill={isTransmitting ? "#10b981" : "#38bdf8"} className="animate-pulse" />
            </svg>

            {/* ANIMATED AIRWAVE TRANSMISSION RINGS */}
            {isTransmitting && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-2 border-dashed border-amber-400 animate-ping opacity-90" />
                <div className="w-56 h-56 rounded-full border border-blue-400 animate-pulse opacity-70" />
                <div className="absolute -top-6 px-3 py-1 rounded-full bg-amber-500 text-white font-mono text-[8px] font-black shadow-lg">
                  5G AIRWAVE RELAY ACTIVE
                </div>
              </div>
            )}
          </div>

          {/* ── PAVED GROUND STREET ROAD ── */}
          <div className="w-full bg-[#334155] border-t-4 border-[#475569] py-2 px-3 flex items-center justify-between shadow-inner relative z-20">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-amber-400 pointer-events-none opacity-80" />

            {/* SNOOPER RADIO VAN (Interactive Attack Console) */}
            <div className="relative z-10 w-full max-w-[240px] mx-auto bg-slate-900 rounded-2xl border-2 border-red-500 p-2 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[7px] font-mono text-red-300 pb-1 border-b border-slate-700">
                <span className="flex items-center gap-1 font-bold">
                  <Radio size={9} className="text-red-400 animate-pulse" />
                  <span>Street Snooper Radio Van</span>
                </span>
                <span className="text-[6px] text-red-400 font-bold">{level === 2 ? "INTERCEPTING AIR" : "SCANNING"}</span>
              </div>

              {/* Snooper Live Display */}
              <div className="w-full bg-black rounded-lg p-1.5 my-1 font-mono text-[7px] text-center text-red-400 border border-slate-800 break-all leading-tight">
                {snooperLog || (level === 2 ? "AIRWAVE DETECTED: [Ψ 9 # λ § @] (ENCRYPTED!)" : "[WAITING FOR AIR TRAFFIC]")}
              </div>

              {/* Level 2: Interactive Snooper Test Button */}
              {level === 2 && !snooperTested && (
                <button
                  onClick={handleSnooperAttack}
                  className="w-full py-1.5 bg-red-950 hover:bg-red-900 border border-red-500 text-red-200 rounded-lg font-mono text-[8px] font-black flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 animate-pulse transition-all shadow-md"
                >
                  <ShieldAlert size={11} />
                  <span>Tap to Test: Can Snooper Read Airwave?</span>
                </button>
              )}

              {level === 2 && snooperTested && (
                <div className="text-[7px] font-mono text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={9} />
                  <span>Shield Proven: E2EE blocks eavesdropper!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── HOUSE #2 (RIGHT): BOB'S LIVING ROOM ─────────────────── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="relative w-[34%] bg-[#f0fdf4] border-l-4 border-[#047857] flex flex-col justify-between p-2 sm:p-3 overflow-hidden shadow-lg">
          {/* Living Room Wallpaper Texture SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
            <defs>
              <pattern id="bobLivingWallPattern" width="28" height="28" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="28" stroke="#059669" strokeWidth="0.8" />
                <circle cx="14" cy="14" r="2" fill="#10b981" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bobLivingWallPattern)" />
          </svg>

          {/* Room Header Label & Rooftop Receiver Antenna */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#059669]/30 pb-1">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#065f46] text-[10px] font-mono font-black">
              <Home size={11} className="text-[#059669]" />
              <span>HOUSE #2: BOB&apos;S LIVING ROOM</span>
            </div>

            <div className="flex items-center gap-1 bg-[#a7f3d0] border border-[#059669] px-2 py-0.5 rounded-md text-[8px] font-mono font-bold text-[#064e3b]">
              <Radio size={10} className="text-[#059669]" />
              <span>5G Receiver</span>
            </div>
          </div>

          {/* Bob's Confidential Private Key Certificate Card on Desk */}
          <div className="relative z-10 flex items-center justify-between px-2 my-0.5">
            <div className="px-2.5 py-1 rounded-lg border-2 border-emerald-500 bg-emerald-50 flex items-center gap-1.5 text-[8.5px] font-mono font-black text-emerald-900 shadow-xs ring-1 ring-emerald-300">
              <Key size={11} className="text-emerald-700" />
              <span>BOB&apos;S SECRET KEY: {correctBobPrivateKey}</span>
            </div>

            {/* Bookshelf SVG */}
            <svg width="40" height="24" viewBox="0 0 40 24" className="drop-shadow-xs pointer-events-none">
              <rect x="0" y="20" width="40" height="4" fill="#047857" />
              <rect x="4" y="4" width="6" height="16" fill="#3b82f6" rx="1" />
              <rect x="12" y="6" width="7" height="14" fill="#f59e0b" rx="1" />
              <rect x="21" y="2" width="5" height="18" fill="#ef4444" rx="1" />
              <rect x="28" y="7" width="8" height="13" fill="#10b981" rx="1" />
            </svg>
          </div>

          {/* ── BOB'S MASSIVE REALISTIC TABLET ── */}
          <div className="relative z-20 mx-auto flex flex-col items-center flex-1 justify-center py-0.5 w-full max-w-[390px] min-h-0">
            {/* Tablet Chassis */}
            <div className="relative w-full flex-1 max-h-[460px] min-h-[340px] bg-[#0f172a] rounded-[28px] border-4 border-[#334155] shadow-2xl p-2.5 flex flex-col justify-between ring-1 ring-slate-700/50">
              
              {/* Glossy White Screen */}
              <div className="flex-1 w-full bg-white rounded-2xl flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200">
                
                {/* Status Bar */}
                <div className="w-full flex items-center justify-between px-3 py-1 text-[9px] font-mono text-slate-500 bg-slate-100 border-b border-slate-200">
                  <span className="font-bold">9:41 AM</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-black/80 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi size={12} className="text-emerald-600" />
                    <span className="text-[8px] font-bold text-slate-600">5G</span>
                    <Battery size={13} className="text-emerald-600" />
                  </div>
                </div>

                {/* Chat App Header */}
                <div className="px-3 py-1.5 bg-emerald-600 text-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white text-emerald-700 font-black text-xs flex items-center justify-center border border-emerald-200 shadow-xs">
                      A
                    </div>
                    <div>
                      <div className="text-[11px] font-black leading-tight">Alice (Friend)</div>
                      <span className="text-[8px] text-emerald-200 flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Active now
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-700 text-[8px] font-mono font-bold text-emerald-100 border border-emerald-400">
                    <Key size={9} /> Private Key - BOB: {correctBobPrivateKey}
                  </div>
                </div>

                {/* Chat Message Stream */}
                <div className="flex-1 p-3 flex flex-col justify-between bg-slate-50 text-[10px] overflow-hidden">
                  {/* Bob's initial prompt to Alice */}
                  <div className="self-end max-w-[88%] bg-emerald-600 text-white rounded-2xl rounded-tr-xs p-2.5 shadow-2xs leading-snug">
                    <span className="font-bold text-emerald-200 block text-[9px]">Bob:</span>
                    <span>Hey Alice! Send me the treehouse code using my Public Padlock!</span>
                  </div>

                  {/* Alice's Incoming Packet onto Bob's Screen */}
                  <div className="self-start max-w-[95%] my-1">
                    {level < 3 && (
                      <div className="p-2.5 rounded-2xl rounded-tl-xs bg-slate-200 text-slate-500 font-mono text-[9px] italic border border-dashed border-slate-300">
                        Waiting for airwave transmission...
                      </div>
                    )}

                    {level >= 3 && (
                      <div
                        className={`p-3 rounded-2xl rounded-tl-xs border-2 shadow-md transition-all ${
                          bobDecrypted
                            ? "bg-emerald-600 border-emerald-700 text-white"
                            : "bg-amber-600 border-amber-700 text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] font-mono mb-1 border-b border-white/20 pb-0.5">
                          <span className="flex items-center gap-1">
                            {bobDecrypted ? <Unlock size={11} /> : <Lock size={11} />}
                            <span>{bobDecrypted ? "DECRYPTED WITH BOB-99 ✓" : "ENCRYPTED INCOMING PACKET"}</span>
                          </span>
                          {!bobDecrypted && <span className="text-yellow-200 font-bold">LOCKED</span>}
                        </div>

                        <p className={`font-mono text-xs sm:text-sm font-black leading-snug ${!bobDecrypted ? "tracking-widest" : ""}`}>
                          {isBobDeciphering ? (
                            <span className="animate-pulse text-yellow-300 font-bold flex items-center gap-1">
                              <Sparkles size={12} className="animate-spin" />
                              Deciphering with Bob&apos;s Private Key...
                            </span>
                          ) : bobDecrypted ? (
                            activePlaintext
                          ) : (
                            cipherText
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bob's Return Reply Bubble */}
                  {level >= 4 && (
                    <div className="self-end max-w-[95%] my-1">
                      <div
                        className={`p-2.5 rounded-2xl rounded-tr-xs border-2 text-white shadow-md transition-all ${
                          selectedReplyLock === "alices_public_lock"
                            ? "bg-gradient-to-br from-amber-600 to-amber-700 border-amber-800"
                            : "bg-emerald-700 border-emerald-800"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[8px] font-mono mb-1 border-b border-white/20 pb-0.5">
                          <span>BOB&apos;S OUTGOING REPLY</span>
                          <span>{replySent ? "SENT ✓" : selectedReplyLock === "alices_public_lock" ? "SEALED" : "DRAFT"}</span>
                        </div>
                        <p className={`font-mono text-xs font-black ${selectedReplyLock === "alices_public_lock" ? "tracking-widest" : ""}`}>
                          {selectedReplyLock === "alices_public_lock" ? bobReplyCipher : bobReplyPlaintext}
                        </p>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 mt-0.5 block text-right">
                        {selectedReplyLock === "alices_public_lock" ? "Locked with Public Key - ALICE" : "Unsealed draft"}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── ON-TABLET DIEGETIC INTERACTION DOCK (Bob's Actions) ── */}
                <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex flex-col gap-1.5">
                  {/* LEVEL 3: BOB'S TOUCH KEYPAD */}
                  {level === 3 && !bobDecrypted && (
                    <div className="flex flex-col gap-1 bg-white p-2 rounded-xl border border-slate-300 shadow-xs">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="font-black text-slate-700">Type Bob&apos;s Secret Key:</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[8px]">
                          Target: {correctBobPrivateKey}
                        </span>
                      </div>

                      {/* Display Screen */}
                      <div className="w-full h-8 px-2 bg-slate-900 rounded-lg text-emerald-400 font-mono text-xs font-black flex items-center justify-between border border-slate-700">
                        <span className="tracking-widest">
                          {bobTypedKey || <span className="text-slate-500 font-normal">Tap keys below...</span>}
                        </span>
                        <div className="w-1.5 h-4 bg-emerald-400 animate-pulse" />
                      </div>

                      {bobKeypadError && (
                        <div className="text-[8px] font-mono text-red-600 font-bold text-center leading-tight">
                          {bobKeypadError}
                        </div>
                      )}

                      {/* Keypad Grid */}
                      <div className="grid grid-cols-4 gap-1">
                        {["B", "O", "9", "-"].map((char) => (
                          <button
                            key={char}
                            onClick={() => handleBobKeypadPress(char)}
                            className="py-1.5 rounded-lg bg-slate-50 hover:bg-slate-200 border border-slate-300 text-slate-800 font-mono font-black text-xs cursor-pointer active:scale-95 shadow-xs transition-all"
                          >
                            {char}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-1 mt-0.5">
                        <button
                          onClick={handleBobKeypadBackspace}
                          className="flex-1 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-mono font-bold text-[10px] flex items-center justify-center cursor-pointer active:scale-95 shadow-xs transition-all"
                        >
                          <Delete size={12} className="mr-1" />
                          <span>DEL</span>
                        </button>
                        <button
                          onClick={handleBobKeypadClear}
                          className="w-12 py-1 rounded-lg bg-red-100 hover:bg-red-200 border border-red-300 text-red-800 font-mono font-black text-[9px] cursor-pointer active:scale-95 shadow-xs transition-all"
                        >
                          CLR
                        </button>
                        <button
                          onClick={handleBobKeypadSubmit}
                          className="flex-[2] py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-black text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs ring-2 ring-emerald-400 animate-pulse transition-all"
                        >
                          <Unlock size={12} />
                          <span>DECRYPT MESSAGE</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LEVEL 4: TWO-WAY RETURN REPLY (Full Option Labels!) */}
                  {level === 4 && !replySent && (
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[9px] font-mono text-slate-700 font-black">
                        Whose Public Key seals Bob&apos;s reply for Alice?
                      </div>

                      {replyLockError && (
                        <div className="text-[8px] font-mono text-red-600 font-bold bg-red-50 p-1 rounded border border-red-200">
                          {replyLockError}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => handleSelectReplyLock("alices_public_lock")}
                          className={`w-full py-2 px-2 rounded-xl border text-[9.5px] font-mono font-black flex items-center justify-between cursor-pointer active:scale-95 transition-all ${
                            selectedReplyLock === "alices_public_lock"
                              ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400 shadow-sm"
                              : "bg-emerald-50 hover:bg-emerald-100 border-emerald-400 text-emerald-800 animate-pulse"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Lock size={12} />
                            <span>Public Key - ALICE</span>
                          </span>
                          <span className="text-[8px] opacity-90">✓ Only Alice can open!</span>
                        </button>

                        <button
                          onClick={() => handleSelectReplyLock("bobs_lock")}
                          className={`w-full py-1.5 px-2 rounded-xl border text-[9px] font-mono font-bold flex items-center justify-between cursor-pointer active:scale-95 transition-all ${
                            selectedReplyLock === "bobs_lock"
                              ? "bg-red-100 border-red-500 text-red-800"
                              : "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-700"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Lock size={11} />
                            <span>Public Key - BOB</span>
                          </span>
                          <span className="text-[7.5px] opacity-75">(Bob&apos;s own lock)</span>
                        </button>
                      </div>

                      {selectedReplyLock === "alices_public_lock" && (
                        <button
                          onClick={handleSendBobReply}
                          className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95 animate-bounce mt-0.5"
                        >
                          <Send size={13} />
                          <span>Transmit Sealed Reply to Alice →</span>
                        </button>
                      )}
                    </div>
                  )}

                  {level >= 5 && (
                    <div className="py-1 text-center font-mono text-[9px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>Reply sealed with Public Key - ALICE & sent!</span>
                    </div>
                  )}

                  {level < 3 && (
                    <div className="py-1 text-center font-mono text-[9px] text-slate-400 font-bold">
                      Awaiting incoming airwave packet...
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Hardwood Study Desk Base Under Tablet */}
            <div className="w-full max-w-[390px] h-4 bg-gradient-to-b from-[#065f46] to-[#064e3b] rounded-b-md shadow-md -mt-1 border-t border-[#34d399]/40 flex items-center justify-center">
              <span className="text-[8px] font-mono text-[#a7f3d0] opacity-80">Hardwood Study Desk</span>
            </div>
          </div>
        </div>

      </div>

      <Celebration
        isActive={hasWon}
        title="End-to-End Encryption Mastered!"
        message="You proved that messages locked with a recipient's public key travel securely through airwaves and cell towers, and can only be decrypted by typing the recipient's matching secret private key!"
        onReplay={handleReset}
      />
    </GradeThreeScaffold>
  );
}
