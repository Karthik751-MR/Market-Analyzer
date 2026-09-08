require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = 5000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);

    process.exit(1);
  }
}

startServer();
