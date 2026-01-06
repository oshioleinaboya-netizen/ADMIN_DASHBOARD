import { adminEmail, adminPassword } from "@support/env";
import { findRowAcrossPages } from '@support/helper';

describe('Staff Management - Pagination & Invitation Status Checks', () => {
  const WAIT_MED = 5000;
  const WAIT_LONG = 30000;

  beforeEach(() => {
    // Clear index DB
    cy.window().then((win) => {
      return win.indexedDB.databases().then((dbs) => {
        dbs.forEach((db) => {
          win.indexedDB.deleteDatabase(db.name);
        });
      });
    });

    // Authentication check - Login/
    cy.visit("/");

    cy.get("[type$='text']").type(adminEmail);
    cy.get("[type$='password']").type(adminPassword);
    cy.get("[type$='submit']").click();
    cy.wait(3000)

    // New device detected
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    // Handle optional OTP
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']", { timeout: 5000 }).type('000000');
      }
    });

    // Wait until spinner disappears and URL includes '/customers'
    cy.get("[class*='animate-spin']", { timeout: 10000 }).should('not.exist');
    cy.url({ timeout: 30000 }).should('include', '/customers');
    cy.wait(3000)

    // Navigate to staff management
    cy.get("[data-testid*='nav-link-staff-management']").click();
    cy.wait(3000)
  });

  it('Mid point between table pages', () => {
    cy.wait(3000);

    cy.get("[data-slot$='table-container'] tbody tr")
      .should("have.length.at.most", 20)
      .its('length')
      .should('be.gte', 6);

    cy.get("[data-slot$='table-container'] tbody tr").eq(5).find("td").eq(1).invoke("text").then(storedValue => {
      cy.log("storedValue:", storedValue.trim());

      // Click midpoint pagination
      cy.get("[data-testid*='pagination-numbers']").within(() => {
        cy.get("[aria-hidden$='true']").click();
        cy.wait(1000);
      });

      cy.get("[data-slot$='table-container'] tbody tr td")
        .should("not.contain", storedValue.trim());
    });

    // Click first page "..." to land
    cy.get("[data-testid$='pagination-button-1']").click();
    cy.get("[aria-current$='page']").should('contain', 1);

    cy.get("[data-testid*='pagination-numbers']").within(() => {
      cy.get("[aria-hidden$='true']").click();
      cy.wait(1000);
    });

    cy.get("[aria-current$='page']").invoke('text').then(text => {
      const currentPage = Number(text.trim());
      expect(currentPage).to.be.oneOf([2, 3, 4, 5]);
    });
  });

  it('Previous page disabled - First page | Next page disabled - Last page', () => {
    cy.get("[aria-current$='page']").should('contain', 1);
    cy.get("[aria-label$='Previous page']").should('be.disabled');

    cy.get("[data-testid$='pagination-button-10']").click();
    cy.get("[aria-current$='page']").should('contain', 12);
    cy.get("[aria-label$='Next page']").should('be.disabled');
    cy.get("[aria-label$='Previous page']").should('not.be.disabled');
  }); // Make last page unique like the first page

  it('Pagination indication functionality', () => {
    const ranges = ['1 - 20', '21 - 40', '41 - 60', '61 - 80', '81 - 100'];

    ranges.forEach((range, index) => {
      cy.get(`[data-testid$='pagination-button-${index + 1}']`).click();
      cy.get("[class$='text-sm text-gray-600']").should('contain', `Showing ${range}`);
    });
  });

  it('Table rows - At most 20 rows displayed per page', () => {
    cy.get("[data-slot*='table-container'] tbody tr").then(rows => {
      expect(rows.length).to.be.at.most(20);
    });
  });

  it('Staff UI - Table headers', () => {
    const expectedHeaders = ['Staff name', 'Level', 'Email address', 'Staff business team', 'Location', 'Status', 'Actions'];
    
    cy.get(`[data-slot*='table-container']`).within(() => {
      cy.get('th').each((header, index) => {
        cy.wrap(header).should('have.text', expectedHeaders[index]);
      });
    });
  })

  it.only('Checks invitation statuses across all pages', () => {
    // ACTIVE
    findRowAcrossPages(row => /(^|\s)ACTIVE(\s|$)/.test(row.innerText))
      .then(activeRow => activeRow && cy.wrap(activeRow).find("td").eq(6).find("button").should("be.disabled"));

    // INVITED
    findRowAcrossPages(row => row.innerText.includes("INVITED"))
      .then(invitedRow => invitedRow && cy.wrap(invitedRow).find("td").eq(6).find("button").should("be.disabled"));

    // INACTIVE
    findRowAcrossPages(row => row.innerText.includes("INACTIVE"))
      .then(inactiveRow => inactiveRow && cy.wrap(inactiveRow).find("td").eq(6).find("button").should("be.disabled"));

    // EXPIRED
    findRowAcrossPages(row => row.innerText.includes("EXPIRED"))
      .then(expiredRow => {
        if (!expiredRow) return;

        cy.wrap(expiredRow).find("td").eq(6).find("button").should("not.be.disabled").click();
        cy.wait(2000);

        cy.get("[data-slot*='dropdown-menu-item']").contains("Resend").should("be.visible").click();
      });

    // Check for at least one NOT EXPIRED row
    findRowAcrossPages(row => !row.innerText.includes("EXPIRED")).should("exist");
  });
});
