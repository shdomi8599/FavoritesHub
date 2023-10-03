import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PostPresetAddDto {
  @ApiProperty({
    example: "매일 방문하는 사이트들",
    description: "프리셋 데이터를 전달해주세요.",
    required: true,
  })
  @IsString()
  presetName: string;
}
