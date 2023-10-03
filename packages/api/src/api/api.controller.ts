import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";
import { FavoriteService } from "src/favorite/favorite.service";
import { PresetService } from "src/preset/preset.service";
import { UserService } from "src/user/user.service";

@Controller("api")
export class ApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly presetService: PresetService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @UseGuards(AuthGuard("local"))
  @Post("auth/login")
  async login(
    @Request() req,
    @Res({ passthrough: true }) res,
    @Body() dto: { mail: string; password: string },
  ) {
    const cookieRefreshToken = req.cookies.refreshToken;
    const { mail, password } = dto;
    const user = await this.userService.validRefreshToken(
      mail,
      cookieRefreshToken,
    );

    if (!user) {
      await this.userService.checkPassword(user, password);
    }

    const tokens = await this.authService.login(req.user);
    const { accessToken, refreshToken } = tokens;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    await this.userService.updateloginTime(req.user);

    return { accessToken };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("auth/refreshToken")
  async getRefreshToken(@Request() req) {
    const { mail } = req.user;
    const refreshToken = await this.authService.getRefreshToken(mail);
    await this.userService.updateRefreshToken(mail, refreshToken);
    return { refreshToken };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("auth/logout")
  async logout(@Request() req, @Res({ passthrough: true }) res) {
    const { mail } = req.user;
    res.clearCookie("refreshToken");
    await this.userService.updateRefreshToken(mail, "");
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Get("auth/refresh")
  async refreshTokens(@Request() req) {
    const accessToken = await this.authService.getAccessToken(req.user);
    return { accessToken };
  }

  // @UseGuards(AuthGuard("local"))
  @Post("user")
  async userSignUp(@Body() dto: { mail: string; password: string }) {
    const { mail, password } = dto;
    await this.userService.add(mail, password);
    return { message: "success" };
  }

  // @UseGuards(AuthGuard("jwt"))
  @Delete("user")
  async userDelete(@Body() dto: { mail: string }) {
    const { mail } = dto;
    await this.userService.remove(mail);
    return { message: "success" };
  }
}
