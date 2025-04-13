import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiController } from "./api/api.controller";
import { AuthModule } from "./auth/auth.module";
import { GoogleStrategy } from "./auth/strategy";
import { FavoritesModule } from "./favorites/favorites.module";
import { GPTModule } from "./gpt/gpt.module";
import { PresetsModule } from "./presets/presets.module";
import { dataSourceOptions } from "./source/data-source";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    GPTModule,
    AuthModule,
    UsersModule,
    PresetsModule,
    FavoritesModule,
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
  ],
  controllers: [ApiController],
  providers: [GoogleStrategy],
})
export class AppModule {}
