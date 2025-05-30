const mongoose = require("mongoose");
const DB_USER = require("../../config/dbConfig");

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true }
);

const TaskModel = DB_USER.model("users", taskSchema);
module.exports = TaskModel;
