import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as cheerio from "cheerio";
import { Favorite } from "src/source/entity/Favorite";
import { Preset } from "src/source/entity/Preset";
import { Repository } from "typeorm";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteTable: Repository<Favorite>,
  ) {}

  async findAll(presetId: number): Promise<Favorite[]> {
    const favorites = await this.favoriteTable.find({
      where: { preset: { id: presetId } },
      relations: ["preset"],
    });

    const favoritesData = favorites?.map((data) => {
      delete data.preset;
      return data;
    });
    return favoritesData;
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

  async freeAdd(preset: Preset, favoriteName: string, address: string) {
    const favorites = await this.findAll(preset.id);

    const existData = favorites.find(
      (favorite) => favorite.address === address,
    );

    if (existData) {
      throw new Error("exist");
    }

    if (!address.includes("https")) {
      address = "https://" + address;
    }

    const favoriteData = {
      favoriteName,
      address,
      title: "",
      description: "",
      imgHref: "",
      star: false,
    };

    const newFavorite = this.favoriteTable.create({
      ...favoriteData,
      preset,
    });
    await this.favoriteTable.save(newFavorite);
  }

  async add(preset: Preset, favoriteName: string, address: string) {
    const favorites = await this.findAll(preset.id);

    const existData = favorites.find(
      (favorite) => favorite.address === address,
    );

    if (existData) {
      throw new Error("exist");
    }

    if (!address.includes("https://")) {
      address = "https://" + address;
    }

    const { title, description, imgHref } = await this.getAddressData(address);

    const favoriteData = {
      favoriteName,
      address,
      title,
      description,
      imgHref,
      star: false,
    };

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

  async update(favoriteId: number, newFavoriteName: string) {
    const favorite = await this.findOne(favoriteId);
    favorite.favoriteName = newFavoriteName;
    const newFavorite = await this.favoriteTable.save(favorite);
    return newFavorite;
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

  async getAddressData(address: string) {
    const response = await axios(address);
    const html = response?.data;

    const $ = cheerio.load(html);

    const title = $("title").text();

    let description = "";
    let imgHref = "";

    const links: { rel: string; href: string }[] = [];
    $("link").each((index, element) => {
      const rel = $(element).attr("rel");
      const href = $(element).attr("href");
      links.push({ rel, href });
    });

    const metas: { name: string; content: string }[] = [];
    $("meta").each((index, element) => {
      const name = $(element).attr("name");
      const content = $(element).attr("content");
      metas.push({ name, content });
    });

    for (const link of links) {
      const { rel, href } = link;
      if (
        rel?.includes("icon") ||
        href?.includes("png") ||
        href?.includes("jpg") ||
        href?.includes("webp") ||
        href?.includes("jpeg")
      ) {
        imgHref = href;
        break;
      }
    }

    for (const meta of metas) {
      const { name, content } = meta;

      if (name?.includes("description")) {
        description = content;
      }

      if (!imgHref) {
        if (
          content?.includes("https") ||
          content?.includes("png") ||
          content?.includes("jpg") ||
          content?.includes("webp") ||
          content?.includes("jpeg")
        ) {
          imgHref = content;
        }
      }
    }

    return { address, title, description, imgHref };
  }

  async upVisitedCount(favoriteId: number) {
    const favorite = await this.findOne(favoriteId);
    favorite.visitedCount = favorite.visitedCount + 1;
    await this.favoriteTable.save(favorite);
  }
}
