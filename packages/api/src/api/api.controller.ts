import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";
import { FavoriteService } from "src/favorite/favorite.service";
import { PresetService } from "src/preset/preset.service";
import { Preset } from "src/source/entity/Preset";
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

  @UseGuards(AuthGuard("jwt"))
  @Get("preset/list")
  async presetList(@Request() req) {
    const { mail } = req.user;
    const presets = await this.presetService.findAll(mail);
    return presets;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("preset")
  async preset(@Request() req) {
    const { mail } = req.user;
    const { presetName } = req.query;
    const preset = await this.presetService.findOne(mail, presetName);
    return preset;
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("preset")
  async presetAdd(
    @Request() req,
    @Body() dto: { presetData: Partial<Preset> },
  ) {
    const { mail } = req.user;
    const { presetData } = dto;
    await this.presetService.add(mail, presetData);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("preset")
  async presetDelete(@Request() req) {
    const { mail } = req.user;
    const { presetName } = req.query;
    await this.presetService.remove(mail, presetName);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("preset")
  async presetUpdate(@Request() req) {
    const { mail } = req.user;
    const { presetName, newPresetName } = req.query;
    await this.presetService.update(mail, presetName, newPresetName);
    return { message: "success" };
  }
}
