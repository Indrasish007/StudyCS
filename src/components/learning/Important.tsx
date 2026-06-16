import React from "react";

interface ImportantProps {
  children: React.ReactNode;
}

export default function Important({ children }: ImportantProps) {
  return (
    <div className="my-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 font-hand text-slate-800 text-xs md:text-sm relative overflow-hidden">
      <div className="absolute top-2 right-2 rotate-[4deg] bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm sticker-tab">
        EXAM HOT
      </div>
      <span className="text-[10px] font-bold text-rose-600 tracking-wider uppercase block mb-1">
        ⚠️ High Yield Watch
      </span>
      <div className="leading-relaxed pr-14">{children}</div>
    </div>
  );
}
