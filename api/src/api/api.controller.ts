import { Controller, Get, Res } from "@nestjs/common";
import { FavoriteService } from "src/favorite/favorite.service";
import { PresetService } from "src/preset/preset.service";
import { UserService } from "src/user/user.service";

@Controller("api")
export class ApiController {
  constructor(
    private readonly userService: UserService,
    private readonly presetService: PresetService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Get("user/all")
  async getAllUser(@Res() res: any) {
    const users = await this.userService.findAll();
    return res.json(users);
  }
}
