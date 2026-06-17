# StudyCS - Handwritten Styled Semester Hub

StudyCS is an immersive, interactive semester notes platform designed for computer science subjects. It is built using **React + Vite + TypeScript + Tailwind CSS**, compiled to run fully client-side. 

The application is styled like a physical double-page opened school notebook featuring ruled paper lines, red margins, handwritten fonts, highlighter strokes, and binder rings.

---

## 🎨 Design Features

1. **Tactile School Notebook Style**:
   - Double-page open notebook layout (stacked on mobile).
   - Centered realistic metallic spiral binder rings.
   - Colored subject divider tabs protruding from the notebook edge (AI, DBMS, DSA, ML, Networking).
   - Cream ruled paper with red vertical margin rules.
   - Text rendered using handwritten cursive Google Fonts (`Kalam`, `Architects Daughter`, `Caveat`).

2. **Smart Outline & Table of Contents**:
   - The left page parses and lists the course section outline.
   - Clicking on any heading in the outline smoothly scrolls the right page to that section.

3. **High-Yield Revision Deck**:
   - Automatically harvests definitions, formulas, and practice questions from raw text files (`text_semester/*.txt`) at compile-time.
   - Supports **Active Recall mode** with 3D-flipping flashcards.

4. **Interactive MDX Widgets**:
   - Parses `<Quiz>`, `<Flashcard>`, `<Formula>`, `<Definition>`, `<Summary>`, and `<PracticeQuestion>` blocks.
   - Renders **Mermaid Diagrams** and **KaTeX Math blocks** (`$$...$$` and `$....$`) with zero lag.

---

## 📁 Project Structure

```text
d:\website_semester\
├── src/
│   ├── components/
│   │   ├── learning/          # Custom Interactive Notebook Blocks
│   │   │   ├── Quiz.tsx
│   │   │   ├── Flashcard.tsx
│   │   │   ├── Definition.tsx
│   │   │   ├── Summary.tsx
│   │   │   ├── Important.tsx
│   │   │   ├── Formula.tsx
│   │   │   └── PracticeQuestion.tsx
│   │   ├── MarkdownRenderer.tsx# Markdown parser (Katex, Mermaid, Quiz)
│   │   ├── RevisionView.tsx   # Aggregated terms deck & flashcards
│   │   └── SearchModal.tsx    # Ctrl + K Command Palette search
│   ├── lib/
│   │   └── notes.ts           # Eager glob compiler-safe file loader
│   ├── App.tsx                # Double-page notebook navigation core
│   ├── main.tsx               # App bootstrapper
│   └── index.css              # Custom ruled backgrounds & handwriting fonts
├── markdown_semester/         # SOURCE md files
│   ├── ai.md
│   ├── dbms.md
│   ├── dsa.md
│   ├── machine_learning.md
│   └── networking.md
├── text_semester/             # Generated plain text files compiled by notes.ts
│   ├── ai.txt
│   ├── dbms.txt
│   ├── dsa.txt
│   ├── machine_learning.txt
│   └── networking.txt
├── public/                    # Static assets
├── vercel.json                # Vercel SPA routing rules config
├── vite.config.ts             # Vite build aliases
├── tailwind.config.js         # Typography & custom animations config
├── tsconfig.json              # TypeScript compilation
└── package.json               # Node packages
```

---

## ⚙️ Development Setup

### 1. Clean Up Legacy Next.js Files
Since we migrated to a React + Vite application, you can safely delete the old Next.js folders:
```powershell
# In PowerShell:
Remove-Item -Recurse -Force app, components, lib, next-env.d.ts, next.config.mjs
```

### 2. Install Dependencies
Run the installation command in your project terminal:
```bash
npm install
```

### 3. Run Development Server
Start the Vite developer server:
```bash
npm run dev
```
Open the provided URL (e.g., `http://localhost:5173`) in your browser to view the animated notebook!

### 4. Build for Production
To compile optimized static assets:
```bash
npm run build
```

---

## ⚡ Deployment to Vercel

Since this is a 100% static React Single Page Application (SPA), it builds extremely fast and deploys to **Vercel** with zero configuration needed.

### Option 1: Git Integration (Recommended)
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
3. Import your repository.
4. Vercel will automatically detect **Vite** as the framework preset and configure:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Any future push to your repository will trigger an automatic preview or production deployment.

### Option 2: Vercel CLI (Command Line)
If you prefer deploying directly from your local terminal:
1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Run the deployment command in the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts to log in and set up your project.
4. To build and deploy directly to production, run:
   ```bash
   vercel --prod
   ```
