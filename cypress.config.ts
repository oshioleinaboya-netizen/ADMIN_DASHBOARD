const dotenv = require('dotenv');
const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

if (!process.env.CI) {
  dotenv.config({ path: 'retest.env' });
}

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{ts,js}',
    supportFile: 'cypress/support/e2e.ts',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      allureWriter(on, config);

      config.env = {
        ...config.env,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        RANK_LINK: process.env.RANK_LINK,
      };

      return config;
    },
    baseUrl: process.env.RANK_LINK,
  },
});
