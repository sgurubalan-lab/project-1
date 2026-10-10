const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Todo.find().sort({ createdAt: -1 }));
});

router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  res.status(201).json(await Todo.create({ title }));
});

router.put("/:id", async (req, res) => {
  const { title, completed } = req.body;
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { title, completed },
    { new: true, omitUndefined: true, runValidators: true }
  );
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

router.delete("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json({ success: true });
});

module.exports = router;
