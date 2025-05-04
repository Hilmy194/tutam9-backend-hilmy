exports.getAll = async (req, res) => {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(transactions);
  };
  
  exports.create = async (req, res) => {
    const transaction = new Transaction({ ...req.body, userId: req.userId });
    await transaction.save();
    res.status(201).json(transaction);
  };
  