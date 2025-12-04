import { adminEmail, adminPassword, rankLink } from "@support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 8000;

describe('Customer Account Information', () => {
  beforeEach(() => {
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
        cy.get("[class*='cursor-text']").type('000000');
      }
      if ($body.find("[class*='animate-spin']").length) {
        cy.get("[class*='animate-spin']", { timeout: WAIT_LONG }).should('not.exist');
      }
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/customers');

    cy.get("#search-bar-button", { timeout: WAIT_MED }).within(() => {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist');
    });

    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']", { timeout: WAIT_MED })
      .type('bills billers');

    cy.get("[data-slot$='table-container'] tbody tr").first().click();
    cy.url({ timeout: WAIT_LONG }).should('include', '/customers/');
  });

  it('Account Information UI check', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Account Information').click();
      cy.wait(WAIT_MED);
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/account-information');

    cy.get("[class$='flex justify-between items-center']").within(() => {
      cy.contains('Rank');
      cy.contains('Customers');
      cy.wait(WAIT_MED);
    });

    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      // Account info
      ['Naira Account balance', 'Ledger balance', 'Account Name', 'Bank', 'Account No', 'Main Account']
        .forEach(label => cy.contains(label).should('be.visible'));

      // Action buttons
      const actionBar = "[class$='w-full flex justify-between mb-[24px]']";
      cy.get(actionBar).within(() => {
        cy.contains('Sort').should('be.visible');
        cy.get("[alt$='sort icon']").should('exist');

        cy.contains('Filter').should('be.visible');
        cy.get("[alt$='filter icon']").should('exist');

        cy.contains('Export').should('be.visible');
        cy.root().should('not.be.disabled');
      });

      cy.get("[class$='w-1/3 flex']").should('exist').and('not.be.disabled');

      // Table info
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'Showing');
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'entries');

      // Dropdown and pagination
      cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible');

      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist');
        cy.get("[aria-label$='Next page']").should('not.be.disabled');
        cy.get("[aria-current$='page']").should('not.be.disabled');
      });

      cy.contains('Customer Management');
      cy.get("[alt$='profile image']").should('be.visible');
      cy.get("[class$='font-bold text-[20px]']").should('be.visible');
      cy.get("[class$='text-[24px] font-bold']").should('be.visible');
    });
  });
});
