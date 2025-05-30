const mongoose = require("mongoose");

try {
  const DB_USER = mongoose.createConnection(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  DB_USER.on("connected", () => console.log("✅ USER_DB connected"));
  DB_USER.on("error", (err) => console.error("❌ USER_DB error", err));
  module.exports = DB_USER;
} catch (err) {
  console.log(err, "db error!");
}
