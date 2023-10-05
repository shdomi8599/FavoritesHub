import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Preset } from "src/source/entity/Preset";
import { PresetsService } from "./presets.service";

@Module({
  imports: [TypeOrmModule.forFeature([Preset])],
  providers: [PresetsService],
  exports: [PresetsService],
})
export class PresetsModule {}
