describe('Log out flow', ()=> {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('Admin logout/Re-login flow', () => {
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000');
      } else {
        cy.log('No OTP field found, skipping OTP input.');
      }
      cy.get("[class*='animate-spin']").should('be.visible')
    });
    cy.get("[class$='flex h-[48px] w-max items-center justify-between gap-2 border border-[#470C00] bg-[#470C00] rounded-full p-3 text-sm font-medium hover:bg-[#452a25] mb-1']").click()
    cy.get("[class$='p-3 w-full bg-white rounded-md hover:cursor-pointer hover:bg-[#452a25] hover:text-white']").within(()=> {
      cy.contains('Logout').click()
    })
    // Re-Login User ---------------------------
    cy.get("[class$='flex flex-col gap-y-4 items-start justify-start p-4']")
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("qa@userank.com")
    cy.get("[type$='submit']").click()
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000');
      } else {
        cy.log('No OTP field found, skipping OTP input.');
      }
      cy.get("[class*='animate-spin']").should('be.visible')
    });
  })
})
