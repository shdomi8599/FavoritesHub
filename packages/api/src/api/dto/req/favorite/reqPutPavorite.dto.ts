import { ApiProperty } from "@nestjs/swagger";
import { Favorite } from "src/source/entity";

export class ReqPutPavoriteDto {
  @ApiProperty({
    description: "즐겨찾기 데이터를 전달해주세요.",
    required: true,
  })
  favoriteData: Favorite;
}
