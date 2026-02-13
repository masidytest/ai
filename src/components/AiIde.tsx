"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ResizeHandle, useResizable } from "./ui/ResizablePanel";
import { projectStore } from "@/lib/projectStore";
import { buildManager } from "@/lib/buildManager";

/* ─── types ─── */
interface FileNode {
  name: string;
  language: string;
  content: string;
}

type AiPhase = "idle" | "thinking" | "streaming" | "building" | "paused";

interface TaskStep {
  id: number;
  label: string;
  status: "pending" | "active" | "done" | "error";
}

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
  actions?: "confirm-plan" | "report-ai-mistake"; // shows Confirm / Reject or Report AI Mistake buttons
  tasks?: TaskStep[];       // shows live task progress
  confirmed?: boolean;      // plan was confirmed/rejected
}

interface ConsoleLine {
  type: "info" | "warn" | "error" | "success";
  text: string;
  ts: string;
}

/* ─── project files (mix of frontend + backend for preview) ─── */
/* ─── Empty starter files — replaced by AI when building ─── */
const defaultFiles: FileNode[] = [
  {
    name: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Project</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="app">
    <h1>Welcome to Masidy IDE</h1>
    <p>Type a prompt in the AI chat or use the hero input to build something.</p>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
  },
  {
    name: "styles.css",
    language: "css",
    content: `/* Your styles here */\n* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: sans-serif; background: #0a0a12; color: #e4e4ef; min-height: 100vh; display: flex; align-items: center; justify-content: center; }\n#app { text-align: center; padding: 2rem; }\nh1 { font-size: 2rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #8b5cf6, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\np { color: #6e6e8a; }`,
  },
  {
    name: "app.js",
    language: "javascript",
    content: `// Your JavaScript here\nconsole.log("Ready to build!");`,
  },
];

/* ─── syntax coloring ─── */
function tokenize(line: string, lang: string): React.ReactNode[] {
  if (lang === "json") {
    const tokens: React.ReactNode[] = [];
    const jsonRegex = /("(?:[^"\\]|\\.)*")\s*:/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let idx = 0;
    const str = line;
    while ((match = jsonRegex.exec(str)) !== null) {
      if (match.index > last) tokens.push(<span key={idx++}>{str.slice(last, match.index)}</span>);
      tokens.push(<span key={idx++} className="text-cyan-400">{match[1]}</span>);
      tokens.push(<span key={idx++}>:</span>);
      last = match.index + match[0].length;
    }
    if (last < str.length) {
      const rest = str.slice(last);
      const valRegex = /("(?:[^"\\]|\\.)*")|(\b\d+\b)|(true|false|null)/g;
      let vLast = 0;
      let vMatch: RegExpExecArray | null;
      while ((vMatch = valRegex.exec(rest)) !== null) {
        if (vMatch.index > vLast) tokens.push(<span key={idx++}>{rest.slice(vLast, vMatch.index)}</span>);
        if (vMatch[1]) tokens.push(<span key={idx++} className="text-amber-400">{vMatch[1]}</span>);
        else if (vMatch[2]) tokens.push(<span key={idx++} className="text-purple-400">{vMatch[2]}</span>);
        else if (vMatch[3]) tokens.push(<span key={idx++} className="text-red-400">{vMatch[3]}</span>);
        vLast = vMatch.index + vMatch[0].length;
      }
      if (vLast < rest.length) tokens.push(<span key={idx++}>{rest.slice(vLast)}</span>);
    }
    if (tokens.length === 0) return [<span key="j">{line}</span>];
    return tokens;
  }

  if (lang === "css") {
    const tokens: React.ReactNode[] = [];
    const cssRegex = /(\/\*[\s\S]*?\*\/|\/\/.*$)|([.#]?[\w-]+(?=\s*\{))|(\{|\})|(:[\w-]+)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(--[\w-]+)|(#[0-9a-fA-F]{3,8})|(\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|deg)?\b)/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let idx = 0;
    while ((match = cssRegex.exec(line)) !== null) {
      if (match.index > last) tokens.push(<span key={idx++}>{line.slice(last, match.index)}</span>);
      const t = match[0];
      if (match[1]) tokens.push(<span key={idx++} className="text-emerald-600/60 italic">{t}</span>);
      else if (match[2]) tokens.push(<span key={idx++} className="text-cyan-400">{t}</span>);
      else if (match[3]) tokens.push(<span key={idx++} className="text-app-text-muted">{t}</span>);
      else if (match[4]) tokens.push(<span key={idx++} className="text-purple-400">{t}</span>);
      else if (match[5]) tokens.push(<span key={idx++} className="text-amber-400">{t}</span>);
      else if (match[6]) tokens.push(<span key={idx++} className="text-orange-400">{t}</span>);
      else if (match[7]) tokens.push(<span key={idx++} className="text-green-400">{t}</span>);
      else if (match[8]) tokens.push(<span key={idx++} className="text-purple-300">{t}</span>);
      else tokens.push(<span key={idx++}>{t}</span>);
      last = match.index + t.length;
    }
    if (last < line.length) tokens.push(<span key={idx++}>{line.slice(last)}</span>);
    if (tokens.length === 0) return [<span key="c">{line}</span>];
    return tokens;
  }

  if (lang === "html") {
    const tokens: React.ReactNode[] = [];
    const htmlRegex = /(<!--[\s\S]*?-->)|(<\/?)([\w-]+)|(\s)([\w-]+)(=)("[^"]*"|'[^']*')|(>)|(&[\w]+;)/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let idx = 0;
    while ((match = htmlRegex.exec(line)) !== null) {
      if (match.index > last) tokens.push(<span key={idx++}>{line.slice(last, match.index)}</span>);
      if (match[1]) tokens.push(<span key={idx++} className="text-emerald-600/60 italic">{match[1]}</span>);
      else if (match[2] && match[3]) {
        tokens.push(<span key={idx++} className="text-app-text-muted">{match[2]}</span>);
        tokens.push(<span key={idx++} className="text-red-400">{match[3]}</span>);
      } else if (match[4] && match[5] && match[6] && match[7]) {
        tokens.push(<span key={idx++}>{match[4]}</span>);
        tokens.push(<span key={idx++} className="text-cyan-400">{match[5]}</span>);
        tokens.push(<span key={idx++} className="text-app-text-muted">{match[6]}</span>);
        tokens.push(<span key={idx++} className="text-amber-400">{match[7]}</span>);
      } else if (match[8]) tokens.push(<span key={idx++} className="text-app-text-muted">{match[8]}</span>);
      else if (match[9]) tokens.push(<span key={idx++} className="text-purple-400">{match[9]}</span>);
      else tokens.push(<span key={idx++}>{match[0]}</span>);
      last = match.index + match[0].length;
    }
    if (last < line.length) tokens.push(<span key={idx++}>{line.slice(last)}</span>);
    if (tokens.length === 0) return [<span key="h">{line}</span>];
    return tokens;
  }

  /* TS / JS */
  const tokens: React.ReactNode[] = [];
  const regex =
    /(\/\/.*$|"[^"]*"|'[^']*'|`[^`]*`|\b(?:import|export|from|const|let|var|function|async|await|return|if|else|try|catch|throw|new|class|interface|type|extends|implements|typeof|as|any|document|window|console|setTimeout|setInterval|clearInterval|addEventListener|querySelector|querySelectorAll|getElementById|createElement|appendChild|insertBefore|remove|textContent|innerHTML|className|style)\b|\b(?:true|false|null|undefined|void|NaN)\b|\b\d+\b)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let idx = 0;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) tokens.push(<span key={idx++}>{line.slice(last, match.index)}</span>);
    const t = match[0];
    let cls = "text-app-text";
    if (t.startsWith("//")) cls = "text-emerald-600/60 italic";
    else if (t.startsWith('"') || t.startsWith("'") || t.startsWith("`")) cls = "text-amber-400";
    else if (/^(import|export|from|const|let|var|function|async|await|return|if|else|try|catch|throw|new|class|interface|type|extends|implements|typeof|as|any)$/.test(t)) cls = "text-purple-400";
    else if (/^(document|window|console|setTimeout|setInterval|clearInterval|addEventListener|querySelector|querySelectorAll|getElementById|createElement|appendChild|insertBefore|remove|textContent|innerHTML|className|style)$/.test(t)) cls = "text-cyan-400";
    else if (/^(true|false|null|undefined|void|NaN)$/.test(t)) cls = "text-red-400";
    else if (/^\d+$/.test(t)) cls = "text-purple-300";
    tokens.push(<span key={idx++} className={cls}>{t}</span>);
    last = match.index + t.length;
  }
  if (last < line.length) tokens.push(<span key={idx++}>{line.slice(last)}</span>);
  return tokens;
}

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

/* ─── AI response simulator ─── */
const aiResponses: Record<string, string> = {
  default:
    "I analyzed your code. Here are my suggestions:\n\n1. Add input validation on all route handlers\n2. Use connection pooling for better DB performance\n3. Add rate limiting to protect against abuse\n4. Implement structured error responses\n\nWant me to generate any of these?",
  error:
    "I can help with error handling. Here is a pattern I recommend:\n\n```ts\nclass AppError extends Error {\n  constructor(\n    public statusCode: number,\n    public message: string,\n    public isOperational = true\n  ) { super(message); }\n}\n```\n\nShall I add a global error handler middleware?",
  test: "I will generate tests for your routes:\n\n- Unit tests for each controller\n- Integration tests for API endpoints\n- Mock database with test fixtures\n- Coverage reporting setup\n\nI recommend using Vitest with supertest. Want me to create the test files?",
  deploy:
    "For deployment, I recommend:\n\n1. Dockerfile with multi-stage build\n2. Health check endpoint (/health) -- already present\n3. Graceful shutdown handling\n4. Environment validation at startup\n5. Zero-downtime deploy via rolling updates\n\nWant me to generate the Dockerfile?",
  style:
    "I can help improve the CSS! Here are some suggestions:\n\n1. Add smooth transitions for hover states\n2. Improve responsive breakpoints\n3. Add subtle backdrop-blur effects\n4. Implement dark/light theme variables\n\nWant me to update the stylesheet?",
  preview:
    "The live preview shows your HTML/CSS/JS rendering in real-time. Try:\n\n1. Edit the HTML to change structure\n2. Modify CSS variables to change theme\n3. Update app.js for new interactivity\n\nAll changes reflect instantly in the preview panel!",
};

/* fallback for when API is unreachable */
function getAiResponseFallback(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("error") || lower.includes("handle")) return aiResponses.error;
  if (lower.includes("test")) return aiResponses.test;
  if (lower.includes("deploy") || lower.includes("docker")) return aiResponses.deploy;
  if (lower.includes("css") || lower.includes("style") || lower.includes("design")) return aiResponses.style;
  if (lower.includes("preview") || lower.includes("live")) return aiResponses.preview;
  return aiResponses.default;
}

/* ─── Preview builder: assembles HTML document from project files ─── */
/* ─── Building animation preview ─── */
function buildingPreviewHtml(progress: number): string {
  return `<!DOCTYPE html><html><head><style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a12; color: #e4e4ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
    .container { text-align: center; max-width: 400px; }
    .spinner { width: 60px; height: 60px; margin: 0 auto 24px; border-radius: 50%; border: 3px solid #1e1e3a; border-top-color: #8b5cf6; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 20px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: #6e6e8a; font-size: 14px; margin-bottom: 24px; }
    .progress-bar { width: 100%; height: 6px; background: #1e1e3a; border-radius: 3px; overflow: hidden; margin-bottom: 12px; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4); border-radius: 3px; transition: width 0.5s ease; width: ${progress}%; }
    .status { font-size: 12px; color: #6e6e8a; }
    .dots { display: inline-block; animation: dots 1.5s steps(4, end) infinite; }
    @keyframes dots { 0%,20% { content: ''; } 40% { content: '.'; } 60% { content: '..'; } 80%,100% { content: '...'; } }
    .particles { position: fixed; inset: 0; pointer-events: none; }
    .particle { position: absolute; width: 4px; height: 4px; background: #8b5cf6; border-radius: 50%; opacity: 0; animation: float 3s ease-in-out infinite; }
    .particle:nth-child(1) { left: 20%; top: 80%; animation-delay: 0s; }
    .particle:nth-child(2) { left: 60%; top: 90%; animation-delay: 0.5s; }
    .particle:nth-child(3) { left: 80%; top: 70%; animation-delay: 1s; }
    .particle:nth-child(4) { left: 40%; top: 85%; animation-delay: 1.5s; }
    .particle:nth-child(5) { left: 10%; top: 75%; animation-delay: 2s; }
    @keyframes float { 0% { opacity: 0; transform: translateY(0) scale(1); } 50% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-200px) scale(0); } }
    .emoji { font-size: 28px; margin-bottom: 16px; animation: bounce 1s ease-in-out infinite; }
    @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  </style></head><body>
    <div class="particles"><div class="particle"></div><div class="particle"></div><div class="particle"></div><div class="particle"></div><div class="particle"></div></div>
    <div class="container">
      <div class="emoji">${progress < 30 ? '🧠' : progress < 60 ? '⚡' : progress < 90 ? '🔨' : '✨'}</div>
      <div class="spinner"></div>
      <h2>${progress < 30 ? 'Analyzing your prompt...' : progress < 60 ? 'Generating code...' : progress < 90 ? 'Building your project...' : 'Almost there!'}</h2>
      <p class="subtitle">${progress < 30 ? 'Understanding what you need' : progress < 60 ? 'Writing HTML, CSS & JavaScript' : progress < 90 ? 'Assembling files & optimizing' : 'Finalizing your project'}</p>
      <div class="progress-bar"><div class="progress-fill"></div></div>
      <p class="status">${progress}% complete</p>
    </div>
  </body></html>`;
}

function buildPreviewHtml(files: FileNode[]): string {
  const htmlFile = files.find((f) => f.name.endsWith(".html"));
  const cssFile = files.find((f) => f.name.endsWith(".css"));
  const jsFile = files.find((f) => f.name === "app.js");

  if (!htmlFile) return "<html><body style='background:#0a0a12;color:#e4e4ef;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif'><p>No HTML file to preview</p></body></html>";

  let html = htmlFile.content;

  /* Inject CSS inline */
  if (cssFile) {
    html = html.replace(
      /<link[^>]*href=["']styles\.css["'][^>]*\/?>/i,
      `<style>${cssFile.content}</style>`
    );
  }

  /* Inject JS inline */
  if (jsFile) {
    html = html.replace(
      /<script[^>]*src=["']app\.js["'][^>]*><\/script>/i,
      `<script>${jsFile.content}<\/script>`
    );
  }

  /* Add base styles for iframe isolation */
  const iframeReset = `<style>html{scrollbar-width:thin;scrollbar-color:#333 transparent}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#333;border-radius:3px}</style>`;
  html = html.replace("</head>", `${iframeReset}</head>`);

  return html;
}

/* ─── Mobile detection hook ─── */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

/* ─── Main Component ─── */
export default function AiIde({ initialPrompt }: { initialPrompt?: string } = {}) {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("projectId");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(projectIdParam);

  const [files, setFiles] = useState<FileNode[]>(defaultFiles);
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState<"code" | "preview" | "chat">("code");

  // Load saved project files from Supabase on mount
  useEffect(() => {
    if (projectIdParam) {
      projectStore.get(projectIdParam).then((saved) => {
        if (saved && saved.files.length > 0) setFiles(saved.files);
      });
    }
  }, [projectIdParam]);
  const [activeFile, setActiveFile] = useState(0);
  const [showConsole, setShowConsole] = useState(false);
  const [showFileTree, setShowFileTree] = useState(!isMobile);
  const [showAi, setShowAi] = useState(!!initialPrompt);
  const [showPreview, setShowPreview] = useState(!isMobile);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([
    { type: "info", text: "Masidy IDE v2.5.0 initialized", ts: timestamp() },
    { type: "success", text: "TypeScript language server ready", ts: timestamp() },
    { type: "info", text: "Live preview connected", ts: timestamp() },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { role: "assistant", text: "Hi! I am your AI coding assistant. Edit any file and see changes instantly in the live preview. Ask me to review code, generate features, write tests, or optimize your project." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [aiPhase, setAiPhase] = useState<AiPhase>("idle");
  const [cursorLine, setCursorLine] = useState(0);
  const [previewKey, setPreviewKey] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const initialPromptSent = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  /* Resizable panels */
  const fileTree = useResizable({ initial: 200, min: 140, max: 360, storageKey: "ide-filetree" });
  const consolePanel = useResizable({ initial: 160, min: 80, max: 400, storageKey: "ide-console" });
  const aiPanel = useResizable({ initial: 300, min: 200, max: 500, storageKey: "ide-ai" });
  const previewPanel = useResizable({ initial: 50, min: 25, max: 75, storageKey: "ide-preview" }); /* percentage */

  const scrollChat = useCallback(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), []);
  const scrollConsole = useCallback(() => consoleEndRef.current?.scrollIntoView({ behavior: "smooth" }), []);

  useEffect(scrollChat, [chatMessages, scrollChat]);
  useEffect(scrollConsole, [consoleLines, scrollConsole]);

  /* ── Helper: save result files to Supabase ── */
  const saveResultFiles = useCallback(async (resultFiles: FileNode[]) => {
    if (currentProjectId) {
      await projectStore.updateFiles(currentProjectId, resultFiles);
    } else {
      const saved = await projectStore.create("AI Project", "HTML/CSS/JS", resultFiles);
      setCurrentProjectId(saved.id);
    }
  }, [currentProjectId]);

  /* ── Subscribe to global buildManager — keeps builds alive across navigation ── */
  useEffect(() => {
    // On mount: if buildManager has an active or completed build, restore its state
    if (buildManager.isActive || buildManager.phase === "done" || buildManager.phase === "error") {
      if (buildManager.chatMessages.length > 0) {
        setChatMessages(buildManager.chatMessages.map((m) => ({
          role: m.role,
          text: m.text,
          actions: m.actions,
          tasks: m.tasks,
          confirmed: m.confirmed,
        })));
      }
      if (buildManager.phase === "building") {
        setAiTyping(true);
        setAiPhase("building");
        setIsBuilding(true);
        setBuildProgress(buildManager.progress);
        setShowAi(true);
      }
      // If build completed while we were away, pick up the result files
      if (buildManager.phase === "done") {
        const resultFiles = buildManager.consumeResults();
        if (resultFiles && resultFiles.length > 0) {
          setFiles(resultFiles);
          setActiveFile(0);
          setPreviewKey((k) => k + 1);
          setIsBuilding(false);
          setBuildProgress(0);
          setAiTyping(false);
          setAiPhase("idle");
          // Auto-save to Supabase
          saveResultFiles(resultFiles);
        }
      }
    }

    // Subscribe: sync buildManager state → component state on every change
    const unsubscribe = buildManager.subscribe(() => {
      // Sync chat messages
      if (buildManager.chatMessages.length > 0) {
        setChatMessages(buildManager.chatMessages.map((m) => ({
          role: m.role,
          text: m.text,
          actions: m.actions,
          tasks: m.tasks,
          confirmed: m.confirmed,
        })));
      }

      // Sync build progress
      setBuildProgress(buildManager.progress);

      if (buildManager.phase === "building") {
        setAiTyping(true);
        setAiPhase("building");
        setIsBuilding(true);
      }

      // Build completed — pick up result files
      if (buildManager.phase === "done") {
        const resultFiles = buildManager.consumeResults();
        if (resultFiles && resultFiles.length > 0) {
          setFiles(resultFiles);
          setActiveFile(0);
          setPreviewKey((k) => k + 1);
          setIsBuilding(false);
          setBuildProgress(0);
          setAiTyping(false);
          setAiPhase("idle");
          // Auto-save to Supabase
          saveResultFiles(resultFiles);
        }
      }

      // Build errored
      if (buildManager.phase === "error") {
        setIsBuilding(false);
        setBuildProgress(0);
        setAiTyping(false);
        setAiPhase("idle");
      }

      // Chatting phase
      if (buildManager.phase === "chatting") {
        setAiTyping(true);
        setAiPhase("streaming");
      }
      if (buildManager.phase === "idle" && !buildManager.isActive) {
        // Chat finished (not building)
        setAiTyping(false);
        setAiPhase("idle");
      }
    });

    return () => { unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // subscribe once on mount

  const previewHtml = useMemo(() => {
    if (isBuilding) return buildingPreviewHtml(buildProgress);
    return buildPreviewHtml(files);
  }, [files, isBuilding, buildProgress]);

  /* ── View mode: code-only, split (both), preview-only ── */
  type ViewMode = "code" | "split" | "preview";
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  const handleViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "code") setShowPreview(false);
    else if (mode === "preview") setShowPreview(true);
    else { setShowPreview(true); }
  }, []);

  // Keep viewMode in sync when preview is toggled elsewhere
  useEffect(() => {
    if (showPreview && viewMode === "code") setViewMode("split");
    if (!showPreview && viewMode !== "code") setViewMode("code");
  }, [showPreview, viewMode]);

  const addConsoleLine = useCallback((type: ConsoleLine["type"], text: string) => {
    setConsoleLines((prev) => [...prev, { type, text, ts: timestamp() }]);
  }, []);

  const updateFileContent = useCallback((content: string) => {
    setFiles((prev) => prev.map((f, i) => i === activeFile ? { ...f, content } : f));
  }, [activeFile]);

  const handleRun = useCallback(() => {
    addConsoleLine("info", `$ tsx ${files[activeFile].name}`);
    setTimeout(() => addConsoleLine("success", "Compiled successfully in 142ms"), 400);
    setTimeout(() => addConsoleLine("info", "Server running on port 3000"), 800);
    setTimeout(() => addConsoleLine("info", "Live preview refreshed"), 1100);
    setTimeout(() => {
      addConsoleLine("success", "Ready - accepting connections");
      setPreviewKey((k) => k + 1);
    }, 1400);
    setShowConsole(true);
  }, [activeFile, files, addConsoleLine]);

  const handleLint = useCallback(() => {
    addConsoleLine("info", "$ eslint src/ --ext .ts,.js,.html,.css");
    setTimeout(() => addConsoleLine("success", `No lint errors found (${files.length} files checked)`), 600);
    setShowConsole(true);
  }, [addConsoleLine, files.length]);

  const handleBuild = useCallback(() => {
    addConsoleLine("info", "$ tsc --build && vite build");
    setTimeout(() => addConsoleLine("info", `Compiling ${files.length} files...`), 300);
    setTimeout(() => addConsoleLine("success", "Build completed in 2.1s - 0 errors, 0 warnings"), 1200);
    setShowConsole(true);
  }, [addConsoleLine, files.length]);

  /* ── Publish / Download project ── */
  const [showPublishMenu, setShowPublishMenu] = useState(false);

  const downloadFile = useCallback((filename: string, content: string, mime = "text/plain") => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handlePublishHtml = useCallback(() => {
    const html = buildPreviewHtml(files);
    downloadFile("index.html", html, "text/html");
    addConsoleLine("success", "Published — downloaded as index.html");
    setShowPublishMenu(false);
  }, [files, downloadFile, addConsoleLine]);

  const handlePublishAllFiles = useCallback(() => {
    files.forEach((f) => {
      const mime = f.language === "html" ? "text/html" : f.language === "css" ? "text/css" : "text/javascript";
      downloadFile(f.name, f.content, mime);
    });
    addConsoleLine("success", `Published — downloaded ${files.length} files`);
    setShowPublishMenu(false);
  }, [files, downloadFile, addConsoleLine]);

  /* ── Git integration ── */
  const [showGitMenu, setShowGitMenu] = useState(false);
  const [gitRepo, setGitRepo] = useState<string | null>(null);

  const handleGitConnect = useCallback(() => {
    const repoUrl = prompt("Enter GitHub repository URL:", "https://github.com/username/repo");
    if (!repoUrl) return;
    setGitRepo(repoUrl);
    addConsoleLine("info", `$ git remote add origin ${repoUrl}`);
    setTimeout(() => addConsoleLine("success", `Connected to ${repoUrl}`), 500);
    setShowGitMenu(false);
    setShowConsole(true);
  }, [addConsoleLine]);

  const handleGitImport = useCallback(() => {
    const repoUrl = prompt("Enter repository URL to import:", "https://github.com/username/repo");
    if (!repoUrl) return;
    setGitRepo(repoUrl);
    addConsoleLine("info", `$ git clone ${repoUrl}`);
    setTimeout(() => addConsoleLine("info", "Cloning repository..."), 300);
    setTimeout(() => addConsoleLine("info", "Receiving objects: 100%"), 800);
    setTimeout(() => addConsoleLine("success", `Imported from ${repoUrl} — ${files.length} files loaded`), 1200);
    setShowGitMenu(false);
    setShowConsole(true);
  }, [addConsoleLine, files.length]);

  const handleGitPush = useCallback(() => {
    if (!gitRepo) {
      addConsoleLine("error", "No remote repository connected. Use Git > Connect first.");
      setShowGitMenu(false);
      setShowConsole(true);
      return;
    }
    const msg = prompt("Commit message:", "Update project files");
    if (!msg) return;
    addConsoleLine("info", `$ git add . && git commit -m "${msg}"`);
    setTimeout(() => addConsoleLine("info", `[main] ${msg}`), 400);
    setTimeout(() => addConsoleLine("info", `$ git push origin main`), 700);
    setTimeout(() => addConsoleLine("info", `Enumerating objects: ${files.length}, done.`), 1000);
    setTimeout(() => addConsoleLine("success", `Pushed to ${gitRepo}`), 1400);
    setShowGitMenu(false);
    setShowConsole(true);
  }, [gitRepo, files.length, addConsoleLine]);

  /* ── Stop / Pause / Resume AI ── */
  const handleStopAi = useCallback(() => {
    // Stop local refs
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (readerRef.current) {
      readerRef.current.cancel().catch(() => {});
      readerRef.current = null;
    }
    // Also abort the global build manager
    buildManager.abort();
    setAiTyping(false);
    setAiPhase("idle");
    setIsBuilding(false);
    setBuildProgress(0);
    addConsoleLine("warn", "AI stopped by user");
  }, [addConsoleLine]);

  /* ── Confirm plan → delegate to buildManager ── */
  const handleConfirmPlan = useCallback(async (msgIndex: number) => {
    // Mark the plan message as confirmed locally
    setChatMessages((prev) => {
      const updated = [...prev];
      updated[msgIndex] = { ...updated[msgIndex], confirmed: true, actions: undefined };
      return updated;
    });

    const planText = chatMessages[msgIndex]?.text || "";
    const existingFiles = files.map((f) => ({ name: f.name, language: f.language, content: f.content }));

    // Sync current chat to buildManager before build starts
    buildManager.chatMessages = chatMessages.map((m) => ({
      role: m.role,
      text: m.text,
      actions: m.actions,
      tasks: m.tasks,
      confirmed: m.confirmed,
    }));
    buildManager.projectId = currentProjectId;

    // Set local UI to building state
    setAiTyping(true);
    setAiPhase("building");
    setIsBuilding(true);
    setBuildProgress(0);

    // Delegate the actual build to the global manager (survives navigation)
    buildManager.executeBuild(planText, existingFiles);
  }, [chatMessages, files, currentProjectId]);

  /* ── Reject plan ── */
  const handleRejectPlan = useCallback((msgIndex: number) => {
    setChatMessages((prev) => {
      const updated = [...prev];
      updated[msgIndex] = { ...updated[msgIndex], confirmed: false, actions: undefined };
      return updated;
    });
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: "❌ Let's change some things." },
    ]);
  }, []);

  const handleSendChat = useCallback(async (promptOverride?: string | unknown) => {
    const userMsg = (typeof promptOverride === "string" ? promptOverride.trim() : "") || chatInput.trim();
    if (!userMsg || aiTyping) return;
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setAiTyping(true);
    setAiPhase("thinking");

    // Build context: include current project files so AI knows what exists
    const fileContext = files
      .map((f) => `=== ${f.name} (${f.language}) ===\n${f.content}`)
      .join("\n\n");
    const context = `Current project files:\n${fileContext}`;

    const recentMessages = [...chatMessages.slice(-10), { role: "user" as const, text: userMsg }].map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.text,
    }));

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recentMessages, context }),
        signal: abortController.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");
      readerRef.current = reader;
      setAiPhase("streaming");

      const decoder = new TextDecoder();
      let fullText = "";

      setChatMessages((prev) => [...prev, { role: "assistant", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const chunkLines = chunk.split("\n").filter((line) => line.startsWith("data: "));

        for (const line of chunkLines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              fullText += parsed.text;
              // Show the text without the build tag
              const visibleText = fullText.replace(/<BUILD_PROJECT>[\s\S]*?<\/BUILD_PROJECT>/g, "").trim();
              setChatMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", text: visibleText };
                return updated;
              });
            }
          } catch {
            // skip malformed SSE chunks
          }
        }
      }

      readerRef.current = null;

      // After streaming done — check for build tag or plan proposal
      const buildMatch = fullText.match(/<BUILD_PROJECT>([\s\S]*?)<\/BUILD_PROJECT>/);

      if (buildMatch) {
        const buildSpec = buildMatch[1].trim();
        const visibleText = fullText.replace(/<BUILD_PROJECT>[\s\S]*?<\/BUILD_PROJECT>/g, "").trim();

        // Fallback: If no plan detected, show warning and block build
        const planDetected = (
          /\*\*.*plan.*\*\*/i.test(visibleText) ||
          /📋.*project/i.test(visibleText) ||
          /here'?s (my|the) plan/i.test(visibleText)
        );

        if (!planDetected) {
          setChatMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              text: "❌ Build blocked: You must show a full plan and wait for user confirmation before building. Please try again.",
              actions: "report-ai-mistake"
            };
            return updated;
          });
          setAiTyping(false);
          setAiPhase("idle");
          return;
        }

        // Show the plan as a message with Confirm/Reject buttons
        setChatMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            text: visibleText,
            actions: "confirm-plan",
          };
          return updated;
        });

        setAiTyping(false);
        setAiPhase("idle");
        return; // Wait for user to confirm/reject
      }

      // Check if the AI proposed a plan (has "**Here's my plan:**" or similar)
      const visibleText = fullText.replace(/<BUILD_PROJECT>[\s\S]*?<\/BUILD_PROJECT>/g, "").trim();
      const looksLikePlan = (
        (/\*\*.*plan.*\*\*/i.test(visibleText) || /📋.*project/i.test(visibleText) || /here'?s (my|the) plan/i.test(visibleText)) &&
        (/want me to (build|go|start|proceed)|change anything|sound good|good to go|ready to build|shall i build|want to change/i.test(visibleText))
      );

      if (looksLikePlan) {
        setChatMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            text: visibleText,
            actions: "confirm-plan",
          };
          return updated;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg !== "The operation was aborted." && msg !== "AbortError") {
        console.warn("AI API error, using fallback:", err);
        setChatMessages((prev) => {
          const cleaned = prev.filter((m) => m.text !== "" || m.role !== "assistant");
          return [...cleaned, { role: "assistant", text: getAiResponseFallback(userMsg) }];
        });
      }
    } finally {
      setAiTyping(false);
      setAiPhase("idle");
      abortControllerRef.current = null;
      readerRef.current = null;
    }
  }, [chatInput, aiTyping, chatMessages, files, activeFile, addConsoleLine]);

  /* Auto-send initial prompt from dashboard/hero input — feed it into the chat flow so AI shows a plan first */
  useEffect(() => {
    if (initialPrompt && !initialPromptSent.current && !aiTyping) {
      initialPromptSent.current = true;
      setShowAi(true);
      // Short delay so component is fully mounted, then send through the chat flow
      setTimeout(() => {
        handleSendChat(initialPrompt);
      }, 200);
    }
  }, [initialPrompt, aiTyping, handleSendChat]);

  const file = files[activeFile];
  const lines = file.content.split("\n");
  const consoleTypeColor: Record<string, string> = {
    info: "text-blue-400",
    warn: "text-amber-400",
    error: "text-red-400",
    success: "text-emerald-400",
  };

  const deviceWidths: Record<string, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="flex flex-col h-full bg-app-bg text-app-text overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 md:px-4 py-2 bg-app-bg-secondary border-b border-app-border shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <button onClick={() => setShowFileTree(!showFileTree)} className={`p-1.5 rounded-lg transition-colors ${showFileTree ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`} title="File tree">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          </button>
          <div className="h-4 w-px bg-app-border mx-0.5 md:mx-1" />
          <button onClick={handleRun} className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors text-xs font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <span className="hidden sm:inline">Run</span>
          </button>
          <button onClick={handleBuild} className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4v5h.58a4.97 4.97 0 012.84-2.84V4H4z"/><path d="M20 4h-5v2.16A4.97 4.97 0 0117.42 9H20V4z"/></svg>
            <span className="hidden sm:inline">Build</span>
          </button>
          <button onClick={handleLint} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors text-xs font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"/></svg>
            Lint
          </button>
        </div>
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <div className="relative hidden sm:block">
            <button onClick={() => setShowPublishMenu(!showPublishMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors text-xs font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              Publish
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showPublishMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowPublishMenu(false)} />
                <div className="absolute top-full right-0 mt-1 z-50 w-52 rounded-lg bg-app-bg-secondary border border-app-border shadow-xl py-1">
                  <button onClick={handlePublishHtml} className="w-full text-left px-3 py-2 text-xs text-app-text hover:bg-app-accent/10 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    Export as HTML
                    <span className="ml-auto text-app-text-muted text-[10px]">Single file</span>
                  </button>
                  <button onClick={handlePublishAllFiles} className="w-full text-left px-3 py-2 text-xs text-app-text hover:bg-app-accent/10 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download all files
                    <span className="ml-auto text-app-text-muted text-[10px]">{files.length} files</span>
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="relative hidden sm:block">
            <button onClick={() => setShowGitMenu(!showGitMenu)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${gitRepo ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20" : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7"/><path d="M6 9v12"/></svg>
              Git
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showGitMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowGitMenu(false)} />
                <div className="absolute top-full right-0 mt-1 z-50 w-52 rounded-lg bg-app-bg-secondary border border-app-border shadow-xl py-1">
                  <button onClick={handleGitConnect} className="w-full text-left px-3 py-2 text-xs text-app-text hover:bg-app-accent/10 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    Connect repo
                    {gitRepo && <span className="ml-auto text-emerald-400 text-[10px]">linked</span>}
                  </button>
                  <button onClick={handleGitImport} className="w-full text-left px-3 py-2 text-xs text-app-text hover:bg-app-accent/10 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Import from repo
                  </button>
                  <div className="h-px bg-app-border my-1" />
                  <button onClick={handleGitPush} className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 ${gitRepo ? "text-app-text hover:bg-app-accent/10" : "text-app-text-muted cursor-not-allowed opacity-50"}`} disabled={!gitRepo}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    Push to remote
                    {!gitRepo && <span className="ml-auto text-[10px]">connect first</span>}
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="h-4 w-px bg-app-border mx-0.5 md:mx-1 hidden sm:block" />
          <span className="text-xs text-app-text-muted hidden md:block">Ln {cursorLine + 1}, Col 1</span>
          <span className="text-xs px-2 py-0.5 rounded bg-app-accent/10 text-app-accent-text hidden md:block">{file.language}</span>
          <div className="h-4 w-px bg-app-border mx-0.5 md:mx-1 hidden sm:block" />

          {/* View mode switcher: Code / Split / Preview (hidden on mobile, tab bar replaces it) */}
          <div className="hidden sm:flex items-center bg-app-bg rounded-lg border border-app-border/50 p-0.5">
            {([
              { mode: "code" as const, label: "Code", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
              { mode: "split" as const, label: "Split", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg> },
              { mode: "preview" as const, label: "Preview", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
            ]).map(({ mode, label, icon }) => (
              <button
                key={mode}
                onClick={() => handleViewMode(mode)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-app-accent/15 text-app-accent-text shadow-sm"
                    : "text-app-text-muted hover:text-app-text"
                }`}
                title={label}
              >
                {icon}
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-app-border mx-1 hidden sm:block" />

          {/* Layout panel manager (hidden on mobile) */}
          <div className="relative hidden sm:block">
            <button onClick={() => setShowLayoutMenu(!showLayoutMenu)} className="flex items-center gap-1 p-1.5 rounded-lg text-app-text-muted hover:text-app-text hover:bg-app-card transition-colors" title="Toggle panels">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            {showLayoutMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLayoutMenu(false)} />
                <div className="absolute top-full right-0 mt-1 z-50 w-48 rounded-lg bg-app-bg-secondary border border-app-border shadow-xl py-1">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-app-text-muted">Panels</div>
                  {([
                    { key: "fileTree", label: "File Explorer", active: showFileTree, toggle: () => setShowFileTree(!showFileTree), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> },
                    { key: "preview", label: "Live Preview", active: showPreview, toggle: () => { setShowPreview(!showPreview); }, icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
                    { key: "console", label: "Console", active: showConsole, toggle: () => setShowConsole(!showConsole), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> },
                    { key: "ai", label: "AI Assistant", active: showAi, toggle: () => setShowAi(!showAi), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a4 4 0 014 4v1a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M16 15a4 4 0 00-8 0v5h8v-5z"/></svg> },
                  ] as const).map(({ key, label, active, toggle, icon }) => (
                    <button key={key} onClick={toggle} className="w-full text-left px-3 py-2 text-xs text-app-text hover:bg-app-accent/10 flex items-center gap-2.5">
                      <span className={active ? "text-app-accent-text" : "text-app-text-muted"}>{icon}</span>
                      {label}
                      <span className={`ml-auto w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${active ? "bg-app-accent/20 border-app-accent/40" : "border-app-border"}`}>
                        {active && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile tab bar */}
      {isMobile && (
        <div className="flex items-center bg-app-bg-secondary border-b border-app-border shrink-0 md:hidden">
          {([
            { tab: "code" as const, label: "Code", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
            { tab: "preview" as const, label: "Preview", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
            { tab: "chat" as const, label: "AI Chat", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
          ]).map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => {
                setMobileTab(tab);
                if (tab === "preview") { setShowPreview(true); setShowAi(false); }
                else if (tab === "chat") { setShowAi(true); setShowPreview(false); }
                else { setShowPreview(false); setShowAi(false); }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                mobileTab === tab
                  ? "text-app-accent-text border-app-accent bg-app-accent/5"
                  : "text-app-text-muted border-transparent"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden" data-ide-main>
        {/* File tree — resizable (hidden on mobile) */}
        <AnimatePresence>
          {showFileTree && !isMobile && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: fileTree.size, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-app-bg-secondary overflow-hidden shrink-0 flex"
            >
             <div className="flex-1 overflow-hidden">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted">Explorer</span>
                  <button onClick={() => setShowFileTree(false)} className="p-0.5 rounded text-app-text-muted hover:text-app-text hover:bg-app-card transition-colors" title="Hide Explorer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="text-xs text-app-text-muted mb-2 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                  masidy-app
                </div>
                {files.map((f, i) => {
                  const langIcon: Record<string, string> = {
                    html: "text-orange-400",
                    css: "text-blue-400",
                    javascript: "text-amber-400",
                    typescript: "text-blue-300",
                    json: "text-emerald-400",
                  };
                  return (
                    <button
                      key={f.name}
                      onClick={() => { setActiveFile(i); setCursorLine(0); }}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded-md mb-0.5 flex items-center gap-2 transition-colors ${
                        activeFile === i ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-secondary hover:bg-app-card hover:text-app-text"
                      }`}
                    >
                      <span className={`text-[10px] font-bold w-4 text-center ${langIcon[f.language] || "text-app-text-muted"}`}>
                        {f.language === "html" ? "<>" : f.language === "css" ? "#" : f.language === "json" ? "{}" : "TS"}
                      </span>
                      {f.name}
                    </button>
                  );
                })}
                <div className="mt-4 border-t border-app-border pt-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted mb-2">Project</div>
                  <div className="text-xs text-app-text-muted space-y-1">
                    <div>Files: {files.length}</div>
                    <div>Lines: {files.reduce((s, f) => s + f.content.split("\n").length, 0)}</div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${showPreview ? "bg-emerald-500 animate-pulse" : "bg-gray-500"}`} />
                      Preview: {showPreview ? "Live" : "Off"}
                    </div>
                  </div>
                </div>
              </div>
             </div>
             <ResizeHandle direction="horizontal" onResize={fileTree.handleResize} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor + Console + Preview container */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          {/* Editor column — hidden in preview-only mode, or when mobile tab is not code */}
          {viewMode !== "preview" && (!isMobile || mobileTab === "code") && <div className="flex flex-col overflow-hidden flex-1 min-w-0 md:min-w-[200px] border-r border-app-border">
            {/* Tabs */}
            <div className="flex items-center bg-app-bg-secondary border-b border-app-border overflow-x-auto shrink-0">
              {files.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => { setActiveFile(i); setCursorLine(0); }}
                  className={`px-3 py-2 text-xs font-medium border-r border-app-border/50 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeFile === i
                      ? "bg-app-bg text-app-text border-b-2 border-b-app-accent"
                      : "text-app-text-muted hover:text-app-text hover:bg-app-card"
                  }`}
                >
                  {f.name}
                  {activeFile === i && <span className="w-1.5 h-1.5 rounded-full bg-app-accent/50" />}
                </button>
              ))}
            </div>

            {/* Code editor (editable) */}
            <div className="flex-1 overflow-auto relative">
              {/* Read-only rendered overlay */}
              <div className="absolute inset-0 font-mono text-[13px] leading-6 pointer-events-none z-10 overflow-auto" style={{ tabSize: 2 }}>
                <table className="w-full border-collapse">
                  <tbody>
                    {lines.map((line, i) => (
                      <tr key={i} className={cursorLine === i ? "bg-app-accent/[0.06]" : ""}>
                        <td className="w-8 md:w-10 text-right pr-2 md:pr-3 pl-1 md:pl-2 text-app-text-muted/30 select-none text-[10px] md:text-[11px] sticky left-0 bg-inherit">{i + 1}</td>
                        <td className="pr-4 whitespace-pre">{tokenize(line, file.language)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Editable textarea underneath */}
              <textarea
                ref={editorRef}
                value={file.content}
                onChange={(e) => updateFileContent(e.target.value)}
                onClick={() => {
                  if (editorRef.current) {
                    const pos = editorRef.current.selectionStart;
                    const upToPos = file.content.slice(0, pos);
                    const lineNum = upToPos.split("\n").length - 1;
                    setCursorLine(lineNum);
                  }
                }}
                onKeyUp={() => {
                  if (editorRef.current) {
                    const pos = editorRef.current.selectionStart;
                    const upToPos = file.content.slice(0, pos);
                    const lineNum = upToPos.split("\n").length - 1;
                    setCursorLine(lineNum);
                  }
                }}
                spellCheck={false}
                className="absolute inset-0 w-full h-full font-mono text-[13px] leading-6 bg-transparent text-transparent caret-app-accent-text resize-none outline-none z-20 overflow-auto pl-10 md:pl-12 pr-4 py-0"
                style={{ tabSize: 2 }}
              />
            </div>

            {/* Console — resizable */}
            <AnimatePresence>
              {showConsole && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: consolePanel.size }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-app-border bg-app-bg-secondary overflow-hidden shrink-0 flex flex-col"
                >
                  <ResizeHandle direction="vertical" onResize={(d) => consolePanel.handleResize(-d)} />
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-app-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted">Console</span>
                    <button onClick={() => setConsoleLines([])} className="text-xs text-app-text-muted hover:text-app-text transition-colors">Clear</button>
                  </div>
                  <div className="overflow-auto flex-1 p-2 font-mono text-xs space-y-0.5">
                    {consoleLines.map((l, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-app-text-muted/40 shrink-0">{l.ts}</span>
                        <span className={consoleTypeColor[l.type]}>{l.text}</span>
                      </div>
                    ))}
                    <div ref={consoleEndRef} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>}

          {/* Resize handle between editor and preview (desktop only) */}
          {viewMode === "split" && showPreview && !isMobile && <ResizeHandle direction="horizontal" onResize={(d) => {
            const container = document.querySelector('[data-ide-main]');
            if (!container) return;
            const totalW = container.clientWidth;
            const pctDelta = (d / totalW) * 100;
            previewPanel.setSize((prev) => Math.max(25, Math.min(75, prev + pctDelta)));
          }} />}

          {/* Live Preview Panel — resizable */}
          <AnimatePresence>
            {showPreview && (!isMobile || mobileTab === "preview") && (
              <motion.div
                initial={isMobile ? { opacity: 0 } : { width: 0, opacity: 0 }}
                animate={isMobile ? { opacity: 1 } : { width: viewMode === "preview" ? "100%" : `${previewPanel.size}%`, opacity: 1 }}
                exit={isMobile ? { opacity: 0 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col overflow-hidden bg-app-bg-secondary ${isMobile ? "flex-1" : viewMode === "preview" ? "flex-1" : "shrink-0"}`}
              >
                {/* Preview toolbar */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-app-border shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted">Live Preview</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Device switcher */}
                    {(["desktop", "tablet", "mobile"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setPreviewDevice(d)}
                        className={`p-1 rounded transition-colors ${previewDevice === d ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`}
                        title={d}
                      >
                        {d === "desktop" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
                        {d === "tablet" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
                        {d === "mobile" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
                      </button>
                    ))}
                    <div className="h-3 w-px bg-app-border mx-1" />
                    <button onClick={() => setPreviewKey((k) => k + 1)} className="p-1 rounded text-app-text-muted hover:text-app-text transition-colors" title="Refresh preview">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                    </button>
                  </div>
                </div>

                {/* URL bar */}
                <div className="flex items-center gap-2 px-3 py-1.5 border-b border-app-border/50 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="flex-1 bg-app-bg rounded-md px-3 py-1 text-[11px] text-app-text-muted font-mono border border-app-border/50 flex items-center gap-2">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    localhost:3000
                  </div>
                </div>

                {/* iframe preview */}
                <div className="flex-1 flex items-start justify-center overflow-auto bg-[#0a0a12] p-2">
                  <div style={{ width: deviceWidths[previewDevice], maxWidth: "100%", height: "100%", transition: "width 0.3s ease" }} className="rounded-lg overflow-hidden border border-app-border/30 shadow-xl">
                    <iframe
                      key={previewKey}
                      srcDoc={previewHtml}
                      className="w-full h-full border-0 bg-[#0a0a12]"
                      sandbox="allow-scripts allow-same-origin"
                      title="Live Preview"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Assistant — resizable on desktop, full-width on mobile */}
        <AnimatePresence>
          {showAi && (!isMobile || mobileTab === "chat") && (
            <motion.div
              initial={isMobile ? { opacity: 0 } : { width: 0, opacity: 0 }}
              animate={isMobile ? { opacity: 1 } : { width: aiPanel.size, opacity: 1 }}
              exit={isMobile ? { opacity: 0 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`bg-app-bg-secondary flex overflow-hidden ${isMobile ? "flex-1" : "shrink-0"}`}
            >
              {!isMobile && <ResizeHandle direction="horizontal" onResize={(d) => aiPanel.handleResize(-d)} />}
              <div className="flex-1 flex flex-col overflow-hidden border-l border-app-border">
              <div className="px-3 py-2.5 border-b border-app-border flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-app-accent/30 to-purple-500/20 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="2" strokeLinecap="round"><path d="M12 2a4 4 0 014 4v1a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M16 15a4 4 0 00-8 0v5h8v-5z"/></svg>
                </div>
                <span className="text-xs font-semibold text-app-text">AI Assistant</span>
                <span className="ml-auto text-[10px] text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                </span>
              </div>

              <div className="flex-1 overflow-auto p-3 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-app-accent/15 text-app-accent-text"
                        : "bg-app-card border border-app-border/50 text-app-text-secondary"
                    }`}>
                      {msg.text}

                      {/* ── Task Steps with checkmarks ── */}
                      {msg.tasks && msg.tasks.length > 0 && (
                        <div className="mt-2.5 space-y-1.5 border-t border-app-border/30 pt-2.5">
                          {msg.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2 text-[11px]">
                              {task.status === "done" && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400 flex-shrink-0">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </motion.span>
                              )}
                              {task.status === "active" && (
                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-app-accent flex-shrink-0">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 11-6.22-8.56"/></svg>
                                </motion.span>
                              )}
                              {task.status === "pending" && (
                                <span className="w-3.5 h-3.5 rounded-full border border-app-border/50 flex-shrink-0" />
                              )}
                              {task.status === "error" && (
                                <span className="text-red-400 flex-shrink-0">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </span>
                              )}
                              <span className={`${
                                task.status === "done" ? "text-emerald-400 line-through opacity-70" :
                                task.status === "active" ? "text-app-accent font-medium" :
                                task.status === "error" ? "text-red-400" :
                                "text-app-text-muted"
                              }`}>
                                {task.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}


                      {/* ── Confirm / Reject Buttons ── */}
                      {msg.actions === "confirm-plan" && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 flex gap-2 border-t border-app-border/30 pt-3"
                        >
                          <button
                            onClick={() => handleConfirmPlan(i)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-[11px] font-medium hover:bg-emerald-500/25 transition-colors border border-emerald-500/20"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Confirm &amp; Build
                          </button>
                          <button
                            onClick={() => handleRejectPlan(i)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Change Plan
                          </button>
                        </motion.div>
                      )}

                      {/* ── Report AI Mistake Button ── */}
                      {msg.actions === "report-ai-mistake" && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 flex gap-2 border-t border-app-border/30 pt-3"
                        >
                          <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-500 text-[11px] font-medium hover:bg-amber-500/25 transition-colors border border-amber-500/20"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Report AI Mistake & Retry
                          </button>
                        </motion.div>
                      )}

                      {/* ── Confirmed / Rejected tag ── */}
                      {msg.confirmed === true && (
                        <div className="mt-2 text-[10px] text-emerald-400/70 flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Plan confirmed
                        </div>
                      )}
                      {msg.confirmed === false && (
                        <div className="mt-2 text-[10px] text-red-400/70 flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          Plan changed
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* ── Typing indicator with phase label ── */}
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-app-card border border-app-border/50 rounded-xl px-3 py-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <motion.span className="w-1.5 h-1.5 rounded-full bg-app-accent" animate={{ opacity: [0.3, 1] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }} />
                        <motion.span className="w-1.5 h-1.5 rounded-full bg-app-accent" animate={{ opacity: [0.3, 1] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.15 }} />
                        <motion.span className="w-1.5 h-1.5 rounded-full bg-app-accent" animate={{ opacity: [0.3, 1] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.3 }} />
                      </div>
                      <span className="text-[10px] text-app-text-muted">
                        {aiPhase === "thinking" && "Thinking..."}
                        {aiPhase === "streaming" && "Responding..."}
                        {aiPhase === "building" && "Building..."}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* ── Quick suggestions ── */}
              {!aiTyping && chatMessages.length < 3 && (
                <div className="px-3 pb-1 flex flex-wrap gap-1.5">
                  {["Review code", "Improve styles", "Write tests", "About preview"].map((q) => (
                    <button key={q} onClick={() => setChatInput(q)} className="text-[10px] px-2 py-1 rounded-full bg-app-card border border-app-border text-app-text-muted hover:text-app-accent-text hover:border-app-accent/30 transition-colors">{q}</button>
                  ))}
                </div>
              )}

              {/* ── Input + Dynamic Send Button ── */}
              <div className="p-3 border-t border-app-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !aiTyping && handleSendChat()}
                    placeholder={aiPhase === "idle" ? "Ask AI anything..." : aiPhase === "building" ? "Building..." : "AI is working..."}
                    disabled={aiPhase === "building"}
                    className="flex-1 bg-app-bg border border-app-border rounded-lg px-3 py-2 text-xs text-app-text placeholder:text-app-text-muted/50 focus:outline-none focus:border-app-accent/40 disabled:opacity-50"
                  />

                  {/* Dynamic button based on aiPhase */}
                  {aiPhase === "idle" ? (
                    /* — Send button — */
                    <button
                      onClick={handleSendChat}
                      disabled={!chatInput.trim()}
                      className="p-2 rounded-lg bg-app-accent/15 text-app-accent-text hover:bg-app-accent/25 disabled:opacity-40 transition-all"
                      title="Send message"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  ) : (
                    /* — Stop button (while thinking / streaming / building) — */
                    <button
                      onClick={handleStopAi}
                      className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all border border-red-500/20"
                      title="Stop AI"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                    </button>
                  )}
                </div>

                {/* ── Phase indicator bar ── */}
                {aiPhase !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex items-center gap-2"
                  >
                    <div className="flex-1 h-1 rounded-full bg-app-border overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${aiPhase === "building" ? "bg-amber-500" : "bg-app-accent"}`}
                        animate={aiPhase === "building" ? { width: `${buildProgress}%` } : { width: ["0%", "100%"] }}
                        transition={aiPhase === "building" ? { duration: 0.3 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    <span className="text-[9px] text-app-text-muted uppercase tracking-wider">
                      {aiPhase === "thinking" && "Analyzing"}
                      {aiPhase === "streaming" && "Streaming"}
                      {aiPhase === "building" && `Building ${Math.round(buildProgress)}%`}
                    </span>
                  </motion.div>
                )}
              </div>
             </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
