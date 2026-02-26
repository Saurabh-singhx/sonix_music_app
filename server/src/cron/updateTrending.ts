import cron from "node-cron";
import { updateTrendingTable } from "../services/trending.services.js";

cron.schedule("0 0 * * *", async () => {
  try {
    await updateTrendingTable();
    console.log("✅ Trending songs updated");
  } catch (err) {
    console.error("❌ Trending cron failed", err);
  }
});
