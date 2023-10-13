import { ApiProperty } from "@nestjs/swagger";

export class ReqPutPavoriteDto {
  @ApiProperty({
    description: "즐겨찾기 별칭을 전달해주세요.",
    required: true,
  })
  newFavoriteName: string;
}
