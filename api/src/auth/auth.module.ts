import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
