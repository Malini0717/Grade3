"use client";

import { useEffect, useState } from "react";
import LabShell from "@/components/LabShell";
import { LabMetadata } from "@/data/labs";
import { LAB_COMPONENTS } from "@/labs/registry";
import { Construction } from "lucide-react";

export default function LabClientRunner({ labMeta }: { labMeta: LabMetadata }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#fffefc] to-[#f4f7fb] text-slate-800 font-baloo">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-sm font-semibold">Loading Lab Environment...</p>
        </div>
      </div>
    );
  }

  const LabComponent = LAB_COMPONENTS[labMeta.slug];

  return (
    <LabShell
      title={labMeta.title}
      category={labMeta.category}
      mode={labMeta.mode}
      theme={labMeta.theme}
      instruction={labMeta.instruction}
      voiceInstruction={labMeta.voiceInstruction}
      hints={labMeta.hints}
    >
      {LabComponent ? (
        <LabComponent />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 mb-4 shadow-sm">
            <Construction size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 font-baloo">
            {labMeta.title}
          </h2>
          <p className="text-slate-600 max-w-md text-sm font-medium leading-relaxed font-baloo">
            {labMeta.desc}
          </p>
        </div>
      )}
    </LabShell>
  );
}
