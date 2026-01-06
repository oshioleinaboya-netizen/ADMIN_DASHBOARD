import { adminEmail, adminPassword } from "@support/env";

describe('Deactivate staff | Reactivate staff', () => {
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

    // Handle optional OTP/
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']", { timeout: 5000 }).type('000000');
      }
    });

    // Wait until spinner disappears and URL includes '/customers'
    cy.get("[class*='animate-spin']", { timeout: 10000 }).should('not.exist');
    cy.url({ timeout: 30000 }).should('include', '/customers');
    cy.wait(3000)

    // Navigate to staff management
    cy.get("[data-testid*='nav-link-staff-management']").click();
    cy.wait(3000)
  });

  function handleModal(confirm: boolean) {
    cy.get("[class*='relative bg-white w-[592px]']")
      .eq(0)
      .should('be.visible')
      .within(() => {
        cy.contains(confirm ? 'Yes, please' : 'No, cancel').click();
      });
    cy.get("[class*='relative bg-white w-[592px]']").should('not.exist');
  }

  function findRowByNameAcrossPages(targetName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    const tableRowsSelector = "[data-slot$='table-container'] tbody tr";
    const nextButtonSelector = "[aria-label$='Next page']";

    function scan(): Cypress.Chainable<JQuery<HTMLElement>> {
      return cy.get(tableRowsSelector).then($rows => {
        const match = [...$rows].find(r => r.innerText.includes(targetName));

        if (match) {
          return cy.wrap(match); // <--- VALID CHAIN RETURN
        }

        return cy.get(nextButtonSelector).then($next => {
          if ($next.is(":disabled")) {
            throw new Error(`Staff '${targetName}' not found.`);
          }

          return cy.wrap($next)
            .click()
            .then(() => cy.get(tableRowsSelector, { timeout: 8000 }).should("exist"))
            .then(() => scan()); // <--- RECURSE (must return chain)
        });
      });
    }
    return scan();
  }



  it.only('Deactivate and Reactivate staff flow', () => {
    let deactivatedStaffName = "";

    // ----- Find first ACTIVE staff row safely -----
    cy.get("[data-slot$='table-container'] tbody tr", { timeout: 10000 })
      .should('have.length.gte', 1) // ensures table loaded
      .then($rows => {
        const match = [...$rows].find(row =>
          row.innerText.includes("ACTIVE") &&
          !row.innerText.includes("INACTIVE") &&
          !row.innerText.includes("SUPER-ADMIN")
        );

        expect(match, "ACTIVE").to.exist;

        // match is a DOM row element; cast to HTMLTableRowElement to read cells
        deactivatedStaffName = (match as HTMLTableRowElement).cells[2].innerText.trim();
        cy.wrap(match).click(); // click opens staff detail
      });

    // Ensure navigation occurred
    cy.url({ timeout: 10000 }).should('include', '/staff-mgt/');

    // Deactivate button
    cy.contains('Deactivate staff', { timeout: 8000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/staff-mgt/deactivate?code');

    // Select reason
    cy.contains("Choosing reason for deactivating")
      .parent()
      .within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").click();
        cy.contains('Contract Termination').click();
       //cy.contains('Other').click();
      });
      //cy.get('textarea[placeholder$="Enter reason"]').type('Testing reason for deactivating staff').eq(1); //Not fetchable

    cy.contains('button', 'Deactivate staff').should('not.be.disabled').click();
    handleModal(true);

    cy.contains('Deactivation successful', { timeout: 10000 }).should('be.visible');
    cy.contains('Ok').click();

    // ======== Reactivate the deactivated staff ========
    // Wait for table to update
    cy.get("[data-slot$='table-container'] tbody tr", { timeout: 10000 })
      .should('exist')
      .then(() => {
        // Now safely search for the exact name
        findRowByNameAcrossPages(deactivatedStaffName).then($row => {
          cy.wrap($row).click();
        });
      })

    // Wait for navigation
    cy.url({ timeout: 10000 }).should('include', '/staff-mgt/');

    cy.contains('Reactivate Staff', { timeout: 8000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/staff-mgt/reactivate?code');

    // Select reason
    cy.contains("Reason")
      .parent()
      .within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").click();
        cy.contains('Error Correction').click();
        //cy.contains('Other').click();
      });
      //cy.get('textarea[placeholder$="Enter reason"]').type('Testing reason for deactivating staff').eq(1); //Not fetchable

    cy.contains('button', 'Reactivate staff').should('not.be.disabled').click();
    handleModal(true);

    cy.contains('Reactivation successful', { timeout: 10000 }).should('be.visible');
    cy.contains('Ok').click();
});

});
