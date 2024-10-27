import bcrypt from "bcryptjs";

import User from "../../entity/user";

import IUserRepository from "../../usecases/interfaces/IUserRepository";

import userModel from "../db/userModel";

class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await userModel.findOne({ email: email });
      if (user) return user;
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async createUser(user: User): Promise<any> {
    try {
      const { name, email, password } = user;
      const newUser = await userModel.create({ name, email, password });
      if (newUser) return newUser;
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async loginUser(hashPass: string, password: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, hashPass);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async uploadFile(file: any, userId: string): Promise<any> {
    try {
      const result = await userModel.findByIdAndUpdate(
        userId,
        {
          $push: { pdfs: file },
        },
        { new: true }
      );
      if (result) return file;
      return null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getFiles(userId: string): Promise<any> {
    try {
      const user = await userModel.findById(userId);
      if (user) return user.pdfs;
      return null;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default UserRepository;
