import { useEffect, useMemo } from "react";
import { 
  ArrowLeft, Layers, 
  ExternalLink, ArrowRight, Play, Calendar
} from "lucide-react";
import { NoteData } from "../lib/notes";
import { getSubjectProgress } from "../lib/progress";
import { updateSeo } from "../lib/seo";

interface SubjectLandingProps {
  note: NoteData;
  onStartReading: (slug: string) => void;
  onSelectTopic: (slug: string, headingId: string) => void;
  onBackToDashboard: () => void;
  allNotes: NoteData[];
}

export default function SubjectLanding({
  note,
  onStartReading,
  onSelectTopic,
  onBackToDashboard,
  allNotes,
}: SubjectLandingProps) {
  const meta = note.metadata;
  const progress = getSubjectProgress(meta.slug);

  useEffect(() => {
    updateSeo({
      title: `${meta.title} Syllabus & Study Hub`,
      description: `Comprehensive study guide and active-recall notes for ${meta.subject}. Includes ${meta.topicsCount} sections.`,
      slug: `subjects/${meta.slug}`,
      type: "article",
    });
  }, [note]);

  // Show at most 3 related notes (excluding the current one)
  const relatedNotes = useMemo(() => {
    return allNotes.filter((n) => n.metadata.slug !== meta.slug).slice(0, 3);
  }, [allNotes, meta.slug]);

  const circleRadius = 24;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress.percent / 100) * circumference;

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden pb-16">
      
      {/* Background decoration */}
      <div className="aurora-bg">
        <div className="aurora-blur-1" />
        <div className="aurora-blur-2" />
        <div className="dot-grid" />
        <div className="noise-overlay" />
        <div className="vignette-edges" />
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 relative z-10 space-y-6 pt-8">
        
        {/* Navigation header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/5 transition duration-150"
          >
            <ArrowLeft size={13} />
            <span>Back to Dashboard</span>
          </button>

          <span className="text-[9px] font-bold uppercase tracking-wider text-[#7C5CFF] bg-[#7C5CFF]/10 px-2.5 py-1 rounded-full border border-[#7C5CFF]/20">
            Syllabus Overview
          </span>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0D1220]/75 backdrop-blur-md p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 shadow-xl">
          <div className="space-y-4 flex-1">
            
            {/* Difficulty & Reading time */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                <Play size={10} className="text-[#7C5CFF]" fill="currentColor" />
                {meta.difficulty}
              </span>
              <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                <Calendar size={10} className="text-[#22D3EE]" />
                ~{meta.readingTime} min read
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {meta.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-xl">
              Access the complete examination study syllabus, topic outlines, and active-recall revision cards for {meta.subject}.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/5 border border-white/5 mt-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block leading-none font-bold">Subject</span>
                <span className="text-xs text-slate-200 flex items-center gap-1 mt-1.5 font-semibold">
                  {meta.icon} {meta.subject}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block leading-none font-bold">Topics Count</span>
                <strong className="text-xs text-slate-200 mt-1.5 block font-semibold">{meta.topicsCount} sections</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block leading-none font-bold">Word Count</span>
                <span className="text-xs text-[#7C5CFF] flex items-center gap-1 mt-1.5 font-semibold">
                  {meta.wordCount.toLocaleString()} words
                </span>
              </div>
            </div>
          </div>

          {/* Reading progress ring */}
          <div className="flex flex-col items-center justify-center bg-[#121A2B]/45 border border-white/5 p-6 rounded-2xl md:w-52 shrink-0 relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={circleRadius}
                className="stroke-slate-800"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={circleRadius}
                className="stroke-[#7C5CFF] transition-all duration-300"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute top-[48px] text-center">
              <span className="text-lg font-black text-white leading-none">
                {progress.percent}%
              </span>
            </div>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4">
              Progress
            </span>
            <span className="text-[9px] text-slate-500 mt-0.5 block font-medium">
              {progress.completedTopics.length} / {meta.topicsCount} sections
            </span>
          </div>
        </section>

        {/* Outline content listing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: List of chapters */}
          <div className="lg:col-span-8 bg-[#0D1220]/75 border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} className="text-[#22D3EE]" />
                Syllabus Topics Outline ({note.toc.length} sections)
              </h2>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Jump directly to</span>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scroll pr-1">
              {note.toc.map((item) => {
                const isChapter = item.level === 1;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectTopic(meta.slug, item.id)}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-[#121A2B]/10 hover:bg-[#121A2B]/45 transition cursor-pointer group"
                  >
                    <span className={`text-xs ${isChapter ? "text-white font-bold" : "text-slate-400 pl-3"} truncate`}>
                      {item.text}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#7C5CFF] group-hover:border-[#7C5CFF] transition shrink-0">
                      <ArrowRight size={8} className="text-slate-500 group-hover:text-white" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Study actions & cross linkings */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CTA */}
            <div className="bg-[#0D1220]/75 border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">Workspace Actions</h3>
              
              <button
                onClick={() => onStartReading(meta.slug)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#7C5CFF] hover:bg-[#6849eb] text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#7C5CFF]/15 group"
              >
                <span>{progress.percent > 0 ? "Resume notes" : "Open Lecture Notes"}</span>
                <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Related Modules */}
            {relatedNotes.length > 0 && (
              <div className="bg-[#0D1220]/75 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">Related modules</h3>
                
                <div className="space-y-2">
                  {relatedNotes.map((r) => (
                    <a
                      key={r.metadata.slug}
                      href={`#/subjects/${r.metadata.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-[#121A2B]/10 hover:bg-[#121A2B]/35 text-xs font-semibold text-slate-300 hover:text-white transition"
                    >
                      <span className="truncate">{r.metadata.subject}</span>
                      <ExternalLink size={10} className="text-[#7C5CFF]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
