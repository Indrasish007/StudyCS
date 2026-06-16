import React from "react";
import { slugify } from "../lib/notes";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Preprocess content to isolate headings with double newlines, preventing them
  // from being grouped with standard paragraphs when split by newlines.
  const processedLines = content.split("\n").map((line) => {
    const trimmed = line.trim();
    const isHeading = /^(Chapter\s+\d+|[0-9]+(?:\.[0-9]+)+)[:.]?\s+(.+)$/i.test(trimmed);
    if (isHeading) {
      return `\n\n${trimmed}\n\n`;
    }
    return line;
  });
  const processedContent = processedLines.join("\n");

  // Split content into blocks by double newlines
  const blocks = processedContent.split(/\n\n+/);

  const renderHighlightedText = (text: string) => {
    // Highlight key terms in double quotes or single quotes with yellow marker highlights
    const parts = text.split(/(".*?"|'.*?')/g);
    return parts.map((part, idx) => {
      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
        return (
          <span key={idx} className="highlight-yellow font-bold text-slate-950 mx-0.5">
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderBlock = (block: string, index: number) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // 1. Check if it's a heading matching "Chapter X: ..." or numbered section "X.Y ..."
    const headingMatch = trimmed.match(/^(Chapter\s+\d+|[0-9]+(?:\.[0-9]+)+)[:.]?\s+(.+)$/i);
    if (headingMatch) {
      const prefix = headingMatch[1];
      const textVal = headingMatch[2].trim();
      const id = slugify(prefix + "-" + textVal);
      const isChapter = prefix.toLowerCase().startsWith("chapter");

      if (isChapter) {
        return (
          <h2 key={index} id={id} className="text-base md:text-xl font-bold hand-h2 mt-6 mb-3 font-daughter">
            {prefix}: {textVal}
          </h2>
        );
      } else {
        return (
          <h3 key={index} id={id} className="text-sm md:text-base font-bold hand-h3 mt-4 mb-2 pb-0.5 border-b border-dashed border-indigo-300 font-daughter">
            {prefix}: {textVal}
          </h3>
        );
      }
    }

    // 2. Check if it is a monospaced block / ASCII diagram (contains drawing characters or multiple tabs/spaces for layout)
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
      trimmed.includes("  ") && trimmed.split("\n").length > 1; // multi-line indented blocks

    if (isMonospaced) {
      return (
        <pre 
          key={index} 
          className="my-3 overflow-x-auto p-3.5 rounded-xl border border-slate-300 bg-slate-900 text-yellow-300 font-mono text-[10px] md:text-xs leading-relaxed select-text shadow-sm"
        >
          <code>{trimmed}</code>
        </pre>
      );
    }

    // 3. Check if it is a list (lines start with bullet markers)
    const lines = trimmed.split("\n");
    const isList = lines.every(line => {
      const l = line.trim();
      return l.startsWith("- ") || l.startsWith("* ") || l.startsWith("🕒 ") || /^\d+\.\s+/.test(l);
    });

    if (isList && lines.length > 1) {
      return (
        <ul key={index} className="list-none pl-3 space-y-1 mb-3">
          {lines.map((line, lIdx) => {
            const itemText = line.trim().replace(/^[-*🕒]\s+/, "").replace(/^\d+\.\s+/, "");
            // Check if it has a colon prefix like "Term: Definition"
            const boldMatch = itemText.match(/^([^:]+):(.+)$/);
            
            return (
              <li key={lIdx} className="hand-bullet leading-relaxed text-slate-700 text-xs md:text-sm">
                {boldMatch ? (
                  <>
                    <strong className="text-indigo-900 font-bold bg-yellow-100 px-1 py-0.5 rounded shadow-sm">{boldMatch[1]}:</strong>
                    <span>{renderHighlightedText(boldMatch[2])}</span>
                  </>
                ) : (
                  <span>{renderHighlightedText(itemText)}</span>
                )}
              </li>
            );
          })}
        </ul>
      );
    }

    // 4. Check if it's a specific highlighted callout block (e.g. starting with "Warning - ")
    if (trimmed.toLowerCase().startsWith("warning -")) {
      return (
        <div key={index} className="my-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 relative overflow-hidden">
          <div className="absolute top-2 right-2 rotate-[4deg] bg-rose-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm sticker-tab font-daughter">
            EXAM HOT
          </div>
          <span className="text-[10px] font-bold text-rose-600 tracking-wider uppercase block mb-1">
            ⚠️ High Yield Warning
          </span>
          <p className="leading-relaxed pr-14 text-slate-700 text-xs md:text-sm">{renderHighlightedText(trimmed.substring(9).trim())}</p>
        </div>
      );
    }

    if (trimmed.toLowerCase().startsWith("tip -")) {
      return (
        <div key={index} className="my-3 p-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/40 text-xs md:text-sm">
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase block mb-0.5">
            💡 Study Tip
          </span>
          <p className="leading-relaxed mt-0.5 text-slate-700">{renderHighlightedText(trimmed.substring(5).trim())}</p>
        </div>
      );
    }

    // 5. Default paragraph
    return (
      <p key={index} className="mb-3 leading-relaxed text-slate-700 text-xs md:text-sm">
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
