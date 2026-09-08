from typing import Any

from .validation import validate_portfolio
from .overlap import (
    calculate_all_overlaps,
    calculate_average_overlap,
    calculate_overlap_score,
)
from .sector import calculate_sector_exposure
from .hhi import (
    calculate_hhi,
    calculate_sector_score,
)
from .scoring import calculate_diversification_score


def analyze_portfolio(portfolio: dict[str, Any]) -> dict[str, Any]:

    # 1. Validate input
    validate_portfolio(portfolio)

    funds = portfolio["funds"]

    # 2. Total portfolio value
    total_value = sum(fund["value"] for fund in funds)

    # 3. Fund overlap
    pairwise_overlaps = calculate_all_overlaps(funds)

    average_overlap = calculate_average_overlap(pairwise_overlaps)

    overlap_score = calculate_overlap_score(average_overlap)

    # 4. Sector exposure
    sector_exposure = calculate_sector_exposure(funds)

    # 5. HHI
    hhi = calculate_hhi(sector_exposure)

    # 6. Sector score
    sector_score = calculate_sector_score(hhi)

    # 7. Final diversification score
    diversification_score = calculate_diversification_score(overlap_score, sector_score)

    return {
        "portfolioValue": total_value,
        "overlap": {
            "pairs": pairwise_overlaps,
            "averageOverlap": round(average_overlap, 2),
            "overlapScore": round(overlap_score, 2),
        },
        "sectors": sector_exposure,
        "hhi": round(hhi, 4),
        "sectorScore": round(sector_score, 2),
        "diversificationScore": round(diversification_score, 2),
    }
