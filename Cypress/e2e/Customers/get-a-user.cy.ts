import { adminEmail, adminPassword } from "@support/env";

describe('Customer Search Flow', () => {
  const searchInput = "[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']"
  const tableRows = "[data-slot$='table-container'] tbody tr"
  const searchButton = "[type$='button']"

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

    // Login
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[type$='submit']").click()

    // New device detected/
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    // Handle OTP if present
    cy.get('body').then($body => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000')
      } else {
        cy.log('No OTP field found, skipping OTP input.')
      }
    })

    // Wait until customers page is loaded
    cy.url({ timeout: 15000 }).should('include', '/customers')
    //cy.get("[class$='self-center space-y-2']", { timeout: 10000 }).should('exist')
    cy.wait(3000)
  })

  const doSearchAndCheck = (query: string, columnIndex?: number, expectRows = 1) => {
    cy.get(searchInput).type(query)
    cy.get(searchButton).contains('Search').click()
    cy.get(tableRows, { timeout: 10000 }).should('have.length', expectRows)

    if (expectRows === 1 && columnIndex !== undefined) {
      cy.get(tableRows).first().within(() => {
        cy.get('td').eq(columnIndex).should('contain', query)
      })
    }
  }

  const doSearchAndCheck2 = (query: string, columnIndex?: number, expectRows = 1) => {
    cy.get(searchInput).type(query)
    cy.get(searchButton).contains('Search').click()
    cy.get(tableRows, { timeout: 10000 }).should('have.length.at.least', expectRows)
  }

  it('Filter by Phone number', () => doSearchAndCheck('+2348123444444', 0))
  it('Filter by Monitag', () => doSearchAndCheck('new_hahaII', 7))
  it('Filter by Name', () => doSearchAndCheck('Naomi Dickson', 1))
  it('Empty table shows no results', () => {
    doSearchAndCheck('iiiiiiiiiiiiii', undefined, 0)
    cy.get("[alt$='empty box']").should('be.visible')
    cy.get("[class$='font-semibold text-[2rem] text-center']").should('contain', 'No result found!')
    cy.get("[class$='text-gray-600 text-center']").should('contain', "We couldn't find any result for this query")
  })
  it('Search by letter returns multiple results', () => doSearchAndCheck2('j', undefined, 1))
})
