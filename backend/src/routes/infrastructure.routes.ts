import { Router } from "express";

import {
  createInfrastructure,
  listInfrastructure,
  getInfrastructure,
  getInfrastructureGraph,
  collectIntelligence
} from "../controllers/infrastructure.controller.js";

import {
  getRelationships
} from "../controllers/relationship.controller.js";

import {
  analyze
} from "../controllers/infrastructure.controller.js";

const router = Router();

router.post(
  "/",
  createInfrastructure
);

router.get(
  "/",
  listInfrastructure
);

router.get(
  "/:id/relationships",
  getRelationships
);

router.get(
  "/:id",
  getInfrastructure
);

router.get(
  "/:id/graph",
  getInfrastructureGraph
);

router.post(
  "/analyze",
  analyze
);

router.post(
  "/collect",
  collectIntelligence
);

export default router;