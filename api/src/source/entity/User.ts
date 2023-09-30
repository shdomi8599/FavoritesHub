import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Preset } from "./Preset";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mail: string;

  @Column()
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
