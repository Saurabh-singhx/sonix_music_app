import cron from "node-cron";
import { calculateSongSuggestion } from "../services/suggestion.services.js";

cron.schedule("0 0 * * *", async () => {
    try {
        await calculateSongSuggestion();

        console.log("✅ suggestion updated");
    } catch (err) {
        console.error("❌ suggestion cron failed", err);
    }
});