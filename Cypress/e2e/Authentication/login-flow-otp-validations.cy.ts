import { adminEmail, adminPassword } from "@support/env";

describe('Login flow', () => {
  beforeEach(() => {
    cy.visit("/");
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
  })

  const otpSelector = "[class$='relative z-[1] flex justify-between gap-4 mb-6 outline-none cursor-text']"

  it('Admin log in - Valid credentials | OTP Validation', () => {
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[type$='submit']").click()

    // New device detected/
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    // Wait for OTP input to exist & be visible
    cy.get(otpSelector, { timeout: 10000 }).should('be.visible').type("111111")

    cy.get("[class$='w-full sm:px-0 sm:max-w-[460px] sm:mx-auto']")
      .should('contain', 'Invalid Otp')
  })

  it('Admin log in - Valid credentials', () => {
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[type$='submit']").click()

    // New device detected
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()
    
    // Wait for OTP input to exist & be visible
    cy.get(otpSelector, { timeout: 10000 }).should('be.visible').type("000000")

    // Confirm successful login
    cy.url({ timeout: 10000 }).should('include', '/customers')
  })
})
