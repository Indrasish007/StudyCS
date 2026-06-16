import React from "react";

interface DefinitionProps {
  term: string;
  children: React.ReactNode;
}

export default function Definition({ term, children }: DefinitionProps) {
  return (
    <div className="my-3 p-3 rounded-lg border-l-4 border-cyan-500 bg-cyan-50/40 font-hand text-slate-800 text-xs md:text-sm">
      <span className="text-[10px] font-bold text-cyan-600 tracking-wider uppercase block mb-0.5">
        📖 Definition
      </span>
      <strong className="text-slate-800 font-bold block">{term}:</strong>
      <div className="leading-relaxed mt-0.5">{children}</div>
    </div>
  );
}
