import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResGetAuthRefreshTokenDto {
  @ApiProperty({
    example: "qwe321312dass456dwq45d6we4wq859d46wqwqd54qw",
    description: "리프레시 토큰입니다.",
    required: true,
  })
  @IsString()
  refreshToken: string;
}
