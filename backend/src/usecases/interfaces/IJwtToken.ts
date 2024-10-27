import User from "../../entity/user";

interface IJwtToken {
  SignInAccessToken(user: {}): Promise<string>;
  SignInRefreshToken(user: {}): Promise<string>;
}

export default IJwtToken;
