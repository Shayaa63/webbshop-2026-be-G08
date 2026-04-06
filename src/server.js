import app from "./app.js";
import { connectToDatabase } from "./config/database.js";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT ?? 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
