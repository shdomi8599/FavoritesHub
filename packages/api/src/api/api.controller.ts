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
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import NodeCache from "node-cache";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard, LocalAuthGuard } from "src/auth/guard";
import { FavoritesService } from "src/favorites/favorites.service";
import { PresetsService } from "src/presets/presets.service";
import { Favorite, Preset } from "src/source/entity";
import { UsersService } from "src/users/users.service";
import { generateRandomNumber } from "src/util";
import { ReqPostFavoriteAddDto, ReqPutPavoriteDto } from "./dto/req/favorite";
import { ReqPostPresetAddDto, ReqPutPresetDto } from "./dto/req/preset";
import { ReqPostUserSignUpDto } from "./dto/req/user";
import {
  ResGetAuthAccessTokenDto,
  ResGetAuthRefreshTokenDto,
  ResPostAuthLoginDto,
} from "./dto/res/auth";
import { ResSuccessMessageDto } from "./dto/res/resSuccessMessage.dto";

const myCache = new NodeCache({ checkperiod: 120 });

@ApiTags("api")
@Controller("api")
export class ApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly presetsService: PresetsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @ApiResponse({
    status: 201,
    description: "유저 로그인에 사용되는 API입니다.",
    type: ResPostAuthLoginDto,
  })
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const user = req.user;
    try {
      const { verify } = user;
      if (!verify) {
        return { message: "not verify", userId: user.id };
      }

      const tokens = await this.authService.login(user);
      const { accessToken, refreshToken } = tokens;
      await this.usersService.updateloginTime(user);
      await this.usersService.updateRefreshToken(user, refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
      });

      return { accessToken, userId: user.id };
    } catch (e) {
      const { message } = e;
      return { message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("auth/refreshToken")
  @ApiResponse({
    status: 200,
    description: "리프레시 토큰을 반환하는 API입니다.",
    type: ResGetAuthRefreshTokenDto,
  })
  async getAuthRefreshToken(@Request() req) {
    const { mail } = req.user;
    const refreshToken = await this.authService.getRefreshToken(mail);
    await this.usersService.updateRefreshToken(mail, refreshToken);
    return { refreshToken };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("auth/logout")
  @ApiResponse({
    status: 201,
    description: "로그아웃 API입니다.",
    type: ResSuccessMessageDto,
  })
  async postAuthLogout(@Request() req, @Res({ passthrough: true }) res) {
    const { userId } = req.user;
    res.clearCookie("refreshToken");
    const user = await this.usersService.findOneToId(userId);
    await this.usersService.updateRefreshToken(user, "");
    return { message: "success" };
  }

  // @UseGuards(AuthGuard("jwt-refresh"))
  @Get("auth/accessToken")
  @ApiResponse({
    status: 200,
    description:
      "리프레시 토큰이 유효한지 체크하고 엑세스 토큰을 반환하는 API입니다.",
    type: ResGetAuthAccessTokenDto,
  })
  async getAuthAccessToken(@Request() req) {
    const accessToken = await this.authService.getAccessToken(req.user);
    return { accessToken };
  }

  @Post("auth/mail")
  @ApiResponse({
    status: 200,
    description: "유저 이메일 보내기에 사용되는 API입니다.",
  })
  async getAuthMail(@Body() dto: { username: string }) {
    const { username } = dto;
    const user = await this.usersService.findOneToMail(username);
    const verifyCode = generateRandomNumber();
    myCache.set(user.id, verifyCode, 180);
    await this.authService.mail(user, verifyCode);
  }

  @Post("auth/verify")
  @ApiResponse({
    status: 200,
    description: "유저 이메일 인증에 사용되는 API입니다.",
  })
  async postAuthVerify(@Body() dto: { username: string; verifyCode: string }) {
    const { username, verifyCode } = dto;
    const user = await this.usersService.findOneToMail(username);
    const cashingVerifyCode = myCache.get(user.id) as string;
    const isVerify = await this.authService.verify(
      cashingVerifyCode,
      verifyCode,
    );
    if (isVerify) {
      await this.usersService.updateVerify(user);
      return { message: "success" };
    }
    return { message: "not verify" };
  }

  @UseGuards(JwtAuthGuard)
  @Post("auth/verify/login")
  @ApiResponse({
    status: 200,
    description: "유저 이메일 인증 직후 로그인에 사용되는 API입니다.",
  })
  async postAuthVerifyLogin(
    @Res({ passthrough: true }) res,
    @Body() dto: { username: string },
  ) {
    const { username } = dto;
    const user = await this.usersService.findOneToMail(username);
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    await this.usersService.updateRefreshToken(user, refreshToken);

    await this.usersService.updateloginTime(user);

    return { accessToken, userId: user.id };
  }

  @Post("user/exist")
  @ApiResponse({
    status: 200,
    description: "회원 가입 유효성 검사에 사용할 유저 조회 API입니다.",
  })
  async postExistUser(@Body() dto: { mail: string }) {
    const { mail } = dto;
    const user = await this.usersService.findOneToMail(mail);
    return user;
  }

  @Post("user")
  @ApiResponse({
    status: 201,
    description: "유저 회원가입에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async postUserSignUp(@Body() dto: ReqPostUserSignUpDto) {
    try {
      const { mail, password } = dto;
      await this.usersService.add(mail, password);
      return { message: "success" };
    } catch (e) {
      if (e.message === "exist") {
        return { message: "exist" };
      }
    }
  }

  @Put("user")
  @ApiResponse({
    status: 200,
    description: "유저 비밀번호 변경에 사용되는 API입니다.",
  })
  async updateUserPassword(
    @Body() dto: { username: string; newPassword: string },
  ) {
    const { username, newPassword } = dto;
    const user = await this.usersService.findOneToMail(username);
    await this.usersService.updatePassword(user, newPassword);
    return { message: "success" };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("user")
  @ApiResponse({
    status: 200,
    description: "유저 회원탈퇴에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async deleteUser(@Request() req) {
    const { userId } = req.user;
    const presets = await this.presetsService.findAll(userId);

    if (presets && presets.length > 0) {
      presets.map(async (preset) => {
        await this.deletePreset(preset.id);
      });
    }

    await this.usersService.remove(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("preset/list")
  @ApiResponse({
    status: 200,
    description: "유저 프리셋 리스트 조회에 사용되는 API입니다.",
    type: [Preset],
  })
  async getPresetList(@Request() req) {
    const { userId } = req.user;
    const presets = await this.presetsService.findAll(userId);
    return presets;
  }

  @UseGuards(JwtAuthGuard)
  @Get("preset/:presetId")
  @ApiResponse({
    status: 200,
    description: "프리셋 조회에 사용되는 API입니다.",
    type: Preset,
  })
  async getPreset(@Param("presetId") presetId: number) {
    const preset = await this.presetsService.findOne(presetId);
    return preset;
  }

  @UseGuards(JwtAuthGuard)
  @Post("preset")
  @ApiResponse({
    status: 201,
    description: "프리셋 생성에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async postPresetAdd(@Request() req, @Body() dto: ReqPostPresetAddDto) {
    const { userId } = req.user;
    try {
      const user = await this.usersService.findOneToId(userId);
      const { presetName } = dto;
      const preset = await this.presetsService.add(user, presetName);
      delete preset.user;
      return { preset };
    } catch (e) {
      const { message } = e;

      if (message === "max") {
        return { message: "max" };
      }

      if (message === "exist") {
        return { message: "exist" };
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("preset/:presetId")
  @ApiResponse({
    status: 200,
    description: "프리셋 삭제에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async deletePreset(@Param("presetId") presetId: number) {
    const favorites = await this.favoritesService.findAll(presetId);

    if (favorites && favorites.length > 0) {
      for (const favorite of favorites) {
        await this.favoritesService.remove(favorite.id);
      }
    }

    await this.presetsService.remove(presetId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("preset/:presetId")
  @ApiResponse({
    status: 200,
    description: "프리셋 수정에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async putPreset(
    @Request() req,
    @Param("presetId") presetId: number,
    @Body() dto: ReqPutPresetDto,
  ) {
    const { userId } = req.user;
    try {
      const { newPresetName } = dto;
      await this.presetsService.update(userId, presetId, newPresetName);
      return { message: "success" };
    } catch (e) {
      const { message } = e;

      if (message === "same") {
        return { message: "same" };
      }

      if (message === "exist") {
        return { message: "exist" };
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("preset/default/:presetId")
  @ApiResponse({
    status: 200,
    description: "프리셋 디폴트 변경에 사용되는 API입니다.",
  })
  async postDefaultPreset(@Request() req, @Param("presetId") presetId: number) {
    const { userId } = req.user;
    const preset = await this.presetsService.updateDefault(userId, presetId);
    return preset;
  }

  @UseGuards(JwtAuthGuard)
  @Get("favorite/list/:presetId")
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 리스트 조회에 사용되는 API입니다.",
    type: [Favorite],
  })
  async getFavoriteList(@Param("presetId") presetId: number) {
    const favorites = await this.favoritesService.findAll(presetId);
    return favorites;
  }

  @UseGuards(JwtAuthGuard)
  @Get("favorite/:favoriteId")
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 조회에 사용되는 API입니다.",
    type: Favorite,
  })
  async getFavorite(@Param("favoriteId") favoriteId: number) {
    const favorite = await this.favoritesService.findOne(favoriteId);
    return favorite;
  }

  @UseGuards(JwtAuthGuard)
  @Post("favorite/:presetId")
  @ApiResponse({
    status: 201,
    description: "즐겨찾기 생성에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async postFavoriteAdd(
    @Param("presetId") presetId: number,
    @Body() dto: ReqPostFavoriteAddDto,
  ) {
    try {
      const { favoriteName, address } = dto;
      const preset = await this.presetsService.findOne(presetId);
      await this.favoritesService.add(preset, favoriteName, address);
      return { message: "success" };
    } catch (e) {
      const { message } = e;
      if (message === "not exact") {
        return { message: "not exact" };
      }

      if (message === "cors") {
        return { message: "cors" };
      }

      if (message === "exist") {
        return { message: "exist" };
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("favorite/:favoriteId")
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 삭제에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async deleteFavorite(@Param("favoriteId") favoriteId: number) {
    await this.favoritesService.remove(favoriteId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("favorite/:favoriteId")
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 수정에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async putFavorite(
    @Param("favoriteId") favoriteId: number,
    @Body() dto: ReqPutPavoriteDto,
  ) {
    const { favoriteData } = dto;
    await this.favoritesService.update(favoriteId, favoriteData);
    return { message: "success" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("favorite/visited/:favoriteId")
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 방문 날짜기록에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async getFavoriteVisited(@Param("favoriteId") favoriteId: number) {
    await this.favoritesService.updateVisitedTime(favoriteId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("favorite/star/:favoriteId")
  @ApiResponse({
    status: 201,
    description: "즐겨찾기 별표 핸들러 API입니다.",
    type: ResSuccessMessageDto,
  })
  async getFavoriteHandleStar(@Param("favoriteId") favoriteId: number) {
    await this.favoritesService.handleStar(favoriteId);
  }
}
