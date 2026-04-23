import {
  getTrades,
  getTradeById,
  createTrade,
  deleteTrade,
  getTradesByUser as getTradesByUserDB,
  updateTradeStatus,
} from "../db/trades.js";
import { getPlantById } from "../db/plants.js";

import { createNotification } from "../db/notifications.js";

//
// GET ALL TRADES
//
export const getAllTrades = async (req, res) => {
  try {
    const trades = await getTrades();
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trades" });
  }
};

// GET MY TRADES
export const getMyTrades = async (req, res) => {
  try {
    const trades = await getTradesByUserDB(req.user.userId);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your trades" });
  }
};

// COMPLETE TRADE
export const completeTrade = async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);

    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    const userId = req.user.userId.toString();
    const isRequester = trade.requester.toString() === userId;
    const isReceiver = trade.receiver.toString() === userId;

    if (!isRequester && !isReceiver) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (trade.status !== "accepted") {
      return res.status(400).json({ error: "Trade must be accepted before completing" });
    }

    const updated = await updateTradeStatus(req.params.id, "completed");

    await createNotification({
      recipient: isRequester ? trade.receiver : trade.requester,
      type: "TRADE_COMPLETED",
      message: "Bytet har slutförts!",
      trade: trade._id,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to complete trade" });
  }
};

//
// GET SINGLE TRADE
//
export const getTrade = async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);

    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trade" });
  }
};

//
// CREATE TRADE
//
export const createNewTrade = async (req, res) => {
  let offered, requested;
    try {
    const { offeredPlant, requestedPlant, receiver } = req.body;

   try { 
        [offered, requested] = await Promise.all([
        getPlantById(offeredPlant),
        getPlantById(requestedPlant),
        ]);
    } catch (err) {
        return res.status(400).json({ error: "Invalid plant ID format" });
}
    if (!offered || !requested) {
      return res.status(404).json({
        error: "One or both plants not found",
      });
    }

    if (offered.owner.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "You don't own the offered plant" });
    }

    if (requested.owner.toString() !== receiver?.toString()) {
      return res
        .status(403)
        .json({ error: "Requested plant doesn't belong to receiver" });
    }

    if (!offered.isAvailable || !requested.isAvailable) {
      return res.status(400).json({
        error: "One or both plants are not available for trading",
      });
    }

    const tradeData = {
      ...req.body,
      requester: req.user.userId,
    };

    const newTrade = await createTrade(tradeData);

    try {
      await createNotification({
        recipient: newTrade.receiver,
        type: "TRADE_REQUEST_RECEIVED",
        message: "Du har fått en ny bytesförfrågan!",
        trade: newTrade._id,
      });
    } catch (notifError) {
      await deleteTrade(newTrade._id);
      console.error("🔥 CREATE TRADE ERROR:", notifError);
      return res.status(500).json({
        error: notifError.message,
        stack: notifError.stack,
      });
    }

    res.status(201).json(newTrade);
  } catch (error) {
    res.status(500).json({ error: "Failed to create trade" });
  }
};

//
// ACCEPT TRADE
//
export const acceptTrade = async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);

    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    if (trade.receiver.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Only receiver can accept trade" });
    }

    if (trade.status !== "posted" && trade.status !== "pending") {
      return res.status(400).json({ error: "Trade cannot be accepted" });
    }

    const updated = await updateTradeStatus(req.params.id, "accepted");

    await createNotification({
      recipient: trade.requester,
      type: "TRADE_ACCEPTED",
      message: "Din bytesförfrågan har accepterats!",
      trade: trade._id,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to accept trade" });
  }
};

//
// REJECT TRADE
//
export const rejectTrade = async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);

    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    if (trade.receiver.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Only receiver can reject trade" });
    }

    if (trade.status !== "posted" && trade.status !== "pending") {
      return res.status(400).json({ error: "Trade cannot be rejected" });
    }

    const updated = await updateTradeStatus(req.params.id, "rejected");

    await createNotification({
      recipient: trade.requester,
      type: "TRADE_REJECTED",
      message: "Din bytesförfrågan har avvisats.",
      trade: trade._id,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to reject trade" });
  }
};

//
// DELETE TRADE
//
export const removeTrade = async (req, res) => {
  try {
    const trade = await getTradeById(req.params.id);

    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    // bara den som skapade trade får ta bort den
    if (trade.requester.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Only requester can delete trade" });
    }

    if (!["pending", "posted"].includes(trade.status)) {
      return res.status(400).json({
        error: "Only pending or posted trades can be deleted",
      });
    }

    await deleteTrade(req.params.id);

    res.json({ message: "Trade cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete trade" });
  }
};