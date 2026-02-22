import { Queue } from "bullmq";

if(!process.env.REDIS_URL){
    throw new Error("redis url not found")
}

export const recommendationQueue = new Queue("update-recommendation",  {
    connection: {
    url: process.env.REDIS_URL,
  },
});