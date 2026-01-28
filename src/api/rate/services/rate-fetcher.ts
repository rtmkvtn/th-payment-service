import axios from 'axios';

const BINANCE_API_URL = 'https://cloudme-th.2meta.app/api/v1/depth?symbol=USDTTHB&limit=10';

interface DepthResponse {
  bids: [string, string][];
  asks: [string, string][];
}

export async function fetchUsdtThbRate(): Promise<number> {
  const response = await axios.get<DepthResponse>(BINANCE_API_URL);
  const bestBidPrice = response.data.bids[0][0];
  return parseFloat(bestBidPrice);
}
