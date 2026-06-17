import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Search, Menu, X, Home, BookOpen, Info } from "lucide-react";

interface NavbarProps {
  currentView: "home" | "dashboard" | "about" | "notes";
  onNavigate: (view: "home" | "dashboard" | "about" | "notes") => void;
  onSearchOpen: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  onSearchOpen,
  theme,
  toggleTheme,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "dashboard" as const, label: "Dashboard", icon: BookOpen },
    { id: "about" as const, label: "About", icon: Info },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-3 md:py-4 ${
        isScrolled ? "bg-transparent" : "bg-transparent"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto rounded-full border transition-all duration-300 ${
          isScrolled
            ? "bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-950/20 py-2.5 px-6"
            : "bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border-white/10 dark:border-white/5 shadow-md py-3 px-6"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => {
              onNavigate("home");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200 font-hand">
              S
            </div>
            <span className="text-lg font-bold tracking-tight font-hand bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              StudyCS
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navItems.map((item) => {
              const isActive =
                currentView === item.id ||
                (item.id === "dashboard" && currentView === "notes");
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                    isActive
                      ? "text-indigo-600 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-indigo-50 dark:bg-white/10 rounded-full border border-indigo-500/10 dark:border-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Global Search Button */}
            <button
              onClick={onSearchOpen}
              className="p-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              title="Search notes (Ctrl+K)"
            >
              <Search size={15} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-300 relative overflow-hidden"
              title="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 360 : 0, scale: theme === "dark" ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className={theme === "dark" ? "absolute" : "relative"}
              >
                <Sun size={15} className="fill-amber-400 text-amber-500" />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ rotate: theme === "light" ? -360 : 0, scale: theme === "light" ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className={theme === "light" ? "absolute" : "relative"}
              >
                <Moon size={15} className="fill-indigo-500 text-indigo-400" />
              </motion.div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-4 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-950/20"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive =
                  currentView === item.id ||
                  (item.id === "dashboard" && currentView === "notes");
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                      isActive
                        ? "bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
