import { Router } from "express";
import BidRouter from "./bid.route";
import CallRouter from "./call.route";
import DiceRouter from "./dice.route";
import GameRouter from "./game.route";
import PlayerRouter from "./player.route";

const router = Router();

router.use("/bid", BidRouter);
router.use("/call", CallRouter);
router.use("/dice", DiceRouter);
router.use("/game", GameRouter);
router.use("/player", PlayerRouter);

export default router;
