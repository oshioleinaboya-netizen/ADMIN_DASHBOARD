const allureWriter = require('@shelex/cypress-allure-plugin/writer');

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  allureWriter(on, config);
  return config;
};