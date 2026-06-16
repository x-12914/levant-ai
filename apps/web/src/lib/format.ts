/** Formatting helpers for trading figures. Digits stay tabular (see .tnum). */

export function formatMoney(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Signed P/L string, e.g. "+515.50" / "-237.53". */
export function formatPnl(value: number): string {
  const abs = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${value >= 0 ? "+" : "-"}${abs}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatNumber(value: number, digits = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Tailwind text color class keyed to sign. Neutral when zero. */
export function pnlColor(value: number): string {
  if (value > 0) return "text-pos";
  if (value < 0) return "text-neg";
  return "text-muted";
}
