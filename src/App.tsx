import { useState, useEffect, useRef } from "react";
import { 
  BookOpen, Compass, Search, 
  ChevronRight, Menu, X, ArrowLeft
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Import utilities and components
import { getAllNotes, NoteData } from "./lib/notes";
import MarkdownRenderer from "./components/MarkdownRenderer";
import RevisionView from "./components/RevisionView";
import SearchModal from "./components/SearchModal";
import Dashboard from "./components/Dashboard";

// Glossy black spiral ring component
function SpiralRings() {
  const ringCount = 14;
  return (
    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 flex flex-col justify-around py-8 z-30 pointer-events-none">
      {Array.from({ length: ringCount }).map((_, i) => (
        <div key={i} className="relative w-8 h-8 flex items-center justify-center">
          {/* Left Hole */}
          <div className="absolute left-[-2px] w-2 h-4 bg-[#0a0715] rounded-full border border-black/40 shadow-inner" />
          {/* Right Hole */}
          <div className="absolute right-[-2px] w-2 h-4 bg-[#0a0715] rounded-full border border-black/40 shadow-inner" />
          {/* Ring shadow */}
          <div className="absolute top-1.5 w-7 h-2 bg-black/45 rounded-full blur-[1.5px]" />
          {/* Glossy Black Loop */}
          <div className="relative w-7 h-3 bg-gradient-to-r from-neutral-850 via-neutral-950 to-neutral-900 rounded-full border-[2px] border-neutral-900 shadow-md">
            {/* White sheen highlight */}
            <div className="absolute top-0.5 left-1 right-1 h-[0.5px] bg-white/20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

const subjectTabLabels: Record<string, string> = {
  dsa: "DATA",
  dbms: "DATABASE",
  networking: "COMPUTER",
  ai: "ARTIFICIAL",
  machine_learning: "MACHINE",
  "machine-learning": "MACHINE"
};

export default function App() {
  const [allNotes, setAllNotes] = useState<NoteData[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [activeMode, setActiveMode] = useState<"notes" | "revision">("notes");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubjectDrawerOpen, setIsSubjectDrawerOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  
  // Mobile active page view: "left" (Outline/TOC/Controls) or "right" (Note Content/Sub-views)
  const [mobileView, setMobileView] = useState<"left" | "right">("right");

  const rightPageRef = useRef<HTMLDivElement>(null);

  // Load notes client-side on mount
  useEffect(() => {
    try {
      const notes = getAllNotes();
      setAllNotes(notes);
      if (notes.length > 0) {
        // Set first note as default active subject
        setActiveSubject(notes[0].metadata.slug);
      }
    } catch (err) {
      console.error("Failed to load notes on mount:", err);
    }
  }, []);

  // Keyboard shortcut for Search (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentNote = allNotes.find((n) => n.metadata.slug === activeSubject) || allNotes[0];

  const handleSubjectChange = (slug: string) => {
    setActiveSubject(slug);
    setMobileView("right");
    setIsSubjectDrawerOpen(false);
    setShowDashboard(false);
    
    // Scroll right page back to top
    if (rightPageRef.current) {
      rightPageRef.current.scrollTop = 0;
    }
  };

  const handleModeChange = (mode: typeof activeMode) => {
    setActiveMode(mode);
    setMobileView("right");
    setIsSubjectDrawerOpen(false);
    setShowDashboard(false);
    
    if (rightPageRef.current) {
      rightPageRef.current.scrollTop = 0;
    }
  };

  // Scroll to TOC Anchor heading on the right page
  const handleAnchorClick = (headingId: string) => {
    setMobileView("right");
    setTimeout(() => {
      const element = document.getElementById(headingId);
      if (element && rightPageRef.current) {
        // Compute offset relative to right page container
        const containerTop = rightPageRef.current.getBoundingClientRect().top;
        const elemTop = element.getBoundingClientRect().top;
        const scrollOffset = elemTop - containerTop + rightPageRef.current.scrollTop - 10;
        
        rightPageRef.current.scrollTo({
          top: scrollOffset,
          behavior: "smooth"
        });
      }
    }, 50);
  };

  if (allNotes.length === 0 || !currentNote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0914] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs font-bold font-hand uppercase tracking-widest text-slate-400">Loading lecture notebooks...</p>
        </div>
      </div>
    );
  }

  // Get color token matching subject
  const subjectColor = currentNote.metadata.color;

  // Map color tokens to Tailwind classes for binder clips and tabs
  const tabColorClasses: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    indigo: { bg: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-600", hover: "hover:bg-indigo-700" },
    cyan: { bg: "bg-cyan-600", text: "text-cyan-600", border: "border-cyan-600", hover: "hover:bg-cyan-700" },
    emerald: { bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-600", hover: "hover:bg-emerald-700" },
    pink: { bg: "bg-pink-600", text: "text-pink-600", border: "border-pink-600", hover: "hover:bg-pink-700" },
    amber: { bg: "bg-amber-600", text: "text-amber-600", border: "border-amber-600", hover: "hover:bg-amber-700" },
  };

  const currentThemeColor = tabColorClasses[subjectColor] || tabColorClasses.indigo;

  if (showDashboard) {
    return (
      <>
        <Dashboard
          notes={allNotes}
          onSelectSubject={(slug) => {
            setActiveSubject(slug);
            setActiveMode("notes");
            setShowDashboard(false);
          }}
          onOpenRevision={() => {
            setActiveMode("revision");
            setShowDashboard(false);
          }}
          onSearchOpen={() => setIsSearchOpen(true)}
        />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          notes={allNotes}
          onSelectSubject={handleSubjectChange}
          onNavigate={(page) => handleModeChange(page as any)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0a0715] via-[#120e24] to-[#080510] text-slate-800 p-2 md:p-4 lg:p-6 flex flex-col gap-3 selection:bg-yellow-300 selection:text-slate-900">
      
      {/* Slim floating top bar */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSubjectDrawerOpen(true)}
            className="p-2 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white hover:border-slate-700 transition duration-150"
            title="Browse Subjects"
          >
            <Menu size={16} />
          </button>
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition duration-150"
            onClick={() => setShowDashboard(true)}
            title="Return to Dashboard"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-600/25 font-hand">
               S
            </div>
            <div className="hidden sm:block">
               <span className="text-base font-bold tracking-tight font-hand bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">StudyCS</span>
               <span className="text-[9px] ml-1.5 px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 font-bold uppercase tracking-wider">Semester Prep</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:block text-[10px] font-bold text-slate-500 font-daughter uppercase tracking-widest">
            {currentNote.metadata.subject}
          </span>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/40 hover:border-slate-700 text-slate-400 text-xs transition duration-150"
          >
            <Search size={13} />
            <span className="hidden sm:inline text-slate-400">Search</span>
            <kbd className="hidden sm:inline-block text-[9px] px-1 bg-slate-800 rounded font-sans text-slate-500 border border-slate-700">Ctrl+K</kbd>
          </button>
        </div>
      </header>

      {/* Main Double-Page Open Notebook */}
      <main className="max-w-7xl mx-auto w-full flex-1 flex relative select-none">
        
        {/* Protruding Subject Divider Tabs on Right Edge (Desktop only) */}
        <div className="hidden lg:flex flex-col gap-3 absolute right-[-48px] top-12 z-10">
          {allNotes.map((note) => {
            const slug = note.metadata.slug;
            const isSelected = activeSubject === slug;
            const colorConfig = tabColorClasses[note.metadata.color] || tabColorClasses.indigo;
            const tabLabel = subjectTabLabels[slug] || note.metadata.title.split(" ")[0].toUpperCase();
            
            return (
              <button
                key={slug}
                onClick={() => handleSubjectChange(slug)}
                className={`w-12 py-3 rounded-r-xl border-y border-r text-[10px] font-bold uppercase font-daughter tracking-wider text-center transition-all duration-200 shadow-tab origin-left ${
                  isSelected 
                    ? `${colorConfig.bg} text-white scale-x-110 border-slate-300 font-extrabold pr-2`
                    : `bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200`
                }`}
                style={{
                  writingMode: "vertical-rl",
                }}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>

        {/* Notebook Body Binder container */}
        <div className="w-full bg-[#1b172a] rounded-3xl p-3 md:p-5 border-4 border-slate-900 shadow-2xl relative flex flex-col lg:flex-row gap-0 overflow-hidden items-stretch select-none lg:h-[720px]">
          
          {/* Notebook Spiral Rings Spine down the middle */}
          <div className="hidden lg:block">
            <SpiralRings />
          </div>

          {/* PAGE 1: LEFT PAGE (Subject Overview, Outline, Statistics, Mode Control) */}
          <div 
            className={`w-full lg:w-1/2 lg:h-full notebook-page rounded-t-2xl lg:rounded-t-none lg:rounded-l-2xl border-b lg:border-b-0 lg:border-r border-slate-300/40 shadow-inner flex flex-col p-4 md:p-8 select-none ${
              mobileView === "left" ? "block" : "hidden lg:flex"
            }`}
          >
            {/* Margins */}
            <div className="margin-line-left" />
            <div className="margin-line-right" />

            <div className="pl-6 md:pl-10 pr-2 md:pr-10 overflow-y-auto flex-1 ruled-content notebook-scroll z-10 relative h-[520px] flex flex-col justify-between">
              
              <div>
                {/* Back button for mobile when right page is shown */}
                {mobileView === "left" && (
                  <button 
                    onClick={() => setMobileView("right")} 
                    className="flex items-center gap-1 text-xs text-indigo-600 font-bold mb-4 font-sans"
                  >
                    <ArrowLeft size={12} /> Go to notes view
                  </button>
                )}

                {/* Section Content Outline (TOC) */}
                {currentNote.toc.length > 0 ? (
                  <div className="space-y-0 font-hand">
                    {currentNote.toc.map((item) => {
                      const isChapter = item.level === 1;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleAnchorClick(item.id)}
                          className="w-full flex items-center text-left py-0 transition-all duration-150 border-b border-transparent group animate-fade-in"
                          style={{ height: '28px', lineHeight: '28px' }}
                        >
                          {isChapter ? (
                            <span className="font-daughter font-bold text-xs md:text-sm text-indigo-900 truncate">
                              {item.text}
                            </span>
                          ) : (
                            <div className="w-full flex items-center justify-between pl-4 text-slate-700 font-hand text-[11px] md:text-xs">
                              <span className="truncate flex-1 group-hover:text-indigo-600 transition-colors">{item.text}</span>
                              <ChevronRight size={10} className="text-slate-400 shrink-0 mr-2 group-hover:text-indigo-600 transition-colors" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium font-hand">No sections outlined for this note.</p>
                )}
              </div>

              {/* Mode Controls Widget at Left bottom (Sticky notes look) */}
              <div className="mt-4 p-4 border border-indigo-200 bg-indigo-50/60 rounded-xl relative overflow-hidden font-hand shadow-sm">
                <div className="absolute top-1 right-2 rotate-[5deg] text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm bg-indigo-600 text-white font-daughter">
                  WIDGETS
                </div>
                <h4 className="text-xs font-bold text-indigo-700 font-daughter mb-2">Notebook Functions</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "notes", label: "Notes" },
                    { id: "revision", label: "Revision" },
                    { id: "dashboard", label: "Dashboard" },
                  ].map((mode) => {
                    const isActive = mode.id === "dashboard" ? false : activeMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          if (mode.id === "dashboard") {
                            setShowDashboard(true);
                          } else {
                            handleModeChange(mode.id as any);
                          }
                        }}
                        className={`text-center p-1.5 border border-slate-300 rounded-lg text-xs transition-colors duration-150 ${
                          isActive 
                            ? "bg-indigo-600 text-white border-indigo-600 font-bold" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* PAGE 2: RIGHT PAGE (Ruled Note Content or Active Sub-view) */}
          <div 
            className={`w-full lg:w-1/2 lg:h-full notebook-page rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl shadow-inner flex flex-col p-4 md:p-8 select-text overflow-hidden ${
              mobileView === "right" ? "block" : "hidden lg:flex"
            }`}
          >
            {/* Margins */}
            <div className="margin-line-left" />
            
            {/* Right page content container */}
            <div 
              ref={rightPageRef}
              className="pl-6 md:pl-10 pr-2 md:pr-4 overflow-y-auto flex-1 ruled-content notebook-scroll z-10 select-text relative h-[520px]"
            >
              
              {/* Mobile View Toggle outline */}
              <div className="lg:hidden flex items-center justify-between mb-4 border-b border-slate-300 pb-2">
                <button
                  onClick={() => setMobileView("left")}
                  className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold font-sans"
                >
                  <ArrowLeft size={11} /> Table of Contents
                </button>
                <span className="text-[10px] font-bold text-slate-400 font-daughter">
                  PAGE 2
                </span>
              </div>

              {/* Dynamic render depending on active mode */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeSubject}-${activeMode}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full select-text"
                >
                  {activeMode === "notes" && (
                    <div className="select-text">
                      <MarkdownRenderer content={currentNote.content} />
                    </div>
                  )}

                  {activeMode === "revision" && (
                    <RevisionView />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>

      {/* Global Interactive Command Search Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notes={allNotes}
        onSelectSubject={handleSubjectChange}
        onNavigate={(page) => handleModeChange(page as any)}
      />

      {/* Unified Left Drawer for Subject & Mode Navigation (Hamburger Menu) */}
      <AnimatePresence>
        {isSubjectDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubjectDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-80 bg-[#0c0915] border-r border-slate-800 p-6 flex flex-col justify-between"
            >
              <div className="space-y-5 flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-daughter">StudyCS Menu</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Quick Workspace Navigation</p>
                  </div>
                  <button 
                    onClick={() => setIsSubjectDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Dashboard Shortcut */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-daughter">
                    Main Menu
                  </span>
                  <button
                    onClick={() => {
                      setShowDashboard(true);
                      setIsSubjectDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-indigo-500/60 bg-gradient-to-r from-indigo-600/90 to-violet-600/80 text-white hover:from-indigo-500 hover:to-violet-500 hover:border-indigo-400/80 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all duration-200 group shadow-md shadow-indigo-900/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform drop-shadow">🏠</span>
                      <span className="text-[12px] font-extrabold font-sans tracking-wide drop-shadow">Return to Dashboard</span>
                    </div>
                    <ChevronRight size={13} className="text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="border-t border-slate-800/80 my-1.5" />

                {/* Notebook Functions / Mode Bar in Menu */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-daughter">
                    Notebook Functions
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "notes", label: "Lecture Notes", icon: BookOpen },
                      { id: "revision", label: "Revision Deck", icon: Compass },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isActive = activeMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => handleModeChange(mode.id as any)}
                          className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] font-bold transition-all duration-150 ${
                            isActive
                              ? `${currentThemeColor.bg} border-slate-300 text-white shadow-md`
                              : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900"
                          }`}
                        >
                          <Icon size={12} className={isActive ? "text-white" : "text-indigo-400"} />
                          <span className="truncate">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-800/80 my-1" />

                {/* Course Notebooks / Subjects in Menu */}
                <div className="space-y-2.5 flex-1 flex flex-col overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-daughter">
                    Course Notebooks
                  </span>
                  
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                    {allNotes.map((note) => {
                      const isSelected = activeSubject === note.metadata.slug;
                      const colorConfig = tabColorClasses[note.metadata.color] || tabColorClasses.indigo;
                      
                      return (
                        <button
                          key={note.metadata.slug}
                          onClick={() => handleSubjectChange(note.metadata.slug)}
                          className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex flex-col gap-1 relative overflow-hidden group ${
                            isSelected 
                              ? `${colorConfig.bg} border-slate-300 text-white shadow-lg` 
                              : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`p-1 rounded-lg ${isSelected ? "bg-white/10" : "bg-slate-900"} text-white`}>
                              <BookOpen size={12} />
                            </span>
                            <span className="text-xs font-bold font-sans">{note.metadata.subject}</span>
                          </div>

                          <div className="flex items-center gap-3 text-[9px] font-daughter uppercase tracking-wider opacity-85 mt-1">
                            <span>⏱️ {note.metadata.readingTime}m read</span>
                            <span>📚 {note.metadata.topicsCount} topics</span>
                            <span className={`px-1 rounded ${isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                              {note.metadata.difficulty}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[9px] text-slate-500 font-medium text-center">
                <span className="font-hand bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent font-bold text-[10px]">StudyCS</span> &bull; Cursive Study Notebooks
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
