import { Request, Response } from "express"
import { timeStamp } from "node:console"
import { uptime } from "node:process"

export const healthCheckPublic = (req: Request, res: Response) => {

    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: new Date(Date.now()),
    })
}