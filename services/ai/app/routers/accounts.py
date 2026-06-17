import httpx
from fastapi import APIRouter, HTTPException

from ..brokers import alpaca

router = APIRouter(prefix="/accounts", tags=["accounts"])


def _f(value, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


@router.get("/summary")
async def summary() -> dict:
    """Live read-only account summary + positions (Alpaca). Falls back to a
    not-configured response when no keys are set, so the UI can show demo data."""
    if not alpaca.configured():
        return {"configured": False, "provider": "alpaca"}

    try:
        account = await alpaca.get_account()
        positions = await alpaca.get_positions()
    except httpx.HTTPStatusError as e:
        detail = "invalid Alpaca credentials" if e.response.status_code in (401, 403) else str(e)
        raise HTTPException(status_code=502, detail=f"alpaca: {detail}") from e
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"alpaca: {e}") from e

    return {
        "configured": True,
        "provider": "alpaca",
        "paper": alpaca.is_paper(),
        "account": {
            "equity": _f(account.get("equity")),
            "lastEquity": _f(account.get("last_equity")),
            "cash": _f(account.get("cash")),
            "buyingPower": _f(account.get("buying_power")),
            "currency": account.get("currency", "USD"),
            "status": account.get("status", "ACTIVE"),
        },
        "positions": [
            {
                "symbol": p.get("symbol"),
                "qty": _f(p.get("qty")),
                "side": p.get("side", "long"),
                "avgEntry": _f(p.get("avg_entry_price")),
                "currentPrice": _f(p.get("current_price")),
                "marketValue": _f(p.get("market_value")),
                "unrealizedPl": _f(p.get("unrealized_pl")),
                "unrealizedPlPct": _f(p.get("unrealized_plpc")) * 100,
            }
            for p in positions
        ],
    }
