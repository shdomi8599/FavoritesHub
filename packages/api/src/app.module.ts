import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiController } from "./api/api.controller";
import { AuthModule } from "./auth/auth.module";
import { FavoriteModule } from "./favorite/favorite.module";
import { PresetModule } from "./preset/preset.module";
import { dataSourceOptions } from "./source/data-source";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    PresetModule,
    FavoriteModule,
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
  ],
  controllers: [ApiController],
  providers: [],
})
export class AppModule {}
