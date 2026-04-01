import { Router } from "express";
import { 
  getTrades, 
  getTradeById, 
  createTrade,
  deleteTrade,
  getTradesByUser
} from "../db/trades.js";

const router = Router();    

router.get('/', async (req, res) => {
    try {
        const trades = await getTrades()    
        res.json(trades)
        } catch (error) {
            console.error("Error fetching trades:", error)
            res.status(500).json({ error: "Failed to fetch trades" })
            }       
});

router.get('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
    try {
        const newTrade = await createTrade(req.body)
        res.status(201).json(newTrade)
    } catch (error) {
        console.error("Error creating trade:", error)
        res.status(500).json({ error: "Failed to create trade" })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedTrade = await deleteTrade(req.params.id);  
        if (!deletedTrade) {
            return res.status(404).json({ error: "Trade not found" });
        }   
        res.json({ message: "Trade deleted successfully" });
    } catch (error) {
        console.error("Error deleting trade:", error);
        res.status(500).json({ error: "Failed to delete trade" });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const trades = await getTradesByUser(req.params.userId)
        res.json(trades);
    }catch (error) {
        console.error("Error fetching trades by user:", error);
        res.status(500).json({ error: "Failed to fetch trades by user" });
    }
});

export default router;