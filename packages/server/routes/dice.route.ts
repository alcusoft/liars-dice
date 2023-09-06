import { Router } from "express";
import DiceController from "../controllers/dice.controller";

const router = Router();

router.post("/reveal", DiceController.Reveal);
router.post("/roll", DiceController.Roll);

export default router;
