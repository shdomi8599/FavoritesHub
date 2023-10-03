import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PostAuthLogoutDto {
  @ApiProperty({
    example: "favorites@gmail.com",
    description: "이메일을 전달해주세요.",
    required: true,
  })
  @IsString()
  mail: string;
}
