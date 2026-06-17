/** Classify text sentiment via the gateway → AI service (real, uses the LLM key). */
export type Sentiment = "positive" | "negative" | "neutral";

export async function classifySentiment(text: string): Promise<Sentiment> {
  const res = await fetch("/api/ai/askai/sentiment", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`sentiment failed (${res.status})`);
  const data = (await res.json()) as { sentiment: Sentiment };
  return data.sentiment;
}
