import { ApiProperty } from "@nestjs/swagger";
import { Preset } from "src/source/entity";

export class ReqPostPresetRelocationDto {
  @ApiProperty({
    example: "",
    description: "프리셋 데이터들을 전달해주세요.",
    required: true,
  })
  presets: Preset[];
}
