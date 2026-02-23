
if(!process.env.REDIS_URL){
    throw new Error("redis url not found")
}
export const redisConnection = {
    connection: {
        url: process.env.REDIS_URL,
    },
}