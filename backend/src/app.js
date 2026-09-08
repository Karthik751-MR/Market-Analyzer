const express = require("express");
const cors = require("cors");

const { analyzePortfolio } = require("./services/analytics.service");
const {
  savePortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} = require("./services/portfolio.service");
const { validatePortfolioBody } = require("./middleware/validate");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

app.post("/api/portfolio/analyze", validatePortfolioBody, async (req, res) => {
  try {
    const result = await analyzePortfolio(req.body);

    res.status(200).json(result);
  } catch (error) {
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT"
    ) {
      return res.status(503).json({
        error: "Analytics service unavailable",
      });
    }

    res.status(500).json({
      error: "Portfolio analysis failed",
    });
  }
});

app.post("/api/portfolios", validatePortfolioBody, async (req, res) => {
  try {
    const savedPortfolio = await savePortfolio(req.body);

    res.status(201).json(savedPortfolio);
  } catch (error) {
    res.status(500).json({
      error: "Failed to save portfolio",
    });
  }
});

app.get("/api/portfolios", async (req, res) => {
  try {
    const portfolios = await getAllPortfolios();

    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch portfolios",
    });
  }
});

app.get("/api/portfolios/:id", async (req, res) => {
  try {
    const portfolio = await getPortfolioById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        error: "Portfolio not found",
      });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch portfolio",
    });
  }
});

app.put("/api/portfolios/:id", validatePortfolioBody, async (req, res) => {
  try {
    const updatedPortfolio = await updatePortfolio(req.params.id, req.body);
    if (!updatedPortfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    res.status(200).json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ error: "Failed to update portfolio" });
  }
});

app.delete("/api/portfolios/:id", async (req, res) => {
  try {
    const deletedPortfolio = await deletePortfolio(req.params.id);
    if (!deletedPortfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete portfolio" });
  }
});

module.exports = app;
