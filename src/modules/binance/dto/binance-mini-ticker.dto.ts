export class BinanceMiniTickerDto {
  e: string; // event type: "24hrMiniTicker"
  E: number; // event time (ms)
  s: string; // symbol e.g. "BTCUSDT"
  c: string; // close price
  o: string; // open price
  h: string; // high price
  l: string; // low price
  v: string; // base asset volume
  q: string; // quote asset volume
}
