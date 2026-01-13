import { adminEmail, adminPassword } from "cypress/support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 10000;

describe('Customer savings plan management', () => {
  const tableRows = "[data-slot$='table-container'] tbody tr"
  const pageInfo = "[class$='text-sm text-gray-600']"
  const pageSizeSelect = "[data-testid$='table-page-size-select']"

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
      .type('billers');

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

  const tableHeaderChecks: string[] = [
    'Transaction type',
    'Amount',
    'Balance before',
    'Balance after',
    'Status',
    'Date',
  ];

  it.only('Savings transactions table check', () => {

    function checkTableColumnsAcrossPages() {
      // Step 1: Validate current page
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .each(($cell, index) => {
            if (index <= 5) {
              cy.wrap($cell)
                .invoke('text')
                .then(text => {
                  expect(text.trim()).to.not.equal('');
                });
            }
          });
      });

      // Step 2: Check if next page exists
      cy.get('body').then(($body) => {
        const nextBtn = $body.find('[aria-label="Next page"]');

        if (nextBtn.length && !nextBtn.is(':disabled')) {
          cy.wrap(nextBtn).click();

          // Step 3: Wait for table to refresh
          cy.get("[data-slot$='table-container'] tbody tr", { timeout: 10000 })
            .should('exist');

          // Step 4: Recurse
          checkTableColumnsAcrossPages();
        }
      });
    }

    function tableHeaderCheck() {
      tableHeaderChecks.forEach((item) => {
        cy.get("[data-slot*='table-header']").contains(item);
      });
    }

    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click();
    });
    cy.wait(5000)

    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();
    cy.wait(3000)
    cy.get("[class*='lucide lucide-arrow-left w-3.5 h-3.5']").click();
    cy.wait(2000)
    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();
    tableHeaderCheck(); // check headers visible

    // Table column data should not be empty
    checkTableColumnsAcrossPages();
  })

  it.only('First and Last page disables correct navigation buttons', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click();
    });
    cy.wait(5000)

    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();
    cy.wait(3000)
    cy.get("[class*='lucide lucide-arrow-left w-3.5 h-3.5']").click();
    cy.wait(2000)
    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();

    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-label$='Previous page']").should('be.disabled')
    cy.get("[data-testid*='pagination-button-last-page']").click()
    // cy.get("[aria-current$='page']").should('contain', 72)
    cy.get("[aria-label$='Next page']").should('be.disabled')
    cy.get("[aria-label$='Previous page']").should('not.be.disabled')
  })

  const validatePageSize = (size: number) => {
    cy.get(pageSizeSelect).select(`Show ${size}`);

    // Wait for table to update
    cy.get(tableRows, { timeout: 10000 }).should('exist');

    // Get total rows info (e.g., "Showing 1 to 11 of 11 entries")
    cy.get(pageInfo).invoke('text').then((text) => {
      const match = text.match(/of\s+(\d+)/i);
      const totalRows = match ? parseInt(match[1]) : 0;

      // Calculate expected rows on current page
      const expectedRows = totalRows >= size ? size : totalRows;

      // Assert the number of rows in the table
      cy.get(tableRows).should('have.length', expectedRows);

      // Optional: check the page info text reflects what’s actually displayed
      cy.get(pageInfo).should('contain', `Showing 1 - ${expectedRows}`);
    });
  };

  it.only('Table page size functionality', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click();
    });
    cy.wait(5000)

    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();
    cy.wait(3000)
    cy.get("[class*='lucide lucide-arrow-left w-3.5 h-3.5']").click();
    cy.wait(2000)
    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();

    [10, 20, 50, 100, 200, 500].forEach(size => validatePageSize(size))
  })

  it('Pagination indication by page buttons', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click();
    });
    cy.wait(3000)

    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();
    cy.wait(3000)
    cy.get("[class*='lucide lucide-arrow-left w-3.5 h-3.5']").click();
    cy.wait(2000)
    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();

    for (let i = 2; i <= 5; i++) {
      cy.get(`[data-testid$='pagination-button-${i}']`).click()
      cy.get(pageInfo).should('contain', `Showing ${((i - 1) * 20 + 1)} - ${i * 20}`)
    }
  })
});