import { adminEmail, adminPassword } from "cypress/support/env";
import { faker } from '@faker-js/faker';

const selectors = {
  firstName: "First name",
  surName: "Surname",
  email: "Email address",
  phone: "Phone Number",
  jobTitle: "Job title",
  department: "Department",
  level: "Level",
  country: "Country of operation",
  domains: "Domains",
  inviteButton: '[type*="button"]:contains("Invite Staff")'
};

// Helper functions/
const typeInput = (label: string, value: string) => {
  cy.contains(label).parent().find("input, textarea").first().clear().type(value);
};

const selectDropdown = (label: string, optionText: string) => {
  cy.contains(label).parent().find("[class*='flex flex-wrap']").click();
  cy.get("[class*='absolute z-10']").contains(optionText).click();
};

const checkPermissions = (check = true) => {
  cy.get("[id*='permissions-scroll-container']").eq(0).within(() => {
    cy.get("[class*='flex items-center gap-x-2']").each(($el, index) => {
      const checkbox = cy.wrap($el).find("input[type='checkbox']");
      if (check) checkbox.check({ force: true }); else checkbox.uncheck({ force: true });
    });
  });
};

describe('Invite staff', () => {
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

    // Authentication check - Login
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

    // Navigate to staff management/
    cy.get("[data-testid*='nav-link-staff-management']").click();
    cy.wait(3000)
  });

  it('Invite staff - full flow', () => {
    cy.contains('Invite a staff').click();

    const firstName = faker.person.firstName();
    const surName = faker.person.lastName();
    const email = `user_${Date.now()}@test.com`;
    const phone = '080' + Math.floor(10000000 + Math.random() * 90000000);

    typeInput(selectors.firstName, firstName);
    typeInput(selectors.surName, surName);
    typeInput(selectors.email, email);
    typeInput(selectors.phone, phone);
    typeInput(selectors.jobTitle, 'Automation Personnel');

    selectDropdown(selectors.department, 'FINANCE');
    selectDropdown(selectors.level, 'LEAD');
    checkPermissions(true);
    selectDropdown(selectors.country, 'NIGERIA');
    selectDropdown(selectors.domains, 'RANK MFB');

    cy.get(selectors.inviteButton).eq(0).click();

    // Success verification
    cy.get("[class*='font-semibold']").should('contain', 'Invitation sent successfully');
  });

  it('Existing email', () => {
    cy.contains('Invite a staff').click();
    typeInput(selectors.email, 'cxadmin@blondmail.com');
    cy.get(selectors.inviteButton).eq(0).click();
    cy.get("[class*='bg-[#FEE7EF]']").should('contain', 'Email is already in use.');
  });

  it('Existing phone', () => {
    cy.contains('Invite a staff').click();
    typeInput(selectors.phone, '08049994882');
    cy.get(selectors.inviteButton).eq(0).click();
    cy.get("[class*='bg-[#FEE7EF]']").should('contain', 'Phone number is already in use.');
  });
});
