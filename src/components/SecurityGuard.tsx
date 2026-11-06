"use client";

import { useEffect, useState } from "react";

const ALLOWED_PARENT_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3004",
  "https://hub.tarcin.in",
];

const DEV_MODE = process.env.NODE_ENV === "development";

export default function SecurityGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(DEV_MODE);

  useEffect(() => {
    if (DEV_MODE) {
      setIsAuthorized(true);
      return;
    }

    const isInsideIframe = window.self !== window.top;
    const selfOrigin = window.location.origin;

    const isLocalhost = selfOrigin.startsWith("http://localhost:");
    if (isLocalhost) {
      setIsAuthorized(true);
      return;
    }

    if (!isInsideIframe) {
      window.location.href = "https://hub.tarcin.in";
      return;
    }

    let parentOrigin = "";
    let parentHostname = "";

    try {
      if (document.referrer) {
        const parentUrl = new URL(document.referrer);
        parentOrigin = parentUrl.origin;
        parentHostname = parentUrl.hostname;
      }
    } catch {
      parentOrigin = "";
      parentHostname = "";
    }

    const isAllowedParent =
      ALLOWED_PARENT_ORIGINS.includes(parentOrigin) ||
      parentHostname === "karky.in" ||
      parentHostname.endsWith(".karky.in");

    if (!isAllowedParent) {
      window.location.href = "https://hub.tarcin.in";
      return;
    }

    setIsAuthorized(true);
  }, []);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <div className="text-slate-600 animate-pulse font-baloo text-lg">
          Verifying LMS Authorization...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

