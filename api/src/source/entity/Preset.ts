import {
  Column,
  Entity,
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

  @Column()
  presetName: string;

  @ManyToOne(() => User, (user) => user.presets)
  user: User;

  @OneToMany(() => Favorite, (favorite) => favorite.preset)
  favorites: Favorite[];
}
