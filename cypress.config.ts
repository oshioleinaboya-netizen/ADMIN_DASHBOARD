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
        PARTNER_EMAIL: process.env.PARTNER_EMAIL,
        PARTNER_PASSWORD: process.env.PARTNER_PASSWORD,
        PARTNER_LINK: process.env.PARTNER_LINK,
        P_LINK_PD: process.env.P_LINK_PD,
        P_EMAIL_PD: process.env.P_EMAIL_PD,
        P_PASSWORD_PD: process.env.P_PASSWORD_PD,
        STAGING_OTP: process.env.STAGING_OTP,
      };

      return config;
    },
    baseUrl: process.env.RANK_LINK,
  },
});
