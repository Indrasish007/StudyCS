import React, { useState, useEffect } from "react";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";

export interface BookmarkItem {
  id: string;
  subjectSlug: string;
  subjectName: string;
  headingId: string;
  headingText: string;
  timestamp: number;
}

interface BookmarksPanelProps {
  onSelectBookmark: (subjectSlug: string, headingId: string) => void;
}

const BOOKMARKS_KEY = "auranotes_bookmarks";

export function getBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveBookmark(subjectSlug: string, subjectName: string, headingId: string, headingText: string) {
  try {
    const list = getBookmarks();
    const id = `${subjectSlug}-${headingId}`;

    if (list.some((item) => item.id === id)) {
      return;
    }

    const newItem: BookmarkItem = {
      id,
      subjectSlug,
      subjectName,
      headingId,
      headingText,
      timestamp: Date.now(),
    };

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([newItem, ...list]));
  } catch (e) {
    console.error("Failed to save bookmark:", e);
  }
}

export function removeBookmark(id: string) {
  try {
    const list = getBookmarks();
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to remove bookmark:", e);
  }
}

export default function BookmarksPanel({ onSelectBookmark }: BookmarksPanelProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const loadBookmarks = () => {
    setBookmarks(getBookmarks());
  };

  useEffect(() => {
    loadBookmarks();

    const handleStorageChange = () => {
      loadBookmarks();
    };
    window.addEventListener("bookmarks_updated", handleStorageChange);
    return () => window.removeEventListener("bookmarks_updated", handleStorageChange);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeBookmark(id);
    loadBookmarks();
    window.dispatchEvent(new Event("bookmarks_updated"));
  };

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          📌 Saved Bookmarks
        </h3>
        <span className="text-[9px] bg-white/5 border border-white/10 text-slate-400 px-1.5 py-0.2 rounded font-sans font-bold">
          {bookmarks.length}
        </span>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scroll pr-1">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectBookmark(b.subjectSlug, b.headingId)}
              className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-500/30 bg-slate-900/90 hover:bg-slate-800 hover:border-indigo-400/50 cursor-pointer transition group shadow-sm"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-bold text-white truncate leading-snug group-hover:text-indigo-200 transition">
                  {b.headingText}
                </span>
                <span className="text-[8.5px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">
                  {b.subjectName}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => handleDelete(b.id, e)}
                  className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/15 transition md:opacity-0 group-hover:opacity-100"
                  title="Remove Bookmark"
                >
                  <Trash2 size={11} />
                </button>
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-400 transition duration-150">
                  <ArrowRight size={8} className="text-indigo-300 group-hover:text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center rounded-xl border border-dashed border-white/5 bg-[#121A2B]/10">
          <Bookmark className="mx-auto text-slate-600 mb-1.5" size={16} />
          <p className="text-[10px] text-slate-400 font-bold">No bookmarks saved</p>
          <p className="text-[9px] text-slate-500 mt-0.5 max-w-[150px] mx-auto leading-normal">
            Click bookmark icons next to notes sections to save.
          </p>
        </div>
      )}
    </div>
  );
}
