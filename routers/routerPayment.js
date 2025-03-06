import express from "express";
import { createPayment } from "../controllers/controllerPayment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-payment", verifyToken, createPayment);

export default router;
