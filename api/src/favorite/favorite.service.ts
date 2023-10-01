import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PresetService } from "src/preset/preset.service";
import { Favorite } from "src/source/entity/Favorite";
import { Repository } from "typeorm";

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteTable: Repository<Favorite>,
    private readonly presetService: PresetService,
  ) {}

  async findAll(mail: string, presetName: string): Promise<Favorite[]> {
    const preset = await this.presetService.findOne(mail, presetName);
    const { favorites } = preset;
    if (!favorites) {
      throw new Error("즐겨찾기 리스트를 찾을 수 없습니다.");
    }
    return favorites;
  }

  async findOne(
    mail: string,
    presetName: string,
    favoriteData: Partial<Favorite>,
  ): Promise<Favorite> {
    const preset = await this.presetService.findOne(mail, presetName);
    const { domain, route, favoriteName } = favoriteData;
    const favorite = await this.favoriteTable.findOne({
      where: {
        preset,
        favoriteName,
        domain,
        route,
      },
      relations: ["preset"],
    });
    if (!favorite) {
      throw new Error("즐겨찾기를 찾을 수 없습니다.");
    }
    return favorite;
  }

  async add(mail: string, presetName: string, favoriteData: Partial<Favorite>) {
    const preset = await this.presetService.findOne(mail, presetName);
    const favorite = await this.findOne(mail, presetName, favoriteData);
    if (favorite) {
      throw new Error("같은 이름의 즐겨찾기가 존재합니다.");
    }
    const newFavorite = this.favoriteTable.create({
      ...favoriteData,
      preset,
    });
    await this.favoriteTable.save(newFavorite);
  }

  async remove(
    mail: string,
    presetName: string,
    favoriteData: Partial<Favorite>,
  ) {
    const favorite = await this.findOne(mail, presetName, favoriteData);
    await this.favoriteTable.delete(favorite);
  }

  async update(
    mail: string,
    presetName: string,
    favoriteData: Partial<Favorite>,
  ) {
    const favorite = await this.findOne(mail, presetName, favoriteData);
    const { domain, route, favoriteName } = favoriteData;
    favorite.domain = domain;
    favorite.route = route;
    favorite.favoriteName = favoriteName;
    await this.favoriteTable.save(favorite);
  }
}
