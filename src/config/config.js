import { randomBytes } from "node:crypto";

const globalConfig = Object.freeze({
  mongodb: {
    MONGO_URI: process.env.MONGO_DB_URI,
  },
  server: {
    SERVER_PORT: +process.env.SERVER_PORT || 3000,
    SALT_ROUNDS: +process.env.SALT_ROUNDS || 10,
    JWT_SECRET:
      randomBytes(32).toString("base64") || "U+uVV8kEcHV7FSOJKvgYo6xEQbRg4xVOEAHJDMcTVQ4=",
  },
});

export { globalConfig };
