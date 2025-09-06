import { getPool } from "./db.js";
import { createServer } from "./server.js";

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  try {
    await getPool(); // connect once at startup
    const app = createServer();
    app.listen(PORT, () => console.log("🚀 Server running on port 3000"));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

bootstrap();
