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
  domain: string;

  @Column()
  route: string;

  @ManyToOne(() => Preset, (preset) => preset.favorites)
  preset: Preset;
}
