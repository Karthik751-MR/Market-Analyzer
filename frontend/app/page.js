"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPortfolios, deletePortfolio } from "../lib/api";

/* Derive risk level and accent color from diversification score */
function riskFromScore(score) {
  if (score == null) return { level: "—",    accent: "accent-amber", badge: "risk-med",   scoreClass: "score-amber" };
  if (score >= 70)   return { level: "Low",  accent: "accent-green", badge: "risk-low",   scoreClass: "score-green" };
  if (score >= 40)   return { level: "Med",  accent: "accent-amber", badge: "risk-med",   scoreClass: "score-amber" };
                     return { level: "High", accent: "accent-red",   badge: "risk-high",  scoreClass: "score-red"   };
}

/* Build a tiny sector mini-bar from holdings data */
const SECTOR_COLORS = ["#6366F1","#C9A84C","#34D399","#F87171","#7DD3FC","#A78BFA","#FB923C","#60A5FA"];
function buildSectorBar(funds) {
  const totals = {};
  let grandTotal = 0;
  funds.forEach((f) => {
    f.holdings.forEach((h) => {
      totals[h.sector] = (totals[h.sector] || 0) + h.weight;
      grandTotal += h.weight;
    });
  });
  if (grandTotal === 0) return { segments: [], labels: [] };
  const sorted = Object.entries(totals).sort(([, a], [, b]) => b - a);
  const segments = sorted.map(([sector, w], i) => ({
    sector,
    pct: (w / grandTotal) * 100,
    color: SECTOR_COLORS[i % SECTOR_COLORS.length],
  }));
  const labels = segments.slice(0, 3).map((s) => ({
    label: `${s.sector.slice(0, 2)} ${Math.round(s.pct)}%`,
  }));
  return { segments, labels };
}

export default function HomePage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function fetchPortfolios() {
    try {
      setError("");
      const data = await getPortfolios();
      setPortfolios(data);
      // Update sidebar count badge via DOM (layout is outside React tree)
      const el = document.getElementById("portfolio-count");
      if (el) el.textContent = data.length;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPortfolios(); }, []);

  async function handleDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this portfolio? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deletePortfolio(id);
      setPortfolios((prev) => prev.filter((p) => p._id !== id));
      const el = document.getElementById("portfolio-count");
      if (el) el.textContent = portfolios.length - 1;
    } catch {
      alert("Unable to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  /* Aggregated stats */
  const totalFunds    = portfolios.reduce((s, p) => s + p.funds.length, 0);
  const totalHoldings = portfolios.reduce((s, p) => s + p.funds.reduce((fs, f) => fs + f.holdings.length, 0), 0);
  const totalValue    = portfolios.reduce((s, p) => s + p.funds.reduce((fs, f) => fs + f.value, 0), 0);

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div>
          <div className="page-title">My Portfolios</div>
          <div className="page-subtitle">Manage and track your investments</div>
        </div>
        <Link href="/create" className="btn-gold">+ New Portfolio</Link>
      </div>

      {/* Summary strip */}
      <div className="summary-strip">
        <div className="summary-stat">
          <div className="stat-label">Total AUM</div>
          <div className="stat-value">
            ₹{totalValue > 0 ? totalValue.toLocaleString("en-IN") : "—"}
          </div>
          <div className="stat-sub">across all portfolios</div>
        </div>
        <div className="summary-divider" />
        <div className="summary-stat">
          <div className="stat-label">Portfolios</div>
          <div className="stat-value">{portfolios.length}</div>
          <div className="stat-sub">active</div>
        </div>
        <div className="summary-divider" />
        <div className="summary-stat">
          <div className="stat-label">Funds</div>
          <div className="stat-value">{totalFunds}</div>
          <div className="stat-sub">total</div>
        </div>
        <div className="summary-divider" />
        <div className="summary-stat">
          <div className="stat-label">Holdings</div>
          <div className="stat-value">{totalHoldings}</div>
          <div className="stat-sub">stocks tracked</div>
        </div>
      </div>

      {/* Column headers */}
      <div style={{ padding: "0 20px", flexShrink: 0 }}>
        <div className="col-header" style={{ marginBottom: 0 }}>
          <div style={{ flex: 1 }}>Portfolio</div>
          <div style={{ width: 108, flexShrink: 0 }}>Value</div>
          <div style={{ width: 120, flexShrink: 0 }}>Sector Allocation</div>
          <div style={{ width: 52,  flexShrink: 0, textAlign: "center" }}>Score</div>
          <div style={{ width: 58,  flexShrink: 0, textAlign: "center" }}>Risk</div>
          <div style={{ width: 20,  flexShrink: 0 }} />
        </div>
      </div>

      {/* Portfolio list */}
      <div className="portfolio-list">
        {loading && (
          <div className="state-loading">Loading portfolios…</div>
        )}

        {error && (
          <div className="state-error">⚠ {error}</div>
        )}

        {!loading && !error && portfolios.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#1C2B40", fontSize: 11 }}>
            No portfolios yet. Create your first one.
          </div>
        )}

        {portfolios.map((portfolio) => {
          const value    = portfolio.funds.reduce((s, f) => s + f.value, 0);
          const risk     = riskFromScore(portfolio.diversificationScore);
          const { segments, labels } = buildSectorBar(portfolio.funds);
          const numHoldings = portfolio.funds.reduce((s, f) => s + f.holdings.length, 0);

          return (
            <Link
              key={portfolio._id}
              href={`/portfolio/${portfolio._id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div className={`portfolio-row ${risk.accent === "accent-green" ? "selected" : ""}`}>
                <div className={`row-accent ${risk.accent}`} />
                <div className="row-inner">
                  {/* Name */}
                  <div className="cell-name">
                    <div className="port-name">{portfolio.portfolioName}</div>
                    <div className="port-meta">
                      {portfolio.funds.length} {portfolio.funds.length === 1 ? "fund" : "funds"} · {numHoldings} holdings
                    </div>
                  </div>

                  {/* Value */}
                  <div className="cell-value">
                    <div className="port-value">₹{value.toLocaleString("en-IN")}</div>
                    <div className="port-value-label">Total value</div>
                  </div>

                  {/* Sector mini-bar */}
                  <div className="cell-sector">
                    <div className="sector-bar">
                      {segments.map((seg, i) => (
                        <div
                          key={i}
                          className="sector-bar-seg"
                          style={{ width: `${seg.pct}%`, background: seg.color }}
                        />
                      ))}
                    </div>
                    <div className="sector-labels">
                      {labels.map((l, i) => (
                        <span key={i} className="sector-label">{l.label}</span>
                      ))}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="cell-score">
                    <div className={`score-num ${risk.scoreClass}`}>
                      {portfolio.diversificationScore ?? "—"}
                    </div>
                    <div className="score-denom">/100</div>
                  </div>

                  {/* Risk */}
                  <div className="cell-risk">
                    <span className={`risk-badge ${risk.badge}`}>{risk.level}</span>
                  </div>

                  {/* Menu (···) — clicking the dots shows edit/delete inline */}
                  <div
                    className="cell-menu"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    title="Options"
                  >
                    <span
                      style={{ cursor: "pointer", color: "#384E68", fontSize: 11 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const action = window.prompt(
                          `"${portfolio.portfolioName}" — type edit or delete`
                        );
                        if (action === "edit")
                          window.location.href = `/portfolio/${portfolio._id}/edit`;
                        if (action === "delete")
                          handleDelete(e, portfolio._id);
                      }}
                    >
                      ···
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Add portfolio ghost row */}
        <Link href="/create" className="add-row">
          <span style={{ fontSize: 15, fontWeight: 300, lineHeight: 1 }}>+</span>
          <span>Add another portfolio</span>
        </Link>
      </div>
    </>
  );
}
