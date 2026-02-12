// src/app/api/ai/build-project/route.ts
// Project generation endpoint — generates a full multi-file project from a prompt
// Returns structured JSON: { files: [{ name, language, content }] }

import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI — an elite frontend engineer who generates stunning, production-quality web projects.

CRITICAL: You MUST output ONLY valid JSON. No markdown, no explanation, no code fences.

Output format (strict JSON):
{
  "files": [
    { "name": "index.html", "language": "html", "content": "...full file content..." },
    { "name": "styles.css", "language": "css", "content": "...full file content..." },
    { "name": "app.js", "language": "javascript", "content": "...full file content..." }
  ]
}

DESIGN RULES (follow these strictly — ugly output is UNACCEPTABLE):
- ALWAYS generate at least: index.html, styles.css, app.js
- The index.html must link to styles.css and app.js (<link rel="stylesheet" href="styles.css"> and <script src="app.js"></script>)
- Use vanilla JS only (no frameworks) — it runs inside a preview iframe

VISUAL QUALITY (this is the most important part):
- Dark premium theme: background #0a0a12 or #0f0f1a, cards #16162a or #1a1a2e, borders #1e1e3a
- Accent colors: use vivid gradients — purple #8b5cf6 → blue #3b82f6 → cyan #06b6d4
- Text: primary #e4e4ef, muted #6e6e8a
- Every element must have: border-radius (8-16px), subtle box-shadow, smooth transitions (0.3s ease)
- Use CSS custom properties for all colors
- Buttons must glow on hover (box-shadow with accent color at 30% opacity)
- Cards: glass-morphism effect (background with slight transparency, backdrop-filter: blur, border 1px solid rgba(255,255,255,0.05))
- Add subtle gradient backgrounds, floating particles, or animated accents
- Typography: use font-weight 700 for headings, 14-16px body, generous line-height
- Layout: use CSS Grid or Flexbox, max-width container, centered content, proper spacing (gap, padding 1.5-2rem)
- Responsive: use media queries for mobile
- Smooth CSS animations: fadeIn, slideUp, pulse for accents
- Include @keyframes for at least 2-3 animations
- Scrollbar styling: thin, accent-colored thumb
- Make it look like a polished SaaS product, NOT a plain HTML page

INTERACTIVITY:
- Fully functional JavaScript — event listeners, dynamic DOM updates, state management
- Smooth transitions on user actions (add/remove classes, toggle visibility)
- Console.log important actions
- Add hover effects, click feedback, smooth scroll

CONTENT:
- Use realistic, professional content — real names, real descriptions, real data
- Never use "lorem ipsum" or placeholder text
- Include proper HTML5 semantic elements (header, main, section, nav, footer)

JSON SAFETY:
- Escape all special characters: newlines as \\n, quotes as \\", backslashes as \\\\, tabs as \\t
- Do NOT include template literals with \${} inside JSON strings — use string concatenation instead
- Test that every string value is properly closed
- Do NOT wrap output in markdown code fences — output raw JSON only`;

export async function POST(req: NextRequest) {
  try {

    const { prompt, existingFiles, confirmed } = (await req.json()) as {
      prompt: string;
      existingFiles?: Array<{ name: string; language: string; content: string }>;
      confirmed?: boolean;
    };

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }
    if (!confirmed) {
      return NextResponse.json({ error: "Build not allowed: plan not confirmed by user." }, { status: 403 });
    }

    // If we have existing files, include them so the AI can improve/modify them
    let userPrompt: string;
    if (existingFiles && existingFiles.length > 0) {
      // For modify requests: send each file separately to keep the prompt cleaner
      const fileParts = existingFiles.map((f) =>
        `FILE: ${f.name}\n${f.content}`
      ).join("\n\n---\n\n");

      userPrompt = [
        `EXISTING PROJECT FILES:`,
        ``,
        fileParts,
        ``,
        `---`,
        ``,
        `USER REQUEST: ${prompt}`,
        ``,
        `Rewrite ALL files with the requested changes applied.`,
        `Keep the same file names. Return the COMPLETE content of each file (not diffs).`,
        `Output ONLY the JSON object. No text before or after it.`,
      ].join("\n");
    } else {
      userPrompt = `Build: ${prompt}\n\nOutput ONLY the JSON object with the files array. No text.`;
    }

    const result = await askClaude(
      SYSTEM_PROMPT,
      userPrompt,
      { maxTokens: 16000, temperature: 0.4 }
    );

    // Robust JSON extraction — handles all the ways Claude can mess up the format
    const parsed = extractFiles(result);

    if (!parsed.files || parsed.files.length === 0) {
      return NextResponse.json(
        { error: "AI did not generate valid project files. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * Robustly extract files from Claude's response, handling:
 * 1. Clean JSON
 * 2. JSON wrapped in markdown fences
 * 3. JSON with text before/after
 * 4. Truncated JSON (incomplete content field)
 * 5. Double-escaped newlines
 */
function extractFiles(raw: string): { files: Array<{ name: string; language: string; content: string }> } {
  const empty = { files: [] };

  // Step 1: Clean up common wrapping issues
  let text = raw.trim();

  // Remove markdown code fences
  text = text.replace(/^```(?:json)?\s*\n?/m, "").replace(/\n?```\s*$/m, "");
  text = text.trim();

  // Step 2: Try direct JSON.parse first
  try {
    const parsed = JSON.parse(text);
    if (parsed.files && Array.isArray(parsed.files) && parsed.files.length > 0) {
      return { files: cleanFiles(parsed.files) };
    }
  } catch {
    // continue to other methods
  }

  // Step 3: Find the JSON object by locating the outermost { ... } containing "files"
  const jsonMatch = text.match(/\{[\s\S]*"files"\s*:\s*\[[\s\S]*\]/);
  if (jsonMatch) {
    let jsonStr = jsonMatch[0];

    // Find the matching closing brace
    let depth = 0;
    let end = -1;
    for (let i = 0; i < jsonStr.length; i++) {
      if (jsonStr[i] === "{") depth++;
      else if (jsonStr[i] === "}") {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    if (end > 0) jsonStr = jsonStr.slice(0, end + 1);

    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.files && Array.isArray(parsed.files) && parsed.files.length > 0) {
        return { files: cleanFiles(parsed.files) };
      }
    } catch {
      // Step 4: Try to fix common JSON issues and re-parse

      // Fix truncated strings: if content was cut off, close it
      let fixed = jsonStr;

      // Fix unescaped newlines inside strings (common Claude mistake)
      // Replace actual newlines between quotes with \\n
      fixed = fixed.replace(/"content"\s*:\s*"([\s\S]*?)(?:"\s*[,}\]])/g, (match) => {
        return match; // keep as-is for now, try parsing
      });

      // Try to repair truncated JSON by closing open strings/arrays/objects
      if (!fixed.endsWith("}")) {
        // Count unclosed structures
        const openBraces = (fixed.match(/\{/g) || []).length;
        const closeBraces = (fixed.match(/\}/g) || []).length;
        const openBrackets = (fixed.match(/\[/g) || []).length;
        const closeBrackets = (fixed.match(/\]/g) || []).length;

        // Close any open string
        const lastQuotePos = fixed.lastIndexOf('"');
        const afterQuote = fixed.slice(lastQuotePos + 1);
        if (!/"\s*[,}\]]/.test(afterQuote) && lastQuotePos > 0) {
          fixed = fixed.slice(0, lastQuotePos + 1) + '"';
        }

        // Close open structures
        fixed += "}".repeat(Math.max(0, openBraces - closeBraces - 1));
        fixed += "]".repeat(Math.max(0, openBrackets - closeBrackets));
        fixed += "}";
      }

      try {
        const parsed = JSON.parse(fixed);
        if (parsed.files && Array.isArray(parsed.files)) {
          return { files: cleanFiles(parsed.files) };
        }
      } catch {
        // continue
      }
    }
  }

  // Step 5: Try to extract individual file objects using regex
  const fileObjects: Array<{ name: string; language: string; content: string }> = [];
  const fileObjRegex = /\{\s*"name"\s*:\s*"([^"]+)"\s*,\s*"language"\s*:\s*"([^"]+)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = fileObjRegex.exec(text)) !== null) {
    try {
      // Unescape the content
      const content = JSON.parse(`"${match[3]}"`);
      fileObjects.push({ name: match[1], language: match[2], content });
    } catch {
      // Use raw content, replacing literal \n with newlines
      fileObjects.push({
        name: match[1],
        language: match[2],
        content: match[3].replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"'),
      });
    }
  }

  if (fileObjects.length > 0) {
    return { files: cleanFiles(fileObjects) };
  }

  // Step 6: Last resort — if the text looks like HTML, use it directly
  if (text.includes("<!DOCTYPE") || text.includes("<html") || text.includes("<head")) {
    // Extract HTML, CSS and JS if they're separated by comments
    const htmlMatch = text.match(/<!DOCTYPE[\s\S]*?<\/html>/i);
    return {
      files: [
        { name: "index.html", language: "html", content: htmlMatch ? htmlMatch[0] : text },
        { name: "styles.css", language: "css", content: "body { font-family: sans-serif; background: #0a0a12; color: #e4e4ef; }" },
        { name: "app.js", language: "javascript", content: "console.log('App loaded');" },
      ],
    };
  }

  return empty;
}

/** Clean up file contents — fix double-escaped newlines, ensure no empty files */
function cleanFiles(files: Array<{ name: string; language: string; content: string }>): Array<{ name: string; language: string; content: string }> {
  return files
    .filter((f) => f.name && f.content)
    .map((f) => ({
      name: f.name,
      language: f.language || f.name.split(".").pop() || "text",
      // Fix double-escaped newlines (\\n → \n) that sometimes happen
      content: f.content
        .replace(/\\\\n/g, "\n")
        .replace(/\\\\t/g, "\t")
        .replace(/\\\\"/g, '"'),
    }));
}
