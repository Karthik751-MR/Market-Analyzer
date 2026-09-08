const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    stockSymbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    sector: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const fundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Number,
      required: true,
      min: 0,
    },

    holdings: {
      type: [holdingSchema],
      required: true,
      validate: {
        validator: (holdings) => holdings.length > 0,
        message: "Fund must contain at least one holding",
      },
    },
  },
  {
    _id: false,
  },
);

const portfolioSchema = new mongoose.Schema(
  {
    portfolioName: {
      type: String,
      required: true,
      trim: true,
    },

    funds: {
      type: [fundSchema],
      required: true,
      validate: {
        validator: (funds) => funds.length > 0,
        message: "Portfolio must contain at least one fund",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
