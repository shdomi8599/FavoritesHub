import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite } from "src/source/entity/Favorite";
import { Repository } from "typeorm";

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private Favorite: Repository<Favorite>,
  ) {}

  async findAll(): Promise<Favorite[]> {
    const Favorite = await this.Favorite.find();
    return Favorite;
  }
}
