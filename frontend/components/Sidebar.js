"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Helper to determine if a nav item is active
  const isActive = (path) => {
    if (path === "/" && pathname !== "/" && !pathname.startsWith("/portfolio/")) {
      return false;
    }
    if (path === "/") {
      return pathname === "/" || pathname.startsWith("/portfolio/") || pathname === "/create";
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">F</div>
        <span className="logo-name">folio</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Workspace</div>
        <Link href="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          Portfolios
          <span className="nav-count" id="portfolio-count">—</span>
        </Link>
        <Link href="/analytics" className={`nav-item ${isActive("/analytics") ? "active" : ""}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Analytics
        </Link>

        <div className="nav-section-label mt">Market</div>
        <Link href="/live-prices" className={`nav-item ${isActive("/live-prices") ? "active" : ""}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
          Live Prices
        </Link>
        <Link href="/watchlist" className={`nav-item ${isActive("/watchlist") ? "active" : ""}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          Watchlist
        </Link>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">KR</div>
        <div>
          <div className="user-name">Karthik R</div>
          <div className="user-role">Personal</div>
        </div>
      </div>
    </aside>
  );
}
