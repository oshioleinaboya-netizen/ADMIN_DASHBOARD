import { adminEmail, adminPassword, rankLink } from "@support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 8000;

describe('Customer Details', () => {
  const customerDetails: string[] = [
    'First name','Middle name','Surname','Customer ID','Date Created','Gender','Marital status',
    'Nationality','Birth country','Birth state','Date of birth','Referred by','Monitag','Status',
    '1.0 migration status','Manual verification','Business domain','Highest educational degree',
    'Employment status','Name of school','Course of study','School address','Home address'
  ];

  const tableHeaders: string[] = [
    'Name','Name/Value','Document','Country','Verification status','Verification type','Action'
  ];

  beforeEach(() => {
    cy.visit(rankLink);
    cy.window().then(win => win.sessionStorage.clear());

    cy.get("[type$='text']", { timeout: WAIT_LONG }).type(adminEmail);
    cy.get("[type$='password']", { timeout: WAIT_LONG }).type(adminPassword);
    cy.get("[type$='submit']", { timeout: WAIT_LONG }).click();

    // New device detected/
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    cy.get("[class$='self-center space-y-2']", { timeout: WAIT_LONG }).within(() => {
      cy.get("[class$='font-semibold']").should('be.visible');
    });

    cy.get('body').then($body => {
      if ($body.find("[class*='cursor-text']").length) cy.get("[class*='cursor-text']").type('000000');
      cy.get("[class*='animate-spin']").should('be.visible');
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/customers');

    cy.get("#search-bar-button", { timeout: WAIT_MED }).within(() => {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist');
    });

    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']", { timeout: WAIT_MED })
      .type('bills billers');

    cy.get("[data-slot$='table-container'] tbody tr").first().click();
    cy.url({ timeout: WAIT_LONG }).should('include', '/customers/');
  });

  it('Customer Details UI Check', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      customerDetails.forEach(detail => cy.contains(detail).should('be.visible'));

      ['KYC','Customer Management',"Customer's Details",'Details','Account Information','Fraud','Loans',
       'Savings','Next of kin details','Phone number','Name','Email address','Relationship']
       .forEach(label => cy.contains(label).should('be.visible'));

      cy.get("[alt$='profile image']").should('be.visible');
      cy.get("[type$='button']").should('contain', 'Customer Actions').and('be.visible');

      tableHeaders.forEach(header => cy.contains(header).should('be.visible'));
    });

    cy.contains('Customer Management');
    cy.get("[alt$='profile image']").should('be.visible');
    cy.get("[class$='flex items-center']").within(() => {
      cy.contains('Rank');
      cy.contains('Customers');
      cy.wait(6000);
    });
  });

  it('Customer ID URL Check', () => {
    cy.get("[class$='font-medium lg:text-base text-sm']").eq(3).invoke('text').then(customerId => {
      const trimmedId = customerId.trim();
      cy.url().should('include', `/${trimmedId}/`);
    });
  });
});
