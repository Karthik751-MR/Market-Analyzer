"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPortfolioById, analyzePortfolio, deletePortfolio } from "../../../lib/api";
import { useRouter } from "next/navigation";

/* Derive risk info from diversification score */
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

export default function PortfolioDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id;

  const [portfolio,  setPortfolio]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [fetchErr,   setFetchErr]   = useState("");

  const [analysis,   setAnalysis]   = useState(null);
  const [analyzing,  setAnalyzing]  = useState(false);
  const [analyzeErr, setAnalyzeErr] = useState("");

  const [deleting,   setDeleting]   = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPortfolioById(id);
        setPortfolio(data);
      } catch {
        setFetchErr("Unable to load portfolio.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleAnalyze() {
    setAnalyzing(true);
    setAnalyzeErr("");
    setAnalysis(null);
    try {
      const result = await analyzePortfolio(portfolio);
      setAnalysis(result);
    } catch (err) {
      setAnalyzeErr(err.message || "Analysis failed. Is the analytics service running?");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    if (!window.confirm("Delete this portfolio? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deletePortfolio(id);
      router.push("/");
    } catch {
      alert("Unable to delete. Please try again.");
      setDeleting(false);
    }
  }

  /* ── Loading ── */
  if (loading) {
    return <div className="state-loading">Loading portfolio…</div>;
  }

  /* ── Error ── */
  if (fetchErr) {
    return (
      <>
        <div className="state-error">{fetchErr}</div>
        <div style={{ padding: "0 20px" }}>
          <Link href="/" className="btn-outline">← Portfolios</Link>
        </div>
      </>
    );
  }

  if (!portfolio) return null;

  const totalValue  = portfolio.funds.reduce((s, f) => s + f.value, 0);
  const numHoldings = portfolio.funds.reduce((s, f) => s + f.holdings.length, 0);
  const risk        = riskFromScore(analysis?.diversificationScore);

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/" className="breadcrumb-link">Portfolios</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{portfolio.portfolioName}</span>
        <div className="breadcrumb-actions">
          <Link href={`/portfolio/${id}/edit`} className="btn-outline">Edit portfolio</Link>
          <button
            className="btn-outline-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      {/* Dashboard header */}
      <div className="dash-header">
        <div>
          <div className="dash-title">{portfolio.portfolioName}</div>
          <div className="dash-meta">
            {portfolio.funds.length} {portfolio.funds.length === 1 ? "fund" : "funds"} · {numHoldings} holdings · Updated today
          </div>
        </div>
        <div>
          <div className="dash-value">₹{totalValue.toLocaleString("en-IN")}</div>
          <div className="dash-value-label">Total portfolio value</div>
        </div>
      </div>

      {/* 4-metric stat bar */}
      <div className="metric-bar">
        {/* Diversification score */}
        <div className="metric-cell">
          <div className={`metric-num ${analysis ? risk.scoreClass : ""}`}
               style={{ color: analysis ? undefined : "#3A5068" }}>
            {analysis ? analysis.diversificationScore : "—"}
          </div>
          <div className="metric-sub">/100</div>
          <div className="metric-label">Div. Score</div>
          <div className="metric-fill-track">
            <div className="metric-fill"
                 style={{
                   width: analysis ? `${analysis.diversificationScore}%` : "0%",
                   background: analysis
                     ? (analysis.diversificationScore >= 70 ? "#34D399"
                       : analysis.diversificationScore >= 40 ? "#FBBF24"
                       : "#F87171")
                     : "#1C2B40",
                   transition: "width .6s ease"
                 }} />
          </div>
        </div>

        {/* HHI */}
        <div className="metric-cell">
          <div className="metric-num" style={{ color: "#D0C8B4" }}>
            {analysis ? analysis.hhi : "—"}
          </div>
          <div className="metric-sub">index</div>
          <div className="metric-label">HHI</div>
          <div className="metric-fill-track">
            <div className="metric-fill"
                 style={{
                   width: analysis ? `${Math.min(analysis.hhi * 100, 100)}%` : "0%",
                   background: "#6366F1",
                   transition: "width .6s ease"
                 }} />
          </div>
        </div>

        {/* Risk level */}
        <div className="metric-cell">
          <div className={`metric-num ${analysis ? risk.scoreClass : ""}`}
               style={{ color: analysis ? undefined : "#3A5068", fontSize: 16 }}>
            {analysis ? risk.level : "—"}
          </div>
          <div className="metric-sub">&nbsp;</div>
          <div className="metric-label">Risk Level</div>
          <div className="metric-fill-track">
            <div className="metric-fill"
                 style={{
                   width: analysis ? `${risk.fillPct}%` : "0%",
                   background: analysis
                     ? (risk.level === "LOW" ? "#34D399"
                       : risk.level === "MED" ? "#FBBF24"
                       : "#F87171")
                     : "#1C2B40",
                   transition: "width .6s ease"
                 }} />
          </div>
        </div>

        {/* Holdings count */}
        <div className="metric-cell">
          <div className="metric-num" style={{ color: "#D0C8B4" }}>{numHoldings}</div>
          <div className="metric-sub">stocks</div>
          <div className="metric-label">Holdings</div>
          <div className="metric-fill-track">
            <div className="metric-fill"
                 style={{ width: `${Math.min(numHoldings * 10, 100)}%`, background: "#6366F1" }} />
          </div>
        </div>
      </div>

      {/* Error banners */}
      {analyzeErr && (
        <div className="state-error">{analyzeErr}</div>
      )}

      {/* Dashboard body */}
      {!analysis ? (
        /* Pre-analysis state: prompt the user */
        <div className="analytics-empty-state">
          <h2>Portfolio analytics</h2>
          <p>
            Analyze this portfolio to see how your money is distributed across sectors and how concentrated your holdings are.
          </p>
          <button
            id="analyze-btn"
            className="analyze-cta-btn"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? "Analyzing…" : "▶ Run portfolio analysis"}
          </button>
          <div style={{ fontSize: 13, color: "#4A5E7A", marginTop: 24, lineHeight: 1.6 }}>
            You'll see<br/>
            <span style={{ color: "#D0C8B4" }}>Diversification · HHI · Sector Exposure</span>
          </div>
        </div>
      ) : (
        /* Post-analysis: two-panel dashboard */
        <DashboardBody analysis={analysis} portfolio={portfolio} onReanalyze={handleAnalyze} analyzing={analyzing} />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dashboard Body — mirrors folio_analytics_dashboard.html exactly
   ───────────────────────────────────────────────────────────── */
function DashboardBody({ analysis, portfolio, onReanalyze, analyzing }) {
  /* Collect all holdings sorted by weight */
  const allHoldings = [];
  portfolio.funds.forEach((f) => {
    f.holdings.forEach((h) => allHoldings.push({ ...h, fundName: f.name }));
  });
  allHoldings.sort((a, b) => b.weight - a.weight);

  /* Sectors sorted by exposure */
  const sectorEntries = Object.entries(analysis.sectors || {}).sort(([, a], [, b]) => b - a);

  /* Assign sector colors */
  const sectorColorMap = {};
  sectorEntries.forEach(([s], i) => { sectorColorMap[s] = SECTOR_COLORS[i % SECTOR_COLORS.length]; });

  /* HHI notes */
  function hhiNote(hhi) {
    if (hhi < 0.15) return `${hhi} — well diversified. Good spread across sectors.`;
    if (hhi < 0.25) return `${hhi} — moderate. Consider reducing concentration in the top sector.`;
    return `${hhi} — high concentration. Portfolio is heavily skewed to one sector.`;
  }

  return (
    <div className="dash-body">
      {/* Left panel — sector allocation */}
      <div className="panel-left">
        <div className="panel-section-label">Sector Allocation</div>

        {sectorEntries.map(([sector, pct], i) => (
          <div key={sector} className="sector-row">
            <span className="sector-name">{sector}</span>
            <div className="sector-track">
              <div
                className="sector-fill"
                style={{ width: `${pct}%`, background: sectorColorMap[sector], transition: "width .5s ease" }}
              />
            </div>
            <span className="sector-pct">{pct.toFixed(0)}%</span>
          </div>
        ))}

        {/* HHI box */}
        <div className="hhi-box">
          <div className="hhi-box-label">Concentration (HHI)</div>
          <div className="hhi-track">
            <div
              className="hhi-fill"
              style={{ width: `${Math.min(analysis.hhi * 100, 100)}%`, background: "#C9A84C" }}
            />
          </div>
          <div className="hhi-scale">
            <span>0.0</span><span>0.5</span><span>1.0</span>
          </div>
          <div className="hhi-note">{hhiNote(analysis.hhi)}</div>
        </div>

        {/* Overlap pairs (if multiple funds) */}
        {analysis.overlap?.pairs?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div className="panel-section-label" style={{ marginTop: 0 }}>Fund Overlap</div>
            {analysis.overlap.pairs.map((pair, i) => (
              <div key={i} className="sector-row" style={{ marginBottom: 8 }}>
                <span className="sector-name" style={{ fontSize: 10 }}>
                  {pair.fundA.slice(0, 7)}↔{pair.fundB.slice(0, 7)}
                </span>
                <div className="sector-track">
                  <div
                    className="sector-fill"
                    style={{
                      width: `${pair.overlap}%`,
                      background: pair.overlap > 50 ? "#F87171" : pair.overlap > 20 ? "#FBBF24" : "#34D399"
                    }}
                  />
                </div>
                <span className="sector-pct">{pair.overlap}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Re-analyze button */}
        <div style={{ marginTop: 14 }}>
          <button className="analyze-cta-btn" onClick={onReanalyze} disabled={analyzing}
                  style={{ fontSize: 10, padding: "5px 14px" }}>
            {analyzing ? "Analyzing…" : "↺ Re-analyze"}
          </button>
        </div>
      </div>

      {/* Right panel — top holdings */}
      <div className="panel-right">
        <div className="panel-section-label">Top Holdings</div>

        {allHoldings.slice(0, 10).map((h, i) => {
          const maxW   = allHoldings[0].weight;
          const fillPct = maxW > 0 ? (h.weight / maxW) * 100 : 0;
          const color  = sectorColorMap[h.sector] || SECTOR_COLORS[0];
          return (
            <div key={i} className="holding-row">
              <span className="holding-symbol">{h.stockSymbol}</span>
              <div className="holding-track">
                <div
                  className="holding-fill"
                  style={{ width: `${fillPct}%`, background: color }}
                />
              </div>
              <span className="holding-sector">{h.sector.slice(0, 6)}</span>
              <span className="holding-pct">{h.weight}%</span>
            </div>
          );
        })}

        {/* Fund breakdown */}
        <div className="panel-section-label" style={{ marginTop: 18 }}>Funds</div>
        {portfolio.funds.map((f, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 12, color: "#D0C8B4" }}>
                {f.name}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6B7FA3" }}>
                ₹{f.value.toLocaleString("en-IN")}
              </span>
            </div>
            <div style={{ height: 2, background: "rgba(255,255,255,.04)", position: "relative" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%",
                width: `${(f.value / portfolio.funds.reduce((s, ff) => s + ff.value, 0)) * 100}%`,
                background: SECTOR_COLORS[i % SECTOR_COLORS.length]
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
