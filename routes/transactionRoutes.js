import express from "express";
import Transaction from "../models/Transaction.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

// Gunakan middleware autentikasi
router.use(authenticate);

// Get all transactions for logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err.message);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// Add transaction
router.post("/", authenticate, async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    const transaction = new Transaction({
      type,
      amount,
      description,
      userId: req.userId, // Pastikan userId diambil dari middleware authenticate
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error("Error adding transaction:", err.message);
    res.status(500).json({ message: "Failed to add transaction" });
  }
});

// Delete transaction
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err.message);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

// Update transaction
router.put("/:id", authenticate, async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log data yang diterima dari frontend
    console.log("Transaction ID:", req.params.id); // Log ID transaksi
    console.log("User ID:", req.userId); // Log ID pengguna

    const { type, amount, description } = req.body;
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { type, amount, description },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(updatedTransaction);
  } catch (err) {
    console.error("Error updating transaction:", err.message);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

export default router;
