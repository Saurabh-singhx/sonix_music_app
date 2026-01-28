import cron from "node-cron";
import { updateRecommendations } from "../services/recommendation.services.js";
import prisma from "../lib/prisma.js";

cron.schedule("0 */3 * * *", async () => {
    try {
        console.log("⏳ Updating recommendations songs...");


        const users = await prisma.user.findMany({
            select: {
                user_id: true
            }
        })

        if (users.length === 0) {
            console.log("no users found");
            return;
        }


        for (const user of users) {
            await updateRecommendations(user.user_id);
        }


        console.log("✅ recommendations updated");
    } catch (err) {
        console.error("❌ recommendation cron failed", err);
    }
});