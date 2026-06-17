import { Sun, Moon, Heart } from "lucide-react";

interface FooterProps {
  onNavigate: (view: "home" | "dashboard" | "about" | "notes") => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function Footer({ onNavigate, theme, toggleTheme }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/50 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/20 backdrop-blur-md py-12 px-6 relative z-10 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform font-hand">
              S
            </div>
            <span className="text-sm font-bold tracking-tight font-hand bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
              StudyCS
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
            &copy; {currentYear} StudyCS. All rights reserved.
          </span>
        </div>

        {/* Center: Quick Links */}
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => onNavigate("home")}
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate("about")}
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors"
          >
            About
          </button>
        </div>

        {/* Right Side: Theme Toggle & Heart */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Built with</span>
            <Heart size={10} className="text-pink-500 fill-pink-500" />
            <span>for CS Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
