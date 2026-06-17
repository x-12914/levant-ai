/** Live read-only account data from the gateway → AI service (Alpaca). */
export interface LivePosition {
  symbol: string;
  qty: number;
  side: string;
  avgEntry: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPl: number;
  unrealizedPlPct: number;
}

export interface LiveAccount {
  equity: number;
  lastEquity: number;
  cash: number;
  buyingPower: number;
  currency: string;
  status: string;
}

export interface AccountSummary {
  configured: boolean;
  provider: string;
  paper?: boolean;
  account?: LiveAccount;
  positions?: LivePosition[];
}

export async function getAccountSummary(): Promise<AccountSummary> {
  const res = await fetch("/api/accounts/summary");
  if (!res.ok) throw new Error(`accounts failed (${res.status})`);
  return (await res.json()) as AccountSummary;
}
