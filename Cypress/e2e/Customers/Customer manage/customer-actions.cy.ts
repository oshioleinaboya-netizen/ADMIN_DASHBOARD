describe('Customer Management functionality check', ()=> {
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
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('billers')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.url().should('include', '/customers/')
  })
  it('Customer Actions - Flag customer', ()=> {
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(()=> {
      cy.contains('Flag customer').click()
    })
    cy.get("[class$='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").should('exist').within(()=> {
      /*cy.get("[class$='text-xl font-semibold mb-4']").should('contain', 'Flag User')
      cy.contains('Report and flag a suspicious activity for further review by assigning reason, severity and action type.')
      cy.contains('Reason (Trigger type)')
      cy.contains('Comment')
      cy.contains('Do you want to escalate this?')
      cy.contains('Yes')
      cy.contains('No')
      cy.get("[type$='button']").should('contain', 'Cancel')
      cy.get("[type$='button']").should('contain', 'Flag')
      cy.get("[class$='flex flex-wrap gap-2 flex-1']").should('contain', 'Select reason')
      cy.get("[class$='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']")*/
    })
    cy.get("[type$='button']").should('contain', 'Cancel').click()
  })
  it('Customer Actions - Add to watchlist', ()=> {
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(()=> {
      cy.contains('Add to watchlist').click()
    })
    /*cy.get("[class$='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").should('exist').within(()=> {
      cy.get("[class$='text-xl font-semibold mb-4']").should('contain', 'Flag User')
      cy.contains('Report and flag a suspicious activity for further review by assigning reason, severity and action type.')
      cy.contains('Reason (Trigger type)')
      cy.contains('Comment')
      cy.contains('Do you want to escalate this?')
      cy.contains('Yes')
      cy.contains('No')
      cy.get("[type$='button']").should('contain', 'Cancel')
      cy.get("[type$='button']").should('contain', 'Flag')
      cy.get("[class$='flex flex-wrap gap-2 flex-1']").should('contain', 'Select reason')
      cy.get("[class$='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']")
    })*/
    cy.get("[class$='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").should('exist').within(()=> {
      cy.get("[type$='button']").should('contain', 'Cancel').click()
    })
  })
  it('Customer Actions - Remove from watchlist', ()=> {
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(()=> {
      cy.contains('Remove from watchlist').click()
    })
    /*cy.get("[class$='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").should('exist').within(()=> {
      cy.get("[class$='text-xl font-semibold mb-4']").should('contain', 'Flag User')
      cy.contains('Report and flag a suspicious activity for further review by assigning reason, severity and action type.')
      cy.contains('Reason (Trigger type)')
      cy.contains('Comment')
      cy.contains('Do you want to escalate this?')
      cy.contains('Yes')
      cy.contains('No')
      cy.get("[type$='button']").should('contain', 'Cancel')
      cy.get("[type$='button']").should('contain', 'Flag')
      cy.get("[class$='flex flex-wrap gap-2 flex-1']").should('contain', 'Select reason')
      cy.get("[class$='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']")
    })*/
    cy.get("[type$='button']").should('contain', 'Cancel').click()
  })
  it('Customer Actions - Apply for loan', ()=> {
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(()=> {
      cy.contains('Apply for loan').click()
    })
    /*cy.get("[class$='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").should('exist').within(()=> {
      cy.get("[class$='text-xl font-semibold mb-4']").should('contain', 'Flag User')
      cy.contains('Report and flag a suspicious activity for further review by assigning reason, severity and action type.')
      cy.contains('Reason (Trigger type)')
      cy.contains('Comment')
      cy.contains('Do you want to escalate this?')
      cy.contains('Yes')
      cy.contains('No')
      cy.get("[type$='button']").should('contain', 'Cancel')
      cy.get("[type$='button']").should('contain', 'Flag')
      cy.get("[class$='flex flex-wrap gap-2 flex-1']").should('contain', 'Select reason')
      cy.get("[class$='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']")
    })*/
    cy.get("[type$='button']").should('contain', 'Cancel').click()
  })
})