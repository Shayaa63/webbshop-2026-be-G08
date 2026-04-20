import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getAllTrades,
  getTradesByUser,
  getTrade,
  createNewTrade,
  acceptTrade,
  rejectTrade,
  removeTrade,
} from "../controllers/tradeController.js";

const router = Router();

router.get("/", getAllTrades);
router.get("/user/:userId", getTradesByUser);
router.get("/:id", getTrade);

router.post("/", protect, createNewTrade);

router.put("/:id/accept", protect, acceptTrade);
router.put("/:id/reject", protect, rejectTrade);

router.delete("/:id", protect, removeTrade);

export default router;