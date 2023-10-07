import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "src/constants";
import { User } from "src/source/entity/User";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async getAccessToken(mail: string) {
    const payload = { sub: mail };
    return await this.jwtService.signAsync(payload, {
      secret: JWT_ACCESS_SECRET,
      expiresIn: "15m",
    });
  }

  async getRefreshToken(mail: string) {
    const payload = { sub: mail };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: "7d",
    });
    return refreshToken;
  }

  async login(user: User) {
    const accessToken = await this.getAccessToken(user.mail);
    const refreshToken = await this.getRefreshToken(user.mail);

    return {
      accessToken,
      refreshToken,
    };
  }
}
