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
  @ApiProperty({
    example: 1,
    description: "아이디 고유 번호입니다.",
    required: true,
  })
  id: number;

  @Index({ unique: true })
  @Column()
  @ApiProperty({
    example: "favorite@gmail.com",
    description: "이메일 주소입니다.",
    required: true,
  })
  mail: string;

  @Column()
  @ApiProperty({
    example: "asdf1234!",
    description: "비밀번호입니다.",
    required: true,
  })
  password: string;

  @Column({ default: false })
  @ApiProperty({
    example: true,
    description: "이메일 인증 확인 테이블입니다.",
    required: true,
  })
  verify: boolean;

  @Column({ default: false })
  googleId: boolean;

  @Column()
  @ApiProperty({
    example: "dqwdwd1d1w322423dsw1e12d21d12",
    description: "발급받은 리프레시 토큰입니다.",
    required: true,
  })
  refreshToken: string;

  @Column({ type: "timestamp", default: () => "now()" })
  @ApiProperty({
    example: "2022-05-20 17:20:00",
    description: "마지막 접속 시간입니다.",
  })
  lastLogin: Date;

  @Column({ type: "timestamp", default: () => "now()" })
  @ApiProperty({
    example: "2022-05-20 17:20:00",
    description: "아이디를 생성한 시간입니다.",
  })
  createdAt: Date;

  @OneToMany(() => Preset, (preset) => preset.user)
  presets: Preset[];
}
