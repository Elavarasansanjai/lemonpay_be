const express = require("express");
const userControler = require("../../controlers/profile.controler/profile.controler");
const { authMiddleware } = require("../../middleware/auth.middleware");

const userRouter = express.Router();

userRouter.post("/register", userControler.createUser);
userRouter.post("/login", userControler.LoginControler);
userRouter.post("/logout", authMiddleware, userControler.logoutControler);
userRouter.get("/sts", authMiddleware, userControler.stsCheck);

module.exports = userRouter;
