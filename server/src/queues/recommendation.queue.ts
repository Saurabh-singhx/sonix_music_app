import { Queue } from "bullmq";
import { redisConnection } from "../config/queue.connection.js";


export const recommendationQueue = new Queue("update-recommendation", redisConnection);