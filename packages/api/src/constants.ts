import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();

export const {
  NODE_MAILER_USER,
  NODE_MAILER_PASS,
  OAUTH_GOOGLE_ID,
  OAUTH_GOOGLE_SECRET,
  OAUTH_GOOGLE_REDIRECT,
  RANDOM_PASSWORD,
  CLIENT_ADDRESS,
  SERVER_ADDRESS,
  NODE_ENV,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  DB_PASSWORD,
  OPENAI_API_KEY,
} = process.env;

export const baseClientURL =
  NODE_ENV === "production" ? CLIENT_ADDRESS : "http://localhost:3000";

export const baseURL =
  NODE_ENV === "production"
    ? `${SERVER_ADDRESS}/api`
    : "http://localhost:8080/api";

export const nodemailerOption = {
  service: "gmail",
  auth: {
    user: NODE_MAILER_USER,
    pass: NODE_MAILER_PASS,
  },
};
