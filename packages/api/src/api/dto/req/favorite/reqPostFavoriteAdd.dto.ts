import { ApiProperty } from "@nestjs/swagger";

export class ReqPostFavoriteAddDto {
  @ApiProperty({
    description: "즐겨찾기 이름을 전달해주세요.",
    required: true,
  })
  favoriteName: string;

  @ApiProperty({
    description: "주소를 전달해주세요.",
    required: true,
  })
  address: string;
}
