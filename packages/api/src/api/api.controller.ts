import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  @Get("preset/:presetId")
  async getPreset(@Param("presetId") presetId: number) {
    const preset = await this.presetsService.findOne(presetId);
    return preset;
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("preset/:userId")
  @ApiResponse({
    status: 201,
    description: "프리셋 생성에 사용되는 API입니다.",
    type: PostPresetAddDto,
  })
  async postPresetAdd(
    @Param("userId") userId: number,
    @Body() dto: PostPresetAddDto,
  ) {
    const user = await this.usersService.findOneToId(userId);
    const { presetName } = dto;
    await this.presetsService.add(user, presetName);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("preset/:presetId")
  async deletePreset(@Param("presetId") presetId: number) {
    await this.presetsService.remove(presetId);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("preset/:presetId")
  async putPreset(
    @Param("presetId") presetId: number,
    @Body() dto: { newPresetName: string },
  ) {
    const { newPresetName } = dto;
    await this.presetsService.update(presetId, newPresetName);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("favorite/:presetId")
  async getFavoriteList(@Param("presetId") presetId: number) {
    const preset = await this.getPreset(presetId);
    const favorites = await this.favoritesService.findAll(preset);
    return favorites;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("favorite/:favoriteId")
  async getFavorite(@Param("favoriteId") favoriteId: number) {
    const favorite = await this.favoritesService.findOne(favoriteId);
    return favorite;
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("favorite/:presetId")
  @ApiResponse({
    status: 201,
    description: "즐겨찾기 생성에 사용되는 API입니다.",
    type: PostFavoriteAddDto,
  })
  async postFavoriteAdd(
    @Param("presetId") presetId: number,
    @Body() dto: PostFavoriteAddDto,
  ) {
    const { favoriteData } = dto;
    const preset = await this.presetsService.findOne(presetId);
    await this.favoritesService.add(preset, favoriteData);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("favorite/:favoriteId")
  async deleteFavorite(@Param("favoriteId") favoriteId: number) {
    await this.favoritesService.remove(favoriteId);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("favorite/:favoriteId")
  async putFavorite(
    @Param("favoriteId") favoriteId: number,
    @Body() dto: PostFavoriteAddDto,
  ) {
    const { favoriteData } = dto;
    await this.favoritesService.update(favoriteId, favoriteData);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("favorite/visited/:favoriteId")
  async getFavoriteVisited(@Param("favoriteId") favoriteId: number) {
    await this.favoritesService.updateVisitedTime(favoriteId);
    return { message: "success" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("favorite/star/:favoriteId")
  @ApiResponse({
    status: 201,
    description: "즐겨찾기 별표 핸들러 API입니다.",
    type: PostFavoriteHandleStarDto,
  })
  async postFavoriteHandleStar(@Param("favoriteId") favoriteId: number) {
    await this.favoritesService.handleStar(favoriteId);
    return { message: "success" };
  }
}
