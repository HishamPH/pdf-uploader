import jwt, { Secret } from "jsonwebtoken";
import IJwtToken from "../../usecases/interfaces/IJwtToken";

class JwtToken implements IJwtToken {
  async SignInAccessToken(user: {}): Promise<string> {
    try {
      const token = jwt.sign(
        { ...user },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        {
          expiresIn: "30min",
        }
      );
      if (token) return token;
      return "";
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  async SignInRefreshToken(user: {}): Promise<string> {
    try {
      const token = jwt.sign(
        { ...user },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        {
          expiresIn: "30d",
        }
      );
      if (token) return token;
      return "";
    } catch (err) {
      console.log(err);
      return "";
    }
  }
}

export default JwtToken;
