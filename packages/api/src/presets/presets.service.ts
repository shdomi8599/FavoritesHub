import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Preset } from "src/source/entity/Preset";
import { User } from "src/source/entity/User";
import { Repository } from "typeorm";

@Injectable()
export class PresetsService {
  constructor(
    @InjectRepository(Preset)
    private presetTable: Repository<Preset>,
  ) {}

  async findAll(userId: number): Promise<Preset[]> {
    const presets = await this.presetTable.find({
      where: { user: { id: userId } },
      relations: ["user"],
    });
    if (!presets) {
      throw new Error("프리셋 리스트를 찾을 수 없습니다.");
    }
    return presets;
  }

  async findOne(presetId: number): Promise<Preset> {
    const preset = await this.presetTable.findOne({
      where: {
        id: presetId,
      },
    });
    if (!preset) {
      throw new Error("프리셋을 찾을 수 없습니다.");
    }
    return preset;
  }

  async add(user: User, presetName: string) {
    const { id: userId } = user;
    const presets = await this.findAll(userId);
    const isSamePreset = presets
      .map((preset) => preset.presetName)
      .includes(presetName);

    if (isSamePreset) {
      throw new Error("같은 이름의 프리셋이 존재합니다.");
    }

    const isFirstPreset = presets.length === 0;

    const newPreset = this.presetTable.create({
      presetName,
      defaultPreset: isFirstPreset ? true : false,
      user,
    });
    await this.presetTable.save(newPreset);
  }

  async remove(presetId: number) {
    const preset = await this.findOne(presetId);
    await this.presetTable.delete(preset);
  }

  async update(presetId: number, newPresetName: string) {
    const preset = await this.findOne(presetId);
    preset.presetName = newPresetName;
    await this.presetTable.save(preset);
  }
}
