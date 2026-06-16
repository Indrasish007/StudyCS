import React from "react";

interface SummaryProps {
  title?: string;
  children: React.ReactNode;
}

export default function Summary({ title = "Key Summary", children }: SummaryProps) {
  return (
    <div className="my-3 p-4 rounded-xl border border-slate-300 bg-slate-100/50 font-hand text-slate-700 text-xs md:text-sm">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
        📝 {title}
      </span>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
