from fastapi import FastAPI, HTTPException

from app.portfolio.analyzer import analyze_portfolio

app = FastAPI(
    title="NextGen Market Analyzer",
    description="Portfolio analysis API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {"message": "NextGen Market Analyzer API is running"}


@app.post("/analyze/portfolio")
def analyze_portfolio_endpoint(portfolio: dict):
    try:
        return analyze_portfolio(portfolio)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
