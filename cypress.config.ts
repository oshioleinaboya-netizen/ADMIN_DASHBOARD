import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config({ path: "retest.env" });

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        RANK_LINK: process.env.RANK_LINK
      };
      return config;
    }
  }
});
console.log("ENV FILE LOADED?");
console.log("EMAIL:", process.env.ADMIN_EMAIL);
console.log("LINK:", process.env.RANK_LINK);

