import { rankLink, adminEmail, adminPassword } from '@support/env';
describe('Get a staff - Filter by search', () => {
  beforeEach(() => {
        // Clear index DB
        cy.window().then((win) => {
          return win.indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              win.indexedDB.deleteDatabase(db.name);
            });
          });
        });

        //Authentication check - Login/
        cy.visit(rankLink)
        
        cy.get("[type$='text']").type(adminEmail)
        cy.get("[type$='password']").type(adminPassword)
        cy.get("[type$='submit']").click()
        cy.wait(3000)

        // New device detected
        cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
        cy.contains('Continue').click()

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
        cy.wait(3000)
        cy.get("[data-testid*='nav-link-staff-management']").click()
        cy.wait(3000)
    })
  it('Get a staff', () => {
    cy.get("[class*='focus-visible:outline-none ml-2 w-full']").type('Camryn Turner')
    cy.wait(3000)

    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).first().within(() => {
      cy.get('td').eq(0).should('contain', 'Camryn Turner');
      //cy.get('td').eq(5).should('contain', 'INVITED');
      cy.get('td').eq(3).should('contain', 'finance');
      cy.get('td').eq(2).should('contain', 'user_1763947207844@test.com');
    })
    cy.get("[class*='focus-visible:outline-none ml-2 w-full']").clear()
    cy.wait(3000)
    //
    cy.get("[class*='focus-visible:outline-none ml-2 w-full']").type('finance')
    cy.wait(4000)
    // Find staff through the across pages
    cy.findRowAcrossPages(
      "Camryn Turner",
      "[data-slot$='table-container'] tbody tr",
      "[data-slot='pagination-next']"
    );
  })
})