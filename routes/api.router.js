const express = require("express");
const userRouter = require("./profile/profile.router");
const taskRouter = require("./task/task.router");
const AppRouter = express.Router();

AppRouter.use("/profile", userRouter);
AppRouter.use("/task", taskRouter);

module.exports = AppRouter;
