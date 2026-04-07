import Trade from "../models/Trades.js";

export async function getTrades() {
    return await Trade.find();
}

export async function createTrade(tradeData) {
    try {
        const trade = new Trade(tradeData);
        await trade.save();
        return trade;
    } catch (error) {
        console.error("Error creating trade", error);
        throw error;
    }
}
export async function getTradeById(tradeId) {
    try {   const trade = await Trade.findById(tradeId);
        if (!trade) {
            throw new Error("Trade not found");
        }
        return trade;
    } catch (error) {
        console.error("Error fetching trade:", error);
        throw error;
    }
}

export async function getTradesByUser(userId) {
    try { const trades = await Trade.find({ $or: [{ requester: userId}, {receiver: userId}] });
        return trades;
    } catch (error) {
        console.error("Error fetching trades:", error);
        throw error;
    }
}
export async function updateTradeStatus(tradeId, newStatus) {
    try { const trade = await Trade.findByIdAndUpdate(tradeId, {status: newStatus}, {new: true});
        if (!trade) {
            throw new Error("Trade not found");
        }     return trade;
    } catch (error) {
        console.error("Error updating trade status:", error);
        throw error;
    }
}

export async function deleteTrade(tradeId) {
    try {
        const trade = await Trade.findByIdAndDelete(tradeId);
        if (!trade) {
            throw new Error("Trade not found");
        }
        return trade;
    } catch (error) {
        console.error("Error deleting trade:", error);
        throw error;
    }
}

