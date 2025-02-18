import { ApiProperty } from "@nestjs/swagger";

export class ReqPostFavoriteTransferDto {
  @ApiProperty({
    example: "",
    description: "이전할 프리셋 아이디와 기존 데이터들을 전달해주세요.",
    required: true,
  })
  presetId: number;
  targetPresetId: number;
  favoriteId: number;
}
