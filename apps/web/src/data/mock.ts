import type { AccountKpis, BrokerAccount, Trade } from "./types";

// Placeholder read-only data. In production the Node gateway streams this from
// the Python aggregation service; the shapes match data/types.ts exactly.

export const accounts: BrokerAccount[] = [
  { id: "fxpro-mt5", label: "FXPro (MT5)", platform: "MetaTrader 5", connected: true },
  { id: "binance", label: "Binance", platform: "Binance", connected: true },
  { id: "ibkr", label: "Interactive Brokers", platform: "IBKR", connected: false },
];

export const kpis: AccountKpis = {
  totalTrades: 30,
  winRate: 46.7,
  avgPnl: -237.53,
  bestTrade: 515.5,
  worstTrade: -7298.27,
  volume: 21.24,
};

export const trades: Trade[] = [
  {
    id: "t1",
    ticket: "94100243",
    asset: "GBPAUD/GBPUSD",
    type: "Pair Trade",
    quantity: "0.1/0.1",
    entry: 0.70894,
    sl: null,
    tp: null,
    pnl: -98.67,
    status: "Executed",
    source: "Pair Trade",
  },
  {
    id: "t2",
    ticket: "94100238",
    asset: "EURNZD",
    type: "Sell",
    quantity: "0.1",
    entry: 1.98408,
    sl: null,
    tp: null,
    pnl: -253.47,
    status: "Executed",
    source: "EA",
  },
  {
    id: "t3",
    ticket: "90962080",
    asset: "GBPAUD/EURNZD",
    type: "Pair Trade",
    quantity: "0.1/0.1",
    entry: 0.06549,
    sl: null,
    tp: null,
    pnl: -300.01,
    status: "Executed",
    source: "Pair Trade",
  },
  {
    id: "t4",
    ticket: "90944112",
    asset: "XAUUSD",
    type: "Buy",
    quantity: "0.05",
    entry: 2341.18,
    sl: 2330.0,
    tp: 2375.0,
    pnl: 515.5,
    status: "Executed",
    source: "Bot",
  },
  {
    id: "t5",
    ticket: "90933071",
    asset: "BTCUSD",
    type: "Buy",
    quantity: "0.02",
    entry: 64210.5,
    sl: null,
    tp: null,
    pnl: 182.34,
    status: "Closed",
    source: "Copy",
  },
  {
    id: "t6",
    ticket: "90928844",
    asset: "USDJPY",
    type: "Sell",
    quantity: "0.2",
    entry: 156.842,
    sl: 157.4,
    tp: 155.9,
    pnl: -41.2,
    status: "Pending",
    source: "Manual",
  },
  {
    id: "t7",
    ticket: "90901577",
    asset: "EURUSD/GBPUSD",
    type: "Pair Trade",
    quantity: "0.1/0.1",
    entry: 0.84021,
    sl: null,
    tp: null,
    pnl: 96.12,
    status: "Executed",
    source: "Pair Trade",
  },
];

/** The signed-in user, as shown in the top bar. */
export const currentUser = {
  name: "faladerasaq22",
  initial: "F",
};
