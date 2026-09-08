const axios = require("axios");

const PYTHON_ANALYTICS_URL = "http://127.0.0.1:8000/analyze/portfolio";

async function analyzePortfolio(portfolio) {
  const response = await axios.post(PYTHON_ANALYTICS_URL, portfolio);

  return response.data;
}

module.exports = {
  analyzePortfolio,
};
