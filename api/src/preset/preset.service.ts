import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Preset } from "src/source/entity/Preset";
import { Repository } from "typeorm";

@Injectable()
export class PresetService {
  constructor(
    @InjectRepository(Preset)
    private Preset: Repository<Preset>,
  ) {}

  async findAll(): Promise<Preset[]> {
    const Preset = await this.Preset.find();
    return Preset;
  }
}
