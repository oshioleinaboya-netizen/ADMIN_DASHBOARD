import { adminEmail, adminPassword, rankLink } from "@support/env";

describe('Staffs UI check', () => {
  beforeEach(() => {
    //Authentication check - Login
    cy.visit(rankLink)
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.wait(2000);
    cy.get('body').then(($body) => {
      const timerExists = $body.find("[class$='self-center space-y-2']").length > 0;
      if (timerExists) {
        cy.get("[class$='self-center space-y-2']").should('exist').within(()=>{
          cy.get("[class$='font-semibold']").should('be.visible')
        })
      } else {
        cy.log('No timer exists');
      }
    })
 
    cy.get('body').then(($body) => {
      const otpField = $body.find("[class*='cursor-text']").length > 0;
      if (otpField) {
        cy.get("[class*='cursor-text']").type('000000');
      } else {
        cy.log('No OTP field found, skipping OTP input.');
      }
      $body.find("[class*='animate-spin']")
    });
    cy.wait(5000)
    cy.location().then((loc) => {
      cy.log('Current URL:', loc.href)
    })
    cy.url({ timeout: 30000 }).should('include', '/customers')
    cy.get("[data-testid*='nav-link-staff-management']").click()
  })
  it('Staffs page - UI check', () => {
    cy.get("[class*='font-bold text-[30px]']").should('be.visible').and('contain', 'Staff Management')
    cy.get("[class*='flex justify-between items-center mb-10']").within(()=> {
      cy.get("[class*='text-[#1E4D37]']").eq(0).should('contain', 'Staff list')
      cy.get("[class*='text-[#71717A] mr-2']").should('contain', 'Rank')
    })
    cy.contains('Invite a staff')
    cy.get("[class*='md:w-1/2 flex']").should('exist').within(()=> {
      cy.get("[class*='flex border border-grey p-1 rounded-md bg-white w-full']").should('exist')
      cy.get(`[placeholder$="search by staff's name, team and role"]`).should('exist')
      cy.get("[type*='button']").should('contain', 'Search')
    })
    cy.get("[class*='relative']").should("exist").and('contain', 'Filter')
  })
  it('Staff UI - Pagination', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[class$='flex items-center justify-between w-full']").within(() => {
      cy.get("[class$='flex items-center gap-4']").within(() => {
        cy.get("[class$='text-sm text-gray-600']").should('exist');
      });

      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist');
        cy.get("[aria-label$='Next page']").should('not.be.disabled');
        cy.get("[aria-current$='page']").should('not.be.disabled');
      });
    });
  })
})