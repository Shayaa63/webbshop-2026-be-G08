import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getAllTrades,
  getMyTrades,
  getTrade,
  createNewTrade,
  acceptTrade,
  rejectTrade,
  completeTrade,
  removeTrade,
} from "../controllers/tradesController.js";
import { validateTrades, validateTradeResult } from "../middleware/tradeValidation.js";

const router = Router();

router.get("/", protect, adminOnly, getAllTrades);
router.get("/mine", protect, getMyTrades);
router.get("/:id", protect, getTrade);

router.post("/", protect, validateTrades, createNewTrade);

router.put("/:id/accept", protect, validateTradeResult, acceptTrade);
router.put("/:id/reject", protect, validateTradeResult, rejectTrade);
router.put("/:id/complete", protect, completeTrade);

router.delete("/:id", protect, adminOnly, removeTrade);

export default router;