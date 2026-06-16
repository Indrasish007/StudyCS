const fs = require("fs");
const path = require("path");

const srcFolder = path.join(__dirname, "markdown_semester");
const destFolder = path.join(__dirname, "text_semester");

// Create destination folder if it doesn't exist
if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder);
}

// Helper to clean Markdown syntax to plain text
function markdownToPlainText(markdown) {
  let text = markdown;

  // 1. Strip YAML frontmatter
  if (text.startsWith("---")) {
    const endOffset = text.indexOf("---", 3);
    if (endOffset !== -1) {
      text = text.slice(endOffset + 3);
    }
  }

  // 2. Strip JSX widgets (<Quiz />, <Definition>, etc.)
  text = text.replace(/<Quiz[\s\S]*?\/>/g, "");
  text = text.replace(/<Flashcard[\s\S]*?\/>/g, "");
  text = text.replace(/<Formula[\s\S]*?\/>/g, "");
  text = text.replace(/<PracticeQuestion[\s\S]*?\/>/g, "");
  text = text.replace(/<(Definition|Summary|Important)[\s\S]*?>([\s\S]*?)<\/\1>/g, "$2");

  // 3. Remove inline KaTeX math tags ($x$ -> x) and block math ($$x$$ -> x)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, "$1");
  text = text.replace(/\$([^$]+)\$/g, "$1");

  // 4. Strip code blocks fences (but keep the inner code contents)
  text = text.replace(/```[a-zA-Z0-9-]*\n([\s\S]*?)```/g, "$1");

  // 5. Remove bold (**) and italic (* or _)
  text = text.replace(/\*\*([\s\S]*?)\*\*/g, "$1");
  text = text.replace(/\*([\s\S]*?)\*/g, "$1");
  text = text.replace(/_([\s\S]*?)_/g, "$1");

  // 6. Format Markdown links [Text](URL) -> Text (URL)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

  // 7. Strip Markdown Headings (# Heading -> Heading)
  text = text.replace(/^(#+)\s+(.+)$/gm, "$2");

  // 8. Strip blockquote symbols (> Text -> Text)
  text = text.replace(/^>\s?/gm, "");

  // 9. Clean up horizontal rules (---)
  text = text.replace(/^---$/gm, "");

  // 10. Clean up bullet markers (* Item or - Item -> Item)
  text = text.replace(/^[\s]*[-*+]\s+/gm, "- ");

  // 11. Normalize excessive newlines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

try {
  const files = fs.readdirSync(srcFolder);
  
  files.forEach((file) => {
    if (path.extname(file) === ".md") {
      const srcPath = path.join(srcFolder, file);
      const destFile = file.replace(/\.md$/, ".txt");
      const destPath = path.join(destFolder, destFile);

      console.log(`Processing: ${file} -> ${destFile}...`);

      const markdownContent = fs.readFileSync(srcPath, "utf-8");
      const plainText = markdownToPlainText(markdownContent);

      fs.writeFileSync(destPath, plainText, "utf-8");
    }
  });

  console.log("\nSuccess! All files converted and written to text_semester/ folder.");
} catch (err) {
  console.error("Error during plain text conversion:", err);
}
