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
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { FavoritesService } from "src/favorites/favorites.service";
import { PresetsService } from "src/presets/presets.service";
import { UsersService } from "src/users/users.service";
import { PostAuthLoginDto, PostAuthLogoutDto } from "./dto/auth";
import { PostFavoriteAddDto, PostFavoriteHandleStarDto } from "./dto/favorite";
import { PostPresetAddDto } from "./dto/preset";
import { PostUserSignUpDto } from "./dto/user";

@ApiTags("api")
@Controller("api")
export class ApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly presetsService: PresetsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @UseGuards(AuthGuard("local"))
  @Post("auth/login")
  @ApiResponse({
    status: 201,
    description: "유저 로그인에 사용되는 API입니다.",
    type: PostAuthLoginDto,
  })
  async postAuthLogin(
    @Request() req,
    @Res({ passthrough: true }) res,
    @Body() dto: PostAuthLoginDto,
  ) {
    const cookieRefreshToken = req.cookies.refreshToken;
    const { mail, password } = dto;
    const user = await this.usersService.validRefreshToken(
      mail,
      cookieRefreshToken,
    );

    if (!user) {
      await this.usersService.checkPassword(user, password);
    }

    const tokens = await this.authService.login(req.user);
    const { accessToken, refreshToken } = tokens;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    await this.usersService.updateloginTime(req.user);

    return { accessToken };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("auth/refreshToken")
  @ApiResponse({
    status: 200,
    description: "리프레시 토큰을 반환하는 API입니다.",
  })
  async getAuthRefreshToken(@Request() req) {
    const { mail } = req.user;
    const refreshToken = await this.authService.getRefreshToken(mail);
    await this.usersService.updateRefreshToken(mail, refreshToken);
    return { refreshToken };
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("auth/logout")
  @ApiResponse({
    status: 201,
    description: "로그아웃 API입니다.",
    type: PostAuthLogoutDto,
  })
  async postAuthLogout(
    @Res({ passthrough: true }) res,
    @Body() dto: PostAuthLogoutDto,
  ) {
    const { mail } = dto;
    res.clearCookie("refreshToken");
    await this.usersService.updateRefreshToken(mail, "");
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Get("auth/accessToken")
  async getAuthAccessToken(@Request() req) {
    const accessToken = await this.authService.getAccessToken(req.user);
    return { accessToken };
  }

  // @UseGuards(AuthGuard("local"))
  @Post("user")
  @ApiResponse({
    status: 201,
    description: "유저 회원가입에 사용되는 API입니다.",
    type: PostUserSignUpDto,
  })
  async postUserSignUp(@Body() dto: { mail: string; password: string }) {
    const { mail, password } = dto;
    await this.usersService.add(mail, password);
    return { message: "success" };
  }

  // @UseGuards(AuthGuard("jwt"))
  @Delete("user")
  async deleteUser(@Request() req) {
    const { mail } = req.query;
    await this.usersService.remove(mail);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("preset/list")
  async getPresetList(@Request() req) {
    const { mail } = req.user;
    const presets = await this.presetsService.findAll(mail);
    return presets;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("preset")
  async getPreset(@Request() req) {
    const { mail } = req.user;
    const { presetName } = req.query;
    const preset = await this.presetsService.findOne(mail, presetName);
    return preset;
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("preset")
  @ApiResponse({
    status: 201,
    description: "프리셋 생성에 사용되는 API입니다.",
    type: PostPresetAddDto,
  })
  async postPresetAdd(@Request() req, @Body() dto: PostPresetAddDto) {
    const { mail } = req.user;
    const user = await this.usersService.findOne(mail);
    const { presetName } = dto;
    await this.presetsService.add(user, presetName);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("preset")
  async deletePreset(@Request() req) {
    const { mail } = req.user;
    const { presetName } = req.query;
    await this.presetsService.remove(mail, presetName);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("preset")
  async putPreset(@Request() req) {
    const { mail } = req.user;
    const { presetName, newPresetName } = req.query;
    await this.presetsService.update(mail, presetName, newPresetName);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("favorite/list")
  async getFavoriteList(@Request() req) {
    const preset = await this.getPreset(req);
    const favorites = await this.favoritesService.findAll(preset);
    return favorites;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("favorite")
  async getFavorite(@Request() req) {
    const preset = await this.getPreset(req);
    const { domain, route, favoriteName } = req.query;
    const favorite = await this.favoritesService.findOne(
      preset,
      domain,
      route,
      favoriteName,
    );
    return favorite;
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("favorite")
  @ApiResponse({
    status: 201,
    description: "즐겨찾기 생성에 사용되는 API입니다.",
    type: PostFavoriteAddDto,
  })
  async postFavoriteAdd(@Request() req, @Body() dto: PostFavoriteAddDto) {
    const { mail } = req.user;
    const { presetName, favoriteData } = dto;
    const preset = await this.presetsService.findOne(mail, presetName);
    await this.favoritesService.add(preset, favoriteData);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("favorite")
  async deleteFavorite(@Request() req) {
    const preset = await this.getPreset(req);
    const { domain, route, favoriteName } = req.query;
    await this.favoritesService.remove(preset, domain, route, favoriteName);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("favorite")
  async putFavorite(@Request() req) {
    const preset = await this.getPreset(req);
    const { domain, route, favoriteName } = req.query;
    await this.favoritesService.update(preset, domain, route, favoriteName);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("favorite/visited")
  async getFavoriteVisited(@Request() req) {
    const preset = await this.getPreset(req);
    const { domain, route, favoriteName } = req.query;
    await this.favoritesService.updateVisitedTime(
      preset,
      domain,
      route,
      favoriteName,
    );
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("favorite/star")
  @ApiResponse({
    status: 201,
    description: "즐겨찾기 별표 핸들러 API입니다.",
    type: PostFavoriteHandleStarDto,
  })
  async postFavoriteHandleStar(
    @Request() req,
    @Body() dto: PostFavoriteHandleStarDto,
  ) {
    const { mail } = req.user;
    const { presetName, favoriteData } = dto;
    const preset = await this.presetsService.findOne(mail, presetName);
    await this.favoritesService.handleStar(preset, favoriteData);
    return { message: "success" };
  }
}
