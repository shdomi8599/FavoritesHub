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

    if (!presets) {
      return [];
    }

    const presetsData = presets.map((data) => {
      delete data.user;
      delete data.favorites;
      return data;
    });

    return presetsData.sort((a, b) => a.order - b.order);
  }

  async findOne(presetId: number): Promise<Preset> {
    const preset = await this.presetTable.findOne({
      where: {
        id: presetId,
      },
    });
    return preset;
  }

  async exist(presets: Preset[], presetName: string) {
    const isSamePreset = presets
      ?.map(({ presetName }) => presetName)
      ?.includes(presetName);

    if (isSamePreset) {
      throw new Error("exist");
    }
  }

  async add(user: User, presetName: string) {
    const presets = await this.findAll(user.id);

    const presetLength = presets.length;
    const isMaxPreset = presetLength === 15;

    if (isMaxPreset) {
      throw new Error("max");
    }

    const newPreset = this.presetTable.create({
      user,
      presetName,
      order: presetLength ? presetLength + 1 : 0,
    });

    const preset = await this.presetTable.save(newPreset);
    return preset;
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
    const newPreset = await this.presetTable.save(preset);
    return newPreset;
  }

  async relocation(userId: number, presets: Preset[]) {
    const updatePromises = presets.map(({ id, order }) =>
      this.presetTable.update({ id, user: { id: userId } }, { order }),
    );
    await Promise.all(updatePromises);
  }
}
