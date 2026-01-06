import { adminEmail, adminPassword } from "@support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 10000;

describe('Customer savings plan management', () => {
  beforeEach(() => {
    // Clear index DB
    cy.window().then((win) => {
      return win.indexedDB.databases().then((dbs) => {
        dbs.forEach((db) => {
          win.indexedDB.deleteDatabase(db.name);
        });
      });
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

  const analyticsChecks: string[] = [
    'Plan Type',
    'Savings plan ID',
    'Savings balance',
    'Total interest earned',
    'Start date',
    'Maturity date',
    'Interest Balance',
    'Interest available to',
    'Interest withdrawn',
    'Interest withdrawal',
    'Interest rate',
    'Progress'
  ];

  it('Individual savings plan management check', () => {
    let status = "";

    function findStatus() {
      analyticsChecks.forEach((item) => {
        cy.contains(item).parent().should('be.visible');
      });

      cy.get("[data-slot$='table-container']").within(() => {
        cy.get("tbody tr")
          .filter((i, row) => row.innerText.includes("Successful"))
          .first()
          .then($row => {
            status = ($row[0] as HTMLTableRowElement).cells[4].innerText.trim();
            cy.wrap($row).click();
          });
      });
    }

    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click();
    });
    cy.wait(3000)

    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();
    cy.get("[class*='lucide lucide-arrow-left w-3.5 h-3.5']").click();
    cy.wait(2000)
    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click();
    findStatus();

    cy.get("[data-slot$='drawer-content']").within(() => {
      const transactionFields = [
        'Amount',
        'Transaction type',
        'Status',
        'Balance before',
        'Balance after',
        'Method',
        'Transaction ID',
        'Date & time created',
        'Paid at',
        'Processed by'
      ];

      transactionFields.forEach((field) => {
        cy.contains(field).should('be.visible');
      });

      cy.get("[class*='lucide lucide-copy w-3.5 h-3.5']").first().should('not.be.disabled').click();
      cy.wait(200);
      //cy.contains('Copied to clipboard');/

      cy.get("[class$='lucide lucide-copy w-3.5 h-3.5']").should('be.visible').click();
      cy.get("[class$='flex items-center text-sm']").contains('Close').click();
    });

    cy.get("[data-slot$='drawer-content']").should('not.be.visible');
  });
});
