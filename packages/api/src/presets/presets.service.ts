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

  async findAll(
    userId: number,
  ): Promise<{ presetName: string; defaultPreset: boolean }[]> {
    const presets = await this.presetTable.find({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    const presetsData = presets?.map(({ presetName, id, defaultPreset }) => {
      const data = {
        presetName,
        id,
        defaultPreset,
      };
      return data;
    });

    return presetsData;
  }

  async findOne(presetId: number): Promise<Preset> {
    const preset = await this.presetTable.findOne({
      where: {
        id: presetId,
      },
    });
    return preset;
  }

  async exist(
    presets: {
      presetName: string;
      defaultPreset: boolean;
    }[],
    presetName: string,
  ) {
    const isSamePreset = presets
      ?.map(({ presetName }) => presetName)
      ?.includes(presetName);

    if (isSamePreset) {
      throw new Error("exist");
    }
  }

  async add(user: User, presetName: string) {
    const presets = await this.findAll(user.id);

    const isMaxPreset = presets.length === 15;

    if (isMaxPreset) {
      throw new Error("max");
    }

    await this.exist(presets, presetName);

    const defaultPreset = presets.find((preset) => preset.defaultPreset);

    const newPreset = this.presetTable.create({
      presetName,
      defaultPreset: defaultPreset ? false : true,
      user,
    });

    await this.presetTable.save(newPreset);
  }

  async remove(presetId: number) {
    const preset = await this.findOne(presetId);
    await this.presetTable.delete(preset);
  }

  async update(userId: number, presetId: number, newPresetName: string) {
    const preset = await this.findOne(presetId);

    const sameName = preset.presetName === newPresetName;

    if (sameName) {
      throw new Error("same");
    }

    const presets = await this.findAll(userId);

    await this.exist(presets, newPresetName);

    preset.presetName = newPresetName;
    await this.presetTable.save(preset);
  }

  async updateDefault(userId: number, presetId: number) {
    const presets = await this.findAll(userId);

    const currentDefaultPreset = presets.find((preset) => preset.defaultPreset);
    currentDefaultPreset.defaultPreset = false;
    await this.presetTable.save(currentDefaultPreset);

    const preset = await this.findOne(presetId);
    preset.defaultPreset = true;
    await this.presetTable.save(preset);
  }
}
