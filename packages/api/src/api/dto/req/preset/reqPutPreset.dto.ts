import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReqPutPresetDto {
  @ApiProperty({
    example: "매일 방문하는 사이트들",
    description: "새로운 프리셋 이름을 전달해주세요.",
    required: true,
  })
  @IsString()
  newPresetName: string;
}
