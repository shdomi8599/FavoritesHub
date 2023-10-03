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
  @Column()
  @ApiProperty({
    example: "김치찌개 레시피",
    description: "즐겨찾기 이름을 입력해주세요.",
  })
  favoriteName: string;

  @Column()
  @ApiProperty({
    example: "naver.com",
    description: "도메인을 입력해주세요.",
  })
  domain: string;

  @Column()
  @ApiProperty({
    example: "/",
    description: "도메인 이후의 값을 입력해주세요.",
  })
  route: string;

  @Column({ default: false })
  star: boolean;

  @Column({ type: "timestamp", default: () => "now()" })
  lastVisitedAt: Date;

  @Column({ type: "timestamp", default: () => "now()" })
  createdAt: Date;

  @ManyToOne(() => Preset, (preset) => preset.favorites)
  preset: Preset;
}
