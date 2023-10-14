import "dotenv/config";

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
} = process.env;

export const baseClientURL =
  NODE_ENV === "production" ? CLIENT_ADDRESS : "http://localhost:3000";

export const baseURL =
  NODE_ENV === "production"
    ? `${SERVER_ADDRESS}/api`
    : "http://localhost:8080/api";

export const JWT_ACCESS_SECRET = "S+Hcvoy/Z08Ljqd7qglf8w1l+bbCjuvq30mQ3cZP21Q=";
export const JWT_REFRESH_SECRET =
  "zeOPjBWjs8kVK3dsCi9OFc24CIN/VTZ3Svw6jXv7MF4=";

export const nodemailerOption = {
  service: "gmail",
  auth: {
    user: NODE_MAILER_USER,
    pass: NODE_MAILER_PASS,
  },
};
