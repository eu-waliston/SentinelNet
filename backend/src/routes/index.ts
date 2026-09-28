import { Router } from "express";

import healthRoutes
  from "./health.routes.js";

import infrastructureRoutes
  from "./infrastructure.routes.js";

const router = Router();

router.use(
  "/health",
  healthRoutes
);

router.use(
  "/infrastructure",
  infrastructureRoutes
);

export default router;