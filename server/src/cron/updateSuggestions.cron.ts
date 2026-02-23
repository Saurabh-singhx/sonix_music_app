import cron from "node-cron";
import { calculateSongSuggestion } from "../services/suggestion.services.js";

cron.schedule("*/5 * * * *", async () => {
    try {
        console.log("⏳ Updating suggestion songs...");

        await calculateSongSuggestion();

        console.log("✅ suggestion updated");
    } catch (err) {
        console.error("❌ suggestion cron failed", err);
    }
});