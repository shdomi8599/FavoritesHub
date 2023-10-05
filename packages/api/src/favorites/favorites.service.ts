import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite } from "src/source/entity/Favorite";
import { Preset } from "src/source/entity/Preset";
import { Repository } from "typeorm";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteTable: Repository<Favorite>,
  ) {}

  async findAll(preset: Preset): Promise<Favorite[]> {
    const { favorites } = preset;
    if (!favorites) {
      throw new Error("즐겨찾기 리스트를 찾을 수 없습니다.");
    }
    return favorites;
  }

  async findOne(
    preset: Preset,
    domain: string,
    route: string,
    favoriteName: string,
  ): Promise<Favorite> {
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

  async add(preset: Preset, favoriteData: Favorite) {
    const { domain, route, favoriteName } = favoriteData;
    const favorite = await this.findOne(preset, domain, route, favoriteName);
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
    preset: Preset,
    domain: string,
    route: string,
    favoriteName: string,
  ) {
    const favorite = await this.findOne(preset, domain, route, favoriteName);
    await this.favoriteTable.delete(favorite);
  }

  async update(
    preset: Preset,
    domain: string,
    route: string,
    favoriteName: string,
  ) {
    const favorite = await this.findOne(preset, domain, route, favoriteName);
    favorite.domain = domain;
    favorite.route = route;
    favorite.favoriteName = favoriteName;
    await this.favoriteTable.save(favorite);
  }

  async updateVisitedTime(
    preset: Preset,
    domain: string,
    route: string,
    favoriteName: string,
  ) {
    const favorite = await this.findOne(preset, domain, route, favoriteName);
    favorite.lastVisitedAt = new Date();
    await this.favoriteTable.save(favorite);
  }

  async handleStar(preset: Preset, favoriteData: Favorite) {
    const { domain, route, favoriteName } = favoriteData;
    const favorite = await this.findOne(preset, domain, route, favoriteName);
    favorite.star = !favorite.star;
    await this.favoriteTable.save(favorite);
  }
}
