import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "src/constants";
import { User } from "src/source/entity/User";
import { UserService } from "src/user/user.service";

interface UserAuth extends User {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getAccessToken(user: UserAuth) {
    const payload = { sub: user.sub }; // 이 부분 수정이 필요할 수도 있겠다.
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

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(mail, hash);

    return refreshToken;
  }

  async login(user: UserAuth) {
    const accessToken = await this.getAccessToken(user);
    const refreshToken = await this.getRefreshToken(user.mail);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(user: UserAuth) {
    await this.userService.updateRefreshToken(user.mail, "");
    return true;
  }
}
