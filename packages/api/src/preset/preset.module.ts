import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Preset } from "src/source/entity/Preset";
import { PresetService } from "./preset.service";

@Module({
  imports: [TypeOrmModule.forFeature([Preset])],
  providers: [PresetService],
  exports: [PresetService],
})
export class PresetModule {}
