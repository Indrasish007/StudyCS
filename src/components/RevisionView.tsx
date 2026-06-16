import { useState, useEffect } from "react";
import { BookOpen, Sigma, HelpCircle, FileText, Search, Copy, Check, BrainCircuit } from "lucide-react";
import { getRevisionData, RevisionConcept } from "../lib/notes";
import Flashcard from "./learning/Flashcard";

export default function RevisionView() {
  const [query, setQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<RevisionConcept[]>([]);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [concepts, setConcepts] = useState<RevisionConcept[]>([]);

  // Load all note revision data on mount client-side
  useEffect(() => {
    try {
      const data = getRevisionData();
      setConcepts(data);
    } catch (err) {
      console.error("Revision loading failed:", err);
    }
  }, []);

  // Extract unique subjects
  const subjects = ["all", ...Array.from(new Set(concepts.map((c) => c.subject.toLowerCase())))];

  // Perform client-side filtering
  useEffect(() => {
    let result = concepts;

    if (selectedSubject !== "all") {
      result = result.filter((c) => c.subject.toLowerCase() === selectedSubject);
    }

    if (selectedType !== "all") {
      result = result.filter((c) => c.type === selectedType);
    }

    if (query.trim() !== "") {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.concept.toLowerCase().includes(q) ||
          c.details.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [query, selectedSubject, selectedType, concepts]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "formula":
        return <Sigma className="text-violet-600" size={14} />;
      case "definition":
        return <BookOpen className="text-cyan-600" size={14} />;
      case "question":
        return <HelpCircle className="text-emerald-600" size={14} />;
      default:
        return <FileText className="text-slate-500" size={14} />;
    }
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case "formula":
        return "border-violet-300 bg-violet-50/40";
      case "definition":
        return "border-cyan-300 bg-cyan-50/40";
      case "question":
        return "border-emerald-300 bg-emerald-50/40";
      default:
        return "border-slate-300 bg-slate-50/40";
    }
  };

  const getPrettySubjectName = (name: string) => {
    if (name === "all") return "All";
    if (name === "dbms") return "DBMS";
    if (name === "dsa") return "DSA";
    if (name === "ai") return "AI";
    if (name === "machine_learning") return "ML";
    return name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="p-2 md:p-4 font-hand select-text">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            📖 Revision Deck
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Browse through formulas, core definitions, and questions dynamically aggregated from your notes.
          </p>
        </div>

        <button
          onClick={() => setIsFlashcardMode(!isFlashcardMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition duration-150 ${
            isFlashcardMode 
              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" 
              : "border-slate-300 text-slate-700 hover:bg-slate-200/50 bg-white"
          }`}
        >
          <BrainCircuit size={14} />
          {isFlashcardMode ? "List View" : "Active Recall (Flashcards)"}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex items-center flex-1 max-w-sm">
          <Search className="absolute left-3 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search revision notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase font-daughter tracking-wider">Subject:</span>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition ${
                selectedSubject === sub
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-200/50 bg-white"
              }`}
            >
              {getPrettySubjectName(sub)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase font-daughter tracking-wider">Type:</span>
          {[
            { id: "all", label: "All" },
            { id: "definition", label: "Definitions" },
            { id: "formula", label: "Formulas" },
            { id: "question", label: "Questions" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                selectedType === type.id
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-200/50 bg-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        isFlashcardMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <Flashcard
                key={item.id}
                front={item.concept}
                back={
                  <div className="text-center font-hand">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-indigo-600 mb-1 font-daughter">
                      {item.topic}
                    </span>
                    <p className="text-xs text-slate-700">
                      {item.details}
                    </p>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border hover:shadow-sm transition-all duration-200 relative group flex flex-col justify-between ${getCardStyle(
                  item.type
                )}`}
              >
                <div>
                  {/* Top line */}
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded bg-white shadow-sm border border-slate-200">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block leading-none font-daughter">
                          {item.topic}
                        </span>
                        <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest block font-daughter mt-0.5">
                          {item.subject}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(item.id, `${item.concept}\n${item.details}`)}
                      className="p-1 rounded border border-slate-300 bg-white text-slate-400 hover:text-slate-600 shadow-sm opacity-0 group-hover:opacity-100 transition duration-150"
                      title="Copy"
                    >
                      {copiedId === item.id ? <Check className="text-emerald-600" size={11} /> : <Copy size={11} />}
                    </button>
                  </div>

                  {/* Concept */}
                  <h4 className="text-xs md:text-sm font-bold text-slate-800 mb-1 leading-snug">
                    {item.concept}
                  </h4>

                  {/* Details */}
                  <div className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.type === "formula" ? (
                      <div className="p-2 my-1.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-yellow-300 overflow-x-auto text-center flex justify-center py-2.5">
                        {item.details}
                      </div>
                    ) : (
                      <p>{item.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 bg-white/40">
          <HelpCircle className="mx-auto text-slate-400 mb-2" size={20} />
          <h3 className="text-xs font-bold text-slate-700">No revision cards match filters</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Try adjusting search query or filters.</p>
        </div>
      )}
    </div>
  );
}
