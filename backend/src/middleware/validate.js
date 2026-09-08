const { validatePortfolio } = require("../validators/portfolio.validator");

/**
 * Express middleware that validates a portfolio request body.
 *
 * Returns 400 with a list of validation errors if the body is invalid,
 * otherwise calls next().
 */
function validatePortfolioBody(req, res, next) {
  const errors = validatePortfolio(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Invalid portfolio data.",
      details: errors,
    });
  }

  next();
}

module.exports = { validatePortfolioBody };
