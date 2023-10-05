import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResSuccessMessageDto {
  @ApiProperty({
    example: "success",
    description: "성공 메세지를 반환합니다.",
    required: true,
  })
  @IsString()
  message: string;
}
