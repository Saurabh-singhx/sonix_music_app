import { Worker } from "bullmq";
import { redisConnection } from "../config/queue.connection.js";
import prisma from "../lib/prisma.js";
import { updateRecommendationsSummary, updateRecommendationWithAi } from "../services/recommendation.services.js";


const worker = new Worker("update-recommendation", async (job) => {

    try {
        const userId = job.data?.userId;

        const userSummary = await prisma.userTasteSummary.findUnique({
            where: {
                user_id: userId
            }
        });

        

        let summary: string | undefined;
        if (!userSummary?.updated_at) {
            summary = await updateRecommendationsSummary(userId)
        } else {
            const summaryDate = userSummary?.updated_at;
            const now = new Date(Date.now());
            const isToday =
                summaryDate.getFullYear() === now.getFullYear() &&
                summaryDate.getMonth() === now.getMonth() &&
                summaryDate.getDate() === now.getDate();
            
            if(isToday){
                summary = userSummary.summary_text;
            }else{
                summary = await updateRecommendationsSummary(userId)
            }
        }

        if(!summary){
            throw new Error("summary is undefined")
        }

        await updateRecommendationWithAi(summary,userId)

    } catch (error) {
        console.log(error)
    }
}, redisConnection);

worker.on("ready", () => {
    console.log("Worker ready");
});

worker.on("error", (err) => {
    console.error("Worker error:", err);
});

worker.on("completed", (job) => {
    console.log("Job completed:", job.id);
});

worker.on("failed", (job, err) => {
    console.error("Job failed:", job?.id, err);
});