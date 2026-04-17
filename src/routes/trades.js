import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTrades,
  getTradeById,
  createTrade,
  deleteTrade,
  getTradesByUser,
  updateTradeStatus,
} from "../db/trades.js";
import { createNotification } from "../db/notifications.js";

const router = Router();

// GET /trades
// Returns all trades — useful for admin purposes
router.get("/", async (req, res) => {
  try {
    const trades = await getTrades();
    res.json(trades);
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});

// GET /trades/user/:userId
// Returns all trades where the user is either requester or receiver.
// Why placed before /:id? Express matches routes top to bottom —
// if /:id came first, "user" would be treated as an ID and fail.
router.get("/user/:userId", async (req, res) => {
  try {
    const trades = await getTradesByUser(req.params.userId);
    res.json(trades);
  } catch (error) {
    console.error("Error fetching trades by user:", error);
    res.status(500).json({ error: "Failed to fetch trades by user" });
  }
});

// GET /trades/:id
// Returns a single trade by ID
router.get("/:id", async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);
    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }
    res.json(trade);
  } catch (error) {
    console.error("Error fetching trade:", error);
    res.status(500).json({ error: "Failed to fetch trade" });
  }
});

// POST /trades
// Person A creates a trade request.
// Notifies person B (the receiver) that they have a new request.
router.post("/", protect, async (req, res) => {
  try {
    // Attach the logged in user as the requester
    // so person A can't create a trade pretending to be someone else
    const tradeData = {
      ...req.body,
      requester: req.user.userId,
    };

    const newTrade = await createTrade(tradeData);

    // Notify the receiver that they have a new trade request
    await createNotification({
      recipient: newTrade.receiver,
      type: "TRADE_REQUEST_RECEIVED",
      message: "Du har fått en ny bytesförfrågan!",
      trade: newTrade._id,
    });

    res.status(201).json(newTrade);
  } catch (error) {
    console.error("Error creating trade:", error);
    res.status(500).json({ error: "Failed to create trade" });
  }
});

// PUT /trades/:id/accept
// Person B accepts the trade.
// Only the receiver of the trade can accept it.
// Notifies person A that their request was accepted.
router.put("/:id/accept", protect, async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);
    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    // Make sure only the receiver can accept
    if (trade.receiver.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Only the receiver can accept a trade" });
    }

    // Make sure the trade is still in a state that can be accepted
    if (trade.status !== "posted" && trade.status !== "pending") {
      return res.status(400).json({ error: "This trade can no longer be accepted" });
    }

    const updatedTrade = await updateTradeStatus(req.params.id, "accepted");

    // Notify person A that their request was accepted
    await createNotification({
      recipient: trade.requester,
      type: "TRADE_ACCEPTED",
      message: "Din bytesförfrågan har accepterats!",
      trade: trade._id,
    });

    res.json(updatedTrade);
  } catch (error) {
    console.error("Error accepting trade:", error);
    res.status(500).json({ error: "Failed to accept trade" });
  }
});

// PUT /trades/:id/reject
// Person B rejects the trade.
// Only the receiver of the trade can reject it.
// Notifies person A that their request was rejected.
router.put("/:id/reject", protect, async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);
    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    // Make sure only the receiver can reject
    if (trade.receiver.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Only the receiver can reject a trade" });
    }

    // Make sure the trade is still in a state that can be rejected
    if (trade.status !== "posted" && trade.status !== "pending") {
      return res.status(400).json({ error: "This trade can no longer be rejected" });
    }

    const updatedTrade = await updateTradeStatus(req.params.id, "rejected");

    // Notify person A that their request was rejected
    await createNotification({
      recipient: trade.requester,
      type: "TRADE_REJECTED",
      message: "Din bytesförfrågan har avvisats.",
      trade: trade._id,
    });

    res.json(updatedTrade);
  } catch (error) {
    console.error("Error rejecting trade:", error);
    res.status(500).json({ error: "Failed to reject trade" });
  }
});

// DELETE /trades/:id
// Only the requester (person A) can delete their own trade request
router.delete("/:id", protect, async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);
    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    // Only person A who created the trade can delete it
    if (trade.requester.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Only the requester can delete a trade" });
    }

    await deleteTrade(req.params.id);
    res.json({ message: "Trade deleted successfully" });
  } catch (error) {
    console.error("Error deleting trade:", error);
    res.status(500).json({ error: "Failed to delete trade" });
  }
});

export default router;