export type TradeType = "Pair Trade" | "Buy" | "Sell";
export type TradeStatus = "Executed" | "Pending" | "Failed" | "Closed";
export type TradeSource = "Pair Trade" | "EA" | "Manual" | "Copy" | "Bot";

export interface Trade {
  id: string;
  ticket: string;
  asset: string;
  type: TradeType;
  quantity: string;
  entry: number;
  sl: number | null;
  tp: number | null;
  pnl: number;
  status: TradeStatus;
  source: TradeSource;
}

export interface AccountKpis {
  totalTrades: number;
  winRate: number;
  avgPnl: number;
  bestTrade: number;
  worstTrade: number;
  volume: number;
}

export interface BrokerAccount {
  id: string;
  label: string;
  platform: string;
  connected: boolean;
}
