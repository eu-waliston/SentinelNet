import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`
╔══════════════════════════════════╗
║          SENTINELNET API         ║
╠══════════════════════════════════╣
║ Environment: ${env.nodeEnv.padEnd(18)}║
║ Port:        ${String(env.port).padEnd(18)}║
║ Status:      ONLINE              ║
╚══════════════════════════════════╝
    `);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start SentinelNet:", error);
  process.exit(1);
});