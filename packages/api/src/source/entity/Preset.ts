import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Favorite } from "./Favorite";
import { User } from "./User";

@Entity("presets")
export class Preset {
  @ApiProperty({
    example: 1,
    description: "프리셋 고유 번호입니다.",
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ charset: "utf8" })
  @ApiProperty({
    example: "자주가는 사이트 모음",
    description: "프리셋 이름입니다.",
    required: true,
  })
  presetName: string;

  @Column({ default: false })
  @ApiProperty({
    example: true,
    description: "기본 프리셋 설정입니다.",
    required: true,
  })
  defaultPreset: boolean;

  @ManyToOne(() => User, (user) => user.presets)
  user: User;

  @OneToMany(() => Favorite, (favorite) => favorite.preset)
  favorites: Favorite[];
}
