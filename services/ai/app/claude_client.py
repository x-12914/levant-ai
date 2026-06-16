"""Claude integration for AskAI and sentiment.

Uses the official `anthropic` SDK (AsyncAnthropic) per the claude-api skill.
Model IDs are current as of the skill's catalog: AskAI defaults to
`claude-opus-4-8`; sentiment uses `claude-haiku-4-5` for cheap, high-volume
classification.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

import anthropic

from .config import settings

_client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key or None)

ASKAI_SYSTEM = (
    "You are Levant AskAI, a pre-trade analysis assistant. The platform is "
    "read-only: you analyze, explain, and assess risk, but you never place or "
    "modify orders, and you say so if asked. Be precise and calm. State numbers "
    "and risk plainly. This is not financial advice."
)


async def stream_askai(prompt: str) -> AsyncIterator[str]:
    """Stream AskAI tokens for a user question (drives the chat UI via SSE)."""
    async with _client.messages.stream(
        model=settings.claude_model,
        max_tokens=2048,
        system=ASKAI_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        async for text in stream.text_stream:
            yield text


async def classify_sentiment(text: str) -> str:
    """Return one of: positive | negative | neutral. Cheap, single-shot."""
    resp = await _client.messages.create(
        model=settings.claude_sentiment_model,
        max_tokens=8,
        system="Classify the market sentiment of the text. Reply with exactly one "
        "word: positive, negative, or neutral.",
        messages=[{"role": "user", "content": text}],
    )
    label = next((b.text for b in resp.content if b.type == "text"), "neutral")
    label = label.strip().lower()
    return label if label in {"positive", "negative", "neutral"} else "neutral"
