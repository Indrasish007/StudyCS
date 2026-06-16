import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { Search, BookOpen, Compass, CornerDownLeft, X } from "lucide-react";
import { NoteData } from "@/lib/notes";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteData[];
  onSelectSubject: (slug: string, headingId?: string) => void;
  onNavigate: (page: string) => void;
}

export default function SearchModal({ isOpen, onClose, notes, onSelectSubject, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(notes, {
      keys: ["metadata.title", "metadata.subject", "topics"],
      threshold: 0.3,
    });

    const searchResults = fuse.search(query).map((res) => ({
      type: "note",
      item: res.item.metadata,
    }));

    const staticOptions = [
      { name: "Revision Center", page: "revision", icon: Compass },
    ];

    const matchedStatic = staticOptions
      .filter((opt) => opt.name.toLowerCase().includes(query.toLowerCase()))
      .map((opt) => ({
        type: "navigation",
        item: opt,
      }));

    setResults([...searchResults, ...matchedStatic]);
    setSelectedIndex(0);
  }, [query, notes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const total = results.length > 0 ? results.length : 1; // Fallback to list length

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % total);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + total) % total);
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter") {
        e.preventDefault();
        triggerSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const triggerSelection = () => {
    if (results.length > 0) {
      const selected = results[selectedIndex];
      if (selected.type === "note") {
        onSelectSubject(selected.item.slug);
      } else if (selected.type === "navigation") {
        onNavigate(selected.item.page);
      }
    } else {
      const navOptions = ["revision"];
      if (selectedIndex < navOptions.length) {
        onNavigate(navOptions[selectedIndex]);
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-[#0f0b22] text-slate-100 shadow-2xl flex flex-col max-h-[400px]">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800 bg-[#080518]">
          <Search size={18} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes, outlines, and pages... (Ctrl + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none border-none text-slate-100 placeholder-slate-500"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {query === "" ? (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Quick Shortcuts
              </div>
              {[
                { name: "Revision Center", desc: "Formulas & Definitions Deck", page: "revision" },
              ].map((opt, idx) => (
                <button
                  key={opt.page}
                  onClick={() => {
                    onNavigate(opt.page);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs ${
                    selectedIndex === idx ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-900/50"
                  }`}
                >
                  <div>
                    <div className="font-bold">{opt.name}</div>
                    <div className="text-[10px] opacity-70">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (res.type === "note") onSelectSubject(res.item.slug);
                  else onNavigate(res.item.page);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs ${
                  selectedIndex === idx ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-900/50"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <BookOpen size={14} className="text-indigo-400" />
                  {res.item.title || res.item.name}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                  {res.type}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800/60 bg-[#070414] text-[9px] text-slate-500">
          <span>Navigate with Arrow keys</span>
          <span className="flex items-center gap-0.5">
            Press <CornerDownLeft size={10} /> Enter to select
          </span>
        </div>
      </div>
    </div>
  );
}
