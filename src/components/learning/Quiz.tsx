import React, { useState } from "react";

interface QuizProps {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export default function Quiz({ question, options, answer, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (!submitted) setSelected(idx);
  };

  return (
    <div className="my-4 p-4 border-2 border-dashed border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-xl font-hand text-slate-800 dark:text-slate-200">
      <div className="font-bold text-sm mb-2 text-indigo-700 flex items-center gap-1.5">
        ❓ Quiz time: {question}
      </div>
      <div className="space-y-1.5 mb-3">
        {options.map((opt, idx) => {
          let color = "hover:bg-slate-100/50";
          if (selected === idx) color = "bg-indigo-100/80 font-bold border-indigo-300";
          if (submitted) {
            if (idx === answer) color = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
            else if (selected === idx) color = "bg-rose-100 text-rose-800 border-rose-300 line-through";
          }
          return (
            <button
              key={idx}
              disabled={submitted}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-2 border border-slate-200 rounded-lg text-xs md:text-sm transition-all duration-200 ${color}`}
            >
              {idx + 1}. {opt}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end gap-2 text-xs">
        {!submitted ? (
          <button
            onClick={() => selected !== null && setSubmitted(true)}
            disabled={selected === null}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg disabled:opacity-50"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={() => {
              setSubmitted(false);
              setSelected(null);
            }}
            className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg"
          >
            Reset
          </button>
        )}
      </div>
      {submitted && (
        <div className="mt-2 p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs md:text-sm">
          <span className="font-bold block mb-0.5">
            {selected === answer ? "🎉 Correct Answer!" : "❌ Try again!"}
          </span>
          {explanation || "Check the topic outline for more details."}
        </div>
      )}
    </div>
  );
}
