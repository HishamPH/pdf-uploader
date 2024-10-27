import User from "../../entity/user";

interface IUserRepository {
  createUser(user: User): Promise<any>;
  loginUser(hashPass: string, password: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  uploadFile(file: any, userId: string): Promise<any>;
  getFiles(userId: string): Promise<any>;
}

export default IUserRepository;
