import { Router } from "express";
import CallController from "../controllers/call.controller";

const router = Router();

router.post("/create", CallController.Create);

export default router;
