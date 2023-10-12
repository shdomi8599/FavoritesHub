import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as nodemailer from "nodemailer";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  nodemailerOption,
} from "src/constants";
import { User } from "src/source/entity/User";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneToMail(username);
    await this.usersService.checkPassword(user, password);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, presets, ...result } = user;
      return result;
    }
    return null;
  }

  async getAccessToken(user: User) {
    const payload = { username: user.mail, sub: user.id };
    return await this.jwtService.signAsync(payload, {
      secret: JWT_ACCESS_SECRET,
      expiresIn: "15m",
    });
  }

  async decodedRefreshToken(refreshToken: string) {
    const decodedRefreshToken = await this.jwtService.verify(refreshToken, {
      secret: JWT_REFRESH_SECRET,
    });
    return decodedRefreshToken;
  }

  async getRefreshToken(user: User) {
    const payload = { username: user.mail, sub: user.id };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
      secret: JWT_REFRESH_SECRET,
    });
    return refreshToken;
  }

  async login(user: User) {
    const accessToken = await this.getAccessToken(user);
    const refreshToken = await this.getRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async mail(user: User, verifyCode: string) {
    const transporter = nodemailer.createTransport(nodemailerOption);

    const { mail } = user;
    const mailOptions = {
      from: "FavoritesHub@gmail.com",
      to: mail,
      subject: "이메일 인증을 완료해주세요.",
      html: `<div>
      <h2>FavoritesHub 이메일 인증</h2>
      <div class="phone" style="font-size: 1.1em;">인증번호 : ${verifyCode}</div>
      </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  }

  async verify(cashingVerifyCode: string, verifyCode: string) {
    return cashingVerifyCode === verifyCode;
  }
}
