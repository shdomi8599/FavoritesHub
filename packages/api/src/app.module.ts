import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiController } from "./api/api.controller";
import { AuthModule } from "./auth/auth.module";
import { GoogleStrategy } from "./auth/strategy";
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
  ],
  controllers: [ApiController],
  providers: [GoogleStrategy],
})
export class AppModule {}
