import React, { useEffect, useState } from "react";
import { Type, Maximize2, Minimize2, Eye, EyeOff, Layout, Printer, Info } from "lucide-react";

interface ReaderSettingsProps {
  fontSize: "sm" | "base" | "lg";
  onChangeFontSize: (size: "sm" | "base" | "lg") => void;
  widthMode: "compact" | "normal" | "wide";
  onChangeWidthMode: (mode: "compact" | "normal" | "wide") => void;
  focusMode: boolean;
  onChangeFocusMode: (focus: boolean) => void;
  readingTimeEst: string;
}

export default function ReaderSettings({
  fontSize,
  onChangeFontSize,
  widthMode,
  onChangeWidthMode,
  focusMode,
  onChangeFocusMode,
  readingTimeEst,
}: ReaderSettingsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-[#0D1220]/75 backdrop-blur-md p-1.5 rounded-xl border border-white/5 text-slate-300 select-none">
      
      {/* Font Size Selector */}
      <div className="flex items-center gap-1 border-r border-white/5 pr-2">
        <Type size={12} className="text-[#7C5CFF]" />
        <span className="text-[9px] font-bold uppercase tracking-wider mr-1 text-slate-500">Size:</span>
        {(["sm", "base", "lg"] as const).map((size) => (
          <button
            key={size}
            onClick={() => onChangeFontSize(size)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
              fontSize === size
                ? "bg-[#7C5CFF] text-white shadow"
                : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            {size === "sm" ? "A-" : size === "base" ? "A" : "A+"}
          </button>
        ))}
      </div>

      {/* Page Width Selector */}
      <div className="flex items-center gap-1 border-r border-white/5 pr-2">
        <Layout size={12} className="text-[#22D3EE]" />
        <span className="text-[9px] font-bold uppercase tracking-wider mr-1 text-slate-500">Width:</span>
        {(["compact", "normal", "wide"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onChangeWidthMode(mode)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
              widthMode === mode
                ? "bg-[#22D3EE]/25 text-[#22D3EE] border border-[#22D3EE]/30"
                : "hover:bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            {mode.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Focus Mode toggler */}
      <button
        onClick={() => onChangeFocusMode(!focusMode)}
        className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition border ${
          focusMode
            ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
            : "hover:bg-white/5 border-transparent text-slate-400 hover:text-slate-200"
        }`}
        title={focusMode ? "Disable Zen Mode" : "Enable Zen Mode"}
      >
        {focusMode ? <EyeOff size={11} /> : <Eye size={11} />}
        <span>{focusMode ? "Zen Mode" : "Zen"}</span>
      </button>

      {/* Fullscreen toggler */}
      <button
        onClick={toggleFullscreen}
        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase hover:bg-white/5 transition text-slate-400 hover:text-slate-200"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
        <span>{isFullscreen ? "Window" : "Full"}</span>
      </button>

      {/* Print Trigger */}
      <button
        onClick={() => window.print()}
        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition text-slate-400"
        title="Print Note (A4 Friendly Layout)"
      >
        <Printer size={11} />
        <span>Print</span>
      </button>

      {/* Reading Time Badge */}
      <div className="flex items-center gap-1 text-[9px] text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-lg ml-auto font-sans font-semibold border border-white/5">
        <Info size={10} className="text-[#7C5CFF]" />
        <span>{readingTimeEst}</span>
      </div>
    </div>
  );
}
