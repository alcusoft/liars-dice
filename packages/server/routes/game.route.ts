import { Router } from "express";
import GameController from "../controllers/game.controller";

const router = Router();

router.post("/create", GameController.Create);
router.post("/:gameId/join", GameController.Join);
router.post("/:gameId/start_round", GameController.StartRound);
router.patch("/:gameId/update_config", GameController.UpdateConfig);

export default router;
