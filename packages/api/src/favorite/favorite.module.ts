import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PresetService } from "src/preset/preset.service";
import { Favorite } from "src/source/entity/Favorite";
import { Preset } from "src/source/entity/Preset";
import { User } from "src/source/entity/User";
import { UserService } from "src/user/user.service";
import { FavoriteService } from "./favorite.service";

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Preset, User])],
  providers: [FavoriteService, PresetService, UserService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
