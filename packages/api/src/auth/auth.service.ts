import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import nodemailer from "nodemailer";
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

  async verify(user: User) {
    const transporter = nodemailer.createTransport(nodemailerOption);

    const { mail } = user;
    const mailOptions = {
      from: "FavoritesHub@gmail.com",
      to: mail,
      subject: "이메일을 인증해주세요.",
      html: `<div>
      <h2>Message Details</h2>
      <div class="email" style="font-size: 1.1em;">Email : ${mail}</div>
      <div class="phone" style="font-size: 1.1em;">Title : </div>
      <div class="message" style="font-size: 1.1em;">message : </div>
      <pre class="message" style="font-size: 1.2em;"></pre>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}
