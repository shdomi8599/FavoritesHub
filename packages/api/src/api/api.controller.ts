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
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import NodeCache from "node-cache";
import { AuthService } from "src/auth/auth.service";
import { FavoritesService } from "src/favorites/favorites.service";
import { PresetsService } from "src/presets/presets.service";
import { Favorite, Preset, User } from "src/source/entity";
import { UsersService } from "src/users/users.service";
import { generateRandomNumber } from "src/util";
import { ReqPostAuthLoginDto } from "./dto/req/auth";
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

  // @UseGuards(AuthGuard("local"))
  @Post("auth/login")
  @ApiResponse({
    status: 201,
    description: "유저 로그인에 사용되는 API입니다.",
    type: ResPostAuthLoginDto,
  })
  async postAuthLogin(
    @Request() req,
    @Res({ passthrough: true }) res,
    @Body() dto: ReqPostAuthLoginDto,
  ) {
    try {
      const cookieRefreshToken = req?.cookies?.refreshToken;

      const { mail, password } = dto;

      let user: User;
      if (cookieRefreshToken) {
        user = await this.usersService.validRefreshToken(
          mail,
          cookieRefreshToken,
        );
      } else {
        user = await this.usersService.findOneToMail(mail);
      }
      await this.usersService.checkPassword(user, password);

      const { verify } = user;

      if (!verify) {
        return { message: "not verify", userId: user.id };
      }

      const tokens = await this.authService.login(user);
      const { accessToken, refreshToken } = tokens;

      await this.usersService.updateRefreshToken(user, refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
      });

      await this.usersService.updateloginTime(user);

      return { accessToken, userId: user.id };
    } catch (e) {
      const { message } = e;
      return { message };
    }
  }

  // @UseGuards(AuthGuard("jwt"))
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

  // @UseGuards(AuthGuard("jwt"))
  @Post("auth/logout")
  @ApiResponse({
    status: 201,
    description: "로그아웃 API입니다.",
    type: ResSuccessMessageDto,
  })
  async postAuthLogout(
    @Res({ passthrough: true }) res,
    @Body() dto: { userId: number },
  ) {
    const { userId } = dto;
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

  // @UseGuards(AuthGuard("jwt"))
  @Post("auth/mail")
  @ApiResponse({
    status: 200,
    description: "유저 이메일 보내기에 사용되는 API입니다.",
  })
  async getAuthMail(@Body() dto: { userMail: string }) {
    const { userMail } = dto;
    const user = await this.usersService.findOneToMail(userMail);
    const verifyCode = generateRandomNumber();
    myCache.set(user.id, verifyCode, 180);
    await this.authService.mail(user, verifyCode);
  }

  // @UseGuards(AuthGuard("jwt"))
  @Post("auth/verify")
  @ApiResponse({
    status: 200,
    description: "유저 이메일 인증에 사용되는 API입니다.",
  })
  async postAuthVerify(@Body() dto: { userMail: string; verifyCode: string }) {
    const { userMail, verifyCode } = dto;
    const user = await this.usersService.findOneToMail(userMail);
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

  // @UseGuards(AuthGuard("jwt"))
  @Post("auth/verify/login")
  @ApiResponse({
    status: 200,
    description: "유저 이메일 인증 직후 로그인에 사용되는 API입니다.",
  })
  async postAuthVerifyLogin(
    @Res({ passthrough: true }) res,
    @Body() dto: { userMail: string },
  ) {
    const { userMail } = dto;
    const user = await this.usersService.findOneToMail(userMail);
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    await this.usersService.updateRefreshToken(user, refreshToken);

    await this.usersService.updateloginTime(user);

    return { accessToken, userId: user.id };
  }

  // @UseGuards(AuthGuard("local"))
  @Post("user/exist")
  @ApiResponse({
    status: 200,
    description: "유저 조회 API입니다.",
  })
  async postExistUser(@Body() dto: { mail: string }) {
    const { mail } = dto;
    const user = await this.usersService.findOneToMail(mail);
    return user;
  }

  // @UseGuards(AuthGuard("local"))
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

  // @UseGuards(AuthGuard("jwt"))
  @Put("user")
  @ApiResponse({
    status: 200,
    description: "유저 비밀번호 변경에 사용되는 API입니다.",
  })
  async updateUserPassword(
    @Body() dto: { userMail: string; newPassword: string },
  ) {
    const { userMail, newPassword } = dto;
    const user = await this.usersService.findOneToMail(userMail);
    await this.usersService.updatePassword(user, newPassword);
    return { message: "success" };
  }

  // @UseGuards(AuthGuard("jwt"))
  @Delete("user/:userId")
  @ApiResponse({
    status: 200,
    description: "유저 회원탈퇴에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async deleteUser(@Param("userId") userId: number) {
    await this.usersService.remove(userId);
    return { message: "success" };
  }

  // @UseGuards(AuthGuard("jwt"))
  @Get("preset/list/:userId")
  @ApiResponse({
    status: 200,
    description: "유저 프리셋 리스트 조회에 사용되는 API입니다.",
    type: [Preset],
  })
  async getPresetList(@Param("userId") userId: number) {
    const presets = await this.presetsService.findAll(userId);
    return presets;
  }

  // @UseGuards(AuthGuard("jwt"))
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

  // @UseGuards(AuthGuard("jwt"))
  @Post("preset/:userId")
  @ApiResponse({
    status: 201,
    description: "프리셋 생성에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async postPresetAdd(
    @Param("userId") userId: number,
    @Body() dto: ReqPostPresetAddDto,
  ) {
    try {
      const user = await this.usersService.findOneToId(userId);
      const { presetName } = dto;
      await this.presetsService.add(user, presetName);
      return { message: "success" };
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

  // @UseGuards(AuthGuard("jwt"))
  @Delete("preset/:presetId")
  @ApiResponse({
    status: 200,
    description: "프리셋 삭제에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async deletePreset(@Param("presetId") presetId: number) {
    await this.presetsService.remove(presetId);
  }

  // @UseGuards(AuthGuard("jwt"))
  @Put("preset/:userId/:presetId")
  @ApiResponse({
    status: 200,
    description: "프리셋 수정에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async putPreset(
    @Param("userId") userId: number,
    @Param("presetId") presetId: number,
    @Body() dto: ReqPutPresetDto,
  ) {
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

  // @UseGuards(AuthGuard("jwt"))
  @Post("preset/:userId/:presetId")
  @ApiResponse({
    status: 200,
    description: "프리셋 디폴트 변경에 사용되는 API입니다.",
  })
  async putDefaultPreset(
    @Param("userId") userId: number,
    @Param("presetId") presetId: number,
  ) {
    await this.presetsService.updateDefault(userId, presetId);
  }

  // @UseGuards(AuthGuard("jwt"))
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

  // @UseGuards(AuthGuard("jwt"))
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

  // @UseGuards(AuthGuard("jwt"))
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
    }
  }

  // @UseGuards(AuthGuard("jwt"))
  @Delete("favorite/:favoriteId")
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 삭제에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async deleteFavorite(@Param("favoriteId") favoriteId: number) {
    await this.favoritesService.remove(favoriteId);
  }

  // @UseGuards(AuthGuard("jwt"))
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

  // @UseGuards(AuthGuard("jwt"))
  @Get("favorite/visited/:favoriteId")
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 방문 날짜기록에 사용되는 API입니다.",
    type: ResSuccessMessageDto,
  })
  async getFavoriteVisited(@Param("favoriteId") favoriteId: number) {
    await this.favoritesService.updateVisitedTime(favoriteId);
  }

  // @UseGuards(AuthGuard("jwt"))
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
