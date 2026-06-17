import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, Binary, Database, Network, Brain, Cpu, 
  Clock, Award, Search, Sparkles, ChevronRight, 
  GraduationCap, Layers, ArrowRight, Zap, Play
} from "lucide-react";
import { NoteData } from "../lib/notes";

// Map slugs to React icons
const iconMap: Record<string, React.ComponentType<any>> = {
  dsa: Binary,
  dbms: Database,
  networking: Network,
  ai: Brain,
  machine_learning: Cpu,
  "machine-learning": Cpu
};

function getIconComponent(slug: string) {
  return iconMap[slug.toLowerCase().replace("-", "_")] || BookOpen;
}

// Map slugs to YouTube video lecture links
const videoLinks: Record<string, string> = {
  dsa: "https://youtu.be/MdG0Vw9f1A4?si=Ugvnqo9vPDzovYUe",
  dbms: "https://youtu.be/YRnjGeQbsHQ?si=dLjv2-mcP_-QciAL",
  networking: "https://youtu.be/q3Z3Qa1UNBA?si=gb9yktll4kIa4G_b",
  ai: "https://youtu.be/yiXAmkimZRQ?si=1iP2SD3lgtXFLNWv",
  machine_learning: "https://youtu.be/2oGsCHlfBUg?si=4hxyAos4r9YhXeFX",
  "machine-learning": "https://youtu.be/2oGsCHlfBUg?si=4hxyAos4r9YhXeFX"
};

// Color theme details mapped to tailwind classes
const colorThemes: Record<string, {
  border: string;
  hoverBorder: string;
  hoverGlow: string;
  iconBg: string;
  iconText: string;
  iconBorder: string;
  btnBg: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
  pulseGlow: string;
}> = {
  emerald: {
    border: "border-emerald-500/10",
    hoverBorder: "group-hover:border-emerald-500/30",
    hoverGlow: "group-hover:shadow-[0_0_35px_rgba(16,185,129,0.12)]",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    iconBorder: "border-emerald-500/20",
    btnBg: "bg-emerald-600 hover:bg-emerald-500",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400",
    gradient: "from-emerald-500/5 via-transparent to-transparent",
    pulseGlow: "bg-emerald-500/10",
  },
  cyan: {
    border: "border-cyan-500/10",
    hoverBorder: "group-hover:border-cyan-500/30",
    hoverGlow: "group-hover:shadow-[0_0_35px_rgba(6,182,212,0.12)]",
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-400",
    iconBorder: "border-cyan-500/20",
    btnBg: "bg-cyan-600 hover:bg-cyan-500",
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-400",
    gradient: "from-cyan-500/5 via-transparent to-transparent",
    pulseGlow: "bg-cyan-500/10",
  },
  amber: {
    border: "border-amber-500/10",
    hoverBorder: "group-hover:border-amber-500/30",
    hoverGlow: "group-hover:shadow-[0_0_35px_rgba(245,158,11,0.12)]",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    iconBorder: "border-amber-500/20",
    btnBg: "bg-amber-600 hover:bg-amber-500",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
    gradient: "from-amber-500/5 via-transparent to-transparent",
    pulseGlow: "bg-amber-500/10",
  },
  indigo: {
    border: "border-indigo-500/10",
    hoverBorder: "group-hover:border-indigo-500/30",
    hoverGlow: "group-hover:shadow-[0_0_35px_rgba(99,102,241,0.12)]",
    iconBg: "bg-indigo-500/10",
    iconText: "text-indigo-400",
    iconBorder: "border-indigo-500/20",
    btnBg: "bg-indigo-600 hover:bg-indigo-500",
    badgeBg: "bg-indigo-500/15",
    badgeText: "text-indigo-400",
    gradient: "from-indigo-500/5 via-transparent to-transparent",
    pulseGlow: "bg-indigo-500/10",
  },
  pink: {
    border: "border-pink-500/10",
    hoverBorder: "group-hover:border-pink-500/30",
    hoverGlow: "group-hover:shadow-[0_0_35px_rgba(236,72,153,0.12)]",
    iconBg: "bg-pink-500/10",
    iconText: "text-pink-400",
    iconBorder: "border-pink-500/20",
    btnBg: "bg-pink-600 hover:bg-pink-500",
    badgeBg: "bg-pink-500/15",
    badgeText: "text-pink-400",
    gradient: "from-pink-500/5 via-transparent to-transparent",
    pulseGlow: "bg-pink-500/10",
  },
};

interface DashboardProps {
  notes: NoteData[];
  onSelectSubject: (slug: string) => void;
  onOpenRevision: () => void;
  onSearchOpen: () => void;
}

export default function Dashboard({
  notes,
  onSelectSubject,
  onOpenRevision,
  onSearchOpen,
}: DashboardProps) {
  // Compute global stats
  const totalSubjects = notes.length;
  const totalReadingTime = notes.reduce((acc, note) => acc + note.metadata.readingTime, 0);
  const totalChapters = notes.reduce((acc, note) => acc + note.metadata.topicsCount, 0);
  const totalWords = notes.reduce((acc, note) => acc + note.metadata.wordCount, 0);

  // Framer Motion container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#07050f] via-[#0d091a] to-[#05030a] text-slate-100 p-4 md:p-8 overflow-hidden select-none">
      
      {/* Background glowing blur components */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-pink-600/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[35%] right-[20%] w-[35%] h-[35%] rounded-full bg-cyan-600/3 blur-[140px] pointer-events-none" />

      {/* Main content wrapper */}
      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-8 pb-16">
        
        {/* Header section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/15">
                Workspace Active
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
              <span className="font-hand bg-gradient-to-r from-indigo-400 via-violet-400 via-40% to-pink-400 bg-clip-text text-transparent drop-shadow-sm">StudyCS</span>
              <span className="ml-2 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">Study Hub</span>
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Handwritten-styled lecture diaries and active-recall exam revision.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full md:w-80">
            <button
              onClick={onSearchOpen}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200 text-sm transition-all duration-200 shadow-inner group"
            >
              <div className="flex items-center gap-2.5">
                <Search size={15} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Search lecture files...</span>
              </div>
              <kbd className="hidden sm:inline-block text-[9.5px] px-2 py-0.5 bg-slate-900 border border-white/10 rounded font-sans text-slate-500">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </header>

        {/* Statistics Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Subjects", val: `${totalSubjects} Modules`, icon: GraduationCap, color: "text-indigo-400", sub: "Core syllabus files" },
            { label: "Revision Chapters", val: `${totalChapters} Sections`, icon: Layers, color: "text-emerald-400", sub: "Outlines parsed" },
            { label: "Study Duration", val: `${totalReadingTime} Min`, icon: Clock, color: "text-amber-400", sub: "Estimated reading time" },
            { label: "Library Volume", val: `${totalWords.toLocaleString()} Words`, icon: Award, color: "text-pink-400", sub: "Handwritten plain text" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-5 flex items-center gap-4 hover:border-white/10 transition duration-200 shadow-lg group"
              >
                <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={20} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block leading-none">
                    {stat.label}
                  </span>
                  <strong className="text-lg font-extrabold text-white mt-1 block font-sans">
                    {stat.val}
                  </strong>
                  <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">
                    {stat.sub}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Subjects & Active Recall deck split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Grid of 5 subjects */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles size={16} className="text-pink-400" />
                Available Lecture Notebooks
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Click notebook cover to open rules page
              </span>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {notes.map((note) => {
                const slug = note.metadata.slug;
                const title = note.metadata.title;
                const colorToken = note.metadata.color;
                const theme = colorThemes[colorToken] || colorThemes.indigo;
                const SubjectIcon = getIconComponent(slug);

                return (
                  <motion.div
                    key={slug}
                    variants={itemVariants}
                    onClick={() => onSelectSubject(slug)}
                    className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-slate-950/40 backdrop-blur-md p-6 flex flex-col justify-between min-h-[325px] h-full cursor-pointer transition-all duration-300 ${theme.hoverBorder} ${theme.hoverGlow} hover:scale-[1.01] hover:-translate-y-0.5`}
                  >
                    {/* Themed corner gradient aura */}
                    <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${theme.gradient} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />

                    <div>
                      {/* Card Header (Icon and Badges) */}
                      <div className="flex items-center justify-between relative z-10">
                        <div className={`p-3 rounded-xl ${theme.iconBg} ${theme.iconText} border ${theme.iconBorder} group-hover:scale-110 transition-transform duration-300 relative`}>
                          <SubjectIcon size={22} className="relative z-10" />
                          <div className={`absolute inset-0 rounded-xl ${theme.pulseGlow} blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </div>

                        <div className="flex items-center gap-2">
                          {videoLinks[slug] && (
                            <a
                              href={videoLinks[slug]}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()} // Prevent card click trigger
                              className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition duration-150 shadow-sm"
                              title="Watch Lecture Video on YouTube"
                            >
                              <Play size={10} fill="currentColor" />
                              <span>Video</span>
                            </a>
                          )}
                          <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${theme.badgeBg} ${theme.badgeText} border border-white/5`}>
                            {note.metadata.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Title & Stats */}
                      <div className="mt-4 relative z-10">
                        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors font-sans line-clamp-2">
                          {title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 font-medium">
                          <span className="flex items-center gap-1">
                            <Layers size={11} className="text-slate-500" />
                            {note.metadata.topicsCount} sections
                          </span>
                        </div>
                      </div>

                      {/* Handwritten Outline Highlights */}
                      <div className="font-hand text-[13px] text-slate-300/80 mt-4 border-t border-white/5 pt-3 leading-relaxed relative z-10 space-y-0.5">
                        <div className="text-[9.5px] uppercase font-bold tracking-wider text-slate-500 font-sans mb-1">
                          Lecture Syllabus Preview
                        </div>
                        {note.topics.slice(0, 3).map((topic, index) => (
                          <div key={index} className="flex items-center gap-1.5">
                            <span className={`${theme.iconText} text-xs font-bold`}>&bull;</span>
                            <span className="truncate max-w-[90%]">{topic}</span>
                          </div>
                        ))}
                        {note.topics.length === 0 && (
                          <div className="italic text-slate-500 text-xs font-sans">No outlined syllabus topics found.</div>
                        )}
                      </div>
                    </div>

                    {/* Bottom CTA trigger */}
                    <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-400 group-hover:text-white transition-colors relative z-10">
                      <span>Open Lecture Notebook</span>
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300">
                        <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform duration-300 text-slate-400 group-hover:text-white" />
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* RIGHT: Revision Quick Deck & Checklist */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Revision / Active Recall Deck Widget */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-[#140e29] to-[#0c0915] p-6 shadow-xl space-y-5 group">
              {/* Radial gradient background glow */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-70 pointer-events-none" />

              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Zap size={18} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Active Recall Center</h3>
                  <span className="text-[10px] text-slate-400 block font-medium">Auto-parsed revision aids</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Review key formulas, flashcards, practice questions, and definitions parsed directly from all your semester files.
              </p>

              {/* 3D Stack Simulation */}
              <div className="relative h-24 flex items-center justify-center my-4 select-none pointer-events-none">
                <div className="absolute w-40 h-16 rounded-xl bg-pink-500/10 border border-pink-500/20 rotate-[-8deg] translate-y-2 translate-x-2 blur-[0.5px]" />
                <div className="absolute w-40 h-16 rounded-xl bg-indigo-500/20 border border-indigo-500/35 rotate-[4deg] -translate-y-1 -translate-x-1 shadow-md" />
                <div className="absolute w-40 h-16 rounded-xl bg-slate-900 border border-white/10 flex flex-col justify-between p-2 shadow-xl">
                  <div className="flex justify-between items-center text-[8px] font-bold text-indigo-400">
                    <span>ACTIVE FLASHCARD</span>
                    <span>Q#12</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 text-center truncate px-1">How does Dijkstra's Algorithm work?</span>
                  <div className="text-[6.5px] text-slate-500 text-right">Tap to reveal</div>
                </div>
              </div>

              <button
                onClick={onOpenRevision}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-indigo-600/20 border border-indigo-500/25 group/btn"
              >
                Launch Revision Deck
                <ChevronRight size={13} className="transform group-hover/btn:translate-x-0.5 transition-transform duration-150" />
              </button>
            </div>

            {/* Sticky study list/tips */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block border-b border-white/5 pb-2">
                🎓 Semester study guide
              </h3>
              
              <ul className="space-y-3 font-hand text-[13px] text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">&bull;</span>
                  <span><strong>Understand:</strong> Read the ruled lecture notebooks on the right page of the diary.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">&bull;</span>
                  <span><strong>Recall:</strong> Toggle standard revision deck cards to trigger active recall.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold shrink-0">&bull;</span>
                  <span><strong>Practice:</strong> Write down formula derivations and execute sample questions.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
