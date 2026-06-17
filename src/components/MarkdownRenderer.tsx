import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { slugify } from "../lib/notes";
import { saveBookmark, removeBookmark, getBookmarks } from "./BookmarksPanel";

interface MarkdownRendererProps {
  content: string;
  subjectSlug?: string;
  subjectName?: string;
}

export default function MarkdownRenderer({
  content,
  subjectSlug = "",
  subjectName = "",
}: MarkdownRendererProps) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Load current bookmarks on mount and keep in sync
  const refreshBookmarks = () => {
    const bms = getBookmarks();
    setBookmarkedIds(new Set(bms.map((b) => b.id)));
  };

  useEffect(() => {
    refreshBookmarks();
    window.addEventListener("bookmarks_updated", refreshBookmarks);
    return () => window.removeEventListener("bookmarks_updated", refreshBookmarks);
  }, []);

  const toggleBookmark = (headingId: string, headingText: string) => {
    const id = `${subjectSlug}-${headingId}`;
    if (bookmarkedIds.has(id)) {
      removeBookmark(id);
    } else {
      saveBookmark(subjectSlug, subjectName, headingId, headingText);
    }
    // Notify all listeners (BookmarksPanel + this component)
    window.dispatchEvent(new Event("bookmarks_updated"));
  };

  // Preprocess content to isolate headings with double newlines
  const processedLines = content.split("\n").map((line) => {
    const trimmed = line.trim();
    const isHeading = /^(Chapter\s+\d+|[0-9]+(?:\.[0-9]+)+)[:.]?\s+(.+)$/i.test(trimmed);
    if (isHeading) {
      return `\n\n${trimmed}\n\n`;
    }
    return line;
  });
  const processedContent = processedLines.join("\n");
  const blocks = processedContent.split(/\n\n+/);

  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\".*?\"|'.*?')/g);
    return parts.map((part, idx) => {
      if (
        (part.startsWith('"') && part.endsWith('"')) ||
        (part.startsWith("'") && part.endsWith("'"))
      ) {
        return (
          <span key={idx} className="highlight-yellow font-bold text-slate-950 mx-0.5">
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const BookmarkButton = ({
    headingId,
    headingText,
  }: {
    headingId: string;
    headingText: string;
  }) => {
    const id = `${subjectSlug}-${headingId}`;
    const isBookmarked = bookmarkedIds.has(id);

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(headingId, headingText);
        }}
        title={isBookmarked ? "Remove bookmark" : "Bookmark this section"}
        className={`bookmark-btn ml-2 p-1 rounded-md transition-all duration-150 opacity-0 group-hover:opacity-100 shrink-0 ${
          isBookmarked
            ? "text-amber-500 bg-amber-500/10 opacity-100"
            : "text-slate-400 hover:text-amber-500 hover:bg-amber-500/10"
        }`}
      >
        {isBookmarked ? (
          <BookmarkCheck size={13} className="fill-amber-400 text-amber-500" />
        ) : (
          <Bookmark size={13} />
        )}
      </button>
    );
  };

  const renderBlock = (block: string, index: number) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // First block = main note title
    if (index === 0) {
      return (
        <h1
          key={index}
          className="text-xl md:text-2xl font-extrabold hand-h1 mb-6 mt-2 pb-2 border-b-2 border-dashed border-indigo-300/60 font-daughter"
          style={{ lineHeight: "36px" }}
        >
          {trimmed}
        </h1>
      );
    }

    // Heading: "Chapter X: ..." or "X.Y ..."
    const headingMatch = trimmed.match(
      /^(Chapter\s+\d+|[0-9]+(?:\.[0-9]+)+)[:.]?\s+(.+)$/i
    );
    if (headingMatch) {
      const prefix = headingMatch[1];
      const textVal = headingMatch[2].trim();
      const id = slugify(prefix + "-" + textVal);
      const isChapter = prefix.toLowerCase().startsWith("chapter");
      const fullText = `${prefix}: ${textVal}`;

      if (isChapter) {
        return (
          <h2
            key={index}
            id={id}
            className="group flex items-center text-base md:text-xl font-bold hand-h2 mt-6 mb-3 font-daughter"
          >
            <span className="flex-1">{fullText}</span>
            {subjectSlug && (
              <BookmarkButton headingId={id} headingText={fullText} />
            )}
          </h2>
        );
      } else {
        return (
          <h3
            key={index}
            id={id}
            className="group flex items-center text-sm md:text-base font-bold hand-h3 mt-4 mb-2 pb-0.5 border-b border-dashed border-indigo-300 font-daughter"
          >
            <span className="flex-1">{fullText}</span>
            {subjectSlug && (
              <BookmarkButton headingId={id} headingText={fullText} />
            )}
          </h3>
        );
      }
    }

    // ASCII diagram / monospaced block
    const isMonospaced =
      trimmed.includes("┌") ||
      trimmed.includes("│") ||
      trimmed.includes("├") ||
      trimmed.includes("└") ||
      trimmed.includes("─") ||
      trimmed.includes("▲") ||
      trimmed.includes("▼") ||
      trimmed.includes("◄") ||
      trimmed.includes("►") ||
      (trimmed.includes("  ") && trimmed.split("\n").length > 1);

    if (isMonospaced) {
      return (
        <pre
          key={index}
          className="my-4 overflow-x-auto p-4 rounded-xl border border-white/5 bg-[#0d1220] text-yellow-300 font-mono text-[10px] md:text-xs leading-relaxed select-text shadow-lg"
        >
          <code>{trimmed}</code>
        </pre>
      );
    }

    // List block
    const lines = trimmed.split("\n");
    const bulletLines = lines.filter((l) => {
      const t = l.trim();
      return (
        t.startsWith("- ") ||
        t.startsWith("* ") ||
        t.startsWith("🕒 ") ||
        /^\d+\.\s+/.test(t)
      );
    });
    const nonBulletLines = lines.filter((l) => {
      const t = l.trim();
      return (
        t.length > 0 &&
        !t.startsWith("- ") &&
        !t.startsWith("* ") &&
        !t.startsWith("🕒 ") &&
        !/^\d+\.\s+/.test(t)
      );
    });

    const isList = bulletLines.length > 0 && nonBulletLines.length <= 1;
    const listHeaderLine = nonBulletLines.length === 1 ? nonBulletLines[0] : null;

    if (isList) {
      const bulletOnlyLines = lines.filter((l) => {
        const t = l.trim();
        return (
          t.startsWith("- ") ||
          t.startsWith("* ") ||
          t.startsWith("🕒 ") ||
          /^\d+\.\s+/.test(t)
        );
      });
      return (
        <div key={index} className="mb-3">
          {listHeaderLine && (
            <p
              className="text-slate-700 text-xs md:text-sm font-bold font-daughter mb-0"
              style={{ lineHeight: "28px" }}
            >
              {listHeaderLine.trim()}
            </p>
          )}
          <ul className="list-none pl-1 space-y-0">
            {bulletOnlyLines.map((line, lIdx) => {
              const rawLine = line;
              const trimmedLine = line.trim();
              const numberMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
              if (numberMatch) {
                return (
                  <li
                    key={lIdx}
                    className="text-slate-700 text-xs md:text-sm pl-2 font-bold font-daughter"
                    style={{ lineHeight: "28px" }}
                  >
                    {numberMatch[1]}. {renderHighlightedText(numberMatch[2])}
                  </li>
                );
              }
              const itemText = trimmedLine.replace(/^[-*🕒]\s+/, "");
              const boldMatch = itemText.match(/^([^:]+):(.+)$/);
              if (boldMatch) {
                return (
                  <li
                    key={lIdx}
                    className="text-slate-700 text-xs md:text-sm flex items-start gap-1.5 pl-2"
                    style={{ lineHeight: "28px" }}
                  >
                    <span className="shrink-0">👉</span>
                    <div>
                      <strong className="text-indigo-900 font-bold font-daughter mr-1">
                        {boldMatch[1]}:
                      </strong>
                      <span>{renderHighlightedText(boldMatch[2])}</span>
                    </div>
                  </li>
                );
              } else {
                const isIndented = rawLine.startsWith("  ") || rawLine.startsWith("\t");
                return (
                  <li
                    key={lIdx}
                    className={`text-slate-700 text-xs md:text-sm flex items-start gap-1.5 ${
                      isIndented ? "pl-6" : "pl-2"
                    }`}
                    style={{ lineHeight: "28px" }}
                  >
                    <span className="shrink-0 text-slate-400 font-bold">-</span>
                    <span>{renderHighlightedText(itemText)}</span>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    }

    // Warning callout
    if (trimmed.toLowerCase().startsWith("warning -")) {
      return (
        <div
          key={index}
          className="my-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 rotate-[4deg] bg-rose-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm sticker-tab font-daughter">
            EXAM HOT
          </div>
          <span className="text-[10px] font-bold text-rose-600 tracking-wider uppercase block mb-1">
            ⚠️ High Yield Warning
          </span>
          <p className="pr-14 text-slate-700 text-xs md:text-sm" style={{ lineHeight: "28px" }}>
            {renderHighlightedText(trimmed.substring(9).trim())}
          </p>
        </div>
      );
    }

    // Tip callout
    if (trimmed.toLowerCase().startsWith("tip -")) {
      return (
        <div
          key={index}
          className="my-3 p-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/40 text-xs md:text-sm"
        >
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase block mb-0.5">
            💡 Study Tip
          </span>
          <p className="mt-0.5 text-slate-700" style={{ lineHeight: "28px" }}>
            {renderHighlightedText(trimmed.substring(5).trim())}
          </p>
        </div>
      );
    }

    // Default paragraph
    return (
      <p
        key={index}
        className="mb-3 text-slate-700 text-xs md:text-sm"
        style={{ lineHeight: "28px" }}
      >
        {renderHighlightedText(trimmed)}
      </p>
    );
  };

  return (
    <div className="notebook-page-content font-hand text-slate-800 select-text">
      {blocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
}
