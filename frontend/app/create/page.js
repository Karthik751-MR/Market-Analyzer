"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PortfolioForm from "../../components/PortfolioForm";
import { createPortfolio } from "../../lib/api";



export default function CreatePortfolioPage() {

  const router = useRouter();
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage,  setErrorMessage]  = useState("");

  async function handleSubmit(portfolioData) {
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const created = await createPortfolio(portfolioData);
      setSuccessMessage("Portfolio created.");
      setTimeout(() => router.push(`/portfolio/${created._id}`), 1200);
    } catch {
      setErrorMessage("Unable to create portfolio. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div>
          <div className="page-title">New Portfolio</div>
          <div className="page-subtitle">Configure your portfolio funds and holdings</div>
        </div>
        <Link href="/" className="btn-outline">← Back</Link>
      </div>

      <PortfolioForm
        onSubmit={handleSubmit}
        submitLabel={isSubmitting ? "Creating…" : "Create Portfolio"}
        isSubmitting={isSubmitting}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </>
  );
}
