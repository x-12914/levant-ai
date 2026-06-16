import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, ShieldCheck, Square } from "lucide-react";
import { streamAskAI } from "@/lib/askai";
import { cn } from "@/lib/cn";

interface Message {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const SUGGESTIONS = [
  "Is now a good time to buy AAPL?",
  "Explain the RSI signal on EURUSD right now.",
  "What's the risk in a GBPAUD/GBPUSD pair trade?",
  "Summarize today's sentiment on BTC.",
];

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(prompt: string) {
    const text = prompt.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for await (const chunk of streamAskAI(text, controller.signal)) {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "assistant",
            content: "Couldn't reach AskAI. Is the gateway + AI service running?",
            error: true,
          };
          return next;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  const empty = messages.length === 0;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4">
        <Bot className="size-5 text-accent" />
        <h2 className="text-xl font-semibold">AI Assistant</h2>
        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
          <ShieldCheck className="size-3" /> Read-only · not financial advice
        </span>
      </div>

      {/* Conversation */}
      <div className="flex-1 space-y-5 overflow-y-auto pb-4">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-accent-gradient">
              <Bot className="size-6 text-white" />
            </div>
            <p className="mt-4 text-lg font-medium">Ask about a trade before you take it</p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Pre-trade analysis, risk, indicators, and sentiment across your watchlist.
            </p>
            <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-card border border-border bg-surface px-4 py-3 text-left text-sm text-muted transition-colors hover:border-border-strong hover:text-text"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => <Bubble key={i} message={m} streaming={streaming && i === messages.length - 1} />)
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-border pt-4">
        <div className="flex items-end gap-2 rounded-card border border-border bg-surface p-2 focus-within:border-border-strong">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask anything about a potential trade…"
            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-text outline-none placeholder:text-faint"
          />
          {streaming ? (
            <button
              onClick={stop}
              aria-label="Stop"
              className="flex size-9 shrink-0 items-center justify-center rounded-ctl bg-surface-2 text-text transition hover:bg-surface-3"
            >
              <Square className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              aria-label="Send"
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-ctl text-white transition",
                input.trim() ? "bg-accent-gradient hover:brightness-110" : "bg-surface-2 text-faint",
              )}
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>
        <p className="mt-2 px-1 text-center text-xs text-faint">
          AskAI can be wrong. Verify before acting; it never places orders.
        </p>
      </div>
    </div>
  );
}

function Bubble({ message, streaming }: { message: Message; streaming: boolean }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {!isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-gradient">
          <Bot className="size-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-wrap rounded-card px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-surface-2 text-text"
            : message.error
              ? "bg-[var(--neg-bg)] text-neg"
              : "border border-border bg-surface text-text",
        )}
      >
        {message.content}
        {streaming && !message.content && <span className="text-muted">Thinking…</span>}
        {streaming && message.content && (
          <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-accent align-middle" />
        )}
      </div>
    </div>
  );
}
