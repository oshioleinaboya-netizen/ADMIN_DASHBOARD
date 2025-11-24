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
  it.only('Deactivate staff', ()=> {
    cy.get("[data-slot$='table-container']").within(() => {
      cy.get("tbody tr")
        .filter((i, row) => {
          const text = row.innerText.trim();
          return text.includes("ACTIVE") && !text.includes("INACTIVE") && !text.includes("SUPER-ADMIN");
        })
        .first()
        .then($row => {
          cy.wrap($row).click(); // ✅ wrap before clicking
        });
    });

    cy.wait(5000)
    cy.url().should('include', '/staff-mgt/')
    cy.contains('Deactivate staff').click()
    cy.wait(5000)
    cy.url({ timeout: 10000 }).should('include', '/staff-mgt/deactivate?code');
    cy.contains("Choosing reason for deactivating").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose reason for deactivating')
      }).click()
    })
    const reasons = [
      'Contract Termination',
      'Extended Leave',
      'Other',
      'Security Concern'
    ]
    reasons.forEach((reason) => {
      cy.contains(reason).should('be.visible');
    })
    cy.get("[type*='button']").should('be.visible').eq(0).and('contain', 'Deactivate staff').and('be.disabled')
    cy.contains('Contract Termination').should('be.visible').click()
    cy.contains("Choosing reason for deactivating").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.contains('Contract Termination')
      })
    })
    cy.get("[type*='button']").should('be.visible').eq(0).and('contain', 'Deactivate staff').and('not.be.disabled')
    //
    cy.contains("Choosing reason for deactivating").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.contains('Contract Termination')
      }).click()
    })
    cy.contains('Other').should('be.visible').click()
    cy.get("[type*='button']").should('be.visible').eq(0).and('contain', 'Deactivate staff').and('not.be.disabled')
    cy.contains("Enter reason for deactivating staff").parent().within(()=> {
      cy.get(`textarea[placeholder$="Enter reason"]`).should('exist').type('Testing reason for deactivating staff')
    })
    // Open modal
    cy.contains('button', 'Deactivate staff')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // ====== MODAL CONTENT CHECK ======
    cy.get("[class*='relative bg-white w-[592px]']").eq(0)
      .should('be.visible')
      .within(() => {

        cy.contains('Are you sure you want to deactivate this staff?').should('be.visible');
        cy.contains('Deactivating Test User').should('be.visible');

        cy.contains('button', 'Yes, please').should('be.visible');
        cy.get('[alt*="close modal"]').should('be.visible');

        // No, cancel
        cy.contains('button', 'No, cancel')
          .should('be.visible')
          .click();
      });

    // Ensure modal closes
    cy.get("[class*='relative bg-white w-[592px]']")
      .should('not.exist');

    cy.wait(1000);

    // ====== REOPEN MODAL ======
    cy.contains('button', 'Deactivate staff').click();

    // Close with X
    cy.get("[class*='relative bg-white w-[592px]']").eq(0)
      .should('be.visible')
      .within(() => {
        cy.get('[alt*="close modal"]').click();
      });

    cy.get("[class*='relative bg-white w-[592px]']")
      .should('not.exist');

    
      // ====== REOPEN MODAL ======
    cy.contains('button', 'Deactivate staff').click();

    // ====== MODAL CONTENT CHECK ======
    cy.get("[class*='relative bg-white w-[592px]']").eq(0)
      .should('be.visible')
      .within(() => {
        cy.contains('Are you sure you want to deactivate this staff?').should('be.visible');
        cy.contains('Deactivating Test User').should('be.visible');

        cy.contains('button', 'No, cancel').should('be.visible');
        cy.get('[alt*="close modal"]').should('be.visible');

        // Yes, please
        cy.contains('button', 'Yes, please')
          .should('be.visible')
          .click();
      });
      cy.wait(5000)
    cy.contains('Deactivation successful')  
    cy.get("[class*='text-[#646464] text-center']").should('be.visible').and('contain', 'You have successfully deactivated')
    cy.get("[class*='text-[#646464] text-center']").should('be.visible').and('contain', 'Test User account and they can')
    cy.contains('Ok')
    cy.get("[alt*='close modal']").should('be.visible')
    cy.contains('Ok').click()

    cy.get("[data-slot$='table-container']").within(() => {
      cy.get("tbody tr")
        .filter((i, row) => {
          const text = row.innerText.trim();
          return text.includes("INACTIVE");
        })
        .its('length')
        .should('be.greaterThan', 5);
    })
  })
})