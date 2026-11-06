import Link from "next/link";
import { Compass, RotateCcw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#d97706] p-6 text-center">
      <div className="max-w-md bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03] p-8 rounded-3xl border-4 border-[#b45309] shadow-2xl flex flex-col items-center">
        <Compass size={48} className="text-[#fef08a] mb-3 animate-spin" />
        <h1 className="text-2xl font-black font-baloo text-[#fef3c7] uppercase tracking-wider mb-2">
          Lab Exploration Lost
        </h1>
        <p className="text-xs font-semibold text-[#fde68a] mb-6">
          The machine or lab module you are looking for has not been discovered or was moved.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-[#fef3c7] font-black text-xs uppercase tracking-wider border-2 border-[#fef08a] shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <RotateCcw size={15} /> Return to Computing Lab Hub
        </Link>
      </div>
    </div>
  );
}

