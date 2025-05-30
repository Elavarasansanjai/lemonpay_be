const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const AppRouter = require("./routes/api.router");

require("./config/dbConfig");
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/lemonpay/", AppRouter);
app.listen(process.env.PORT, () => {
  console.log("user running on port " + process.env.PORT);
});
