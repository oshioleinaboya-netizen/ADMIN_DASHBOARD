import { adminEmail, adminPassword } from "@support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 10000;

function waitForTable() {
  return cy.get("[data-slot$='table-container'] tbody tr").then(($row) => {
      cy.wrap($row)
          .find("td")
          .eq(1)
    }).should('exist');
}

describe('Filtering savings table', () => {
  beforeEach(() => {
    // Clear index DB/
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

    cy.visit("/");

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

  it('Filtering', () => {
    const tags: string[] = ['Target', 'Reserve', 'Goals', 'Naira reserve', 'Periodic'];
    const savingssortBy: string[] = [
      'Start date',
      'Maturity date',
      'Balance',
      'Principal',
      'Interest earned',
      'Interest withdrawn',
      'Interest available to withdraw',
      'Auto topup amount'
    ];

    // Savings click
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click();
    });
    cy.wait(3000)

    // Open filters
    cy.get("[data-testid$='filters-trigger']", { timeout: WAIT_MED }).click();
    cy.get("[data-testid$='filters-content']", { timeout: WAIT_MED }).should('be.visible').within(() => {
      cy.get("[class$='text-base font-semibold']").should('contain', 'Filter');
      cy.get("[class$='md:text-base text-sm font-semibold text-gray-900']").eq(0).should('contain', 'Tag');
      cy.get("[class$='md:text-base text-sm font-semibold text-gray-900']").eq(1).should('contain', 'Sort by');
      cy.get("[aria-hidden*='true']").should('exist');
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-white text-black border border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm px-4 !bg-gray-200 border-0']").should('exist').and('contain', 'Clear all filters');
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply');
    });

    // Filter options check
    tags.forEach(tag => {
      cy.contains('Tag').parent().within(()=> {
        cy.contains(tag);
      });
    });

    savingssortBy.forEach(item => {
      cy.contains('Sort by').parent().within(()=> {
        cy.contains(item);
      });
    });

    // Apply single Tag filter
    //cy.get("[data-testid$='filters-trigger']").click();
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Tag').parent().within(()=> {
        cy.contains('Reserve').click();
      })
      cy.contains('Apply').click();
    });
    cy.get("[data-slot$='table-container'] tbody tr", { timeout: WAIT_LONG }).should('exist');
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('contain', 'Reserve');

    // Apply single Sort filter
    cy.get("[data-testid$='filters-trigger']").click();
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Clear all filters').click({ force: true });
    });
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Sort by').parent().within(()=> {
        cy.contains('Start date').click();
      })
      cy.contains('Apply').click({ force: true });
    });
    cy.get("[data-slot$='table-container'] tbody tr", { timeout: WAIT_LONG }).should('exist')
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(7)").eq(1).should('not.contain', 'Oct 28, 2025');

    // Apply multiple Tag filters
    cy.get("[data-testid$='filters-trigger']").click();
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Clear all filters').click({ force: true });
    });
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Tag').parent().within(()=> {
        cy.contains('Periodic').click();
        cy.contains('Goals').click();
      })
      cy.contains('Apply').click({ force: true });
    });
    cy.get("[data-slot$='table-container'] tbody tr", { timeout: WAIT_LONG }).should('exist');
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.contain', 'Reserve');

    // Apply multiple Tag + Sort filters
    cy.get("[data-testid$='filters-trigger']").click();
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Clear all filters').click({ force: true });
    });
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Tag').parent().within(()=> {
        cy.contains('Goals').click();
      })
      cy.contains('Sort by').parent().within(()=> {
        cy.contains('Start date').click();
      })
      cy.contains('Apply').click({ force: true });
    });
    cy.get("[data-slot$='table-container'] tbody tr", { timeout: WAIT_LONG }).should('exist'); // Table wait
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('contain', 'Goals');
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(7)").eq(0).should('not.contain', 'Dec 02');

    // Close filter
    cy.get("[data-testid$='filters-trigger']").click();
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Clear all filters').click({ force: true });
    });
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.get("[aria-hidden*='true']").click();
    });
    cy.get("[data-testid$='filters-content']").should('not.exist');

    // Clear all filters
    cy.get("[data-testid$='filters-trigger']").click();
    cy.get("[data-testid$='filters-content']").within(() => {
      cy.contains('Clear all filters').click({ force: true });
    });
    cy.get("[data-testid$='filters-content']").should('exist');

    // Search validation
    cy.get("#search-bar-button").within(() => {
      cy.get(`[placeholder$="Search by plan type or plan name"]`).should('exist');
    });
    cy.get("#search-bar-button").type('h');
    cy.get("[data-slot$='table-container'] tbody tr", { timeout: WAIT_LONG }).should('exist') // Table wait
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 1);
  });
});
