import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  BookOpen,
  Zap,
  HelpCircle,
  Search,
  TrendingUp,
  Map,
  ArrowRight,
  Sparkles,
  Clock,
  Layers,
  ChevronRight,
  CheckCircle2,
  Binary,
  Database,
  Network,
  Brain,
  Cpu,
  Terminal,
} from "lucide-react";
import { NoteData } from "../lib/notes";

interface HomeProps {
  notes: NoteData[];
  onSelectSubject: (slug: string) => void;
  onNavigate: (view: "home" | "dashboard" | "about" | "notes") => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  dsa: Binary,
  dbms: Database,
  networking: Network,
  ai: Brain,
  machine_learning: Cpu,
};

function getIconComponent(slug: string) {
  return iconMap[slug.toLowerCase().replace("-", "_")] || BookOpen;
}

// Color theme details mapped to tailwind classes
const colorThemes: Record<
  string,
  {
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
  }
> = {
  emerald: {
    border: "border-emerald-500/10 dark:border-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/30 dark:hover:border-emerald-500/30",
    hoverGlow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.08)]",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/20",
    btnBg: "bg-emerald-600 hover:bg-emerald-500",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500/5 via-transparent to-transparent",
  },
  cyan: {
    border: "border-cyan-500/10 dark:border-cyan-500/10",
    hoverBorder: "hover:border-cyan-500/30 dark:hover:border-cyan-500/30",
    hoverGlow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.08)]",
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-500 dark:text-cyan-400",
    iconBorder: "border-cyan-500/20",
    btnBg: "bg-cyan-600 hover:bg-cyan-500",
    badgeBg: "bg-cyan-500/10 dark:bg-cyan-500/15",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    gradient: "from-cyan-500/5 via-transparent to-transparent",
  },
  amber: {
    border: "border-amber-500/10 dark:border-amber-500/10",
    hoverBorder: "hover:border-amber-500/30 dark:hover:border-amber-500/30",
    hoverGlow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-500 dark:text-amber-400",
    iconBorder: "border-amber-500/20",
    btnBg: "bg-amber-600 hover:bg-amber-500",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/15",
    badgeText: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500/5 via-transparent to-transparent",
  },
  indigo: {
    border: "border-indigo-500/10 dark:border-indigo-500/10",
    hoverBorder: "hover:border-indigo-500/30 dark:hover:border-indigo-500/30",
    hoverGlow: "hover:shadow-[0_0_40px_rgba(99,102,241,0.08)]",
    iconBg: "bg-indigo-500/10",
    iconText: "text-indigo-500 dark:text-indigo-400",
    iconBorder: "border-indigo-500/20",
    btnBg: "bg-indigo-600 hover:bg-indigo-500",
    badgeBg: "bg-indigo-500/10 dark:bg-indigo-500/15",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-500/5 via-transparent to-transparent",
  },
  pink: {
    border: "border-pink-500/10 dark:border-pink-500/10",
    hoverBorder: "hover:border-pink-500/30 dark:hover:border-pink-500/30",
    hoverGlow: "hover:shadow-[0_0_40px_rgba(236,72,153,0.08)]",
    iconBg: "bg-pink-500/10",
    iconText: "text-pink-500 dark:text-pink-400",
    iconBorder: "border-pink-500/20",
    btnBg: "bg-pink-600 hover:bg-pink-500",
    badgeBg: "bg-pink-500/10 dark:bg-pink-500/15",
    badgeText: "text-pink-600 dark:text-pink-400",
    gradient: "from-pink-500/5 via-transparent to-transparent",
  },
};

// Countup Ticker Component
function CounterTicker({ value, sub }: { value: number; sub: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (start === end) return;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += Math.ceil(end / 40); // larger step for speed
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(start);
        }
      }, Math.max(stepTime, 20));
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
        {sub}
      </span>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white"
      >
        {count.toLocaleString()}
      </motion.span>
    </div>
  );
}

export default function Home({
  notes,
  onSelectSubject,
  onNavigate,
}: HomeProps) {
  const subjectsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSubjects = () => {
    subjectsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Compute stats
  const totalSubjects = notes.length;
  const totalReadingTime = notes.reduce((acc, note) => acc + note.metadata.readingTime, 0);
  const totalChapters = notes.reduce((acc, note) => acc + note.metadata.topicsCount, 0);
  const totalWords = notes.reduce((acc, note) => acc + note.metadata.wordCount, 0);

  // Features list
  const features = [
    {
      icon: BookOpen,
      title: "Structured Notes",
      desc: "Beautifully organized handwritten-style notes compiled from verified lectures.",
      color: "indigo",
    },
    {
      icon: Zap,
      title: "Revision Mode",
      desc: "Optimized cheat sheets and interactive active-recall decks to speed up exam prep.",
      color: "pink",
    },
    {
      icon: HelpCircle,
      title: "Quizzes & Flashcards",
      desc: "Test your computer science concepts on-the-fly and review correct solutions.",
      color: "emerald",
    },
    {
      icon: Search,
      title: "Powerful Find Tool",
      desc: "Instantly look up key definition words directly inside lecture note pages.",
      color: "cyan",
    },
    {
      icon: TrendingUp,
      title: "Study Progress Tracking",
      desc: "Easily bookmark, check reading durations, and monitor finished modules.",
      color: "amber",
    },
    {
      icon: Map,
      title: "Learning Roadmaps",
      desc: "Clear visual timelines showcasing structured paths to master semester syllabi.",
      color: "indigo",
    },
  ];

  // Why StudyCS Benefits
  const benefits = [
    "Structured Learning Outlines",
    "Exam Preparation Focused",
    "Revision-Friendly Checklists",
    "Core Concept Focus & Visual Diagrams",
    "Fast Find Navigation In-Note",
    "Mobile & Desktop Fully Responsive",
  ];

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 overflow-hidden select-none font-sans">
      
      {/* ── Background Aurora Radial Glows & Grid Overlay ── */}
      <div className="absolute top-0 inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] dark:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Noise overlay texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none" />

      {/* Aurora glow indicators */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[45%] rounded-full bg-pink-500/10 dark:bg-pink-600/10 blur-[130px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* ── HERO SECTION ── */}
      <section className="relative max-w-5xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest shadow-sm"
        >
          <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span>Learn Computer Science Smarter</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15]"
        >
          Master Computer Science Subjects{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
            Faster
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium"
        >
          Structured notes, revision tools, quizzes, flashcards, and learning resources built from trusted educational lectures.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-4"
        >
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] group border border-indigo-500/20"
          >
            Start Learning
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={scrollToSubjects}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-all border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm"
          >
            Explore Subjects
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.6 }}
          className="mt-16 flex flex-col items-center gap-1.5 cursor-pointer text-slate-400"
          onClick={scrollToSubjects}
        >
          <span className="text-[10px] uppercase font-bold tracking-widest font-sans">Scroll Down</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 flex justify-center p-1">
            <div className="w-1 h-2 bg-indigo-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── FEATURE HIGHLIGHTS ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 border-t border-slate-200/50 dark:border-white/5">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
            Supercharge Your Study System
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Interactive, active-recall notebooks designed to assist memory retention and speed up revisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group p-6 rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/20 dark:hover:border-indigo-400/25 hover:shadow-lg dark:hover:shadow-[0_0_35px_rgba(99,102,241,0.06)] hover:-translate-y-0.5"
              >
                <div className="p-3 w-fit rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/15 group-hover:scale-105 transition-transform duration-200">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-4 font-sans">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── SUBJECT SHOWCASE ── */}
      <section
        ref={subjectsSectionRef}
        className="max-w-5xl mx-auto px-6 py-16 md:py-24 border-t border-slate-200/50 dark:border-white/5 scroll-mt-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
              Course Lecture Notebooks
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Start learning. Click any of the curriculum modules below to review the corresponding study files.
            </p>
          </div>
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Go to dashboard <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => {
            const slug = note.metadata.slug;
            const colorToken = note.metadata.color;
            const theme = colorThemes[colorToken] || colorThemes.indigo;
            const SubjectIcon = getIconComponent(slug);

            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => onSelectSubject(slug)}
                className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-white/40 dark:bg-slate-900/30 backdrop-blur-md p-6 flex flex-col justify-between min-h-[280px] cursor-pointer transition-all duration-300 ${theme.hoverBorder} ${theme.hoverGlow} hover:scale-[1.01]`}
              >
                {/* corner aura */}
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${theme.gradient} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity`} />

                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${theme.iconBg} ${theme.iconText} border ${theme.iconBorder} group-hover:scale-105 transition-transform duration-300`}>
                      <SubjectIcon size={18} />
                    </div>
                    <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${theme.badgeBg} ${theme.badgeText} border border-white/5`}>
                      {note.metadata.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-white mt-5 font-sans leading-snug line-clamp-2">
                    {note.metadata.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Layers size={11} className="text-slate-400" />
                      {note.metadata.topicsCount} sections
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-slate-400" />
                      {note.metadata.readingTime}m read
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-500 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                  <span>Open Notebook</span>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all duration-300">
                    <ArrowRight size={11} className="transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Placeholder for coming soon Python course */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/20 dark:bg-slate-900/10 p-6 flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-500/5 text-indigo-300/40 border border-dashed border-indigo-500/25">
                  <Terminal size={18} />
                </div>
                <span className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                  Coming Soon
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-400 dark:text-slate-500 mt-5 font-sans leading-snug">
                Python Programming
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-hand">
                Syntax structures, Object-Oriented paradigms, algorithms, and libraries.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              Lecture Outlines Loading
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATISTICS SECTION ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 border-t border-slate-200/50 dark:border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CounterTicker value={totalSubjects} sub="Subjects Available" />
          <CounterTicker value={totalChapters} sub="Topics Covered" />
          <CounterTicker value={totalWords} sub="Study Resources" />
          <CounterTicker value={totalReadingTime} sub="Revision Minutes" />
        </div>
      </section>

      {/* ── WHY STUDYCS ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 border-t border-slate-200/50 dark:border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block font-sans">
              Why StudyCS?
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">
              Designed For High-Performance Learning
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              We cut through the noise of bloated textbooks. StudyCS features custom handwritten layout aesthetics with full keyword query support, built strictly to optimize exam preparation and revision schedules.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/40"
              >
                <CheckCircle2 size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
