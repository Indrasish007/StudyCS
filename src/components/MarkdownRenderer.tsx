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

    // First block is the main note title
    if (index === 0) {
      return (
        <h1 key={index} className="text-xl md:text-2xl font-extrabold hand-h1 mb-6 mt-2 pb-2 border-b-2 border-dashed border-indigo-300/60 font-daughter" style={{ lineHeight: '36px' }}>
          {trimmed}
        </h1>
      );
    }

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
          className="my-4 overflow-x-auto p-4 rounded-xl border border-white/5 bg-[#0d1220] text-yellow-300 font-mono text-[10px] md:text-xs leading-relaxed select-text shadow-lg"
        >
          <code>{trimmed}</code>
        </pre>
      );
    }

    // 3. Check if it is a list (lines start with bullet markers)
    const lines = trimmed.split("\n");
    
    // Check if it looks like a list block: all lines are bullets OR it has a header + bullets
    const bulletLines = lines.filter(l => {
      const t = l.trim();
      return t.startsWith("- ") || t.startsWith("* ") || t.startsWith("🕒 ") || /^\d+\.\s+/.test(t);
    });
    const nonBulletLines = lines.filter(l => {
      const t = l.trim();
      return t.length > 0 && !t.startsWith("- ") && !t.startsWith("* ") && !t.startsWith("🕒 ") && !/^\d+\.\s+/.test(t);
    });
    
    // Pure list: all lines are bullets, OR has 1 non-bullet header + rest are bullets
    const isList = bulletLines.length > 0 && nonBulletLines.length <= 1;
    const listHeaderLine = nonBulletLines.length === 1 ? nonBulletLines[0] : null;

    if (isList) {
      const bulletOnlyLines = lines.filter(l => {
        const t = l.trim();
        return t.startsWith("- ") || t.startsWith("* ") || t.startsWith("🕒 ") || /^\d+\.\s+/.test(t);
      });
      return (
        <div key={index} className="mb-3">
          {listHeaderLine && (
            <p className="text-slate-700 text-xs md:text-sm font-bold font-daughter mb-0" style={{ lineHeight: '28px' }}>
              {listHeaderLine.trim()}
            </p>
          )}
          <ul className="list-none pl-1 space-y-0">
            {bulletOnlyLines.map((line, lIdx) => {
              const rawLine = line;
              const trimmedLine = line.trim();
              
              // Check if it's a numbered item
              const numberMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
              if (numberMatch) {
                const num = numberMatch[1];
                const text = numberMatch[2];
                return (
                  <li key={lIdx} className="text-slate-700 text-xs md:text-sm pl-2 font-bold font-daughter" style={{ lineHeight: '28px' }}>
                    {num}. {renderHighlightedText(text)}
                  </li>
                );
              }

              // Standard bullet item
              const itemText = trimmedLine.replace(/^[-*🕒]\s+/, "");
              const boldMatch = itemText.match(/^([^:]+):(.+)$/);
              
              // If it has a colon, render with 👉 bullet and styled term inline
              if (boldMatch) {
                return (
                  <li key={lIdx} className="text-slate-700 text-xs md:text-sm flex items-start gap-1.5 pl-2" style={{ lineHeight: '28px' }}>
                    <span className="shrink-0">👉</span>
                    <div>
                      <strong className="text-indigo-900 font-bold font-daughter mr-1">{boldMatch[1]}:</strong>
                      <span>{renderHighlightedText(boldMatch[2])}</span>
                    </div>
                  </li>
                );
              } else {
                // No colon, check if indented
                const isIndented = rawLine.startsWith("  ") || rawLine.startsWith("\t");
                return (
                  <li key={lIdx} className={`text-slate-700 text-xs md:text-sm flex items-start gap-1.5 ${isIndented ? "pl-6" : "pl-2"}`} style={{ lineHeight: '28px' }}>
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
          <p className="pr-14 text-slate-700 text-xs md:text-sm" style={{ lineHeight: '28px' }}>{renderHighlightedText(trimmed.substring(9).trim())}</p>
        </div>
      );
    }

    if (trimmed.toLowerCase().startsWith("tip -")) {
      return (
        <div key={index} className="my-3 p-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/40 text-xs md:text-sm">
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase block mb-0.5">
            💡 Study Tip
          </span>
          <p className="mt-0.5 text-slate-700" style={{ lineHeight: '28px' }}>{renderHighlightedText(trimmed.substring(5).trim())}</p>
        </div>
      );
    }

    // 5. Default paragraph
    return (
      <p key={index} className="mb-3 text-slate-700 text-xs md:text-sm" style={{ lineHeight: '28px' }}>
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
