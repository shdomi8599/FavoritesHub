import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Preset } from "./Preset";

@Entity("favorites")
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ charset: "utf8" })
  @ApiProperty({
    example: "백종원 레시피",
    description: "즐겨찾기의 별칭을 전달해주세요.",
    required: true,
  })
  favoriteName: string;

  @Column({ charset: "utf8" })
  @ApiProperty({
    example: "naver.com",
    description: "도메인을 전달해주세요.",
    required: true,
  })
  domain: string;

  @Column({ charset: "utf8" })
  @ApiProperty({
    example: "/",
    description: "도메인 뒤의 라우트 부분을 전달해주세요.",
    required: true,
  })
  route: string;

  @Column({ default: false })
  @ApiProperty({
    description: "즐겨찾기 별표 핸들러에 사용되는 값입니다.",
  })
  star: boolean;

  @Column({ type: "timestamp", default: () => "now()" })
  lastVisitedAt: Date;

  @Column({ type: "timestamp", default: () => "now()" })
  createdAt: Date;

  @ManyToOne(() => Preset, (preset) => preset.favorites)
  preset: Preset;
}
