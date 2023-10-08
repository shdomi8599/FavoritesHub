import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/source/entity";
import { Preset } from "src/source/entity/Preset";
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
    const presets = await this.findAll(user.id);

    const isSamePreset = presets
      ?.map((preset) => preset.presetName)
      ?.includes(presetName);

    if (isSamePreset) {
      throw new Error("exist");
    }

    const isFirstPreset = presets.length === 0;

    const newPreset = this.presetTable.create({
      presetName,
      defaultPreset: isFirstPreset,
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
