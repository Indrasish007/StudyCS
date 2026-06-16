
interface FormulaProps {
  title: string;
  latex: string;
  description?: string;
}

export default function Formula({ title, latex, description }: FormulaProps) {
  return (
    <div className="my-3 p-3.5 rounded-xl border border-violet-300 bg-violet-50/50 font-hand text-slate-800 text-xs md:text-sm">
      <span className="text-[10px] font-bold text-violet-600 tracking-wider uppercase block mb-1">
        📐 Equation
      </span>
      <strong className="block text-slate-800 mb-1">{title}</strong>
      <div className="overflow-x-auto py-2.5 px-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-center text-xs md:text-sm my-1">
        {`$$${latex}$$`}
      </div>
      {description && (
        <p className="text-[10px] text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
}
