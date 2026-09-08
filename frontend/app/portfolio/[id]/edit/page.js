"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PortfolioForm from "../../../../components/PortfolioForm";
import { getPortfolioById, updatePortfolio } from "../../../../lib/api";

export default function EditPortfolioPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id;

  const [portfolio,     setPortfolio]     = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [fetchError,    setFetchError]    = useState("");
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage,  setErrorMessage]  = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getPortfolioById(id);
        setPortfolio(data);
      } catch {
        setFetchError("Unable to load portfolio.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleSubmit(portfolioData) {
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await updatePortfolio(id, portfolioData);
      setSuccessMessage("Portfolio updated.");
      setTimeout(() => router.push(`/portfolio/${id}`), 1200);
    } catch {
      setErrorMessage("Unable to update portfolio. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div className="state-loading">Loading…</div>;

  if (fetchError) {
    return (
      <>
        <div className="state-error">{fetchError}</div>
        <div style={{ padding: "0 20px" }}>
          <Link href="/" className="btn-outline">← Portfolios</Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div>
          <div className="page-title">Edit Portfolio</div>
          <div className="page-subtitle" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 300 }}>
            {portfolio?.portfolioName}
          </div>
        </div>
        <Link href={`/portfolio/${id}`} className="btn-outline">← Back</Link>
      </div>

      <PortfolioForm
        initialData={portfolio}
        onSubmit={handleSubmit}
        submitLabel={isSubmitting ? "Saving…" : "Save Changes"}
        isSubmitting={isSubmitting}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </>
  );
}
