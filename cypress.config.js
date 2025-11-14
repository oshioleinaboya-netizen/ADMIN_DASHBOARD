const { defineConfig } = require("Cypress");

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "reports",
    overwrite: false,
    html: false,
    json: true
  },
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
    defaultCommandTimeout: 15000, // 15 seconds for all cy.get, cy.contains, etc
    pageLoadTimeout: 60000, // for cy.visit()
  },
});

