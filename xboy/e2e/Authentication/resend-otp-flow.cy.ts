import { adminEmail, adminPassword } from "xboy/support/env"
describe('Resend OTP flow', () => {
  it.only('Resend OTP', () => {
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
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[type$='submit']").click()

    // New device detected/
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    cy.wait(3000)
    cy.get("[class$='self-center space-y-2']").should('exist').within(() => {
      cy.get("[class$='font-semibold']").should('be.visible')
    })
    cy.wait(60000)
    cy.contains('Resend OTP').click()
    cy.contains('Resending')
    cy.wait(2000)
    cy.get("[class$='self-center space-y-2']").should('exist').within(() => {
      cy.get("[class$='font-semibold']").should('be.visible')
    })
  })
})