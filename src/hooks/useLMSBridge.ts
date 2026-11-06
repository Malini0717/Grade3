"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { globalErrorCount, resetGlobalErrorCount } from "./useLabAudio";

type LMSInitData = {
  userId?: string;
  studentName?: string;
  grade?: number;
  levelValue?: number;
  mode?: string;
  attemptId?: string;
  sessionId?: string;
  labId?: string;
  [key: string]: unknown;
};

type LMSMessage = { type?: string; data?: LMSInitData; [key: string]: unknown } | LMSInitData;

type ReportCompleteArgs = {
  labId?: string;
  points?: number;
  timeTaken?: number;
  extraData?: Record<string, unknown>;
};

const DEFAULT_POINTS = 100;
const GRADE = 3;

// Global smart timer state
let globalStartTime = typeof window !== "undefined" ? Date.now() : 0;
let globalIsCompleted = false;
let globalIsStarted = false;
let frozenActiveTimeSeconds = 0;
let initialized = false;

const timeListeners = new Set<(time: number, completed: boolean) => void>();

function getActiveTime() {
  if (globalIsCompleted) return frozenActiveTimeSeconds;
  if (!globalIsStarted) return 0;
  return (Date.now() - globalStartTime) / 1000;
}

function tickTimer() {
  if (typeof window === "undefined" || globalIsCompleted || !globalIsStarted) return;
  timeListeners.forEach((listener) => listener(getActiveTime(), globalIsCompleted));
}

if (typeof window !== "undefined" && !initialized) {
  initialized = true;
  globalStartTime = Date.now();
  setInterval(tickTimer, 1000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      tickTimer();
    }
  });
}

export function resetGlobalTimer() {
  globalStartTime = Date.now();
  globalIsCompleted = false;
  globalIsStarted = false;
  frozenActiveTimeSeconds = 0;
  resetGlobalErrorCount();
  timeListeners.forEach((listener) => listener(0, globalIsCompleted));
}

export function startGlobalTimer() {
  if (!globalIsStarted) {
    globalStartTime = Date.now();
    globalIsStarted = true;
    timeListeners.forEach((listener) => listener(0, globalIsCompleted));
  }
}

function exitFullscreen() {
  if (typeof document !== "undefined") {
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => void;
      msExitFullscreen?: () => void;
      mozCancelFullScreen?: () => void;
    };
    if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) {
      if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
    }
  }
}

export function useSmartTimer() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);
  const [completed, setCompleted] = useState(globalIsCompleted);

  useEffect(() => {
    setMounted(true);
    setTime(getActiveTime());
    setCompleted(globalIsCompleted);

    const listener = (newTime: number, newCompleted: boolean) => {
      setTime(newTime);
      setCompleted(newCompleted);
    };
    timeListeners.add(listener);
    return () => {
      timeListeners.delete(listener);
    };
  }, []);

  return { activeTimeSeconds: mounted ? time : 0, isCompleted: completed };
}

export function useLMSBridge(defaultLabId?: string) {
  const [lmsData, setLmsData] = useState<LMSInitData>({});
  const reportedLabsRef = useRef<Set<string>>(new Set());
  const [hasParentFrame, setHasParentFrame] = useState(false);

  const getTimeTaken = useCallback(() => Math.max(1, Math.round(getActiveTime())), []);

  useEffect(() => {
    resetGlobalTimer();
  }, [defaultLabId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isEmbedded = window.parent !== window;
    setHasParentFrame(isEmbedded);

    const handleMessage = (event: MessageEvent<LMSMessage>) => {
      const message = event.data;
      if (!message || typeof message !== "object") return;

      if ("type" in message && message.type === "lmsInit") {
        setLmsData((prev) => ({ ...prev, ...(message.data ?? {}) }));
        return;
      }
      if ("type" in message && message.type === "lmsContext" && "data" in message && message.data) {
        setLmsData((prev) => ({ ...prev, ...(message.data ?? {}) }));
        return;
      }
      if (!("type" in message)) {
        const hasKnownKeys =
          "userId" in message ||
          "studentName" in message ||
          "grade" in message ||
          "levelValue" in message ||
          "mode" in message ||
          "attemptId" in message ||
          "sessionId" in message ||
          "labId" in message;
        if (hasKnownKeys) setLmsData((prev) => ({ ...prev, ...message }));
      }
    };

    window.addEventListener("message", handleMessage);
    if (isEmbedded) {
      window.parent.postMessage({ type: "labReady", data: { grade: GRADE, labId: defaultLabId ?? null } }, "*");
    }
    return () => window.removeEventListener("message", handleMessage);
  }, [defaultLabId]);

  const reportComplete = useCallback(
    ({ labId, points, timeTaken, extraData }: ReportCompleteArgs = {}) => {
      if (typeof window === "undefined") return;

      if (!globalIsCompleted) {
        globalIsCompleted = true;
        frozenActiveTimeSeconds = (Date.now() - globalStartTime) / 1000;
        setTimeout(() => {
          timeListeners.forEach((listener) => listener(frozenActiveTimeSeconds, globalIsCompleted));
        }, 0);
      }

      if (window.parent === window) return; // Local dev preview

      const resolvedLabId =
        labId ??
        lmsData.labId ??
        defaultLabId ??
        (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : undefined);

      if (!resolvedLabId || reportedLabsRef.current.has(resolvedLabId)) return;

      exitFullscreen();

      globalIsCompleted = true;
      frozenActiveTimeSeconds = (Date.now() - globalStartTime) / 1000;
      timeListeners.forEach((listener) => listener(frozenActiveTimeSeconds, globalIsCompleted));

      reportedLabsRef.current.add(resolvedLabId);

      const finalTimeTaken = timeTaken ?? getTimeTaken();
      const finalPoints = points !== undefined ? points : Math.max(0, DEFAULT_POINTS - globalErrorCount * 5);

      window.parent.postMessage(
        {
          type: "levelComplete",
          data: {
            labId: resolvedLabId,
            grade: GRADE,
            level: Number(lmsData.levelValue ?? 1),
            points: finalPoints,
            score: finalPoints,
            timeTaken: finalTimeTaken,
            userId: lmsData.userId,
            attemptId: lmsData.attemptId,
            sessionId: lmsData.sessionId,
            mode: lmsData.mode,
            completedAt: new Date().toISOString(),
            ...extraData,
          },
          points: finalPoints,
          score: finalPoints,
        },
        "*"
      );
    },
    [defaultLabId, getTimeTaken, lmsData]
  );

  return { lmsData, hasParentFrame, getTimeTaken, reportComplete };
}

