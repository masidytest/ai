/**
 * BuildManager — singleton that runs builds independently of React component lifecycle.
 * When the user navigates away from the IDE, the build keeps running.
 * The IDE re-subscribes on mount and picks up the latest state.
 */

export interface BuildFile {
  name: string;
  language: string;
  content: string;
}

export interface BuildTaskStep {
  id: number;
  label: string;
  status: "pending" | "active" | "done" | "error";
}

export interface BuildChatMsg {
  role: "user" | "assistant";
  text: string;
  actions?: "confirm-plan" | "report-ai-mistake";
  tasks?: BuildTaskStep[];
  confirmed?: boolean;
}

export type BuildPhase = "idle" | "chatting" | "building" | "done" | "error";

type Listener = () => void;

class BuildManager {
  /* ── Public state — components read these directly ── */
  phase: BuildPhase = "idle";
  progress = 0;
  chatMessages: BuildChatMsg[] = [];
  resultFiles: BuildFile[] = [];
  projectId: string | null = null;
  errorMsg: string | null = null;

  /* ── Internal ── */
  private listeners = new Set<Listener>();
  private abortController: AbortController | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  /* ── Subscribe / unsubscribe (React components use this) ── */
  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  /* ── Is a build currently active? ── */
  get isActive() {
    return this.phase === "chatting" || this.phase === "building";
  }

  /* ── Start the chat flow (sends prompt through /api/ai/chat SSE) ── */
  async startChat(prompt: string, context: string, historyMessages: Array<{ role: string; text: string }>) {
    if (this.isActive) return; // already running

    this.phase = "chatting";
    this.errorMsg = null;
    this.chatMessages = [
      ...this.chatMessages,
      { role: "user", text: prompt },
    ];
    this.notify();

    const recentMessages = [...historyMessages.slice(-10), { role: "user", text: prompt }].map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.text,
    }));

    this.abortController = new AbortController();

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recentMessages, context }),
        signal: this.abortController.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      // Add empty assistant message
      this.chatMessages = [...this.chatMessages, { role: "assistant", text: "" }];
      this.notify();

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
              const visibleText = fullText.replace(/<BUILD_PROJECT>[\s\S]*?<\/BUILD_PROJECT>/g, "").trim();
              const msgs = [...this.chatMessages];
              msgs[msgs.length - 1] = { role: "assistant", text: visibleText };
              this.chatMessages = msgs;
              this.notify();
            }
          } catch {
            // skip malformed SSE chunks
          }
        }
      }

      // Streaming done — check for build tag
      const buildMatch = fullText.match(/<BUILD_PROJECT>([\s\S]*?)<\/BUILD_PROJECT>/);
      const visibleText = fullText.replace(/<BUILD_PROJECT>[\s\S]*?<\/BUILD_PROJECT>/g, "").trim();

      if (buildMatch) {
        const planDetected =
          /\*\*.*plan.*\*\*/i.test(visibleText) ||
          /📋.*project/i.test(visibleText) ||
          /here'?s (my|the) plan/i.test(visibleText);

        if (!planDetected) {
          const msgs = [...this.chatMessages];
          msgs[msgs.length - 1] = {
            role: "assistant",
            text: "❌ Build blocked: You must show a full plan first. Please try again.",
            actions: "report-ai-mistake",
          };
          this.chatMessages = msgs;
          this.phase = "idle";
          this.notify();
          return;
        }

        // Show plan with confirm/reject actions
        const msgs = [...this.chatMessages];
        msgs[msgs.length - 1] = { role: "assistant", text: visibleText, actions: "confirm-plan" };
        this.chatMessages = msgs;
        this.phase = "idle"; // waiting for user confirmation
        this.notify();
        return;
      }

      // Check if it looks like a plan proposal
      const looksLikePlan =
        (/\*\*.*plan.*\*\*/i.test(visibleText) || /📋.*project/i.test(visibleText) || /here'?s (my|the) plan/i.test(visibleText)) &&
        /want me to (build|go|start|proceed)|change anything|sound good|good to go|ready to build|shall i build|want to change/i.test(visibleText);

      if (looksLikePlan) {
        const msgs = [...this.chatMessages];
        msgs[msgs.length - 1] = { role: "assistant", text: visibleText, actions: "confirm-plan" };
        this.chatMessages = msgs;
      }

      this.phase = "idle";
      this.notify();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg !== "The operation was aborted." && msg !== "AbortError") {
        this.errorMsg = msg;
        this.phase = "error";
      } else {
        this.phase = "idle";
      }
      this.notify();
    } finally {
      this.abortController = null;
    }
  }

  /* ── Execute a confirmed build ── */
  async executeBuild(planText: string, existingFiles?: BuildFile[]) {
    this.phase = "building";
    this.progress = 0;
    this.errorMsg = null;
    this.resultFiles = [];

    const buildTasks: BuildTaskStep[] = [
      { id: 1, label: "Analyzing plan", status: "active" },
      { id: 2, label: "Generating HTML structure", status: "pending" },
      { id: 3, label: "Writing CSS styles", status: "pending" },
      { id: 4, label: "Adding JavaScript logic", status: "pending" },
      { id: 5, label: "Assembling project", status: "pending" },
    ];

    // Add user confirmation + building messages
    this.chatMessages = [
      ...this.chatMessages,
      { role: "user", text: "✅ Looks good, build it!" },
      { role: "assistant", text: "Building your project...", tasks: [...buildTasks] },
    ];
    this.notify();

    // Progress animation
    this.progressInterval = setInterval(() => {
      this.progress = Math.min(this.progress + Math.random() * 10 + 3, 90);
      this.notify();
    }, 600);

    const updateTask = (id: number, status: BuildTaskStep["status"]) => {
      buildTasks.forEach((t) => { if (t.id === id) t.status = status; });
      const msgs = [...this.chatMessages];
      msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], tasks: [...buildTasks] };
      this.chatMessages = msgs;
      this.notify();
    };

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    this.abortController = new AbortController();

    try {
      const isModify = planText.toLowerCase().includes("modify") || planText.toLowerCase().includes("improve") || planText.toLowerCase().includes("update");
      const sendFiles = isModify ? existingFiles : undefined;

      await delay(800);
      updateTask(1, "done");
      updateTask(2, "active");

      const buildRes = await fetch("/api/ai/build-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: planText, existingFiles: sendFiles, confirmed: true }),
        signal: this.abortController.signal,
      });

      if (!buildRes.ok) {
        const err = await buildRes.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Build API error: ${buildRes.status}`);
      }

      updateTask(2, "done");
      updateTask(3, "active");
      await delay(400);
      updateTask(3, "done");
      updateTask(4, "active");
      await delay(400);

      const buildData = await buildRes.json() as { files: Array<BuildFile> };
      if (!buildData.files || buildData.files.length === 0) throw new Error("No files generated");

      updateTask(4, "done");
      updateTask(5, "active");
      await delay(300);
      updateTask(5, "done");

      if (this.progressInterval) clearInterval(this.progressInterval);
      this.progress = 100;
      this.resultFiles = buildData.files;
      this.notify();

      await delay(500);

      const fileList = buildData.files.map((f) => `- **${f.name}** (${f.language})`).join("\n");
      const msgs = [...this.chatMessages];
      msgs[msgs.length - 1] = {
        role: "assistant",
        text: `✅ **Done!** Generated ${buildData.files.length} files:\n${fileList}\n\nPreview is live. Ask me to tweak anything!`,
        tasks: buildTasks,
      };
      this.chatMessages = msgs;
      this.phase = "done";
      this.notify();
    } catch (err) {
      if (this.progressInterval) clearInterval(this.progressInterval);
      this.progress = 0;
      const msg = err instanceof Error ? err.message : "Build failed";
      if (msg !== "The operation was aborted." && msg !== "AbortError") {
        this.errorMsg = msg;
        const msgs = [...this.chatMessages];
        msgs[msgs.length - 1] = {
          role: "assistant",
          text: `❌ Build failed: ${msg}`,
          tasks: buildTasks.map((t) => t.status === "active" ? { ...t, status: "error" as const } : t),
        };
        this.chatMessages = msgs;
        this.phase = "error";
      } else {
        this.phase = "idle";
      }
      this.notify();
    } finally {
      this.abortController = null;
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
    }
  }

  /* ── Abort active operation ── */
  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.phase = "idle";
    this.progress = 0;
    this.notify();
  }

  /* ── Reset state (when user opens a new project) ── */
  reset() {
    this.abort();
    this.chatMessages = [];
    this.resultFiles = [];
    this.projectId = null;
    this.errorMsg = null;
    this.notify();
  }

  /* ── Consume results (IDE picks them up and clears) ── */
  consumeResults(): BuildFile[] | null {
    if (this.resultFiles.length === 0) return null;
    const files = [...this.resultFiles];
    this.resultFiles = [];
    this.phase = "idle";
    this.progress = 0;
    return files;
  }
}

// Singleton instance
export const buildManager = new BuildManager();
