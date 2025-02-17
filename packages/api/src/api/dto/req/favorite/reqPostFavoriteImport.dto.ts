import { ApiProperty } from "@nestjs/swagger";

export interface ImportFavorite {
  address: string;
  [key: string]: any;
}

export class ReqPostFavoriteImportDto {
  @ApiProperty({
    example: "",
    description: "즐겨찾기 주소들을 전달해주세요.",
    required: true,
  })
  presetId: number;
  favorites: ImportFavorite[];
}
