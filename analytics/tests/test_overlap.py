from app.portfolio.overlap import (
    calculate_pairwise_overlap,
    calculate_all_overlaps,
    calculate_average_overlap,
    calculate_overlap_score,
)


def test_fund_a_and_b_overlap():

    fund_a = {
        "name": "Fund A",
        "value": 1000000,
        "holdings": [
            {"stockSymbol": "ITC", "weight": 20, "sector": "FMCG"},
            {"stockSymbol": "INFY", "weight": 30, "sector": "IT"},
            {"stockSymbol": "HDFC", "weight": 50, "sector": "Banking"},
        ],
    }

    fund_b = {
        "name": "Fund B",
        "value": 1000000,
        "holdings": [
            {"stockSymbol": "INFY", "weight": 40, "sector": "IT"},
            {"stockSymbol": "RELIANCE", "weight": 30, "sector": "Energy"},
            {"stockSymbol": "HDFC", "weight": 30, "sector": "Banking"},
        ],
    }

    # HDFC symbol must match for overlap.
    # Use HDFC instead of HDFCBANK consistently.
    fund_a["holdings"][2]["stockSymbol"] = "HDFC"

    result = calculate_pairwise_overlap(fund_a, fund_b)

    assert result == 60


def test_all_sample_overlaps():

    funds = [
        {
            "name": "Fund A",
            "value": 1000000,
            "holdings": [
                {"stockSymbol": "ITC", "weight": 20, "sector": "FMCG"},
                {"stockSymbol": "INFY", "weight": 30, "sector": "IT"},
                {"stockSymbol": "HDFC", "weight": 50, "sector": "Banking"},
            ],
        },
        {
            "name": "Fund B",
            "value": 1000000,
            "holdings": [
                {"stockSymbol": "INFY", "weight": 40, "sector": "IT"},
                {"stockSymbol": "RELIANCE", "weight": 30, "sector": "Energy"},
                {"stockSymbol": "HDFC", "weight": 30, "sector": "Banking"},
            ],
        },
        {
            "name": "Fund C",
            "value": 500000,
            "holdings": [
                {"stockSymbol": "TCS", "weight": 50, "sector": "IT"},
                {"stockSymbol": "INFY", "weight": 30, "sector": "IT"},
                {"stockSymbol": "ITC", "weight": 20, "sector": "FMCG"},
            ],
        },
    ]

    results = calculate_all_overlaps(funds)

    assert results[0]["overlap"] == 60
    assert results[1]["overlap"] == 50
    assert results[2]["overlap"] == 30

    average = calculate_average_overlap(results)

    assert round(average, 2) == 46.67

    score = calculate_overlap_score(average)

    assert round(score, 2) == 53.33
