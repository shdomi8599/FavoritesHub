import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Preset } from "./Preset";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  @ApiProperty({
    example: "favoritesHub@gmail.com",
    description: "이메일을 입력해주세요.",
  })
  mail: string;

  @Column()
  @ApiProperty({
    example: "asdf1234!",
    description: "비밀번호를 입력해주세요.",
  })
  password: string;

  @Column()
  refreshToken: string;

  @Column({ type: "timestamp", default: () => "now()" })
  lastLogin: Date;

  @Column({ type: "timestamp", default: () => "now()" })
  createdAt: Date;

  @OneToMany(() => Preset, (preset) => preset.user)
  presets: Preset[];
}
