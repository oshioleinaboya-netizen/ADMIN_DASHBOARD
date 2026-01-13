import { adminEmail, adminPassword } from "xboy/support/env";

describe('Customer List & Pagination Flow', () => {
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

    // 1. Login
    cy.visit("/");

    cy.get("[type$='text']", { timeout: 15000 }).should('be.visible').type(adminEmail);
    cy.get("[type$='password']").should('be.visible').type(adminPassword);
    cy.get("[type$='submit']").click();
    cy.wait(3000)

    // New device detected/
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()
    cy.wait(3000)

    //2. Wait for timer (if present)
    cy.get('body').then(($body) => {
      const timer = $body.find("[class$='self-center space-y-2']");
      if (timer.length) {
        cy.wrap(timer)
          .should('be.visible')
          .within(() => {
            cy.get("[class$='font-semibold']").should('be.visible');
          });
      }
    });

    // 3. OTP (if present)
    cy.get('body').then(($body) => {
      const otp = $body.find("[class*='cursor-text']");
      if (otp.length) {
        cy.wrap(otp).type('000000');
      }
    });

    // 4. Wait for load spinner to disappear (replaces cy.wait)
    cy.get("[class*='animate-spin']", { timeout: 20000 }).should('not.exist');

    // 5. Ensure redirected to /customers
    cy.url({ timeout: 30000 }).should('include', '/customers');
    cy.wait(3000)
  })

  it('Total users count matches entries', () => {
    cy.get('p.font-bold.text-2xl').first()
      .invoke('text')
      .then(totalText => {
        const totalCustomers = Number(totalText.replace(/,/g, '').trim())
        cy.contains('Showing').invoke('text').then(entriesText => {
          const match = entriesText.match(/of\s([\d,]+)/)
          expect(match, 'should contain total entries').to.not.be.null
          const totalEntries = Number(match[1].replace(/,/g, ''))
          expect(totalEntries).to.eq(totalCustomers)
        })
      })
  })

  it('Next and Previous page navigation', () => {
    cy.get(tableRows).should('have.length.at.most', 20)
    cy.get(tableRows).eq(0).find('td').eq(0).invoke('text').then(firstRowValue => {
      cy.get("[aria-label$='Next page']").click()
      cy.get(tableRows + ' td').should('not.contain', firstRowValue)
      cy.get("[aria-label$='Previous page']").click()
      cy.get(tableRows + ' td').should('contain', firstRowValue)
      cy.get(pageInfo).should('contain', 'Showing 1 - 20')
    })
  })

  it('Midpoint pagination check', () => {
    cy.get(tableRows).should('have.length.at.most', 20).its('length').should('be.gte', 6)
    cy.get(tableRows).eq(5).find('td').eq(1).invoke('text').then(midValue => {
      cy.get("[aria-hidden$='true']").click()
      cy.get(tableRows + ' td').should('not.contain', midValue)
    })
    cy.get("[data-testid$='pagination-button-1']").click()
    cy.get("[aria-current$='page']").should('contain', 1)
  })

  it('First and Last page disables correct navigation buttons', () => {
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-label$='Previous page']").should('be.disabled')
    cy.get("[data-testid*='pagination-button-last-page']").click()
    // cy.get("[aria-current$='page']").should('contain', 72)
    cy.get("[aria-label$='Next page']").should('be.disabled')
    cy.get("[aria-label$='Previous page']").should('not.be.disabled')
  })

  const validatePageSize = (size: number) => {
    cy.get(pageSizeSelect).select(`Show ${size}`)
    cy.get(tableRows, { timeout: 10000 }).should('have.length.at.most', size)
    cy.get(pageInfo).should('contain', `Showing 1 - ${size}`)
  }

  it('Table page size functionality', () => {
    [10, 20, 50, 100, 200, 500].forEach(size => validatePageSize(size))
  })

  it('Pagination indication by page buttons', () => {
    for (let i = 2; i <= 5; i++) {
      cy.get(`[data-testid$='pagination-button-${i}']`).click()
      cy.get(pageInfo).should('contain', `Showing ${((i - 1) * 20 + 1)} - ${i * 20}`)
    }
  })

  it.only('Verify if I can copy the emails and numbers of customers on the customer table. And the functionality works as expected.', () => {

    // Phone numbers copy check
    cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
      cy.wrap($row)
        .find('td')
        .eq(0)
        .find("[class*='lucide lucide-copy size-3.5']")
        .should('be.visible')
        .and('not.be.disabled');
    });

    // Emails copy check
    cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
      cy.wrap($row)
        .find('td')
        .eq(2)
        .find("[class*='lucide lucide-copy size-3.5']")
        .should('be.visible')
        .and('not.be.disabled');
    });
  })
})
