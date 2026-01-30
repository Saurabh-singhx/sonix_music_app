import cron from "node-cron";
import { updateRecommendationsSummary, updateRecommendationWithAi } from "../services/recommendation.services.js";
import prisma from "../lib/prisma.js";

cron.schedule("0 */3 * * *", async () => {
    try {
        console.log("⏳ Updating recommendations songs...");


        const users = await prisma.user.findMany({

            // where:{
            //     role:'USER'  
            // },
            select: {
                user_id: true
            }
        })

        if (users.length === 0) {
            console.log("no users found");
            return;
        }
        let summary = "";

        for (const user of users) {
            summary += await updateRecommendationsSummary(user.user_id);

            if(!summary){
                continue;
            }
            await updateRecommendationWithAi(summary,user.user_id);
            summary = "";
        }


        console.log("✅ recommendations updated");
    } catch (err) {
        console.error("❌ recommendation cron failed", err);
    }
});