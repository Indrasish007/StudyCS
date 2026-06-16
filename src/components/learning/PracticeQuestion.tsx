import React, { useState } from "react";

interface PracticeQuestionProps {
  question: string;
  hint?: string;
  answer: string;
}

export default function PracticeQuestion({ question, hint, answer }: PracticeQuestionProps) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="my-4 p-4 rounded-2xl border border-emerald-300 bg-emerald-50/40 font-hand text-slate-800 text-xs md:text-sm">
      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">
        ✍️ Practice Prompt
      </span>
      <h4 className="font-bold text-sm text-slate-800 leading-tight mb-2">
        {question}
      </h4>

      <div className="flex gap-2 justify-end my-1">
        {hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-2.5 py-1 text-[10px] border border-amber-300 text-amber-700 bg-amber-50/30 hover:bg-amber-50 rounded"
          >
            {showHint ? "Hide Hint" : "Check Hint"}
          </button>
        )}
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-3 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded shadow-sm"
        >
          {showAnswer ? "Hide Answer" : "Reveal Answer"}
        </button>
      </div>

      {showHint && hint && (
        <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
          <strong>Hint:</strong> {hint}
        </div>
      )}

      {showAnswer && (
        <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs md:text-sm leading-relaxed">
          <strong className="block text-slate-700 mb-0.5">Solution:</strong>
          {answer}
        </div>
      )}
    </div>
  );
}
