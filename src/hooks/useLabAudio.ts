"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// Global audio state synchronized across hook instances
let globalIsSpeaking = false;
const speakingListeners = new Set<(isSpeaking: boolean) => void>();

export let globalErrorCount = 0;
const errorListeners = new Set<(count: number) => void>();

export const resetGlobalErrorCount = () => {
  globalErrorCount = 0;
  errorListeners.forEach((l) => l(globalErrorCount));
};

// Utterance reference to prevent V8 Garbage Collection mid-speech
let _activeUtterance: SpeechSynthesisUtterance | null = null;
let _keepaliveTimer: ReturnType<typeof setInterval> | null = null;

function clearKeepalive() {
  if (_keepaliveTimer) {
    clearInterval(_keepaliveTimer);
    _keepaliveTimer = null;
  }
}

function startKeepalive() {
  clearKeepalive();
  // Solves Chromium / Edge SpeechSynthesis 15s silent cutoff bug
  _keepaliveTimer = setInterval(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    } else {
      clearKeepalive();
    }
  }, 10000);
}

function setGlobalIsSpeaking(value: boolean) {
  globalIsSpeaking = value;
  if (!value) {
    clearKeepalive();
    _activeUtterance = null;
    if (typeof window !== "undefined") {
      (window as unknown as { _activeUtterance: SpeechSynthesisUtterance | null })._activeUtterance = null;
    }
  }
  speakingListeners.forEach((l) => l(value));
}

// Single shared Web Audio Context
let _sharedCtx: AudioContext | null = null;
const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  try {
    if (!_sharedCtx || _sharedCtx.state === "closed") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      _sharedCtx = new AudioCtx();
    }
    if (_sharedCtx.state === "suspended") _sharedCtx.resume();
    return _sharedCtx;
  } catch {
    return null;
  }
};

const playTone = (freq: number, type: OscillatorType, duration: number, delay = 0) => {
  setTimeout(() => {
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Audio unsupported or blocked by browser autoplay policy
    }
  }, delay);
};

let _cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const loadVoices = () => {
    try {
      _cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      /* ignore */
    }
  };
  loadVoices();
  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
}

let _speakTimeout: ReturnType<typeof setTimeout> | null = null;

function clearSpeakTimeout() {
  if (_speakTimeout) {
    clearTimeout(_speakTimeout);
    _speakTimeout = null;
  }
}

export function cancelAllSpeech() {
  clearSpeakTimeout();
  clearKeepalive();
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }
  _activeUtterance = null;
  if (typeof window !== "undefined") {
    (window as unknown as { _activeUtterance: SpeechSynthesisUtterance | null })._activeUtterance = null;
  }
  setGlobalIsSpeaking(false);
}

if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAllSpeech();
  });
  window.addEventListener("blur", () => cancelAllSpeech());
  window.addEventListener("beforeunload", () => cancelAllSpeech());
  window.addEventListener("pagehide", () => cancelAllSpeech());
}

export function useLabAudio() {
  const [isSpeaking, setIsSpeaking] = useState(globalIsSpeaking);
  const [errorCount, setErrorCount] = useState(globalErrorCount);

  useEffect(() => {
    speakingListeners.add(setIsSpeaking);
    errorListeners.add(setErrorCount);
    return () => {
      speakingListeners.delete(setIsSpeaking);
      errorListeners.delete(setErrorCount);
    };
  }, []);

  const playClick = useCallback(() => playTone(660, "sine", 0.08), []);
  const playPop = useCallback(() => playTone(880, "sine", 0.1), []);
  const playSuccess = useCallback(() => {
    playTone(523.25, "sine", 0.15);
    playTone(659.25, "sine", 0.15, 120);
    playTone(783.99, "sine", 0.15, 240);
    playTone(1046.5, "sine", 0.4, 360);
  }, []);
  const playError = useCallback(() => {
    globalErrorCount++;
    errorListeners.forEach((l) => l(globalErrorCount));
    playTone(180, "sawtooth", 0.3);
  }, []);
  const playZap = useCallback(() => playTone(440, "square", 0.12), []);
  const playDrop = useCallback(() => playTone(300, "sine", 0.15), []);
  const playChime = useCallback(() => {
    playTone(1046.5, "sine", 0.2);
    playTone(1318.5, "sine", 0.2, 150);
  }, []);

  const stopSpeaking = useCallback(() => {
    cancelAllSpeech();
  }, []);

  const speakInstructions = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (typeof document !== "undefined" && document.hidden) return;
    if (!text || text.trim().length === 0) return;

    clearSpeakTimeout();
    try {
      clearKeepalive();
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }

    _speakTimeout = setTimeout(() => {
      try {
        if (!window.speechSynthesis) return;
        if (typeof document !== "undefined" && document.hidden) return;
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.1;

        const voices = window.speechSynthesis.getVoices();
        const availableVoices = voices.length > 0 ? voices : _cachedVoices;

        const goodVoice =
          availableVoices.find((v) => v.lang === "en-IN" || v.lang.includes("en-IN")) ||
          availableVoices.find(
            (v) =>
              v.lang.includes("en") &&
              (v.name.includes("Female") || v.name.includes("Google") || v.name.includes("Samantha"))
          );

        if (goodVoice) {
          utterance.voice = goodVoice;
        }

        _activeUtterance = utterance;
        (window as unknown as { _activeUtterance: SpeechSynthesisUtterance })._activeUtterance = utterance;

        utterance.onstart = () => {
          setGlobalIsSpeaking(true);
          startKeepalive();
        };

        utterance.onend = () => {
          setGlobalIsSpeaking(false);
        };

        utterance.onerror = (e) => {
          console.warn("Speech synthesis notice:", e);
          setGlobalIsSpeaking(false);
        };

        setGlobalIsSpeaking(true);
        startKeepalive();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Speech synthesis error:", err);
        setGlobalIsSpeaking(false);
      }
    }, 50);
  }, []);

  useEffect(() => {
    const resume = () => getCtx();
    document.addEventListener("click", resume, { once: true });
    document.addEventListener("touchstart", resume, { once: true });

    return () => {
      cancelAllSpeech();
      document.removeEventListener("click", resume);
      document.removeEventListener("touchstart", resume);
    };
  }, []);

  return {
    playClick,
    playPop,
    playSuccess,
    playError,
    playZap,
    playDrop,
    playChime,
    speakInstructions,
    stopSpeaking,
    isSpeaking,
    errorCount,
  };
}

