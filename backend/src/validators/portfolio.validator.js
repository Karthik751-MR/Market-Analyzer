/**
 * Validation rules for portfolio request bodies.
 *
 * Rules mirror the Python analytics engine validation so errors are caught
 * at the Express layer before proxying to the analytics service.
 */

/**
 * Validate a portfolio object. Returns an array of error strings.
 * An empty array means the portfolio is valid.
 *
 * @param {unknown} portfolio
 * @returns {string[]}
 */
function validatePortfolio(portfolio) {
  const errors = [];

  if (!portfolio || typeof portfolio !== "object" || Array.isArray(portfolio)) {
    return ["Portfolio must be a JSON object."];
  }

  if (!Array.isArray(portfolio.funds)) {
    errors.push("'funds' must be an array.");
    return errors;
  }

  if (portfolio.funds.length === 0) {
    errors.push("Portfolio must contain at least one fund.");
  }

  const fundNames = new Set();

  portfolio.funds.forEach((fund, fundIndex) => {
    const prefix = `Fund ${fundIndex + 1}`;

    if (!fund || typeof fund !== "object" || Array.isArray(fund)) {
      errors.push(`${prefix}: must be an object.`);
      return;
    }

    if (!fund.name || typeof fund.name !== "string" || !fund.name.trim()) {
      errors.push(`${prefix}: name must be a non-empty string.`);
    } else if (fundNames.has(fund.name)) {
      errors.push(`${prefix}: duplicate fund name '${fund.name}'.`);
    } else {
      fundNames.add(fund.name);
    }

    if (typeof fund.value !== "number" || fund.value <= 0) {
      errors.push(`${prefix}: value must be a positive number.`);
    }

    if (!Array.isArray(fund.holdings)) {
      errors.push(`${prefix}: 'holdings' must be an array.`);
      return;
    }

    if (fund.holdings.length === 0) {
      errors.push(`${prefix}: must contain at least one holding.`);
    }

    let totalWeight = 0;
    const stockSymbols = new Set();

    fund.holdings.forEach((holding, holdingIndex) => {
      const hPrefix = `${prefix} — Holding ${holdingIndex + 1}`;

      if (!holding || typeof holding !== "object" || Array.isArray(holding)) {
        errors.push(`${hPrefix}: must be an object.`);
        return;
      }

      if (
        !holding.stockSymbol ||
        typeof holding.stockSymbol !== "string" ||
        !holding.stockSymbol.trim()
      ) {
        errors.push(`${hPrefix}: stockSymbol must be a non-empty string.`);
      } else if (stockSymbols.has(holding.stockSymbol)) {
        errors.push(
          `${hPrefix}: duplicate stock symbol '${holding.stockSymbol}'.`
        );
      } else {
        stockSymbols.add(holding.stockSymbol);
      }

      if (
        typeof holding.weight !== "number" ||
        holding.weight <= 0 ||
        holding.weight > 100
      ) {
        errors.push(`${hPrefix}: weight must be a number between 0 and 100.`);
      } else {
        totalWeight += holding.weight;
      }

      if (
        !holding.sector ||
        typeof holding.sector !== "string" ||
        !holding.sector.trim()
      ) {
        errors.push(`${hPrefix}: sector must be a non-empty string.`);
      }
    });

    if (
      fund.holdings.length > 0 &&
      Math.abs(totalWeight - 100) > 1e-9
    ) {
      errors.push(
        `${prefix}: holding weights must total 100% (currently ${totalWeight}%).`
      );
    }
  });

  return errors;
}

module.exports = { validatePortfolio };
