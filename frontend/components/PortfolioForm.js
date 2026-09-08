"use client";

import { useState, useEffect } from "react";

export default function PortfolioForm({
  initialData,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  successMessage = "",
  errorMessage = "",
}) {
  const [portfolioName, setPortfolioName] = useState(initialData?.portfolioName || "");
  const [fundName,      setFundName]      = useState(initialData?.funds?.[0]?.name  || "");
  const [fundValue,     setFundValue]     = useState(initialData?.funds?.[0]?.value || "");
  const [holdings, setHoldings] = useState(
    initialData?.funds?.[0]?.holdings || [{ stockSymbol: "", weight: "", sector: "" }]
  );
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setPortfolioName(initialData.portfolioName || "");
      setFundName(initialData.funds?.[0]?.name  || "");
      setFundValue(initialData.funds?.[0]?.value || "");
      setHoldings(initialData.funds?.[0]?.holdings || [{ stockSymbol: "", weight: "", sector: "" }]);
    }
  }, [initialData]);

  function addHolding()       { setHoldings([...holdings, { stockSymbol: "", weight: "", sector: "" }]); }
  function removeHolding(idx) { if (holdings.length === 1) return; setHoldings(holdings.filter((_, i) => i !== idx)); }
  function updateHolding(idx, field, value) {
    setHoldings(holdings.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  }

  function validate() {
    const errs = [];
    if (!portfolioName.trim()) errs.push("Portfolio name is required");
    if (!fundName.trim())      errs.push("Fund name is required");
    if (!fundValue || Number(fundValue) <= 0) errs.push("Fund value must be greater than 0");
    let total = 0;
    holdings.forEach((h, i) => {
      if (!h.stockSymbol?.trim()) errs.push(`Holding ${i + 1}: Stock symbol required`);
      if (!h.sector?.trim())      errs.push(`Holding ${i + 1}: Sector required`);
      const w = Number(h.weight);
      if (h.weight === "" || w <= 0 || w > 100) errs.push(`Holding ${i + 1}: Weight must be 1–100`);
      total += w;
    });
    if (holdings.length > 0 && Math.abs(total - 100) > 1e-9)
      errs.push(`Weights must total 100% (currently ${total}%)`);
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      portfolioName,
      funds: [{
        name: fundName,
        value: Number(fundValue),
        holdings: holdings.map((h) => ({
          stockSymbol: h.stockSymbol.toUpperCase(),
          weight: Number(h.weight),
          sector: h.sector,
        })),
      }],
    });
  }

  const totalWeight = holdings.reduce((s, h) => s + (Number(h.weight) || 0), 0);
  const weightOk    = Math.abs(totalWeight - 100) < 1e-9;
  const weightClass = weightOk ? "weight-ok" : totalWeight > 100 ? "weight-over" : "weight-under";

  return (
    <form onSubmit={handleSubmit} noValidate className="form-page">

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="form-errors">
          Please fix the following:
          <ul>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="state-success" style={{ marginBottom: 14 }}>✓ {successMessage}</div>
      )}
      {errorMessage && (
        <div className="state-error" style={{ marginBottom: 14 }}>⚠ {errorMessage}</div>
      )}

      {/* Portfolio details */}
      <div className="form-section">
        <div className="form-section-title">Portfolio Details</div>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label" htmlFor="portfolioName">Portfolio Name</label>
          <input
            id="portfolioName"
            className="form-input"
            type="text"
            placeholder="e.g. Growth Equity"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
          />
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="fundName">Fund Name</label>
            <input
              id="fundName"
              className="form-input"
              type="text"
              placeholder="e.g. Bluechip Fund"
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="fundValue">Fund Value (₹)</label>
            <input
              id="fundValue"
              className="form-input"
              type="number"
              placeholder="e.g. 1000000"
              value={fundValue}
              onChange={(e) => setFundValue(e.target.value)}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="form-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid rgba(255,255,255,.04)" }}>
          <div className="form-section-title" style={{ margin: 0, padding: 0, border: 0 }}>Holdings</div>
          <span className={`weight-indicator ${weightClass}`}>
            {weightOk ? "✓" : "⚠"} {totalWeight}% / 100%
          </span>
        </div>

        {holdings.map((h, idx) => (
          <div key={idx} className="holding-block">
            <div className="holding-block-header">
              <span className="holding-block-num">Holding {idx + 1}</span>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeHolding(idx)}
                disabled={holdings.length === 1}
              >
                ✕ Remove Holding
              </button>
            </div>
            <div className="holding-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor={`stockSymbol-${idx}`}>Stock Symbol</label>
                <input
                  id={`stockSymbol-${idx}`}
                  className="form-input"
                  type="text"
                  placeholder="e.g. INFY"
                  value={h.stockSymbol}
                  onChange={(e) => updateHolding(idx, "stockSymbol", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor={`weight-${idx}`}>Weight (%)</label>
                <input
                  id={`weight-${idx}`}
                  className="form-input"
                  type="number"
                  placeholder="30"
                  value={h.weight}
                  onChange={(e) => updateHolding(idx, "weight", e.target.value)}
                  min="0" max="100"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor={`sector-${idx}`}>Sector</label>
                <input
                  id={`sector-${idx}`}
                  className="form-input"
                  type="text"
                  placeholder="e.g. IT"
                  value={h.sector}
                  onChange={(e) => updateHolding(idx, "sector", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn-add-holding" onClick={addHolding}>
          + Add Holding
        </button>
      </div>

      {/* Submit */}
      <div className="form-submit-row">
        <button
          id="submit-portfolio"
          type="submit"
          className="btn-gold"
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? .6 : 1 }}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
