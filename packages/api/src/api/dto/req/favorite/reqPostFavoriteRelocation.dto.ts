import { ApiProperty } from "@nestjs/swagger";

export class ReqPostFavoriteRelocationDto {
  @ApiProperty({
    example: "",
    description: "즐겨찾기 아이디와 순서를 전달해주세요.",
    required: true,
  })
  presetId: number;
  orderList: { id: number; order: number }[];
}
