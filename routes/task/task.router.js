const express = require("express");
const taskControler = require("../../controlers/task.controler/task.controler");
const { authMiddleware } = require("../../middleware/auth.middleware");
const taskRouter = express.Router();

taskRouter.post("/get", authMiddleware, taskControler.getAllTasks);
taskRouter.post("/create", authMiddleware, taskControler.createTask);
taskRouter.post("/edite", authMiddleware, taskControler.editeTask);
taskRouter.post("delete", authMiddleware, taskControler.deleteTask);

module.exports = taskRouter;
