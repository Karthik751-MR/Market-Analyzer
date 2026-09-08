const mongoose = require("mongoose");

const { connectDatabase } = require("../src/config/database");

describe("MongoDB configuration", () => {
  test("connectDatabase uses MONGODB_URI", async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";

    const connectSpy = jest
      .spyOn(mongoose, "connect")
      .mockResolvedValue(mongoose);

    await connectDatabase();

    expect(connectSpy).toHaveBeenCalledWith("mongodb://localhost:27017/test");

    connectSpy.mockRestore();
  });
  test("connects to MongoDB using MONGODB_URI", async () => {
    process.env.MONGODB_URI = "mongodb://test-uri";

    const connectSpy = jest.spyOn(mongoose, "connect").mockResolvedValue({});

    await connectDatabase();

    expect(connectSpy).toHaveBeenCalledWith("mongodb://test-uri");

    connectSpy.mockRestore();
  });
});
