import cron from "node-cron";
import { updateTrendingTable } from "../services/trending.services.js";

cron.schedule("*/1 * * * *", async () => {
  try {
    console.log("⏳ Updating trending songs...");
    await updateTrendingTable();
    console.log("✅ Trending songs updated");
  } catch (err) {
    console.error("❌ Trending cron failed", err);
  }
});
