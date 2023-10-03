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
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  @ApiProperty({
    example: "제일 많이 보는 곳",
    description: "프리셋 이름을 입력해주세요.",
  })
  presetName: string;

  @ManyToOne(() => User, (user) => user.presets)
  user: User;

  @OneToMany(() => Favorite, (favorite) => favorite.preset)
  favorites: Favorite[];
}
