const Portfolio = require("../models/portfolio.model");

async function savePortfolio(portfolioData) {
  return Portfolio.create(portfolioData);
}

async function getAllPortfolios() {
  return Portfolio.find({});
}

async function getPortfolioById(id) {
  return Portfolio.findById(id);
}

async function updatePortfolio(id, portfolioData) {
  return Portfolio.findByIdAndUpdate(id, portfolioData, { new: true });
}

async function deletePortfolio(id) {
  return Portfolio.findByIdAndDelete(id);
}

module.exports = {
  savePortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
};
