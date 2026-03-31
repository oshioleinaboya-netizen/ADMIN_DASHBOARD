import { adminPassword } from "CI_INTEGRATION/allure-results/cypress/support/env"
describe('Password visibility toggle', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.window().then((win) => {
      cy.window().then((win) => {
        if (win.indexedDB?.databases) {
          win.indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              if (db.name) {
                win.indexedDB.deleteDatabase(db.name);
              }
            });
          });
        }
      });
    });
  })
  it('should toggle password visibility when clicking the button', () => {
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[class$='relative -top-[11px] -right-[6px]']").should('be.visible')
    cy.get("[alt$='show password icon']").click()
    cy.get("[class$='relative  ']").should('be.visible')
  });
});//