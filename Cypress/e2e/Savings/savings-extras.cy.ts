describe('Customer Management', ()=> {
  beforeEach(() => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
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
  it.only('Get particular a customer - Savings UI Check', ()=> {
    cy.wait(5000)
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Savings').click()
      cy.wait(5000)
    })
    cy.url().should('include', '/savings')

      cy.contains('Total Savings Balance');
      cy.contains('Total Interest Earned');
      cy.contains('Active Savings Plans');
      cy.contains('Closed Savings Plans');
      cy.contains('Active savings plans');
      cy.contains('Matured savings plans');
      cy.contains('Closed savings plans');
      cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
        cy.contains('Filter').should('be.visible');
        cy.root().should('not.be.disabled');
      });
      cy.get("[alt$='search icon']").should('exist').and('not.be.disabled');
      /*cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'Showing')
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'entries')*/
      cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible')
      cy.get("[class$='font-bold text-[20px]']").should('be.visible')
      cy.get("[alt$='profile image']").should('be.visible')
      cy.contains('Customer Management')
      cy.get("[class$='flex justify-between items-center']").within(()=> {
      cy.contains('Rank')
      cy.contains('Customers')
      cy.get
      cy.wait(8000)
      cy.get("[class$='text-[#1E4D37]']").invoke('text').then((customerName) => {
        const trimmedId = customerName.trim()
        cy.get("[class*='font-bold text-[20px]']").should('contain', `/${trimmedId}/`)
      })
    })
    //Matured savings
    cy.contains('Matured savings plans').click()
    cy.get("[data-slot$='table-container']").should('exist')

    //Closed savings
    cy.contains('Closed savings plans').click()
    cy.get("[data-slot$='table-container']").should('exist')
  })
})