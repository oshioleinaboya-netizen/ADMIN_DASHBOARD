import { adminEmail, adminPassword } from "xboy/support/env";
import { findRowAcrossPages } from 'xboy/support/helper';

const WAIT_LONG = 30000;
const WAIT_MED = 8000;

describe('Get a savings plan', () => {
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

    cy.visit("/");
    cy.window().then((win) => win.sessionStorage.clear());

    cy.get("[type$='text']", { timeout: WAIT_LONG }).type(adminEmail);
    cy.get("[type$='password']", { timeout: WAIT_LONG }).type(adminPassword);
    cy.get("[type$='submit']", { timeout: WAIT_LONG }).click();

    // New device detected
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    // Timer check
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
    cy.get("[data-slot$='table-container'] tbody tr").then(($row) => {
      cy.wrap($row)
        .find("td")
        .eq(1)
        .click()
    })
    cy.url({ timeout: WAIT_LONG }).should('include', '/customers/');
    cy.wait(3000)
  });

  it('Filter by search', () => {
    const searchInput = "[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']";
    const tableRows = "[data-slot$='table-container'] tbody tr";
    const clearInput = "[class$='focus-visible:outline-none ml-2 w-full']";
    const savingsTabClick = "[class*='inline-block rounded-t-lg border-b-2 px-2 py-1 text-sm font-medium transition-colors border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600']"

    // Savings tab click
    cy.get(savingsTabClick).eq(3).click()
    cy.wait(3000)

    // Plan type/
    cy.get("#search-bar-button").within(() => {
      cy.get(`[placeholder$="Search by plan type or plan name"]`).should('exist');
    });

    cy.get(searchInput).clear().type('reserve');
    cy.wait(3000);
    cy.get(`${tableRows} td:nth-child(1)`).should('contain', 'Reserve');
    cy.get(clearInput).clear();
    cy.get(tableRows).should('have.length.at.least', 10);

    // Plan name - fetch by name
    cy.get(searchInput).type('bzbdb');
    cy.wait(3000);
    cy.get(tableRows).should('have.length', 1).first().within(() => {
      cy.get('td').eq(2).should('contain', 'bzbdb');
    });
    cy.get(clearInput).clear();
    cy.get(tableRows).should('have.length.at.least', 10);

    // Unavailable plan type/name
    cy.get(searchInput).type('iiiiiiiiiiiiii');
    cy.wait(3000);
    cy.get(tableRows).should('have.length', 0);
    cy.get("[alt$='empty box']").should('be.visible');
    cy.get("[class$='font-semibold text-[2rem] text-center']").should('contain', 'No result found!');
    cy.get("[class$='text-gray-600 text-center']").should('contain', "We couldn't find any result for this query.");
    cy.get("[class$='text-gray-600 text-center']").should('contain', "Try adjusting the search again");
    cy.get(clearInput).clear();
  });

  it(
    'Check that if the plan opened is active, mature or closed, it is indicated at the top of the savings details page',
    () => {

      const savingsTabClick = "[class*='inline-block rounded-t-lg border-b-2 px-2 py-1 text-sm font-medium transition-colors border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600']"
      // Savings tab click
      cy.get(savingsTabClick).eq(3).click()
      cy.wait(3000)

      findRowAcrossPages(row =>
        /(^|\s)(ACTIVE|MATURED|CLOSED)(\s|$)/i.test(row.innerText)
      ).then(($row) => {

        // ✅ Guard clause
        expect($row, 'Matching plan row').to.exist;

        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusFromTable = text.trim().toUpperCase();

            // Click row
            cy.wrap($row).click();
            cy.wait(3000);

            // ✅ Verify badge text (not color)
            cy.get("[class*='rounded-full']").eq(5)
              .should('be.visible')
              .invoke('text')
              .then((badgeText) => {
                expect(badgeText.trim().toUpperCase()).to.equal(statusFromTable);
              });
          });
      });
    });
});
