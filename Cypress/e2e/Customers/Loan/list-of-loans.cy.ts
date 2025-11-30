import { adminEmail, adminPassword, rankLink } from "@support/env";
describe('template spec', () => {
    beforeEach(() => {
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
      cy.get("[class$='self-center space-y-2']").should('exist').within(()=>{
        cy.get("[class$='font-semibold']").should('be.visible')
      })
   
      cy.get('body').then(($body) => {
        if ($body.find("[class*='cursor-text']").length) {
          cy.get("[class*='cursor-text']").type('000000');
        } else {
          cy.log('No OTP field found, skipping OTP input.');
        }
        cy.get("[class*='animate-spin']").should('be.visible')
      });
      cy.wait(3000)
      cy.url().should('include', '/customers')
      cy.wait(8000)
      cy.get("#search-bar-button").within(()=> {
        cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
      })
      cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('bills billers')
      cy.wait(8000)
      cy.get("[data-slot$='table-container'] tbody tr").first().click()
      cy.url().should('include', '/customers/')
    })
  it('Table ', () => {
    const tableHeaders = [
      'Loan ID',
      'Loan Type',
      'Amount',
      'Status',
      'Create At',
      "Due Date"
    ]
    cy.contains('Loans').click()
    cy.get("[data-slot*='table-container']").should('exist')
    tableHeaders.forEach((header)=> {
      cy.get("[data-slot*='table-header']").should('contain', header)
    })
  })

  it('Table ', () => {
    const tableHeaders = [
      'Loan ID',
      'Loan Type',
      'Amount',
      'Status',
      'Create At',
      "Due Date"
    ]
    cy.contains('Loans').click()
    //Status check
      cy.get("[data-slot$='table-container'] tbody tr").each(($row, index) => {
        cy.wrap($row).within(() => {
          cy.get(`[class$='flex w-fit items-center bg rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800']`).invoke('text').then((text) => {
            const status = text.trim();

            if (status === 'Active') {
              cy.wrap($row).should('contain.text', 'Active');
            } else if (status === 'Inactive') {
              cy.wrap($row).should('contain.text', 'Inactive');
            } else {
              cy.log(`⚠️ Row ${index + 1}: Invalid status "${status}"`);
            }
          });
        });
      });
  })
})