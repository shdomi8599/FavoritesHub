import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import "dotenv/config";
import { Profile, Strategy } from "passport-google-oauth20";
import { OAUTH_GOOGLE_ID, OAUTH_GOOGLE_SECRET } from "src/constants";

const { SERVER_ADDRESS, NODE_ENV } = process.env;

const oauthGoogleRedirect =
  NODE_ENV === "production"
    ? `${SERVER_ADDRESS}/api/auth/google/callback`
    : `http://localhost:8080/api/auth/google/callback`;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: OAUTH_GOOGLE_ID,
      clientSecret: OAUTH_GOOGLE_SECRET,
      callbackURL: oauthGoogleRedirect,
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
