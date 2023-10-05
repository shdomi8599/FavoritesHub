import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResPostAuthLoginDto {
  @ApiProperty({
    example: "qwe456dwq45d6we4wq859d46wqwqd54qw",
    description: "엑세스 토큰입니다.",
    required: true,
  })
  @IsString()
  accessToken: string;
}
