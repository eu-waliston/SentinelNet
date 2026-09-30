import { Router } from "express";

import {
  createInfrastructure,
  listInfrastructure,
  getInfrastructure,
  getInfrastructureGraph
} from "../controllers/infrastructure.controller.js";

import {
  getRelationships
} from "../controllers/relationship.controller.js";

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

export default router;