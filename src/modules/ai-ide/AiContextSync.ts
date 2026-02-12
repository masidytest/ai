// src/modules/ai-ide/AiContextSync.ts
// Service to sync AI IDE context with backend

export class AiContextSync {
  private static interval: NodeJS.Timeout | null = null;
  private static lastPayload: any = null;

  static startSync(getContext: () => Promise<any>) {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(async () => {
      const payload = await getContext();
      if (JSON.stringify(payload) !== JSON.stringify(this.lastPayload)) {
        await this.sendContext(payload);
        this.lastPayload = payload;
      }
    }, 2000);
  }

  static stopSync() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }

  static async sendContext(payload: {
    openFiles: Array<{ path: string; content: string }>;
    fileTree: string[];
    cursorPosition: { file: string; line: number; column: number };
    selectedText: string;
  }) {
    // Send to backend (stub: POST /ai-ide/context)
    await fetch("/ai-ide/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }
}
