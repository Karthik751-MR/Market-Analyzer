"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data for the user's watchlist
const INITIAL_WATCHLIST = [
  { symbol: "ZOMATO", name: "Zomato Ltd.", price: 275.40, change: 4.25, added: "2 days ago", alert: "Price > 250" },
  { symbol: "JIOFIN", name: "Jio Financial Services", price: 345.15, change: -1.20, added: "1 week ago", alert: "None" },
  { symbol: "TRENT", name: "Trent Limited", price: 7240.50, change: 2.80, added: "1 month ago", alert: "Earnings tomorrow" },
  { symbol: "IRFC", name: "Indian Railway Finance", price: 185.90, change: 0.45, added: "3 months ago", alert: "None" },
  { symbol: "SUZLON", name: "Suzlon Energy", price: 82.30, change: -4.50, added: "4 months ago", alert: "Price < 85" }
];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [newSymbol, setNewSymbol] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    
    // Add mock entry
    setWatchlist([{
      symbol: newSymbol.toUpperCase(),
      name: "Added manually",
      price: Math.floor(Math.random() * 5000) + 100,
      change: (Math.random() * 6) - 3,
      added: "Just now",
      alert: "None"
    }, ...watchlist]);
    
    setNewSymbol("");
  };

  const handleRemove = (symbolToRemove) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbolToRemove));
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Watchlist</div>
          <div className="page-subtitle">Track potential investments and set alerts</div>
        </div>
        <div style={{ color: "#D0C8B4", fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
          {watchlist.length} items
        </div>
      </div>

      <div style={{ padding: "20px", display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        
        {/* Add Bar */}
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <input
            type="text"
            className="form-input"
            style={{ width: "300px" }}
            placeholder="Enter stock symbol (e.g. INFY)"
            value={newSymbol}
            onChange={e => setNewSymbol(e.target.value)}
          />
          <button type="submit" className="btn-gold" style={{ padding: "0 20px" }}>
            + Add to Watchlist
          </button>
        </form>

        {/* Table Header */}
        <div className="col-header">
          <div style={{ flex: 1 }}>Symbol / Company</div>
          <div style={{ width: 120, textAlign: "right" }}>LTP (₹)</div>
          <div style={{ width: 100, textAlign: "right" }}>% Change</div>
          <div style={{ width: 150, textAlign: "right" }}>Active Alerts</div>
          <div style={{ width: 120, textAlign: "right" }}>Added</div>
          <div style={{ width: 40, textAlign: "center" }}></div>
        </div>

        {/* Table Body */}
        <div style={{ flex: 1, overflowY: "auto" }} className="custom-scrollbar">
          {watchlist.length === 0 ? (
            <div className="analytics-empty-state" style={{ minHeight: "300px" }}>
              <h2 style={{ fontSize: 24 }}>Your watchlist is empty</h2>
              <p>Add stocks to monitor their live performance without adding them to a portfolio.</p>
            </div>
          ) : (
            watchlist.map(stock => (
              <div key={stock.symbol} className="portfolio-row" style={{ padding: "14px 10px", margin: 0, borderBottom: "1px solid rgba(255,255,255,.02)", borderTop: "none", borderLeft: "none", borderRight: "none", background: "transparent", alignItems: "center" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#D0C8B4" }}>{stock.symbol}</span>
                  <span style={{ fontSize: 12, color: "#4A5E7A" }}>{stock.name}</span>
                </div>
                <div style={{ width: 120, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: "#D0C8B4" }}>
                  {stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ width: 100, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: stock.change >= 0 ? "#34D399" : "#F87171" }}>
                  {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}%
                </div>
                <div style={{ width: 150, textAlign: "right", fontSize: 12, color: stock.alert !== "None" ? "#FBBF24" : "#4A5E7A" }}>
                  {stock.alert}
                </div>
                <div style={{ width: 120, textAlign: "right", fontSize: 12, color: "#6B7FA3" }}>
                  {stock.added}
                </div>
                <div style={{ width: 40, textAlign: "center" }}>
                  <button 
                    onClick={() => handleRemove(stock.symbol)}
                    style={{ background: "transparent", border: "none", color: "#F87171", cursor: "pointer", fontSize: 16, opacity: 0.6 }}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); }
      `}} />
    </>
  );
}
