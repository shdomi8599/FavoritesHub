import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PostAuthLoginDto {
  @ApiProperty({
    example: "favorites@gmail.com",
    description: "이메일을 전달해주세요.",
    required: true,
  })
  @IsString()
  mail: string;

  @ApiProperty({
    example: "asdf1234!",
    description: "비밀번호를 전달해주세요.",
    required: true,
  })
  @IsString()
  password: string;
}
