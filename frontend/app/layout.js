import { Fraunces, JetBrains_Mono } from "next/font/google";
import Sidebar from "../components/Sidebar";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Folio — Portfolio Analyzer",
  description:
    "Analyze your investment portfolios — diversification, sector exposure, fund overlap, and risk scoring.",
};

const TICKER = [
  { label: "NIFTY 50",   value: "24,836.35", change: "▲ 0.43%", up: true },
  { label: "SENSEX",     value: "81,722.11", change: "▲ 0.38%", up: true },
  { label: "NIFTY BANK", value: "52,441.60", change: "▼ 0.21%", up: false },
  { label: "NIFTY IT",   value: "38,924.80", change: "▲ 1.12%", up: true },
  { label: "₹/USD",      value: "83.42",     change: "▼ 0.06%", up: false },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div className="app-shell">
          {/* macOS window chrome */}
          <div className="window-chrome">
            <div className="window-dots">
              <span className="window-dot dot-red" />
              <span className="window-dot dot-amber" />
              <span className="window-dot dot-green" />
            </div>
            <div className="window-url">folio.app / portfolios</div>
          </div>

          {/* Market ticker strip */}
          <div className="ticker-bar">
            {TICKER.map((t) => (
              <div key={t.label} className="ticker-item">
                <span className="ticker-label">{t.label}</span>
                <span className="ticker-value">{t.value}</span>
                <span className={t.up ? "ticker-up" : "ticker-dn"}>{t.change}</span>
              </div>
            ))}
          </div>

          {/* Sidebar + main */}
          <div className="body-layout">
            {/* Sidebar */}
            <Sidebar />

            {/* Page content */}
            <main className="main-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
