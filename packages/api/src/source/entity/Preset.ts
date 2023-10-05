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
  presetName: string;

  @Column({ default: false })
  defaultPreset: boolean;

  @ManyToOne(() => User, (user) => user.presets)
  user: User;

  @OneToMany(() => Favorite, (favorite) => favorite.preset)
  favorites: Favorite[];
}
