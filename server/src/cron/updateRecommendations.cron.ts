import cron from "node-cron";
import { calculateSongSuggestion } from "../services/suggestion.services.js";

cron.schedule("0 0 * * *", async () => {
    try {
        console.log("⏳ Updating suggestion songs...");

        await calculateSongSuggestion();
        // const users = await prisma.user.findMany({

        //     // where:{
        //     //     role:'USER'  
        //     // },
        //     select: {
        //         user_id: true
        //     }
        // })

        // if (users.length === 0) {
        //     console.log("no users found");
        //     return;
        // }
        // let summary = "";

        // for (const user of users) {

        //     console.log("creating summary...")
        //     summary += await updateRecommendationsSummary(user.user_id); //fix here

        //     if(!summary.length){
        //         console.log(`no summary found for ${user.user_id}`)
        //         continue;
        //     }

        //     console.log(`updating recommendations... for user ${user.user_id}`)
            
        //     await updateRecommendationWithAi(summary,user.user_id);//fix here
        //     summary = "";
        // }


        console.log("✅ suggestion updated");
    } catch (err) {
        console.error("❌ suggestion cron failed", err);
    }
});