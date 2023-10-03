import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Preset } from "src/source/entity/Preset";
import { User } from "src/source/entity/User";
import { Repository } from "typeorm";

@Injectable()
export class PresetService {
  constructor(
    @InjectRepository(Preset)
    private presetTable: Repository<Preset>,
  ) {}

  async findAll(mail: string): Promise<Preset[]> {
    const presets = await this.presetTable.find({
      where: { user: { mail } },
      relations: ["user"],
    });
    if (!presets) {
      throw new Error("프리셋 리스트를 찾을 수 없습니다.");
    }
    return presets;
  }

  async findOne(mail: string, presetName: string): Promise<Preset> {
    const preset = await this.presetTable.findOne({
      where: {
        user: { mail },
        presetName: presetName,
      },
      relations: ["user"],
    });
    if (!preset) {
      throw new Error("프리셋을 찾을 수 없습니다.");
    }
    return preset;
  }

  async add(user: User, presetData: Preset) {
    const { mail } = user;
    const { presetName } = presetData;
    const preset = await this.findOne(mail, presetName);
    if (preset) {
      throw new Error("같은 이름의 프리셋이 존재합니다.");
    }
    const newPreset = this.presetTable.create({
      ...presetData,
      user,
    });
    await this.presetTable.save(newPreset);
  }

  async remove(mail: string, presetName: string) {
    const preset = await this.findOne(mail, presetName);
    await this.presetTable.delete(preset);
  }

  async update(mail: string, presetName: string, newPresetName: string) {
    const preset = await this.findOne(mail, presetName);
    preset.presetName = newPresetName;
    await this.presetTable.save(preset);
  }
}
