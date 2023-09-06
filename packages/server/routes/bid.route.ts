import { Router } from "express";
import BidController from "../controllers/bid.controller";

const router = Router();

router.post("/create", BidController.Create);

export default router;
