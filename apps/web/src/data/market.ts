// Demo market/community data for the v1 read-only UI. Anything sourced here is
// placeholder until the corresponding live integration (broker APIs, market-data
// feeds, analyst providers) is connected. Pages label it as "Demo data".

export interface Asset {
  symbol: string;
  name: string;
  klass: "Stock" | "Forex" | "Crypto" | "Metal";
  price: number;
  changePct: number;
}

export interface AnalystRating {
  symbol: string;
  buy: number;
  hold: number;
  sell: number;
  priceTarget: number;
  upsidePct: number;
}

export interface NewsItem {
  id: string;
  symbol: string;
  headline: string;
  source: string;
  ago: string;
}

export interface Trader {
  id: string;
  name: string;
  handle: string;
  winRate: number;
  roiPct: number;
  followers: number;
  risk: "Low" | "Medium" | "High";
  copying: boolean;
}

export interface Strategy {
  id: string;
  name: string;
  type: "Pair" | "Momentum" | "Mean Reversion" | "Grid";
  instrument: string;
  status: "Live" | "Paper" | "Draft";
  sharpe: number;
  maxDrawdownPct: number;
  winRate: number;
}

export interface PairStat {
  a: string;
  b: string;
  correlation: number;
  zScore: number;
}

export const watchlist: Asset[] = [
  { symbol: "AAPL", name: "Apple Inc.", klass: "Stock", price: 231.4, changePct: 0.82 },
  { symbol: "NVDA", name: "NVIDIA Corp.", klass: "Stock", price: 142.18, changePct: -1.34 },
  { symbol: "TSLA", name: "Tesla Inc.", klass: "Stock", price: 412.9, changePct: 2.11 },
  { symbol: "BTCUSD", name: "Bitcoin", klass: "Crypto", price: 64210.5, changePct: 1.07 },
  { symbol: "ETHUSD", name: "Ethereum", klass: "Crypto", price: 3380.2, changePct: -0.42 },
  { symbol: "EURUSD", name: "Euro / US Dollar", klass: "Forex", price: 1.0842, changePct: 0.13 },
  { symbol: "XAUUSD", name: "Gold Spot", klass: "Metal", price: 2341.18, changePct: 0.55 },
];

export const analystRatings: Record<string, AnalystRating> = {
  AAPL: { symbol: "AAPL", buy: 28, hold: 9, sell: 2, priceTarget: 255, upsidePct: 10.2 },
  NVDA: { symbol: "NVDA", buy: 41, hold: 5, sell: 1, priceTarget: 175, upsidePct: 23.1 },
  TSLA: { symbol: "TSLA", buy: 14, hold: 16, sell: 9, priceTarget: 390, upsidePct: -5.5 },
  BTCUSD: { symbol: "BTCUSD", buy: 12, hold: 6, sell: 3, priceTarget: 72000, upsidePct: 12.1 },
  ETHUSD: { symbol: "ETHUSD", buy: 9, hold: 7, sell: 4, priceTarget: 3600, upsidePct: 6.5 },
  EURUSD: { symbol: "EURUSD", buy: 5, hold: 8, sell: 4, priceTarget: 1.1, upsidePct: 1.5 },
  XAUUSD: { symbol: "XAUUSD", buy: 11, hold: 4, sell: 2, priceTarget: 2450, upsidePct: 4.6 },
};

export const news: NewsItem[] = [
  { id: "n1", symbol: "AAPL", headline: "Apple's services revenue beats estimates as installed base hits record", source: "Bloomberg", ago: "1h" },
  { id: "n2", symbol: "NVDA", headline: "NVIDIA slips as supply-chain checks point to softer near-term GPU demand", source: "Reuters", ago: "2h" },
  { id: "n3", symbol: "TSLA", headline: "Tesla deliveries accelerate on new incentives; analysts raise targets", source: "CNBC", ago: "3h" },
  { id: "n4", symbol: "BTCUSD", headline: "Bitcoin ETF inflows turn positive again after a week of outflows", source: "CoinDesk", ago: "4h" },
  { id: "n5", symbol: "XAUUSD", headline: "Gold holds gains as traders price in a more dovish rate path", source: "FT", ago: "5h" },
];

export const traders: Trader[] = [
  { id: "t1", name: "Lena Carter", handle: "@lenatrades", winRate: 68.4, roiPct: 142.0, followers: 12400, risk: "Medium", copying: true },
  { id: "t2", name: "Marco Reyes", handle: "@m_reyes_fx", winRate: 61.2, roiPct: 98.5, followers: 8800, risk: "Low", copying: false },
  { id: "t3", name: "Aisha Khan", handle: "@aisha_quant", winRate: 73.9, roiPct: 211.3, followers: 19300, risk: "High", copying: false },
  { id: "t4", name: "Tom Becker", handle: "@beckerswing", winRate: 57.0, roiPct: 64.2, followers: 4100, risk: "Medium", copying: false },
  { id: "t5", name: "Sofia Lind", handle: "@sofialind", winRate: 65.5, roiPct: 120.7, followers: 9600, risk: "Low", copying: true },
];

export const strategies: Strategy[] = [
  { id: "s1", name: "GBPAUD / GBPUSD reversion", type: "Pair", instrument: "GBPAUD/GBPUSD", status: "Paper", sharpe: 1.42, maxDrawdownPct: -8.3, winRate: 58.0 },
  { id: "s2", name: "Gold momentum", type: "Momentum", instrument: "XAUUSD", status: "Live", sharpe: 1.08, maxDrawdownPct: -12.1, winRate: 51.5 },
  { id: "s3", name: "BTC grid", type: "Grid", instrument: "BTCUSD", status: "Paper", sharpe: 0.94, maxDrawdownPct: -15.6, winRate: 62.4 },
  { id: "s4", name: "EURUSD mean reversion", type: "Mean Reversion", instrument: "EURUSD", status: "Draft", sharpe: 1.21, maxDrawdownPct: -6.9, winRate: 60.1 },
];

export const pairStats: PairStat[] = [
  { a: "GBPAUD", b: "GBPUSD", correlation: 0.91, zScore: -2.1 },
  { a: "EURUSD", b: "GBPUSD", correlation: 0.84, zScore: 0.4 },
  { a: "BTCUSD", b: "ETHUSD", correlation: 0.88, zScore: 1.6 },
  { a: "AAPL", b: "NVDA", correlation: 0.72, zScore: -0.8 },
  { a: "XAUUSD", b: "EURUSD", correlation: 0.66, zScore: 2.0 },
];

// Portfolio analytics (aggregated across the demo accounts).
export const allocation = [
  { name: "Stocks", value: 42 },
  { name: "Forex", value: 23 },
  { name: "Crypto", value: 21 },
  { name: "Metals", value: 14 },
];

export const portfolioSeries = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 104 },
  { month: "Mar", value: 99 },
  { month: "Apr", value: 112 },
  { month: "May", value: 121 },
  { month: "Jun", value: 118 },
  { month: "Jul", value: 129 },
];

// Sparkline series for the Research detail view (relative price path).
export const priceSeries = [
  { t: "1", p: 100 }, { t: "2", p: 102 }, { t: "3", p: 101 }, { t: "4", p: 105 },
  { t: "5", p: 108 }, { t: "6", p: 106 }, { t: "7", p: 110 }, { t: "8", p: 114 },
  { t: "9", p: 112 }, { t: "10", p: 117 }, { t: "11", p: 121 }, { t: "12", p: 119 },
];
