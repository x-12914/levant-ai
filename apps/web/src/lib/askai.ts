/**
 * Stream AskAI tokens from the gateway (POST /api/ai/askai/stream).
 * The server sends SSE frames: `data: <json-string>\n\n`, ending with
 * `data: [DONE]`. Each json-string decodes to one text chunk.
 */
export async function* streamAskAI(
  prompt: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const res = await fetch("/api/ai/askai/stream", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`AskAI request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trimStart();
      if (data === "[DONE]") return;
      try {
        yield JSON.parse(data) as string;
      } catch {
        // Ignore malformed frames rather than breaking the stream.
      }
    }
  }
}
