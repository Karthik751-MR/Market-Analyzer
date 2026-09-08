<div align="center">

<img src="https://img.shields.io/badge/status-active%20development-22c55e?style=flat-square" />
<img src="https://img.shields.io/badge/stack-Next.js%20%7C%20Node.js%20%7C%20FastAPI-0ea5e9?style=flat-square" />
<img src="https://img.shields.io/badge/license-MIT-a855f7?style=flat-square" />
<img src="https://img.shields.io/badge/PRs-welcome-f59e0b?style=flat-square" />

# NextGen Market Analyzer

**See what your portfolio is actually doing — not what it looks like it's doing.**

A full-stack investment analysis platform that quantifies diversification, exposes hidden concentration risk, and turns raw holdings data into actionable portfolio intelligence.

[Portfolio Dashboard](#portfolio-dashboard) · [Analytics Engine](#analytics-engine) · [Quick Start](#quick-start) · [Roadmap](#roadmap)

</div>

---

## The Problem This Solves

Most investors think they're diversified. They have multiple funds, multiple sectors, multiple holdings. But when you look closely, Fund A holds Infosys, Fund B holds Infosys, and Fund C holds Infosys — and suddenly your "diversified" portfolio is 40% one company.

**NextGen Market Analyzer surfaces exactly this.** It analyzes your portfolio at the aggregate level, not fund-by-fund, and gives you a single diversification score backed by real math.

---

## Screenshots

### Portfolio Home — Fund & Holdings Overview

> *Replace this with a screenshot of `folio_portfolio_list_home.html`*

```
[ Drop screenshot here — folio_portfolio_list_home.html ]
Screenshot: 1280×800 recommended · PNG or WebP
```

<!-- To add your screenshot:
     1. Open folio_portfolio_list_home.html in a browser
     2. Take a full-page screenshot
     3. Save as docs/screenshots/portfolio-home.png
     4. Replace the block above with:
        ![Portfolio Home](docs/screenshots/portfolio-home.png)
-->

---

### Analytics Dashboard — Diversification & Risk Breakdown

> *Replace this with a screenshot of `folio_analytics_dashboard.html`*

```
[ Drop screenshot here — folio_analytics_dashboard.html ]
Screenshot: 1280×800 recommended · PNG or WebP
```

<!-- To add your screenshot:
     1. Open folio_analytics_dashboard.html in a browser
     2. Take a full-page screenshot
     3. Save as docs/screenshots/analytics-dashboard.png
     4. Replace the block above with:
        ![Analytics Dashboard](docs/screenshots/analytics-dashboard.png)
-->

---

## What It Calculates

| Metric | What It Tells You |
|---|---|
| **Diversification Score** | A 0–100 composite score combining overlap and sector distribution |
| **HHI (Herfindahl-Hirschman Index)** | How concentrated your holdings are — lower is more spread out |
| **Sector Allocation** | Breakdown of exposure across IT, Banking, Energy, etc. |
| **Overlap Score** | How much the same stocks appear across multiple funds |
| **Risk Classification** | LOW / MODERATE / HIGH based on concentration patterns |
| **Top Holdings** | Which individual stocks dominate the aggregate portfolio |

### The Diversification Formula

The analytics engine evaluates your full portfolio — not each fund in isolation — using:

```
Diversification Score  =  (0.5 × Overlap Score)  +  (0.5 × Sector Score)
```

**Example:** Three funds that all hold Infosys will show a low overlap score regardless of how they're labeled. That's the insight.

---

## Architecture

```
┌──────────────────────────────────────┐
│           Next.js Frontend           │
│                                      │
│  Portfolio List  →  Create  →  Dashboard  │
└──────────────────────┬───────────────┘
                       │  HTTP / JSON
                       ▼
┌──────────────────────────────────────┐
│        Node.js / Express API         │
│                                      │
│  Portfolio CRUD · Validation · CORS  │
│  Analytics Proxy                     │
└──────────────────────┬───────────────┘
                       │  planned analytics calls
                       ▼
┌──────────────────────────────────────┐
│      Python / FastAPI Analytics      │
│                                      │
│  HHI · Diversification Score         │
│  Sector Allocation · Risk Analysis   │
└──────────────────────────────────────┘
```

The Node backend handles all CRUD and validation. Heavy portfolio math is delegated to the Python analytics engine so each layer stays focused on what it does best.

---

## Project Structure

```
nextgen-market-analyzer/
│
├── frontend/
│   ├── app/
│   │   ├── page.js                    # Home — portfolio list
│   │   ├── create/
│   │   │   ├── page.js                # Portfolio creation flow
│   │   │   └── page.test.js
│   │   └── portfolio/
│   │       └── [id]/                  # Portfolio detail & dashboard
│   ├── components/
│   └── next.config.mjs
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   └── services/
│   └── tests/
│
├── analytics/                         # Python analytics service
│   ├── main.py
│   ├── requirements.txt
│   └── services/
│
└── docs/
    └── screenshots/
```

---

## Tech Stack

### Frontend
- **Next.js** + React — file-based routing, SSR-ready
- **Fraunces** — portfolio names and identity display
- **JetBrains Mono** — financial values, percentages, metrics
- **Inter** — navigation, controls, general UI
- Jest + React Testing Library

### Backend
- **Node.js** + Express — REST API, validation, CORS
- Jest + Supertest

### Analytics Service *(in progress)*
- **Python** + FastAPI + Uvicorn
- NumPy, Pandas

### Planned
- Historical & live market data
- Sharpe Ratio, Volatility, Max Drawdown, Beta

---

## Quick Start

### Prerequisites

```bash
node --version    # 18+ recommended
npm --version
python3 --version # 3.11+ for the analytics service
```

### 1. Clone

```bash
git clone <your-repository-url>
cd nextgen-market-analyzer
```

### 2. Install

```bash
# Frontend
cd frontend && npm install

# Backend (separate terminal)
cd backend && npm install
```

### 3. Run

```bash
# Frontend — http://localhost:3000
cd frontend && npm run dev

# Backend
cd backend && npm run dev   # or: npm start
```

### 4. Create Your First Portfolio

Navigate to `http://localhost:3000`, click **Create Portfolio**, and fill in:

```json
{
  "name": "My Growth Portfolio",
  "funds": [
    {
      "name": "Growth Fund",
      "value": 1000000,
      "holdings": [
        { "stockSymbol": "INFY",     "weight": 30, "sector": "IT"      },
        { "stockSymbol": "HDFCBANK", "weight": 70, "sector": "Banking" }
      ]
    }
  ]
}
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/portfolios` | List all portfolios |
| `POST` | `/api/portfolios` | Create a portfolio |
| `GET` | `/api/portfolios/:id` | Get portfolio detail |
| `PUT` | `/api/portfolios/:id` | Update a portfolio |
| `DELETE` | `/api/portfolios/:id` | Delete a portfolio |
| `POST` | `/api/portfolios/:id/analyze` | Run analytics *(planned)* |

**Analytics response shape *(planned)*:**

```json
{
  "diversificationScore": 72,
  "hhi": 0.18,
  "riskLevel": "MODERATE",
  "sectorAllocation": {
    "IT": 45,
    "Banking": 30,
    "Energy": 25
  },
  "topHoldings": [
    { "symbol": "INFY", "aggregateWeight": 28.5 }
  ]
}
```

---

## Testing

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && npm test

# Specific backend test file
cd backend && npm test -- cors.test.js
```

**Frontend coverage includes:** portfolio rendering, holding add/remove, minimum-holding guard, field updates, payload construction, and backend submission.

---

## Development Workflow

```
Write test  →  Confirm failure  →  Implement  →  Pass tests  →  Manual verify  →  Commit
```

Keep the cycle tight. The test suite is the source of truth for expected behavior — check it before assuming something is broken or working.

---

## Design System

The UI uses a **dark financial workspace** — not a SaaS dashboard.

- Numbers are the primary visual element, not decorations around content.
- Risk communicates through color; concentration through width (horizontal bars).
- Thin borders and whitespace carry hierarchy instead of nested cards.
- Fraunces for identity, JetBrains Mono for numbers, Inter for everything else.

---

## Roadmap

- [x] Portfolio creation UI
- [x] Dynamic holdings management
- [x] Frontend test suite
- [x] Backend portfolio submission
- [x] CORS between frontend and backend
- [x] Portfolio dashboard UI
- [ ] Complete portfolio CRUD (edit, delete)
- [ ] Portfolio validation & loading/error states
- [ ] Python FastAPI analytics engine
- [ ] HHI and concentration calculations
- [ ] Sector allocation engine
- [ ] Diversification scoring
- [ ] Risk classification
- [ ] Analytics dashboard with live data
- [ ] Market-data integration
- [ ] Sharpe Ratio, Volatility, Max Drawdown, Beta
- [ ] Production deployment

---

## Contributing

Contributions are welcome. Before opening a PR:

1. Branch off `main` with a focused name — `feature/analytics-engine`, `fix/portfolio-validation`, `test/hhi-calculation`
2. Keep the change scoped to one feature or fix
3. Add or update tests if behavior changes
4. Run both frontend and backend test suites
5. Manually verify in the browser
6. Describe what changed and why in the PR description

---

## License

MIT. See [`LICENSE`](LICENSE).

---

<div align="center">

Built for investors who want to know what their portfolio is *actually* doing.

</div>
