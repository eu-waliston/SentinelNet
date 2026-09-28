import { Router } from "express";

import {
  createInfrastructure,
  listInfrastructure,
  getInfrastructure
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
  "/:id",
  getInfrastructure
);

export default router;