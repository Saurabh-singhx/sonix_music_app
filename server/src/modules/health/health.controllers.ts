import { Request, Response } from "express"

export const healthCheckPublic = (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Sonix Music API is up and running 🎵",
    timestamp: new Date().toISOString(),
    uptime: formatUptime(process.uptime()),
  })
}

const formatUptime = (seconds: number): string => {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}