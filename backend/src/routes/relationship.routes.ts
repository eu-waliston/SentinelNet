import { Router } from "express";

import {
  createRelationship
} from "../controllers/relationship.controller.js";

const router = Router();

router.post(
  "/",
  createRelationship
);

export default router;