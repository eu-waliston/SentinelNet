import { Router } from "express";

import healthRoutes
  from "./health.routes.js";

import infrastructureRoutes
  from "./infrastructure.routes.js";

import relationshipRoutes
  from "./relationship.routes.js";

const router = Router();

router.use(
  "/health",
  healthRoutes
);

router.use(
  "/infrastructure",
  infrastructureRoutes
);

router.use(
  "/relationships",
  relationshipRoutes
);

export default router;