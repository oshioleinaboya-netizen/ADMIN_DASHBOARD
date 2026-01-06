import { adminEmail, adminPassword } from "@support/env";
import { checkColumnAcrossAllPages } from '@support/helper';

const WAIT_LONG = 30000;
const WAIT_MED = 10000;

describe('Filter savings transactions', () => {
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

    cy.visit("/"); // Site visit

    // Login
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

  it('Filter Trnsactions by Type', () => {

    function checkTransactionType(type) {
      cy.get("body").then(($body) => {
        // Check for "No results found" first
        if ($body.find("[class*='flex flex-col items-center']").text().match(/No result(s)? found!?/i)) {
          // Assert visible and stop
          cy.get("[class*='flex flex-col items-center']")
            .contains(/No result(s)? found!?/i)
            .should("be.visible");
        } else {
          // Table exists → check rows
          cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
            cy.wrap($row)
              .find("td")
              .eq(0)
              .invoke("text")
              .then((text) => {
                expect(text.trim().toUpperCase()).to.equal(type.toUpperCase());
              });
          });
        }
      });
    }

    // savings tab click
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click().click();
    });
    cy.wait(4000)
    
    cy.get("[data-slot$='table-container'] tbody tr", {timeout: 5000} ).eq(2).click().click(); // Table data selection
    cy.wait(4000)

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Interest').click()
      })
      cy.contains('Apply').click();
    })
    cy.wait(3000)
    checkTransactionType("INTEREST"); // Check transaction type column

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters').scrollIntoView().click();
      cy.wait(2000)
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Topup').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkTransactionType("TOPUP"); // Check transaction type column

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters').scrollIntoView().click();
      cy.wait(2000)
      cy.contains('Type').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Withdrawal').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkTransactionType("WITHDRAWAL"); // Check transaction type column

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters').scrollIntoView().click();
      cy.wait(2000)
      cy.contains('Type').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Deposit').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkTransactionType("DEPOSIT"); // Check transaction type column

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Type').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Interest posting').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkTransactionType("INTEREST_POSTING"); // Check transaction type column
  })

  it('Filter Trnsactions by Status', () => {
    function checkStatus(allowedStatuses) {
      if (!Array.isArray(allowedStatuses)) {
        allowedStatuses = [allowedStatuses]; // convert single string to array
      }
      cy.get("body").then(($body) => {
        // Check for "No results found" first
        if ($body.find("[class*='flex flex-col items-center']").text().match(/No result(s)? found!?/i)) {
          // Assert visible and stop
          cy.get("[class*='flex flex-col items-center']")
            .contains(/No result(s)? found!?/i)
            .should("be.visible");
        } else {
          // Table exists → check rows
          cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
            cy.wrap($row)
              .find("td")
              .eq(4)
              .invoke("text")
              .then((text) => {
                const statusText = text.trim().toUpperCase();
                expect(allowedStatuses.map(s => s.toUpperCase())).to.include(statusText);
              });
          });
        }
      });
    }

    // savings tab click
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click().click();
    });
    cy.wait(4000)
    
    cy.get("[data-slot$='table-container'] tbody tr", {timeout: 5000} ).eq(2).click().click(); // Table data selection
    cy.wait(4000)

    // Status Filtering

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Status').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Successful').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkStatus("SUCCESSFUL"); // Check transaction type column
    // -------
    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Status').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Pending').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkStatus("PENDING"); // Check transaction type column
    // -------
    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Status').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Completed').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkStatus(["SUCCESSFUL", "FAILED"]); // Check transaction type column
    // -------
    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Status').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Acknowledged').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkStatus("ACKNOWLEDGED"); // Check transaction type column
    // -------
    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Status').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Failed').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkStatus("FAILED"); // Check transaction type column
  })

  it('Sort By savings transactions', () => {
    function checkDateSort() {
      cy.get("body").then(($body) => {
        // Check for "No results found" first
        if ($body.find("[class*='flex flex-col items-center']").text().match(/No result(s)? found!?/i)) {
          // Assert visible and stop
          cy.get("[class*='flex flex-col items-center']")
            .contains(/No result(s)? found!?/i)
            .should("be.visible");
        } else {
          // Table exists → check rows
          cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
            cy.wrap($row)
              .find("td")
              .eq(5)
              .should('not.be.empty')
          });
        }
      });
    }

    // savings tab click
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click().click();
    });
    cy.wait(4000)
    
    cy.get("[data-slot$='table-container'] tbody tr", {timeout: 5000} ).eq(2).click().click(); // Table data selection
    cy.wait(4000)

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      //cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      //cy.wait(2000)
      cy.contains('Sort by').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Created at').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkDateSort()
    // -------
    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
    cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
    cy.wait(2000)
      cy.contains('Sort by').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Paid at').click()
      })
      cy.contains('Apply').click(); // Apply filters
    })
    cy.wait(3000)
    checkDateSort()
  })

  it('Multiple picks - One parent (Type)', () => {

    // savings tab click
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click().click();
    });
    cy.wait(2000)
    
    cy.get("[data-slot$='table-container'] tbody tr", {timeout: 5000} ).eq(2).click().click(); // Table data selection
    cy.wait(2000)

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Interest').click()
        cy.contains('Topup').click()
      })
      cy.contains('Apply').click();
    })
    cy.wait(3000)
    // Interest & Top Up
    checkColumnAcrossAllPages(0, ["Topup", "Interest"]); // Check transaction type column
  })

  it('Multiple picks - One parent (Type - Status)', () => {

    function checkStatus(allowedStatuses) {
      if (!Array.isArray(allowedStatuses)) {
        allowedStatuses = [allowedStatuses]; // convert single string to array
      }
      cy.get("body").then(($body) => {
        // Check for "No results found" first
        if ($body.find("[class*='flex flex-col items-center']").text().match(/No result(s)? found!?/i)) {
          // Assert visible and stop
          cy.get("[class*='flex flex-col items-center']")
            .contains(/No result(s)? found!?/i)
            .should("be.visible");
        } else {
          // Table exists → check rows
          cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
            cy.wrap($row)
              .find("td")
              .eq(4)
              .invoke("text")
              .then((text) => {
                const statusText = text.trim().toUpperCase();
                expect(allowedStatuses.map(s => s.toUpperCase())).to.include(statusText);
              });
          });
        }
      });
    }

    // savings tab click
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click().click();
    });
    cy.wait(2000)
    
    cy.get("[data-slot$='table-container'] tbody tr", {timeout: 5000} ).eq(2).click().click(); // Table data selection
    cy.wait(2000)

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Interest').click()
      }) // Type pick
      cy.contains('Status').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Successful').click()
      }) // Status pick
      cy.contains('Apply').click();
    })
    cy.wait(3000)
    // Interest & Top Up
    checkColumnAcrossAllPages(0, ["Interest"])
    checkStatus("SUCCESSFUL"); // Check transaction type column
    
    // -------
    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Interest').click()
      }) // Type pick
      cy.contains('Status').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Failed').click()
      }) // Status pick
      cy.contains('Apply').click();
    })
    cy.wait(3000)
    // Interest & Top Up
    checkColumnAcrossAllPages(0, ["Interest"])
    checkStatus("FAILED"); // Check transaction type column
  })

  it('Multiple picks - One parent (Type - Sort by)', () => {

    function checkDateSort() {
      cy.get("body").then(($body) => {
        // Check for "No results found" first
        if ($body.find("[class*='flex flex-col items-center']").text().match(/No result(s)? found!?/i)) {
          // Assert visible and stop
          cy.get("[class*='flex flex-col items-center']")
            .contains(/No result(s)? found!?/i)
            .should("be.visible");
        } else {
          // Table exists → check rows
          cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
            cy.wrap($row)
              .find("td")
              .eq(5)
              .should('not.be.empty')
          });
        }
      });
    }

    // savings tab click
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click().click();
    });
    cy.wait(2000)
    
    cy.get("[data-slot$='table-container'] tbody tr", {timeout: 5000} ).eq(2).click().click(); // Table data selection
    cy.wait(2000)

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Interest').click()
      }) // Type pick
      cy.contains('Sort by').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Created at').click()
      }) // Status pick
      cy.contains('Apply').click();
    })
    cy.wait(3000)
    // Interest & Top Up
    checkColumnAcrossAllPages(0, ["Interest"])
    checkDateSort(); // Check transaction type column
    
    // -------
    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Topup').click()
      }) // Type pick
      cy.contains('Sort by').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Paid at').click()
      }) // Status pick
      cy.contains('Apply').click();
    })
    cy.wait(3000)
    // Interest & Top Up
    checkColumnAcrossAllPages(0, ["Interest"])
    checkDateSort(); // Check transaction type column
  })

  it.only('Multiple picks - One parent (Type - Sort by)', () => {
    function checkStatus(allowedStatuses) {
      if (!Array.isArray(allowedStatuses)) {
        allowedStatuses = [allowedStatuses]; // convert single string to array
      }
      cy.get("body").then(($body) => {
        // Check for "No results found" first
        if ($body.find("[class*='flex flex-col items-center']").text().match(/No result(s)? found!?/i)) {
          // Assert visible and stop
          cy.get("[class*='flex flex-col items-center']")
            .contains(/No result(s)? found!?/i)
            .should("be.visible");
        } else {
          // Table exists → check rows
          cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
            cy.wrap($row)
              .find("td")
              .eq(4)
              .invoke("text")
              .then((text) => {
                const statusText = text.trim().toUpperCase();
                expect(allowedStatuses.map(s => s.toUpperCase())).to.include(statusText);
              });
          });
        }
      });
    }

    function checkDateSort() {
      cy.get("body").then(($body) => {
        // Check for "No results found" first
        if ($body.find("[class*='flex flex-col items-center']").text().match(/No result(s)? found!?/i)) {
          // Assert visible and stop
          cy.get("[class*='flex flex-col items-center']")
            .contains(/No result(s)? found!?/i)
            .should("be.visible");
        } else {
          // Table exists → check rows
          cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
            cy.wrap($row)
              .find("td")
              .eq(5)
              .should('not.be.empty')
          });
        }
      });
    }

    // savings tab click
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Savings').click().click();
    });
    cy.wait(2000)
    
    cy.get("[data-slot$='table-container'] tbody tr", {timeout: 5000} ).eq(2).click().click(); // Table data selection
    cy.wait(2000)

    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Interest').click()
      }) // Type pick
      cy.contains('Sort by').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Created at').click()
      }) // Status pick
      cy.contains('Apply').click();
    })
    cy.wait(3000)
    // Interest & Top Up
    checkColumnAcrossAllPages(0, ["Interest"])
    checkDateSort(); // Check transaction type column
    
    // -------
    cy.get("[data-testid*='filters-trigger']").click() // Click filter button
    cy.wait(500)
    cy.get("[class*='space-y-6']").should('exist').within(()=> { // Parent selection
      cy.contains('Clear all filters', { timeout: 5000 }).scrollIntoView().click({ force: true });
      cy.wait(2000)
      cy.contains('Type').parent().should('be.visible').within(()=> {
        cy.contains('Topup').click()
      }) // Type pick
      cy.contains('Status').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Successful').click()
      }) // Status pick
      cy.contains('Sort by').parent().scrollIntoView().should('be.visible').within(()=> {
        cy.contains('Paid at').click()
      }) // Date pick
      cy.contains('Apply').click();
    })
    cy.wait(3000)
    // Interest & Top Up
    checkColumnAcrossAllPages(0, ["Interest"])
    checkStatus("SUCCESSFUL")
    checkDateSort(); // Check transaction type column
  })
})