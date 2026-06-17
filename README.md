# 🎓 StudyCS — Learn Computer Science Smarter

<div align="center">
  <p><strong>A Premium, Immersive CS Learning Platform styled like an Interactive Lecture notebook.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  </p>
</div>

<div align="center">
  <h3>🌐 Live Demo: <a href="https://studycs.vercel.app/">studycs.vercel.app</a></h3>
</div>

---

## ⚡ Introduction

**StudyCS** is a premium educational platform that provides structured computer science lecture notes, revision flashcards, quizzes, and diagrams. 

The core notes interface is styled after a **physical open spiral binder diary** with ruled paper sheets, handwritten fonts, sticker annotations, and highlighter strokes. The dashboard, landing page, and about pages employ a high-end, responsive dark interface inspired by premium modern tools like Linear, Apple, and Arc Browser.

---

## ✨ Key Platform Features

### 📖 1. Tactile Notebook Workspace
- **Spiral Binder Layout**: Centered glossy metallic spine loops dividing two notebook pages.
- **Rules & Margin Accents**: Cream paper backgrounds with red vertical margin rules and blue horizontal writing lines.
- **Cursive Handwritten Fonts**: Leverages Google Web Fonts (`Kalam`, `Architects Daughter`, `Caveat`) to replicate handwritten student logs.
- **Colored divider tabs**: Easily switch subjects (DSA, DBMS, Networks, AI, ML) using folder-tab clips protruding from the notebook edge.

### 🔍 2. Interactive In-Note Find Tool (`Ctrl+F`)
- **Localized Querying**: Tap the **Find** button or press `Ctrl+F` while reading to toggle an in-note find bar directly on the paper.
- **Pill Marks**: Highlights matches instantly in **yellow**, and turns the active selection **orange**.
- **Smooth Auto-Scroll**: Jumps and scrolls the notes sheet directly to matches using Next/Prev controls or standard keys (`Enter` / `Shift+Enter`).

### 🌗 3. System-Sync Dark/Light Mode Theme Switcher
- **State Persistence**: Saves your custom theme choices in browser `localStorage`.
- **Night Notebook Mode**: When switching to Dark mode, the white cream notebook sheets turn into a custom charcoal black paper style with soft indigo-ruled guidelines to protect your eyes during late-night study sessions.

### 🎯 4. Active Recall Revision Center (`RevisionView.tsx`)
- **Card deck harvester**: Automatically aggregates definitions, formulas, warnings, and practice questions from raw notes.
- **3D Flip cards**: Flip flashcards on a 3D-perspective axis to practice recall questions.

---

## 📁 File Structure

```text
website_semester/
├── src/
│   ├── components/
│   │   ├── learning/          # Interactive notebook blocks (Quiz, Cards, Formulas)
│   │   ├── Navbar.tsx         # Sticky glassmorphic nav header
│   │   ├── Home.tsx           # Hero page & showcase counters
│   │   ├── About.tsx          # Contributor profile cards & disclaimer
│   │   ├── Footer.tsx         # Nav shortcuts & copyright signatures
│   │   ├── BookmarksPanel.tsx # Bookmark list controllers
│   │   ├── MarkdownRenderer.tsx# Markdown parser (Handles KaTeX math, Mermaid diagrams)
│   │   ├── RevisionView.tsx   # Aggregated flashcard decks
│   │   └── SearchModal.tsx    # Command Palette global search (Ctrl + K)
│   ├── lib/
│   │   └── notes.ts           # Eager files loading compiler
│   ├── App.tsx                # Double-page notebook navigation core
│   ├── main.tsx               # Entry bootstrapper
│   └── index.css              # Custom notebook rules & handwriting styles
├── text_semester/             # Ruled study text resources (DSA, DBMS, Networks, AI, ML)
├── public/                    # Page assets & icons
├── vite.config.ts             # Bundler options
├── tailwind.config.js         # Typography & custom animations config
└── package.json               # Dependencies
```

---

## ⚙️ Development Setup

### 1. Install Dependencies
Run the installation command in your project terminal:
```bash
npm install
```

### 2. Run Development Server
Start the Vite developer server:
```bash
npm run dev
```
Open the provided URL (typically `http://localhost:5173`) in your browser to view the animated notebook!

### 3. Build for Production
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
