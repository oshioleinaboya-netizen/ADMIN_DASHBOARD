import { adminEmail, adminPassword, rankLink } from "@support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 10000;

function waitForTable() {
  return cy.get("[data-slot$='table-container'] tbody tr", { timeout: WAIT_LONG }).should('exist');
}

describe('Savings Interest Summation Validation', () => {
  beforeEach(() => {
    // Clear index DB/
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
      .type('8156768888');

    cy.wait(3000)
    waitForTable().first().click();
    cy.url({ timeout: WAIT_LONG }).should('include', '/customers/');
    cy.wait(3000)
  });

  const sumInterestAcrossPages = (selectorFirstCol: number, selectorSecondCol: number, matchText?: RegExp) => {
    let totalInterest = 0;

    const sumInterestOnPage = () => {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        const firstCol = $row.find("td").eq(selectorFirstCol).text().trim();
        const secondCol = $row.find("td").eq(selectorSecondCol).text().trim();

        if (!matchText || matchText.test(firstCol)) {
          const numeric = parseFloat(secondCol.replace(/[^0-9.]/g, ""));
          totalInterest += numeric || 0;
        }
      });
    };

    const goToNextPage = () => {
      cy.get("[aria-label$='Next page']").then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.wait(2000);
          sumInterestOnPage();
          goToNextPage();
        } else {
          cy.log('✅ All pages scanned.');
        }
      });
    };

    return { sumInterestOnPage, goToNextPage, getTotal: () => totalInterest };
  };

  it('Total vs summation interest checks', () => {
    cy.contains('Savings').click();
    cy.wait(3000)

    const { sumInterestOnPage, goToNextPage, getTotal } = sumInterestAcrossPages(4, 4);

    waitForTable();
    cy.wait(2000);

    sumInterestOnPage();
    goToNextPage();

    cy.then(() => {
      cy.get('div')
        .contains('Total Interest Earned')
        .next()
        .invoke('text')
        .then((summaryText) => {
          const analyticsInterest = parseFloat(summaryText.replace(/[^0-9.]/g, ''));
          cy.log(`Total Interest (summed): ${getTotal()}`);
          cy.log(`Analytics Interest: ${analyticsInterest}`);
          expect(getTotal()).to.eql(analyticsInterest);
        });
    });
  });

  it.only('Total vs summation interest checks - Individual plans', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click();
      cy.wait(3000);
    });

    cy.get("[data-slot$='table-container'] tbody tr").eq(0).click();
    cy.wait(3000);

    const { sumInterestOnPage, goToNextPage, getTotal } = sumInterestAcrossPages(0, 1, /interest/i);

    sumInterestOnPage();
    goToNextPage();

    cy.then(() => {
      cy.get('div')
        .contains('Total interest earned')
        .next()
        .invoke('text')
        .then((summaryText) => {
          const analyticsInterest = parseFloat(summaryText.replace(/[^0-9.]/g, ''));
          cy.log(`Total Interest (summed): ${getTotal()}`);
          cy.log(`Analytics Interest: ${analyticsInterest}`);
          expect(getTotal()).to.eql(analyticsInterest);
        });
    });
  });
});
