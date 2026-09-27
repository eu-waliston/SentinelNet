import type { Request, Response } from "express";
import mongoose from "mongoose";

export function healthCheck(_req: Request, res: Response): void {
    const database = mongoose.connection.readyState === 1 ? "connected" : "disconnected"

    const status = database === "connected" ? "ok" : "degraded";

    res.status(status === "ok" ? 200 : 503).json({
        success: true,
        service: "sentinelnet-api",
        status,
        environment: process.env.NODE_ENV ?? "development",
        database,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
}