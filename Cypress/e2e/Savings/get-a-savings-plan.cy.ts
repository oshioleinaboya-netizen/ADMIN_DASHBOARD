import { adminEmail, adminPassword, rankLink } from "@support/env";

describe('Get a savings plan', () => {
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
  it('Filter by search', ()=> {
    // Plan type
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by plan type or plan name"]`).should('exist')
    })
    cy.get("#search-bar-button").type('reserve')
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('contain', 'Reserve')
    cy.get("[class$='focus-visible:outline-none ml-2 w-full']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 10)
    // ------------------
    /*cy.get("#search-bar-button").type('goals')
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('contain', 'Goals')
    cy.get("[class$='focus-visible:outline-none ml-2 w-full']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 10)*/

    // Plan name - Fetch by name
    cy.get("#search-bar-button").type('bzbdb')
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).first().within(() => {
      cy.get('td').eq(2).should('contain', 'bzbdb');
    })
    cy.get("[class$='focus-visible:outline-none ml-2 w-full']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 10)
  
    // Unavailable plan type/name
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by plan type or plan name"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('iiiiiiiiiiiiii')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 0)
    cy.get("[alt$='empty box']").should('be.visible')
    cy.get("[class$='font-semibold text-[2rem] text-center']").should('contain', 'No result found!')
    cy.get("[class$='text-gray-600 text-center']").should('contain', "We couldn't find any result for this query.")
    cy.get("[class$='text-gray-600 text-center']").should('contain', "Try adjusting the search again")
    cy.get("[class$='focus-visible:outline-none ml-2 w-full']").clear()
  })
})