from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_analyze_portfolio_returns_analysis():
    portfolio = {
        "portfolioName": "Test Portfolio",
        "funds": [
            {
                "name": "Fund A",
                "value": 1000000,
                "holdings": [
                    {"stockSymbol": "INFY", "weight": 50, "sector": "IT"},
                    {"stockSymbol": "HDFCBANK", "weight": 50, "sector": "Banking"},
                ],
            }
        ],
    }

    response = client.post("/analyze/portfolio", json=portfolio)

    assert response.status_code == 200

    data = response.json()

    assert data["portfolioValue"] == 1000000
    assert "overlap" in data
    assert "sectors" in data
    assert "hhi" in data
    assert "sectorScore" in data
    assert "diversificationScore" in data


def test_analyze_portfolio_rejects_invalid_portfolio():
    portfolio = {"portfolioName": "Invalid Portfolio", "funds": []}

    response = client.post("/analyze/portfolio", json=portfolio)

    assert response.status_code == 400
