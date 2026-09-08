const mongoose = require("mongoose");

const Portfolio = require("../src/models/portfolio.model");

describe("Portfolio model", () => {
  test("creates a portfolio with funds and holdings", () => {
    const portfolio = new Portfolio({
      portfolioName: "Test Portfolio",
      funds: [
        {
          name: "Fund A",
          value: 1000000,
          holdings: [
            {
              stockSymbol: "INFY",
              weight: 50,
              sector: "IT",
            },
            {
              stockSymbol: "HDFCBANK",
              weight: 50,
              sector: "Banking",
            },
          ],
        },
      ],
    });

    expect(portfolio.portfolioName).toBe("Test Portfolio");
    expect(portfolio.funds).toHaveLength(1);
    expect(portfolio.funds[0].name).toBe("Fund A");
    expect(portfolio.funds[0].value).toBe(1000000);
    expect(portfolio.funds[0].holdings).toHaveLength(2);
    expect(portfolio.funds[0].holdings[0].stockSymbol).toBe("INFY");
  });
  test("rejects a portfolio without a portfolio name", async () => {
    const portfolio = new Portfolio({
      funds: [
        {
          name: "Fund A",
          value: 1000000,
          holdings: [
            {
              stockSymbol: "INFY",
              weight: 100,
              sector: "IT",
            },
          ],
        },
      ],
    });

    await expect(portfolio.validate()).rejects.toThrow();
  });

  test("rejects a holding with weight greater than 100", async () => {
    const portfolio = new Portfolio({
      portfolioName: "Invalid Portfolio",
      funds: [
        {
          name: "Fund A",
          value: 1000000,
          holdings: [
            {
              stockSymbol: "INFY",
              weight: 101,
              sector: "IT",
            },
          ],
        },
      ],
    });

    await expect(portfolio.validate()).rejects.toThrow();
  });

  test("rejects a fund without holdings", async () => {
    const portfolio = new Portfolio({
      portfolioName: "Invalid Portfolio",
      funds: [
        {
          name: "Fund A",
          value: 1000000,
          holdings: [],
        },
      ],
    });

    await expect(portfolio.validate()).rejects.toThrow();
  });
});
