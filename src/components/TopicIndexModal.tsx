import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, BookOpen, ArrowRight, HelpCircle } from "lucide-react";
import { NoteData } from "../lib/notes";

interface TopicIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteData[];
  onSelectTopic: (subjectSlug: string, headingId: string) => void;
}

interface IndexItem {
  originalText: string;
  cleanText: string;
  headingId: string;
  subjectSlug: string;
  subjectName: string;
  color: string;
}

// Clean prefixes like "Chapter 1: " or "1.2: "
function getCleanTopicText(text: string): string {
  return text.replace(/^(Chapter\s+\d+|[0-9]+(?:\.[0-9]+)+)[:.]?\s*/i, "").trim();
}

const colorBadges: Record<string, { bg: string; text: string; border: string }> = {
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
};

export default function TopicIndexModal({
  isOpen,
  onClose,
  notes,
  onSelectTopic,
}: TopicIndexModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setSearchQuery("");
      setSelectedLetter(null);
    }
  }, [isOpen]);

  // Extract and clean all topics from all notes
  const allTopics = useMemo(() => {
    const items: IndexItem[] = [];
    notes.forEach((note) => {
      note.toc.forEach((tocItem) => {
        const clean = getCleanTopicText(tocItem.text);
        if (clean) {
          items.push({
            originalText: tocItem.text,
            cleanText: clean,
            headingId: tocItem.id,
            subjectSlug: note.metadata.slug,
            subjectName: note.metadata.subject,
            color: note.metadata.color,
          });
        }
      });
    });
    // Sort alphabetically
    return items.sort((a, b) => a.cleanText.localeCompare(b.cleanText));
  }, [notes]);

  // Find which letters have topics associated with them
  const lettersWithTopics = useMemo(() => {
    const set = new Set<string>();
    allTopics.forEach((item) => {
      const firstChar = item.cleanText.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        set.add(firstChar);
      }
    });
    return set;
  }, [allTopics]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Handle letter tab click
  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null); // toggle off
    } else {
      setSelectedLetter(letter);
      setSearchQuery(""); // Clear search query when selecting a letter
    }
  };

  // Filter topics based on search query or selected letter
  const filteredTopics = useMemo(() => {
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return allTopics.filter(
        (item) =>
          item.cleanText.toLowerCase().includes(query) ||
          item.subjectName.toLowerCase().includes(query)
      );
    }

    if (selectedLetter) {
      return allTopics.filter(
        (item) => item.cleanText.charAt(0).toUpperCase() === selectedLetter
      );
    }

    return allTopics;
  }, [allTopics, searchQuery, selectedLetter]);

  // Group filtered results by first letter (only if not displaying search results)
  const groupedTopics = useMemo(() => {
    const groups: Record<string, IndexItem[]> = {};
    
    filteredTopics.forEach((item) => {
      let firstChar = item.cleanText.charAt(0).toUpperCase();
      if (!/[A-Z]/.test(firstChar)) {
        firstChar = "#";
      }
      
      if (!groups[firstChar]) {
        groups[firstChar] = [];
      }
      groups[firstChar].push(item);
    });

    return groups;
  }, [filteredTopics]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-2xl bg-[#0b0816] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[580px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span className="text-indigo-400">📖</span> A-Z Syllabus Topic Index
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Browse or search course chapters and sections alphabetically.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X size={15} />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-white/5 bg-slate-950/20">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search specific topics (e.g. Recurrence Relations, Dijkstra)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedLetter(null); // Clear letter filter when searching
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Alphabet Tabs */}
          <div className="px-5 py-3 border-b border-white/5 bg-slate-950/10">
            <div className="flex flex-wrap gap-1 items-center justify-center">
              {alphabet.map((letter) => {
                const isAvailable = lettersWithTopics.has(letter);
                const isSelected = selectedLetter === letter;

                return (
                  <button
                    key={letter}
                    disabled={!isAvailable}
                    onClick={() => handleLetterClick(letter)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                      isSelected
                        ? "bg-indigo-600 text-white border border-indigo-500 shadow-md"
                        : isAvailable
                        ? "text-slate-300 hover:bg-white/5 hover:text-white"
                        : "text-slate-600 opacity-30 cursor-not-allowed"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 notebook-scroll bg-slate-950/10">
            {filteredTopics.length > 0 ? (
              searchQuery || selectedLetter ? (
                // Flat list view for searches/letter filter
                <div className="space-y-2">
                  {filteredTopics.map((item, idx) => {
                    const badge = colorBadges[item.color] || colorBadges.indigo;
                    return (
                      <div
                        key={idx}
                        onClick={() => onSelectTopic(item.subjectSlug, item.headingId)}
                        className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-900/20 hover:bg-slate-900/60 hover:border-white/10 transition cursor-pointer group"
                      >
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition truncate">
                            {item.cleanText}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 truncate italic font-medium">
                            Header: {item.originalText}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {item.subjectName}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition duration-150">
                            <ArrowRight size={10} className="text-slate-400 group-hover:text-white transform group-hover:translate-x-0.5 transition" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Grouped alphabetical view when showing index
                Object.keys(groupedTopics)
                  .sort()
                  .map((letter) => (
                    <div key={letter} className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                          {letter}
                        </span>
                        <div className="flex-1 h-[1px] bg-white/5" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {groupedTopics[letter].map((item, idx) => {
                          const badge = colorBadges[item.color] || colorBadges.indigo;
                          return (
                            <div
                              key={idx}
                              onClick={() => onSelectTopic(item.subjectSlug, item.headingId)}
                              className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-900/10 hover:bg-slate-900/50 hover:border-white/10 transition cursor-pointer group"
                            >
                              <div className="flex flex-col min-w-0 pr-3">
                                <span className="text-xs font-semibold text-slate-300 group-hover:text-indigo-300 transition truncate">
                                  {item.cleanText}
                                </span>
                                <span className="text-[9.5px] text-slate-500 mt-0.5 truncate font-medium">
                                  {item.subjectName}
                                </span>
                              </div>

                              <div className="w-5 h-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition duration-150 shrink-0">
                                <ArrowRight size={8} className="text-slate-500 group-hover:text-white" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2">
                <HelpCircle size={32} className="text-slate-600" />
                <p className="text-xs font-bold uppercase tracking-wider">No matching topics found</p>
                <p className="text-[10px] text-slate-600">Try searching for other keywords or select a different letter.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
