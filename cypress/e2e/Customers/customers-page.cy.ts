import { adminEmail, adminPassword } from "cypress/support/env";

describe('Customers page - UI', () => {
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
    cy.wait(4000)

    // New device detected
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()
    cy.wait(4000)

    //2. Wait for timer (if present)/
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
  });

  // ========= TEST 1 =========
  it('Should have all expected clickable components visible', () => {
    cy.document().its('readyState').should('eq', 'complete');

    cy.get('body', { timeout: 15000 }).should('be.visible').within(() => {
      cy.get("[alt$='Rank Logo']").should('exist');
      cy.get("[data-testid$='nav-link-customers']").should('be.visible').and('not.be.disabled');
      cy.get("[data-testid$='nav-link-text-staff-management']").should('be.visible');
      cy.get("[data-testid$='nav-link-text-fraud-management']").should('be.visible');
      cy.get("[data-testid$='nav-link-text-loan']").should('be.visible');
      cy.get("[class$='flex h-[48px] w-max items-center justify-between gap-2 border border-[#470C00] bg-[#470C00] rounded-full p-3 text-sm font-medium hover:bg-[#452a25] mb-1']")
        .should('be.visible');
    });
  });

  // ========= TEST 2 =========
  it('Customers UI - 1', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('be.visible');

    cy.get("[class$='rounded-lg bg-white transition-shadow duration-200 border border-gray-200 p-4 flex py-8 mb-8']")
      .should('exist')
      .within(() => {
        cy.get("[class$='ml-8 pr-8']")
          .should('contain', 'Tier 0')
          .and('contain', 'Tier 1')
          .and('contain', 'Tier 2')
          .and('contain', 'Tier 3');

        cy.contains("[class$='ml-8 border-r pr-8']", 'Onboarded users');
        cy.contains("[class$='ml-8 border-r pr-8']", 'Total customers');
      });

    cy.get("[class$='font-bold text-[14px]']").should('be.visible');
    cy.get("[class*='flex items-center']").should('be.visible');
    cy.get("[alt$='right arrow']").should('be.visible');
    cy.get("[class$='text-[#71717A]']").should('contain', 'Rank');
    cy.get("[class$='text-[#1E4D37] hover:cursor-pointer']").should('be.visible');

    cy.get("[class$='__className_b9c7ce antialiased bg-[#fafafa]']")
      .should('contain', 'Create a client')
      .and('contain', 'Drafts');
  });

  // ========= TEST 3 =========
  it('Customers UI - 2', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('be.visible');

    cy.contains("[class$='font-bold text-[14px]']", 'Total number of customers by period').should('be.visible');
    cy.get("[class$='font-bold text-[30px]']").should('be.visible');

    cy.get("[class$='__className_b9c7ce antialiased bg-[#fafafa]']")
      .should('contain', 'Active clients');

    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Sort').should('be.visible');
      cy.get("[alt$='sort icon']").should('exist');
      cy.contains('Filter').should('be.visible');
      cy.get("[alt$='filter icon']").should('exist');
      cy.contains('Export').should('be.visible');
    });

    cy.get("#search-bar-button").should('be.visible');
  });

  // ========= TEST 4 =========
  it('Customer management UI - Table', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('be.visible');

    cy.get("[data-slot$='table-container'] thead tr th")
      .should('have.length', 8)
      .each(($th, index) => {
        const headers = [
          'Phone number',
          "Customer's Name",
          'Email address',
          'Created At',
          'Gender',
          'Nationality',
          'Place of birth',
          'Monitag',
        ];
        expect($th).to.contain(headers[index]);
      });

    cy.get("[data-slot$='table-container'] tbody tr")
      .should('have.length.at.most', 20)
      .first()
      .within(() => {
        cy.get('td').each(($td) => {
          cy.wrap($td).should('not.be.empty');
        });
      });
  });

  // ========= TEST 5 =========
  it('Customer UI - Pagination', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('be.visible');

    cy.get("[class$='flex items-center justify-between w-full']").within(() => {
      cy.get("[class$='flex items-center gap-4']").within(() => {
        cy.contains('Show').should('be.visible');
        cy.get("[class$='text-sm text-gray-600']").should('exist');
      });

      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist');
        cy.get("[aria-label$='Next page']").should('not.be.disabled');
        cy.get("[aria-current$='page']").should('be.visible');
      });
    });
  });
});
