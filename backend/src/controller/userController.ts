import { Request, Response, NextFunction } from "express";
import UserUseCase from "../usecases/userUseCases";

class UserController {
  private userCase: UserUseCase;
  constructor(userCase: UserUseCase) {
    this.userCase = userCase;
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const user = await this.userCase.createUser(userData);
      if (user.accessToken && user.refreshToken) {
        res.cookie("refreshToken", user.refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.cookie("accessToken", user.accessToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }
      return res.status(user?.statusCode).json({ ...user });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const user = await this.userCase.loginUser(userData);
      if (user.accessToken && user.refreshToken) {
        res.cookie("refreshToken", user.refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.cookie("accessToken", user.accessToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }
      return res.status(user?.statusCode).json({ ...user });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.file;
      const userId = req.user.id;
      const file = await this.userCase.uploadFile(data, userId);
      return res.status(file?.statusCode).json({ ...file });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const files = await this.userCase.getFiles(userId);
      return res.status(files?.statusCode).json({ ...files });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const pdfId = req.params.id;
      const userId = req.user.id;
      const result = await this.userCase.deleteFile(userId, pdfId);
      return res.status(result?.statusCode).json({ ...result });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("logout");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "User LogOut success fully" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default UserController;
