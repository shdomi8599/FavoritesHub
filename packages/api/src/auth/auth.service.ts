import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as nodemailer from "nodemailer";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  nodemailerOption,
} from "src/constants";
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

  async mail(user: User, verifyCode: string) {
    const transporter = nodemailer.createTransport(nodemailerOption);

    const { mail } = user;
    const mailOptions = {
      from: "FavoritesHub@gmail.com",
      to: mail,
      subject: "이메일을 인증해주세요.",
      html: `<div>
      <h2>FavoritesHub 이메일 인증</h2>
      <div class="phone" style="font-size: 1.1em;">인증번호 : ${verifyCode}</div>
      </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  }

  async verify(user: User, verifyCode: string) {
    return user.verifyCode === verifyCode;
  }
}
