import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as cheerio from "cheerio";
import extractDomain from "extract-domain";
import isValidDomain from "is-valid-domain";
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

  async add(preset: Preset, favoriteName: string, address: string) {
    const { domain, title, description, imgHref } =
      await this.getDomainData(address);

    const path = address.split(domain)[1];

    const favoriteData = {
      favoriteName,
      domain,
      title,
      description,
      imgHref,
      path,
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

  async update(favoriteId: number, favoriteData: Favorite) {
    const { domain, path, favoriteName } = favoriteData;
    const favorite = await this.findOne(favoriteId);
    favorite.domain = domain;
    favorite.path = path;
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

  async getDomainData(address: string) {
    const domain = (await extractDomain(address)) as string;
    const isDomain = isValidDomain(domain);

    if (!isDomain) {
      throw new Error("not exact");
    }

    try {
      const response = await axios(`https://${domain}`);
      const html = response.data;

      const $ = cheerio.load(html);

      const title = $("title").text();

      let imgHref = "";
      let localHref = "";
      const hrefs: string[] = [];
      $("link").each((index, element) => {
        const rel = $(element).attr("rel");
        const href = $(element).attr("href");
        if (rel?.includes("icon")) {
          hrefs.push(href);
        }
      });

      for (const href of hrefs) {
        if (href.includes("https")) {
          imgHref = href;
          break;
        }
        localHref = href;
      }

      if (!imgHref && localHref) {
        imgHref = domain + localHref;
      }

      let description = "";
      $("meta").each((index, element) => {
        const name = $(element).attr("name");
        const content = $(element).attr("content");
        if (!description && name?.includes("description")) {
          description = content;
        }
      });

      return { domain, title, description, imgHref };
    } catch (error) {
      // 코스 에러가 뜨는 사이트는 어떻게 처리할 지 고민 중
      throw new Error("cors");
    }
  }
}
