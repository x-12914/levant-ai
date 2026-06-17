"""Read-only Alpaca connector.

Pulls account balances, positions, and recent orders via Alpaca's REST API
(paper or live, set by ALPACA_BASE_URL). Read-only: this module never sends
orders. Uses httpx (already pulled in by the OpenAI/Anthropic SDKs).
"""
from __future__ import annotations

import httpx

from ..config import settings


def configured() -> bool:
    return bool(settings.alpaca_api_key and settings.alpaca_api_secret)


def is_paper() -> bool:
    return "paper-api" in settings.alpaca_base_url


def _base_url() -> str:
    # Tolerate a trailing slash or an accidental "/v2" suffix (Alpaca shows the
    # endpoint as .../v2); we add the /v2/<path> ourselves.
    base = settings.alpaca_base_url.rstrip("/")
    if base.endswith("/v2"):
        base = base[:-3]
    return base


def _client() -> httpx.AsyncClient:
    return httpx.AsyncClient(
        base_url=_base_url(),
        headers={
            "APCA-API-KEY-ID": settings.alpaca_api_key,
            "APCA-API-SECRET-KEY": settings.alpaca_api_secret,
        },
        timeout=15.0,
    )


async def get_account() -> dict:
    async with _client() as c:
        r = await c.get("/v2/account")
        r.raise_for_status()
        return r.json()


async def get_positions() -> list[dict]:
    async with _client() as c:
        r = await c.get("/v2/positions")
        r.raise_for_status()
        return r.json()


async def get_orders(limit: int = 50) -> list[dict]:
    async with _client() as c:
        r = await c.get(
            "/v2/orders",
            params={"status": "all", "limit": limit, "direction": "desc", "nested": "true"},
        )
        r.raise_for_status()
        return r.json()
