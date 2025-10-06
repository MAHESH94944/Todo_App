const Todo = require("../models/todoModel");

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const todo = await Todo.create({
      user: req.user.id,
      title,
      description,
    });

    return res.status(201).json({ todo });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getTodos = async (req, res) => {
  const id = req.user.id;

  try {
    const todos = await Todo.find({ user: id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ todos });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getTodo = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    const todo = await Todo.findOne({ _id: taskId, user: userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    return res.status(200).json({ todo });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const updates = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: taskId, user: userId },
      updates,
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    return res.status(200).json({ todo });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    return res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = { createTodo, getTodos, getTodo, updateTodo, deleteTodo };
