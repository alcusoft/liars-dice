import { Router } from "express";
import PlayerController from "../controllers/player.controller";

const router = Router();

router.patch("/:playerId/update", PlayerController.Update);

export default router;
