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
    const check = await this.usersService.checkPassword(user, password);
    if (check?.message) {
      return { message: check?.message };
    }
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
      secret: `${JWT_ACCESS_SECRET}=`,
      expiresIn: "7d",
    });
  }

  async decodedRefreshToken(refreshToken: string) {
    const decodedRefreshToken = await this.jwtService.verify(refreshToken, {
      secret: `${JWT_REFRESH_SECRET}=`,
    });
    return decodedRefreshToken;
  }

  async getRefreshToken(user: User) {
    const payload = { username: user.mail, sub: user.id };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
      secret: `${JWT_REFRESH_SECRET}=`,
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

  async verify(cashingVerifyCode: string, verifyCode: string) {
    return cashingVerifyCode === verifyCode;
  }

  async mail(user: User, verifyCode: string) {
    const transporter = nodemailer.createTransport(nodemailerOption);

    const { mail } = user;
    const mailOptions = {
      from: "FavoritesHub@gmail.com",
      to: mail,
      subject: "이메일 인증을 완료해주세요.",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; padding: 20px 0;">FavoritesHub 이메일 인증</h2>
            <p style="font-size: 1.1em; margin: 20px 0;">안녕하세요! FavoritesHub을 이용해 주셔서 감사합니다.</p>
            <p style="font-size: 1.1em; margin: 20px 0;">아래의 인증번호를 입력하여 계정을 인증해주세요:</p>
            <div style="font-size: 1.5em; background-color: #007BFF; color: #fff; padding: 10px; border-radius: 5px;">${verifyCode}</div>
            <p style="font-size: 1em; margin: 20px 0;">이 인증번호는 계정 보안을 위해 개인적으로 유지해 주시기 바랍니다.</p>
            <p style="font-size: 1em; padding: 20px 0;">감사합니다.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}
