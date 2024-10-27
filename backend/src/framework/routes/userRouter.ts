import express from "express";
const userRouter = express.Router();

import JwtToken from "../services/jwtToken";
import UserRepository from "../repository/userRepository";
import UserUseCase from "../../usecases/userUseCases";
import UserController from "../../controller/userController";
import { userAuth } from "../middlewares/userAuth";
import { uploadPdf } from "../services/upload";

const jwtToken = new JwtToken();
const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository, jwtToken);
const userController = new UserController(userUseCase);

userRouter.post("/signup", (req, res, next) => {
  userController.createUser(req, res, next);
});

userRouter.post("/login", (req, res, next) => {
  userController.loginUser(req, res, next);
});

userRouter.post("/upload-pdf", userAuth, uploadPdf, (req, res, next) => {
  userController.uploadFile(req, res, next);
});

userRouter.post("/logout", (req, res, next) => {
  userController.logoutUser(req, res, next);
});

userRouter.get("/get-files", userAuth, (req, res, next) => {
  userController.getFiles(req, res, next);
});

export default userRouter;
