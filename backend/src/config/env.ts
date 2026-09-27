import "dotenv/config"

const requiredEnv = ["MONGO_URI"] as const;

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing enviroment variable ${key}`)
    }
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 3000),
    mongoUri: process.env.MONGO_URI!,
    frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173"
}
