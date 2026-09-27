import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";
import { env } from "./config/env.js";

import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: env.frontendUrl
    })
)

app.use(express.json())

app.get("/", (_req, res) => {
    res.json({
        sucess: true,
        service: "sentinelnet-api",
        message: "SentinelNet API online"
    })
})

app.use("/api", routes)
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;