import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Preset } from "src/source/entity/Preset";
import { User } from "src/source/entity/User";
import { UserService } from "src/user/user.service";
import { PresetService } from "./preset.service";

@Module({
  imports: [TypeOrmModule.forFeature([Preset, User])],
  providers: [PresetService, UserService],
  exports: [PresetService],
})
export class PresetModule {}
