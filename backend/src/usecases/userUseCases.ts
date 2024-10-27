import { stat } from "fs";
import User from "../entity/user";

import IUserRepository from "./interfaces/IUserRepository";
import IJwtToken from "./interfaces/IJwtToken";

interface ResponseType {
  _id?: string;
  result?: User | {} | null;
  status?: boolean;
  statusCode: number;
  message?: string;
  activationToken?: string;
  accessToken?: string;
  refreshToken?: string;
  authToken?: string;
}

class UserUseCase {
  private iUserRepository: IUserRepository;
  private iJwtToken: IJwtToken;
  constructor(iUserRepository: IUserRepository, iJwtToken: IJwtToken) {
    this.iUserRepository = iUserRepository;
    this.iJwtToken = iJwtToken;
  }

  async createUser(user: User): Promise<ResponseType> {
    try {
      const checkUser = await this.iUserRepository.findByEmail(user.email);
      if (checkUser) {
        console.log("user already exists");
        return {
          status: false,
          message: "Account already exists",
          statusCode: 409,
        };
      }
      const data = await this.iUserRepository.createUser(user);
      if (!data) {
        return {
          statusCode: 500,
          message: "error in creating user",
        };
      }
      const { _id, name, email, pdfs } = data;
      const result = { _id, name, email, pdfs };
      const accessToken = await this.iJwtToken.SignInAccessToken({
        id: _id,
      });
      const refreshToken = await this.iJwtToken.SignInRefreshToken({ id: _id });
      return {
        statusCode: 200,
        message: "User registered SuccessFully",
        result,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        statusCode: 500,
        message: "Internal server Error",
      };
    }
  }
  async loginUser(user: User): Promise<ResponseType> {
    try {
      const checkUser = await this.iUserRepository.findByEmail(user.email);
      if (!checkUser) {
        return {
          status: false,
          message: "The user doesn't exist",
          statusCode: 409,
        };
      }
      let isValid;
      if (checkUser.password) {
        isValid = await this.iUserRepository.loginUser(
          checkUser.password,
          user.password
        );
      }
      if (!isValid) {
        return {
          statusCode: 401,
          message: "Invalid Credentials",
        };
      }
      const { _id, name, email, pdfs } = checkUser;
      const result = { _id, name, email, pdfs };
      const accessToken = await this.iJwtToken.SignInAccessToken({ id: _id });
      const refreshToken = await this.iJwtToken.SignInRefreshToken({ id: _id });
      return {
        statusCode: 200,
        message: "Login successful",
        result,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        statusCode: 500,
        message: "Internal server Error",
      };
    }
  }
  async uploadFile(file: any, userId: string): Promise<ResponseType> {
    try {
      const originalName = file.originalname;
      const name = file.filename;
      const url = `${process.env.BACKEND_URL}/pdfs/${file.filename}`;
      const result = await this.iUserRepository.uploadFile(
        { originalName, name, url },
        userId
      );
      return {
        statusCode: 200,
        message: "Upload successful",
        result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        statusCode: 500,
        message: "Internal server Error",
      };
    }
  }

  async getFiles(userId: string): Promise<ResponseType> {
    try {
      const result = await this.iUserRepository.getFiles(userId);
      return {
        statusCode: 200,
        message: "Files retrieved",
        result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        statusCode: 500,
        message: "Internal server Error",
      };
    }
  }
}

export default UserUseCase;
