def calculate_diversification_score(overlap_score: float, sector_score: float) -> float:

    return 0.5 * overlap_score + 0.5 * sector_score
