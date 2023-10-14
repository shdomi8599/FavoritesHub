import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { OAUTH_GOOGLE_ID, OAUTH_GOOGLE_SECRET } from "src/constants";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: OAUTH_GOOGLE_ID,
      clientSecret: OAUTH_GOOGLE_SECRET,
      callbackURL: "http://stackoverflo.site:8080/api/auth/google/callback",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { emails, photos } = profile;
    const user = {
      email: emails[0].value,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    return user;
  }
}
