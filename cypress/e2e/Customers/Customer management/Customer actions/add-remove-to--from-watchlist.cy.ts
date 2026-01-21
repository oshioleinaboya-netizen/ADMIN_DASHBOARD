import { adminEmail, adminPassword } from "cypress/support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 8000;

describe('Customer Actions', () => {
  beforeEach(() => {
    cy.visit("/");

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

    cy.get("[type$='text']", { timeout: WAIT_LONG }).type(adminEmail);
    cy.get("[type$='password']", { timeout: WAIT_LONG }).type(adminPassword);
    cy.get("[type$='submit']", { timeout: WAIT_LONG }).click();

    // New device detected/
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    cy.get("[class$='self-center space-y-2']", { timeout: WAIT_LONG }).should('exist').within(() => {
      cy.get("[class$='font-semibold']").should('be.visible');
    });

    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000');
      }
      if ($body.find("[class*='animate-spin']").length) {
        cy.get("[class*='animate-spin']", { timeout: WAIT_LONG }).should('not.exist');
      }
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/customers');
    cy.wait(3000)

    cy.get("#search-bar-button", { timeout: WAIT_MED }).within(() => {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist');
    });

    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']", { timeout: WAIT_MED })
      .type('bills billers');
    cy.wait(3000)

    cy.get("[data-slot$='table-container'] tbody tr").first().within(() => {
      cy.get("td").eq(1).click();
    })
    cy.url({ timeout: WAIT_LONG }).should('include', '/customers/');
    cy.wait(3000)
  })
  it('Customer Actions - Add to watchlist | Remove customer from watchlist', () => {
    // Add customer to watchlist
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(() => {
      cy.contains('Add to watchlist').click()
    })

    cy.get("[data-slot*='drawer-content']").within(() => {
      cy.contains('Cancel').click()
    }) // Close the flag modal

    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(() => {
      cy.contains('Add to watchlist').click()
    })

    cy.get("[data-slot*='drawer-content']").within(() => {
      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Add').and('be.disabled') // Flag button should be disbaled

      cy.get("[class*='text-xl font-semibold mb-4']").contains('Add Customer to Watchlist').should('be.visible'); // Header check

      cy.contains('Why do you want to add customer to watchlist').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('contain.text', 'Select reason').click();
      }) // Open reason dropdown

      cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').should('have.length.at.least', 1).within(() => {
        cy.get("[data-testid*='dropdown-option-0']").click(); // Option selection
      })

      cy.contains('Why do you want to remove customer from watchlist').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('not.be.empty')
      }) // After selection check

      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Add').and('be.disabled') // Flag button should be disbaled

      cy.contains('Comment').parent().should('be.visible').within(() => {
        cy.get("[class*='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']").type('Why you never pay tax since?')
      }) // Comment input check

      cy.get("[type*='button']").eq(1).should('contain.text', 'Flag').and('not.be.disabled').click() // Flag button should be enabled now
    })
    cy.contains('Customer added').should('be.visible'); // Success page check
    cy.contains('Ok').click(); // Close success page

    // Remove customer from watchlist
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(() => {
      cy.contains('Remove from watchlist').click()
    })

    cy.get("[data-slot*='drawer-content']").within(() => {
      cy.contains('Cancel').click()
    }) // Close the flag modal

    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(() => {
      cy.contains('Remove from watchlist').click()
    })

    cy.get("[data-slot*='drawer-content']").within(() => {
      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Add').and('be.disabled') // Flag button should be disbaled

      cy.get("[class*='text-xl font-semibold mb-4']").contains('Remove Customer from Watchlist').should('be.visible'); // Header check

      cy.contains('Why do you want to remove customer from watchlist').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('contain.text', 'Select reason').click();
      }) // Open reason dropdown

      cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').should('have.length.at.least', 1).within(() => {
        cy.get("[data-testid*='dropdown-option-0']").click(); // Option selection
      })

      cy.contains('Why do you want to remove customer from watchlist').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('not.be.empty')
      }) // After selection check

      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Add').and('be.disabled') // Flag button should be disbaled

      cy.contains('Comment').parent().should('be.visible').within(() => {
        cy.get("[class*='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']").type('Why you never pay tax since?')
      }) // Comment input check

      cy.get("[type*='button']").eq(1).should('contain.text', 'Flag').and('not.be.disabled').click() // Flag button should be enabled now
    })
    cy.contains('Customer added').should('be.visible'); // Success page check
    cy.contains('Ok').click(); // Close success page
  })
})