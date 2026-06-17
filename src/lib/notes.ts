// Utility to dynamically parse and load plain text files in Vite using import.meta.glob
// BUNDLE REFRESH: 2026-06-17T09:15:00+05:30 — All 4 subject .txt files fully updated (ai, dsa, ml, networking)

export interface NoteMetadata {
  slug: string;
  title: string;
  subject: string;
  icon: string;
  readingTime: number;
  wordCount: number;
  topicsCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  color: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface NoteData {
  metadata: NoteMetadata;
  content: string;
  toc: TocItem[];
  topics: string[];
}

export interface RevisionConcept {
  id: string;
  topic: string;
  concept: string;
  type: "concept" | "definition" | "formula" | "question";
  subject: string;
  details: string;
}

// 1. Vite eager glob imports for raw plain text content from text_semester folder
// Last updated: 2026-06-17 (forces Vite HMR rebundle to pick up .txt file changes)
const rawNotes = import.meta.glob("../../text_semester/*.txt", {
  as: "raw",
  eager: true,
}) as Record<string, string>;

// Helper to capitalize first letters
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Map slug to human readable Subject names
function getSubjectName(slug: string): string {
  const mapping: { [key: string]: string } = {
    ai: "Artificial Intelligence",
    dbms: "Database Management Systems",
    dsa: "Data Structures & Algorithms",
    machine_learning: "Machine Learning",
    "machine-learning": "Machine Learning",
    networking: "Computer Networks",
  };
  return mapping[slug.toLowerCase().replace("-", "_")] || capitalize(slug.replace(/[_-]/g, " "));
}

// Map slug to Lucide icon string
function getSubjectIcon(slug: string): string {
  const mapping: { [key: string]: string } = {
    ai: "Brain",
    dbms: "Database",
    dsa: "Binary",
    machine_learning: "Cpu",
    "machine-learning": "Cpu",
    networking: "Network",
  };
  return mapping[slug.toLowerCase().replace("-", "_")] || "BookOpen";
}

// Map slug to color tokens (primarily for cards and spiral borders)
function getSubjectColor(slug: string): string {
  const mapping: { [key: string]: string } = {
    ai: "indigo",
    dbms: "cyan",
    dsa: "emerald",
    machine_learning: "pink",
    networking: "amber",
  };
  return mapping[slug.toLowerCase().replace("-", "_")] || "violet";
}

// Clean and create a slug from heading text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[-\s]+/g, "-");
}

export function getAllNotes(): NoteData[] {
  const notes: NoteData[] = [];

  for (const filepath in rawNotes) {
    const filename = filepath.split("/").pop() || "";
    const slug = filename.replace(/\.txt$/, "");
    const content = rawNotes[filepath];

    const lines = content.split("\n");
    
    // Extract title from the first line
    const titleLine = lines[0] ? lines[0].trim() : "";
    const cleanTitle = titleLine.replace(/^[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]\s*/g, "");

    // Calculate word count & reading time
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.round(wordCount / 180));

    // Build TOC and list of topics from text structure
    const toc: TocItem[] = [];
    const topics: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Match "Chapter X: ..." or numbered section "X.Y ..."
      const headingMatch = trimmed.match(/^(Chapter\s+\d+|[0-9]+(?:\.[0-9]+)+)[:.]?\s+(.+)$/i);
      if (headingMatch) {
        const prefix = headingMatch[1];
        const textVal = headingMatch[2].trim();
        const id = slugify(prefix + "-" + textVal);
        const level = prefix.toLowerCase().startsWith("chapter") ? 1 : 2;

        toc.push({ id, text: prefix + ": " + textVal, level });

        if (level === 2) {
          topics.push(textVal);
        }
      }
    });

    let difficulty: NoteMetadata["difficulty"] = "Intermediate";
    if (wordCount > 4000) {
      difficulty = "Expert";
    } else if (wordCount > 2500) {
      difficulty = "Advanced";
    } else if (wordCount < 1200) {
      difficulty = "Beginner";
    }

    const metadata: NoteMetadata = {
      slug,
      title: cleanTitle || getSubjectName(slug),
      subject: getSubjectName(slug),
      icon: getSubjectIcon(slug),
      readingTime,
      wordCount,
      topicsCount: topics.length,
      difficulty,
      color: getSubjectColor(slug),
    };

    notes.push({
      metadata,
      content,
      toc,
      topics,
    });
  }

  // Sort notes so they always appear in a consistent order
  const order = ["dsa", "dbms", "networking", "ai", "machine_learning"];
  return notes.sort((a, b) => {
    return order.indexOf(a.metadata.slug) - order.indexOf(b.metadata.slug);
  });
}

export function getNoteBySlug(slug: string): NoteData | null {
  const all = getAllNotes();
  const matched = all.find(
    (n) =>
      n.metadata.slug.toLowerCase() === slug.toLowerCase() ||
      n.metadata.slug.toLowerCase().replace("_", "-") === slug.toLowerCase() ||
      n.metadata.slug.toLowerCase().replace("-", "_") === slug.toLowerCase()
  );
  return matched || null;
}

// Dynamically extract revision helpers from plain text notes
export function getRevisionData(): RevisionConcept[] {
  const allNotes = getAllNotes();
  const revisionConcepts: RevisionConcept[] = [];

  allNotes.forEach((note) => {
    const meta = note.metadata;
    const lines = note.content.split("\n");
    let currentTopic = meta.subject;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Track current section / chapter
      const headingMatch = line.match(/^(Chapter\s+\d+|[0-9]+(?:\.[0-9]+)+)[:.]?\s+(.+)$/i);
      if (headingMatch) {
        currentTopic = headingMatch[2].trim();
        continue;
      }

      // 1. Formulas (Equations, calculations or assignments)
      const isFormulaLine = 
        line.includes("Address(A[") ||
        line.includes("BF(n) =") ||
        line.includes("T(n) =") ||
        line.includes("h(k, i) =") ||
        line.includes("v_NB =") ||
        line.includes("P(h | D) =") ||
        line.includes("C = M^e") ||
        line.includes("W_S =") ||
        line.includes("eta =") ||
        line.includes("Links L =") ||
        (line.includes(" = ") && (line.includes(" + ") || line.includes(" - ") || line.includes(" * ") || line.includes(" / ") || line.includes(" % ")));

      if (isFormulaLine) {
        const prevLines = [];
        for (let k = Math.max(0, i - 1); k < i; k++) {
          const pl = lines[k].trim();
          if (pl && !pl.startsWith("Chapter") && !pl.match(/^[0-9]+(?:\.[0-9]+)+/)) {
            prevLines.push(pl);
          }
        }

        revisionConcepts.push({
          id: `formula-${meta.slug}-${i}`,
          topic: currentTopic,
          concept: prevLines.join(" ") || "Addressing/Mathematical Formula",
          type: "formula",
          subject: meta.subject,
          details: line,
        });
      }

      // 2. Definitions (Format: - Term: Definition)
      const defMatch = line.match(/^- ([^:]+?)\s*:\s*(.+)$/);
      if (defMatch) {
        revisionConcepts.push({
          id: `def-${meta.slug}-${i}`,
          topic: currentTopic,
          concept: defMatch[1].trim(),
          type: "definition",
          subject: meta.subject,
          details: defMatch[2].trim(),
        });
      }

      // 3. Practice/Key Questions
      const questionMatch = line.match(
        /^(?:What|How|Explain|Why|Describe|Calculate|Compare|Difference between)\s+.*\?/i
      );
      if (questionMatch) {
        let answerLines = [];
        let j = i + 1;
        while (j < lines.length && !lines[j].match(/^(Chapter|[0-9]+(?:\.[0-9]+)+)/) && answerLines.length < 4) {
          const al = lines[j].trim();
          if (al) {
            answerLines.push(al);
          }
          j++;
        }

        if (answerLines.length > 0) {
          revisionConcepts.push({
            id: `q-${meta.slug}-${i}`,
            topic: currentTopic,
            concept: line,
            type: "question",
            subject: meta.subject,
            details: answerLines.join(" "),
          });
        }
      }
    }
  });

  return revisionConcepts;
}
