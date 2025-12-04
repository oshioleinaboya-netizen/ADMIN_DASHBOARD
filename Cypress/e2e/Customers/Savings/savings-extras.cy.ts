import { adminEmail, adminPassword, rankLink } from "@support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 10000;

function waitForTable() {
  return cy.get("[data-slot$='table-container'] tbody tr", { timeout: WAIT_LONG }).should('exist');
}

describe('Customer Management', () => {
  beforeEach(() => {
    // Clear index DB
    cy.window().then((win) => {
      return win.indexedDB.databases().then((dbs) => {
        dbs.forEach((db) => {
          win.indexedDB.deleteDatabase(db.name);
        });
      });
    });

    cy.visit(rankLink);
    cy.window().then((win) => win.sessionStorage.clear());

    cy.get("[type$='text']", { timeout: WAIT_LONG }).type(adminEmail);
    cy.get("[type$='password']", { timeout: WAIT_LONG }).type(adminPassword);
    cy.get("[type$='submit']", { timeout: WAIT_LONG }).click();

    // New device detected
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    cy.get("[class$='self-center space-y-2']", { timeout: WAIT_LONG }).should('exist').within(() => {
      cy.get("[class$='font-semibold']").should('be.visible');
    });

    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']", { timeout: WAIT_MED }).type('000000');
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
    waitForTable().first().click();
    cy.url({ timeout: WAIT_LONG }).should('include', '/customers/');
    cy.wait(3000)
  });

  it('Get particular customer - Savings UI Check', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click();
    });
    cy.wait(3000)

    cy.url({ timeout: WAIT_LONG }).should('include', '/savings');

    const uiElements = [
      'Total Savings Balance',
      'Total Interest Earned',
      'Active Savings Plans',
      'Closed Savings Plans',
      'Active savings plans',
      'Matured savings plans',
      'Closed savings plans',
      'Customer Management'
    ];

    uiElements.forEach((text) => cy.contains(text).should('exist'));

    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Filter').should('be.visible');
      cy.root().should('not.be.disabled');
    });

    cy.get("[alt$='search icon']").should('exist').and('not.be.disabled');
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible');
    cy.get("[class$='font-bold text-[20px]']").should('be.visible');
    cy.get("[alt$='profile image']").should('be.visible');

    cy.get("[class$='flex justify-between items-center']").within(() => {
      cy.contains('Rank').should('exist');
      cy.contains('Customers').should('exist');
    });

    // Matured savings
    cy.contains('Matured savings plans').click();
    waitForTable();

    // Closed savings
    cy.contains('Closed savings plans').click();
    waitForTable();
  });
});
