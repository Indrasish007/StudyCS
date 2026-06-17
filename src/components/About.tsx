import { motion } from "framer-motion";
import { Youtube, ExternalLink, ShieldAlert, Award, Heart, GraduationCap } from "lucide-react";

interface AboutProps {}

export default function About({}: AboutProps) {
  const contributors = [
    {
      name: "Gate Smashers",
      url: "https://www.youtube.com/@GateSmashers",
      initials: "GS",
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      description:
        "India's leading education platform providing top-tier tutorials for GATE, UGC NET, university exams, and placement training.",
      metrics: "4M+ Subscribers • Detailed Explanations",
    },
    {
      name: "Knowledge Gate",
      url: "https://www.youtube.com/@KNOWLEDGEGATE_kg",
      initials: "KG",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      description:
        "Comprehensive lectures covering core computer science subjects including DBMS, OS, TOC, Compiler Design, and Algorithms.",
      metrics: "1M+ Subscribers • Concept Clearness",
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 overflow-hidden select-none font-sans pt-32 pb-24">
      {/* Background radial effects */}
      <div className="absolute top-0 inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-[50%] h-[40%] rounded-full bg-indigo-500/5 dark:bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-pink-500/5 dark:bg-pink-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-12">
        {/* Title */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest"
          >
            <GraduationCap size={13} />
            <span>Academic Project</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            About{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
              StudyCS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto font-medium"
          >
            StudyCS was created to help students learn Computer Science subjects through structured, easy-to-understand study materials. The notes and learning resources are prepared using educational content from the following YouTube channels:
          </motion.p>
        </div>

        {/* Contributors cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contributors.map((contrib, index) => (
            <motion.div
              key={contrib.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 flex flex-col justify-between hover:border-indigo-500/20 dark:hover:border-indigo-400/25 transition-all duration-300 hover:shadow-lg dark:hover:shadow-indigo-950/10 hover:-translate-y-0.5"
            >
              <div>
                {/* Header (Initials Avatar & Channel Info) */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contrib.gradient} text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    {contrib.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white font-sans">
                      {contrib.name}
                    </h3>
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
                      {contrib.metrics}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">
                  {contrib.description}
                </p>
              </div>

              <div className="mt-6">
                <a
                  href={contrib.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900/5 dark:bg-white/5 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-all border border-slate-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-500"
                >
                  <Youtube size={13} />
                  <span>Visit Channel</span>
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer Warning */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-2xl border border-amber-500/20 dark:border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-4"
        >
          <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <ShieldAlert size={16} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Educational Disclaimer
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              StudyCS is an independent educational project. Credit for the original lecture content belongs to the respective creators and channels. This platform acts as an organized text and revision interface to aid university review.
            </p>
          </div>
        </motion.div>

        {/* Built with Heart Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-widest font-sans"
        >
          <Award size={13} className="text-indigo-400" />
          <span>Curated For Excellence</span>
          <Heart size={13} className="text-pink-500 fill-pink-500 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
