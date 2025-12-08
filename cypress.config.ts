import dotenv from "dotenv";
import { defineConfig } from "cypress";
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

dotenv.config({ path: "retest.env" });

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      config.env = {
        ...config.env,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        RANK_LINK: process.env.RANK_LINK
      };
      return config;
    },
    baseUrl: process.env.RANK_LINK,
  },
  reporter: 'mocha-allure-reporter',
}); //

