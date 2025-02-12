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
    description: "주소를 전달해주세요.",
    required: true,
  })
  address: string;

  @Column({ charset: "utf8" })
  title: string;

  @Column({ charset: "utf8" })
  description: string;

  @Column({ charset: "utf8" })
  imgHref: string;

  @Column({ default: false })
  @ApiProperty({
    description: "즐겨찾기 별표 핸들러에 사용되는 값입니다.",
  })
  star: boolean;

  @Column({ default: 0 })
  @ApiProperty({
    description: "즐겨찾기의 카운트입니다.",
  })
  visitedCount: number;

  @Column({ type: "timestamp", default: () => "now()" })
  lastVisitedAt: Date;

  @Column({ type: "timestamp", default: () => "now()" })
  createdAt: Date;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Preset, (preset) => preset.favorites)
  preset: Preset;
}
