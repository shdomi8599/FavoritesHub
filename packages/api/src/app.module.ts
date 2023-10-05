import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiController } from "./api/api.controller";
import { AuthModule } from "./auth/auth.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { PresetsModule } from "./presets/presets.module";
import { dataSourceOptions } from "./source/data-source";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PresetsModule,
    FavoritesModule,
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
  ],
  controllers: [ApiController],
  providers: [],
})
export class AppModule {}
