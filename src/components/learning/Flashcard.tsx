import React, { useState } from "react";

interface FlashcardProps {
  front: string;
  back: React.ReactNode | string;
}

export default function Flashcard({ front, back }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="my-4 w-full h-48 perspective-1000 cursor-pointer group select-none"
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-dashed border-indigo-400 bg-amber-50/90 shadow-md p-5 flex flex-col justify-between backface-hidden">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-daughter">
            <span>⚡ Active Recall Card</span>
            <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">QUESTION</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-center font-hand text-sm md:text-base font-bold text-slate-800 leading-snug">
            {front}
          </div>
          <div className="text-[9px] text-slate-400 text-center font-sans font-medium uppercase tracking-widest animate-pulse">
            Click Card to Flip & Reveal
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-dashed border-emerald-400 bg-[#fbf9f1] shadow-md p-5 flex flex-col justify-between rotate-y-180 backface-hidden">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-daughter">
            <span>🎯 Solution Verified</span>
            <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">ANSWER</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-center font-hand text-xs md:text-sm text-slate-800 overflow-y-auto leading-relaxed">
            {typeof back === "string" ? <p>{back}</p> : back}
          </div>
          <div className="text-[9px] text-slate-400 text-center font-sans font-medium uppercase tracking-widest">
            Click again to flip back
          </div>
        </div>
      </div>
    </div>
  );
}
