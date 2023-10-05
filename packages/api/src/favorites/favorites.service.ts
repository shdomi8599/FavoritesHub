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

  async findOne(favoriteId: number): Promise<Favorite> {
    const favorite = await this.favoriteTable.findOne({
      where: {
        id: favoriteId,
      },
    });
    if (!favorite) {
      throw new Error("즐겨찾기를 찾을 수 없습니다.");
    }
    return favorite;
  }

  async add(preset: Preset, favoriteData: Favorite) {
    const { favoriteName: newFavoriteName } = favoriteData;
    const favorites = await this.findAll(preset);
    const isSameFavorite = favorites
      .map((favorite) => favorite.favoriteName)
      .includes(newFavoriteName);

    if (isSameFavorite) {
      throw new Error("같은 이름의 즐겨찾기가 존재합니다.");
    }

    const newFavorite = this.favoriteTable.create({
      ...favoriteData,
      preset,
    });
    await this.favoriteTable.save(newFavorite);
  }

  async remove(favoriteId: number) {
    const favorite = await this.findOne(favoriteId);
    await this.favoriteTable.delete(favorite);
  }

  async update(favoriteId: number, favoriteData: Favorite) {
    const { domain, route, favoriteName } = favoriteData;
    const favorite = await this.findOne(favoriteId);
    favorite.domain = domain;
    favorite.route = route;
    favorite.favoriteName = favoriteName;
    await this.favoriteTable.save(favorite);
  }

  async updateVisitedTime(favoriteId: number) {
    const favorite = await this.findOne(favoriteId);
    favorite.lastVisitedAt = new Date();
    await this.favoriteTable.save(favorite);
  }

  async handleStar(favoriteId: number) {
    const favorite = await this.findOne(favoriteId);
    favorite.star = !favorite.star;
    await this.favoriteTable.save(favorite);
  }
}
