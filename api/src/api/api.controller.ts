import { Controller, Get, Post, Request, Res, UseGuards } from "@nestjs/common";
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
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const tokens = await this.authService.login(req.user);
    const { accessToken, refreshToken } = tokens;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    return { accessToken };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("auth/refreshToken")
  async getRefreshToken(@Request() req) {
    const { address } = req.user;
    const ret = await this.authService.getRefreshToken(address);
    return { refreshToken: ret };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("auth/logout")
  async logout(@Request() req, @Res({ passthrough: true }) res) {
    res.clearCookie("refreshToken");
    await this.authService.logout(req.user);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("auth/user")
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Get("auth/refresh")
  async refreshTokens(@Request() req) {
    const accessToken = await this.authService.getAccessToken(req.user);
    return { accessToken: accessToken };
  }
}
