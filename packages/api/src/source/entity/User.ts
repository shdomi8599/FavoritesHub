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
  mail: string;

  @Column()
  password: string;

  @Column({ default: false })
  verify: boolean;

  @Column()
  refreshToken: string;

  @Column({ type: "timestamp", default: () => "now()" })
  lastLogin: Date;

  @Column({ type: "timestamp", default: () => "now()" })
  createdAt: Date;

  @OneToMany(() => Preset, (preset) => preset.user)
  presets: Preset[];
}
