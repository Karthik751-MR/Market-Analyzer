import json
from pathlib import Path

import pytest

from app.portfolio.analyzer import analyze_portfolio
from app.portfolio.validation import validate_portfolio

SAMPLE_PATH = (
    Path(__file__).resolve().parents[2] / "data" / "samples" / "sample-portfolio.json"
)


def load_sample():

    with open(SAMPLE_PATH, "r", encoding="utf-8") as file:

        return json.load(file)


def test_sample_portfolio_analysis():

    portfolio = load_sample()

    result = analyze_portfolio(portfolio)

    assert result["portfolioValue"] == 2500000

    assert result["overlap"]["averageOverlap"] == 46.67

    assert result["overlap"]["overlapScore"] == 53.33

    assert result["sectors"]["IT"] == 44.0
    assert result["sectors"]["Banking"] == 32.0
    assert result["sectors"]["FMCG"] == 12.0
    assert result["sectors"]["Energy"] == 12.0

    assert result["hhi"] == 0.3248

    assert result["sectorScore"] == 67.52

    assert result["diversificationScore"] == 60.43


def test_invalid_holdings_total():

    portfolio = load_sample()

    portfolio["funds"][0]["holdings"][0]["weight"] = 10

    with pytest.raises(ValueError):
        validate_portfolio(portfolio)


def test_negative_fund_value():

    portfolio = load_sample()

    portfolio["funds"][0]["value"] = -100000

    with pytest.raises(ValueError):
        validate_portfolio(portfolio)


def test_duplicate_stock():

    portfolio = load_sample()

    portfolio["funds"][0]["holdings"][1]["stockSymbol"] = "ITC"

    with pytest.raises(ValueError):
        validate_portfolio(portfolio)


def test_duplicate_fund():

    portfolio = load_sample()

    portfolio["funds"][1]["name"] = "Fund A"

    with pytest.raises(ValueError):
        validate_portfolio(portfolio)
