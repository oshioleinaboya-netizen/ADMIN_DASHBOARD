import { adminEmail, adminPassword } from "cypress/support/env";
import { faker } from '@faker-js/faker';

// Helper functions/
const typeInput = (label: string, value: string) => {
  cy.contains(label).parent().find("input, textarea").first().clear().type(value);
};

const selectDropdown = (label: string, optionText: string) => {
  cy.contains(label).parent().find("[class*='flex flex-wrap']").click();
  cy.get("[class*='absolute z-10']").contains(optionText).click();
};

describe('Upload a business line', () => {
  beforeEach(() => {
    // Clear index DB
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

    // Authentication check - Login
    cy.visit("/");

    cy.get("[type$='text']").type(adminEmail);
    cy.get("[type$='password']").type(adminPassword);
    cy.get("[type$='submit']").click();
    cy.wait(3000)

    // New device detected
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    // Handle optional OTP
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']", { timeout: 5000 }).type('000000');
      }
    });

    // Wait until spinner disappears and URL includes '/customers'
    cy.get("[class*='animate-spin']", { timeout: 10000 }).should('not.exist');
    cy.url({ timeout: 30000 }).should('include', '/customers');
    cy.wait(3000)

    //Loan management navigation
    cy.get("[data-testid*='nav-link-loan']").click()
    cy.wait(1000)
    cy.contains('Loan Management').click()
    cy.wait(3000)
  })
  it('Upload a business line', () => {
    // Click on the loan product
    cy.contains('Civic Loan').click()
    cy.wait(3000)

    cy.contains('Actions').click() // Click the actions drawdown button
    cy.get("[role*='menu']").eq(0).should('not.be.empty').within(() => {
      cy.get("[role*='menuitem']").eq(0).contains('Add New Business Line').click() // Select the drawdown option
    })
    cy.wait(3000)

    // Fill out the business line details
    typeInput('Business Line name', faker.company.name())
    selectDropdown('Business Line type', 'Public')
    typeInput('Business Contact Address', faker.location.streetAddress())
    typeInput('Business Email Address', faker.internet.email())
    cy.contains('Upload Signed Copy of Agreement').parent().find("[type*='file']").selectFile('cypress/fixtures/Media.jpeg', { force: true }) // Upload a file
    cy.wait(2000)
    cy.contains('Media.jpeg').should('be.visible'); //Check uploaded file
    cy.contains('Continue').click() // Submit the business line details

    // Upload staff list
    cy.contains('Upload Staff List CSV file').should('be.visible')
    cy.get("[type*='file']").selectFile('cypress/fixtures/Staff List.csv', { force: true }) // Upload the staff list
    cy.wait(2000)

    // Colmunn data matching
    cy.get("[class*='w-full']").eq(5).scrollIntoView().within(() => {
      cy.get("[class*='w-full']").eq(2).click()
      cy.get("[class*='max-h-60 overflow-auto']").eq(1).within(() => {
        cy.get("[data-testid*='dropdown-option-2']").click()
      })
    })
    cy.get("[class*='w-full']").eq(5).scrollIntoView().within(() => {
      cy.get("[class*='w-full']").eq(6).click()
      cy.get("[class*='max-h-60 overflow-auto']").eq(1).within(() => {
        cy.get("[data-testid*='dropdown-option-3']").click()
      })
    })
    cy.get("[class*='w-full']").eq(5).scrollIntoView().within(() => {
      cy.get("[class*='w-full']").eq(7).click()
      cy.get("[class*='max-h-60 overflow-auto']").eq(1).within(() => {
        cy.get("[data-testid*='dropdown-option-4']").click()
      })
    })
    cy.wait(2000)

    cy.contains('Submit').click() // Submit button click check
  })
})