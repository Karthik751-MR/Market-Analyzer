jest.mock("../src/config/database", () => ({
  connectDatabase: jest.fn().mockResolvedValue(),
}));

jest.mock("../src/app", () => ({
  listen: jest.fn(),
}));

const { connectDatabase } = require("../src/config/database");
const app = require("../src/app");

describe("Server startup", () => {
  test("connects to MongoDB before starting the server", async () => {
    jest.isolateModules(() => {
      require("../src/server");
    });

    // Give startServer() time to await connectDatabase()
    await new Promise((resolve) => setImmediate(resolve));

    expect(connectDatabase).toHaveBeenCalled();

    expect(app.listen).toHaveBeenCalledWith(5000, expect.any(Function));
  });
});
