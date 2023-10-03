import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/source/entity/User";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
