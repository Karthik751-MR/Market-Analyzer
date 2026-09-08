"use client";

import { useState, useEffect } from "react";

// Mock data to simulate live pricing
const MOCK_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2954.20, change: 1.24, vol: "4.2M", high: 3024, low: 2840 },
  { symbol: "TCS", name: "Tata Consultancy", price: 3842.15, change: -0.45, vol: "1.8M", high: 4120, low: 3600 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1645.80, change: 0.82, vol: "12.4M", high: 1750, low: 1510 },
  { symbol: "INFY", name: "Infosys Limited", price: 1482.90, change: 2.15, vol: "5.1M", high: 1620, low: 1350 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", price: 1124.50, change: 1.05, vol: "8.9M", high: 1150, low: 980 },
  { symbol: "SBIN", name: "State Bank of India", price: 812.35, change: -1.20, vol: "15.2M", high: 880, low: 720 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1345.60, change: 0.55, vol: "3.4M", high: 1400, low: 1100 },
  { symbol: "ITC", name: "ITC Limited", price: 428.90, change: -0.15, vol: "9.7M", high: 480, low: 390 },
  { symbol: "L&T", name: "Larsen & Toubro", price: 3540.25, change: 1.80, vol: "1.2M", high: 3800, low: 3200 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 6845.10, change: -2.30, vol: "850K", high: 7400, low: 6200 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2345.80, change: 0.10, vol: "1.5M", high: 2600, low: 2200 },
  { symbol: "MARUTI", name: "Maruti Suzuki", price: 12450.00, change: 1.45, vol: "420K", high: 13000, low: 10500 },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 985.40, change: 3.20, vol: "18.5M", high: 1050, low: 850 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", price: 1540.75, change: -0.85, vol: "2.1M", high: 1600, low: 1300 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1780.20, change: 0.40, vol: "3.2M", high: 1950, low: 1650 },
];

export default function LivePricesPage() {
  const [stocks, setStocks] = useState(MOCK_STOCKS);
  const [flashing, setFlashing] = useState({});

  // Simulate live tick updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        // Only update ~30% of stocks per tick
        if (Math.random() > 0.3) return stock;
        
        const changeAmt = (Math.random() * 4 - 2); // -2 to +2
        const newPrice = Math.max(stock.price + changeAmt, 1);
        const newChangePct = stock.change + (changeAmt / stock.price * 100);
        
        setFlashing(f => ({ ...f, [stock.symbol]: changeAmt > 0 ? "flash-up" : "flash-down" }));
        
        setTimeout(() => {
          setFlashing(f => {
            const next = { ...f };
            delete next[stock.symbol];
            return next;
          });
        }, 500);

        return { ...stock, price: newPrice, change: newChangePct };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Live Prices</div>
          <div className="page-subtitle">Real-time market data for NIFTY 50 components</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", display: "inline-block" }} />
            Live Market
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        {/* Table Header */}
        <div className="col-header" style={{ marginTop: 20 }}>
          <div style={{ flex: 1 }}>Symbol / Company</div>
          <div style={{ width: 120, textAlign: "right" }}>LTP (₹)</div>
          <div style={{ width: 100, textAlign: "right" }}>% Change</div>
          <div style={{ width: 100, textAlign: "right" }}>Volume</div>
          <div style={{ width: 100, textAlign: "right" }}>52W High</div>
          <div style={{ width: 100, textAlign: "right" }}>52W Low</div>
        </div>

        {/* Table Body */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }} className="custom-scrollbar">
          {stocks.map(stock => (
            <div key={stock.symbol} className="portfolio-row" style={{ padding: "12px 10px", margin: 0, borderBottom: "1px solid rgba(255,255,255,.02)", borderTop: "none", borderLeft: "none", borderRight: "none", background: "transparent" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0C8B4" }}>{stock.symbol}</span>
                <span style={{ fontSize: 11, color: "#4A5E7A" }}>{stock.name}</span>
              </div>
              <div style={{ width: 120, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#D0C8B4", transition: "color 0.3s" }} className={flashing[stock.symbol] || ""}>
                {stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ width: 100, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: stock.change >= 0 ? "#34D399" : "#F87171" }}>
                {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}%
              </div>
              <div style={{ width: 100, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6B7FA3" }}>
                {stock.vol}
              </div>
              <div style={{ width: 100, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4A5E7A" }}>
                {stock.high.toLocaleString("en-IN")}
              </div>
              <div style={{ width: 100, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4A5E7A" }}>
                {stock.low.toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .flash-up { color: #34D399 !important; text-shadow: 0 0 8px rgba(52,211,153,0.4); }
        .flash-down { color: #F87171 !important; text-shadow: 0 0 8px rgba(248,113,113,0.4); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); }
      `}} />
    </>
  );
}
