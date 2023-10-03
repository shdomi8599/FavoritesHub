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
  favoriteName: string;

  @Column()
  domain: string;

  @Column()
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
