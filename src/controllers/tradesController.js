import {
  getTrades,
  getTradeById,
  createTrade,
  deleteTrade,
  getTradesByUser as getTradesByUserDB,
  updateTradeStatus,
} from "../db/trades.js";

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

//
// GET TRADES BY USER
//
export const getTradesByUser = async (req, res) => {
  try {
    const trades = await getTradesByUserDB(req.params.userId);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trades by user" });
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
  try {
    const tradeData = {
      ...req.body,
      requester: req.user.userId,
    };

    const newTrade = await createTrade(tradeData);

    await createNotification({
      recipient: newTrade.receiver,
      type: "TRADE_REQUEST_RECEIVED",
      message: "Du har fått en ny bytesförfrågan!",
      trade: newTrade._id,
    });

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

    if (trade.requester.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Only requester can delete trade" });
    }

    await deleteTrade(req.params.id);

    res.json({ message: "Trade deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete trade" });
  }
};