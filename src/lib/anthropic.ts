// src/lib/anthropic.ts
// Shared Anthropic Claude client for all AI services

import Anthropic from "@anthropic-ai/sdk";

// Singleton Anthropic client — reused across all server-side calls
let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to your .env file."
      );
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

// Default model — Claude Sonnet 4.5 (fast + smart, good balance for IDE)
export const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";

// Smaller model for quick completions (Haiku 4.5 — faster and cheaper)
export const FAST_MODEL = "claude-haiku-4-5-20251001";

/**
 * Send a single prompt to Claude and return the text response.
 * This is the simplest helper — most services can use this directly.
 */
export async function askClaude(
  systemPrompt: string,
  userMessage: string,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: options?.model ?? DEFAULT_MODEL,
    max_tokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.3,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  // Extract text from the response
  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text ?? "";
}

/**
 * Stream a response from Claude (for real-time typing in the IDE chat).
 * Returns an async generator of text chunks.
 */
export async function* streamClaude(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): AsyncGenerator<string> {
  const client = getAnthropicClient();

  const stream = client.messages.stream({
    model: options?.model ?? DEFAULT_MODEL,
    max_tokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.3,
    system: systemPrompt,
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}
