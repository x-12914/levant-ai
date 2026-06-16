"""Provider-agnostic LLM layer for AskAI + sentiment.

Switch backends with AI_PROVIDER=openai|anthropic (see .env.example). The two
implementations live side by side; clients are created lazily so only the
selected provider's API key is required. Flip the env var to migrate from
OpenAI to Anthropic later with no code change.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

from .config import settings

ASKAI_SYSTEM = (
    "You are Levant AskAI, a pre-trade analysis assistant. The platform is "
    "read-only: you analyze, explain, and assess risk, but you never place or "
    "modify orders, and you say so if asked. Be precise and calm. State numbers "
    "and risk plainly. This is not financial advice."
)

SENTIMENT_SYSTEM = (
    "Classify the market sentiment of the text. Reply with exactly one word: "
    "positive, negative, or neutral."
)

_anthropic = None
_openai = None


def _anthropic_client():
    global _anthropic
    if _anthropic is None:
        import anthropic

        _anthropic = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key or None)
    return _anthropic


def _openai_client():
    global _openai
    if _openai is None:
        from openai import AsyncOpenAI

        _openai = AsyncOpenAI(api_key=settings.openai_api_key or None)
    return _openai


async def stream_askai(prompt: str) -> AsyncIterator[str]:
    """Stream AskAI tokens for a user question (drives the chat UI via SSE)."""
    if settings.ai_provider == "anthropic":
        client = _anthropic_client()
        async with client.messages.stream(
            model=settings.claude_model,
            max_tokens=2048,
            system=ASKAI_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            async for text in stream.text_stream:
                yield text
    else:
        client = _openai_client()
        stream = await client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": ASKAI_SYSTEM},
                {"role": "user", "content": prompt},
            ],
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta


async def classify_sentiment(text: str) -> str:
    """Return one of: positive | negative | neutral. Cheap, single-shot."""
    if settings.ai_provider == "anthropic":
        client = _anthropic_client()
        resp = await client.messages.create(
            model=settings.claude_sentiment_model,
            max_tokens=8,
            system=SENTIMENT_SYSTEM,
            messages=[{"role": "user", "content": text}],
        )
        label = next((b.text for b in resp.content if b.type == "text"), "neutral")
    else:
        client = _openai_client()
        resp = await client.chat.completions.create(
            model=settings.openai_sentiment_model,
            max_tokens=4,
            messages=[
                {"role": "system", "content": SENTIMENT_SYSTEM},
                {"role": "user", "content": text},
            ],
        )
        label = resp.choices[0].message.content or "neutral"

    label = label.strip().lower()
    return label if label in {"positive", "negative", "neutral"} else "neutral"
