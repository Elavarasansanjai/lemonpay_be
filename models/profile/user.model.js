const mongoose = require("mongoose");
const DB_USER = require("../../config/dbConfig");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user_secretkey: { type: String },
  },
  { timestamps: true }
);

const USERMODEL = DB_USER.model("lemonpay_users", userSchema);
module.exports = USERMODEL;
