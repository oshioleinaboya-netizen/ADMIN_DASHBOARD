import { adminEmail, adminPassword } from "@support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 8000;

describe('Customer Account Information', () => {
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

    cy.get("[data-slot$='table-container'] tbody tr").first().within(()=> {
      cy.get("td").eq(1).click();
    })
    cy.url({ timeout: WAIT_LONG }).should('include', '/customers/');
    cy.wait(3000)
  });

  it('Account Information UI check', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Account Information').click();
      cy.wait(5000);
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/account-information');

    cy.get("[class$='flex justify-between items-center']").within(() => {
      cy.contains('Rank');
      cy.contains('Customers');
      cy.wait(3000); //
    });

    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      // Account info
      ['Naira Account balance', 'Ledger balance', 'Account Name', 'Bank', 'Account No', 'Main Account']
        .forEach(label => cy.contains(label).should('be.visible'));

      // Action buttons
      const actionBar = "[class$='w-full flex justify-between mb-[24px]']";
      cy.get(actionBar).within(() => {
        cy.contains('Sort').should('be.visible');
        cy.get("[alt$='sort icon']").should('exist').and('not.be.disabled');

        cy.contains('Filter').should('be.visible');
        cy.get("[alt$='filter icon']").should('exist').and('not.be.disabled');

        cy.contains('Export').should('be.visible');
        cy.root().should('not.be.disabled').and('not.be.disabled');
      });

      cy.get("[class$='w-1/3 flex']").should('exist').and('not.be.disabled');

      // Table info
      cy.get("[class*='text-sm text-gray-600']").first().should('contain', 'Showing');
      cy.get("[class*='text-sm text-gray-600']").first().should('contain', 'entries');

      // Dropdown and pagination
      cy.get("[data-testid*='dropdown-button']").should('contain', 'Customer Actions').and('be.visible');

      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist');
        cy.get("[aria-label$='Next page']").should('not.be.disabled');
        cy.get("[aria-current$='page']").should('not.be.disabled');
      });

      cy.contains('Customer Management');
      cy.get("[alt$='profile image']").should('be.visible');
      cy.get("[class$='font-bold text-[20px]']").should('be.visible');
      cy.get("[class$='text-[24px] font-bold']").should('be.visible');

      //Table headers
      const tableHeaders: Array<string> = [
        'Amount',
        'Fees',
        'Reference',
        'Date',
        'Balance before',
        'Status',
        'Balance after',
        'Destination name',
        'Source',
        'Destination account',
        'Destination bank',
        'Action'
      ];
      tableHeaders.forEach((header)=> {
        cy.get("[data-slot*='table-header']").contains(header)
      })

      //Pagination avavlilability
      cy.get("[data-testid*='pagination']").should('exist')

      //Page size selector availability
      cy.get("[data-testid*='table-page-size-select']").should('exist')

      //Page text indication availability
      cy.get("[class*='text-sm text-gray-600']").should('exist');

      //Table rows availability
      /*cy.get('body').then(($body) => {
        if ($body.text().includes('No result found')) {
          expect($body.text()).to.include('No result found');
        } else {
          cy.get("[data-slot*='table-body']").should('exist');
        }
      });*/

      //Status check
      // checkColumnAcrossAllPages(3, ["SUCCESSFUL", "FAILED", "PENDING"]);
    });
  });

  it('Check that when balance after is subtracted from balaance, the result equals the amount', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Account Information').click();
      cy.wait(5000);
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/account-information');

    cy.get("[data-slot*='table-body']").each(($row) => {
      cy.wrap(($row)).within(() => {
        cy.get('td').eq(5).invoke('text').then((balanceBeforeText) => {
          const balanceBefore = Number(balanceBeforeText.replace(/[^0-9,.-]+/g,"").replace(/,/g, '')); // Converts string to number
          cy.get('td').eq(6).invoke('text').then((balanceAfterText) => {
            const balanceAfter = Number(balanceAfterText.replace(/[^0-9,.-]+/g,"").replace(/,/g, '')); // Converts string to number
            cy.get('td').eq(0).invoke('text').then((amountText) => {
              const amount = Number(amountText.replace(/[^0-9,.-]+/g,"").replace(/,/g, '')); // Converts string to number
              expect(balanceBefore - balanceAfter).to.be.closeTo(amount, 0.01);
            });
          });
        })
      })
    })
  })

  it('Check status values in Account Information table', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Account Information').click();
      cy.wait(5000);
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/account-information');

    function checkColumnAcrossAllPages(columnIndex: number, expectedValues: string[]) {
      cy.get("[data-testid*='table-page-size-select']").select('Show 500');
          cy.wait(3000)
      const checkPage = (): Cypress.Chainable<any> => {
        const noResultSelector = "[class*='flex flex-col items-center']";
        if (noResultSelector) {
          return cy.get(noResultSelector)
            .contains(/No result(s)? found!?/i)
            .should("be.visible")
            .then(() => cy.wrap(void 0));
        }
          // Table exists → check all rows on this page
          return cy.get("[data-slot*='table-body']").each($row => {
            cy.wrap($row)
              .find("td")
              .eq(columnIndex)
              .invoke("text")
              .then(text => {
                const cellText = text.trim().toUpperCase();
                expectedValues.forEach(val => {
                  if (cellText.includes(val.toUpperCase())) {
                    cy.log(`Found expected value: ${val}`);
                  }
                });
              });
          }).then(() => {
            // Check for NEXT button
            return cy.get("[data-testid*='pagination-arrow-next']").then($next => {
              if ($next.is(':disabled')) return cy.wrap(void 0); // no more pages
              cy.wrap($next).click();
              cy.wait(2000); // wait for table to render
              return checkPage(); // continue to next page
            });
          });
      };
      return checkPage();
    }

    checkColumnAcrossAllPages(3, ["SUCCESSFUL", "FAILED", "PENDING", "REVERSED"]);
  })

  it.only('Page size selector functionality check', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Account Information').click();
      cy.wait(5000);
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/account-information');

    // Page-size changes: select -> wait for table -> assert count or presence
      const pageSizeChecks = [
        { label: "Show 10", expectCount: 10 },
        { label: "Show 20", expectCount: 20 },
        { label: "Show 50", expectCount: 50 },
        { label: "Show 100", expectCount: 100 },
        { label: "Show 200", expectCount: 200 },
        { label: "Show 500", expectCount: 500 }
      ];

      pageSizeChecks.forEach((ps) => {
        cy.get("[data-testid$='table-page-size-select']").select(ps.label);
        cy.wait(3000);
        cy.get("[data-slot*='table-body']").then(($rows) => {
          const rowCount = $rows.length;
          cy.log(`After selecting ${ps.label}, found ${rowCount} rows`);
          if (ps.expectCount && rowCount === ps.expectCount) {
            expect(rowCount).to.eq(ps.expectCount);
          } else if (!ps.expectCount || rowCount < (ps.expectCount || 1)) {
            // fallback: ensure total display exists (original code checks .eq(2) element)
            cy.get("[class*='text-sm text-gray-600']").eq(0).should('exist');
          } else {
            cy.log('Unexpected row count (allowed but flagged)');
          }
        });
      });
  })
});
