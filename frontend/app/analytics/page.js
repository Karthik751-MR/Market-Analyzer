"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPortfolios, analyzePortfolio } from "../../lib/api";

function riskFromScore(score) {
  if (score == null) return { level: "MED", accent: "accent-amber", scoreClass: "score-amber", fillPct: 50 };
  if (score >= 70)   return { level: "LOW", accent: "accent-green", scoreClass: "score-green", fillPct: 25 };
  if (score >= 40)   return { level: "MED", accent: "accent-amber", scoreClass: "score-amber", fillPct: 50 };
                     return { level: "HIGH", accent: "accent-red",  scoreClass: "score-red",   fillPct: 90 };
}

const SECTOR_COLORS = [
  "#6366F1","#C9A84C","#34D399","#F87171",
  "#7DD3FC","#A78BFA","#FB923C","#60A5FA",
];

export default function GlobalAnalyticsPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeErr, setAnalyzeErr] = useState("");

  useEffect(() => {
    async function fetchAll() {
      try {
        const data = await getPortfolios();
        setPortfolios(data);
      } catch (err) {
        setError("Unable to load portfolios for global analytics.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  async function handleGlobalAnalyze() {
    setAnalyzing(true);
    setAnalyzeErr("");
    
    try {
      // Create a master portfolio that contains all funds from all portfolios
      const allFunds = portfolios.flatMap(p => p.funds);
      
      if (allFunds.length === 0) {
        throw new Error("No funds available to analyze. Please create a portfolio first.");
      }

      const masterPortfolio = {
        portfolioName: "Global Workspace",
        funds: allFunds
      };

      const result = await analyzePortfolio(masterPortfolio);
      setAnalysis(result);
    } catch (err) {
      setAnalyzeErr(err.message || "Global analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return <div className="state-loading">Loading workspace data…</div>;
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <div>
            <div className="page-title">Global Analytics</div>
            <div className="page-subtitle">Workspace Overview</div>
          </div>
        </div>
        <div className="state-error">{error}</div>
      </>
    );
  }

  const totalValue = portfolios.reduce((s, p) => s + p.funds.reduce((fs, f) => fs + f.value, 0), 0);
  const numHoldings = portfolios.reduce((s, p) => s + p.funds.reduce((fs, f) => fs + f.holdings.length, 0), 0);
  const risk = riskFromScore(analysis?.diversificationScore);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Global Analytics</div>
          <div className="page-subtitle">Workspace Overview across {portfolios.length} portfolios</div>
        </div>
        <div className="dash-value" style={{ fontSize: "clamp(26px, 1.8vw, 36px)" }}>
          ₹{totalValue.toLocaleString("en-IN")}
        </div>
      </div>

      {/* 4-metric stat bar */}
      <div className="metric-bar">
        <div className="metric-cell">
          <div className={`metric-num ${analysis ? risk.scoreClass : ""}`} style={{ color: analysis ? undefined : "#3A5068" }}>
            {analysis ? analysis.diversificationScore : "—"}
          </div>
          <div className="metric-sub">/100</div>
          <div className="metric-label">Global Div. Score</div>
          <div className="metric-fill-track">
            <div className="metric-fill"
                 style={{
                   width: analysis ? `${analysis.diversificationScore}%` : "0%",
                   background: analysis ? (analysis.diversificationScore >= 70 ? "#34D399" : analysis.diversificationScore >= 40 ? "#FBBF24" : "#F87171") : "#1C2B40",
                   transition: "width .6s ease"
                 }} />
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-num" style={{ color: "#D0C8B4" }}>
            {analysis ? analysis.hhi : "—"}
          </div>
          <div className="metric-sub">index</div>
          <div className="metric-label">Global HHI</div>
          <div className="metric-fill-track">
            <div className="metric-fill"
                 style={{
                   width: analysis ? `${Math.min(analysis.hhi * 100, 100)}%` : "0%",
                   background: "#6366F1",
                   transition: "width .6s ease"
                 }} />
          </div>
        </div>

        <div className="metric-cell">
          <div className={`metric-num ${analysis ? risk.scoreClass : ""}`} style={{ color: analysis ? undefined : "#3A5068" }}>
            {analysis ? risk.level : "—"}
          </div>
          <div className="metric-sub">&nbsp;</div>
          <div className="metric-label">Overall Risk</div>
          <div className="metric-fill-track">
            <div className="metric-fill"
                 style={{
                   width: analysis ? `${risk.fillPct}%` : "0%",
                   background: analysis ? (risk.level === "LOW" ? "#34D399" : risk.level === "MED" ? "#FBBF24" : "#F87171") : "#1C2B40",
                   transition: "width .6s ease"
                 }} />
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-num" style={{ color: "#D0C8B4" }}>{numHoldings}</div>
          <div className="metric-sub">total stocks</div>
          <div className="metric-label">Total Holdings</div>
          <div className="metric-fill-track">
            <div className="metric-fill" style={{ width: `${Math.min(numHoldings * 2, 100)}%`, background: "#6366F1" }} />
          </div>
        </div>
      </div>

      {analyzeErr && <div className="state-error">{analyzeErr}</div>}

      {!analysis ? (
        <div className="analytics-empty-state">
          <h2>Global Workspace Analytics</h2>
          <p>
            Analyze your entire workspace to see your macroeconomic exposure across all active portfolios and funds.
          </p>
          <button
            className="analyze-cta-btn"
            onClick={handleGlobalAnalyze}
            disabled={analyzing || portfolios.length === 0}
          >
            {analyzing ? "Analyzing Workspace…" : "▶ Run global analysis"}
          </button>
          {portfolios.length === 0 && (
            <div style={{ marginTop: 16, fontSize: 13, color: "#F87171" }}>
              Please create at least one portfolio first.
            </div>
          )}
          <div style={{ fontSize: 13, color: "#4A5E7A", marginTop: 24, lineHeight: 1.6 }}>
            You'll see<br/>
            <span style={{ color: "#D0C8B4" }}>Global Diversification · Overall HHI · Macro Sector Exposure</span>
          </div>
        </div>
      ) : (
        <DashboardBody analysis={analysis} portfolios={portfolios} />
      )}
    </>
  );
}

function DashboardBody({ analysis, portfolios }) {
  const allHoldings = [];
  portfolios.forEach(p => p.funds.forEach(f => f.holdings.forEach(h => allHoldings.push({...h, fundName: f.name, portfolioName: p.portfolioName}))));
  allHoldings.sort((a, b) => b.weight - a.weight);

  const sectorEntries = Object.entries(analysis.sectors || {}).sort(([, a], [, b]) => b - a);
  const sectorColorMap = {};
  sectorEntries.forEach(([s], i) => { sectorColorMap[s] = SECTOR_COLORS[i % SECTOR_COLORS.length]; });

  function hhiNote(hhi) {
    if (hhi < 0.15) return `${hhi} — excellent global diversification.`;
    if (hhi < 0.25) return `${hhi} — moderate macro concentration.`;
    return `${hhi} — high global concentration in your top sectors.`;
  }

  return (
    <div className="dash-body">
      <div className="panel-left">
        <div className="panel-section-label">Global Sector Allocation</div>
        {sectorEntries.map(([sector, pct]) => (
          <div key={sector} className="sector-row">
            <span className="sector-name">{sector}</span>
            <div className="sector-track">
              <div className="sector-fill" style={{ width: `${pct}%`, background: sectorColorMap[sector], transition: "width .5s ease" }} />
            </div>
            <span className="sector-pct">{pct.toFixed(0)}%</span>
          </div>
        ))}

        <div className="hhi-box" style={{ marginTop: 20 }}>
          <div className="hhi-box-label">Global Concentration (HHI)</div>
          <div className="hhi-track">
            <div className="hhi-fill" style={{ width: `${Math.min(analysis.hhi * 100, 100)}%`, background: "#C9A84C" }} />
          </div>
          <div className="hhi-scale">
            <span>0.0</span><span>0.5</span><span>1.0</span>
          </div>
          <div className="hhi-note">{hhiNote(analysis.hhi)}</div>
        </div>
      </div>

      <div className="panel-right">
        <div className="panel-section-label">Top Global Holdings</div>
        {allHoldings.slice(0, 15).map((h, i) => {
          const maxW = allHoldings[0]?.weight || 1;
          const fillPct = maxW > 0 ? (h.weight / maxW) * 100 : 0;
          return (
            <div key={i} className="holding-row" title={`From ${h.portfolioName} - ${h.fundName}`}>
              <span className="holding-symbol">{h.stockSymbol}</span>
              <div className="holding-track">
                <div className="holding-fill" style={{ width: `${fillPct}%`, background: sectorColorMap[h.sector] || SECTOR_COLORS[0] }} />
              </div>
              <span className="holding-sector" style={{ width: 'auto', minWidth: 26, fontSize: 10 }}>{h.weight}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
