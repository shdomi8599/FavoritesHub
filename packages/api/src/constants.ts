import "dotenv/config";

const { NODE_MAILER_USER, NODE_MAILER_PASS } = process.env;

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
