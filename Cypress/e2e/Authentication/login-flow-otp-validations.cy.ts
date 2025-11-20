describe('Login flow', ()=> {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('Admin log in - Valid credentials | OTP Validation', () => {
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("qa@userank.com")
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.get("[class$='relative z-[1] flex justify-between gap-4 mb-6 outline-none cursor-text']").type("111111")
    cy.get("[class$='w-full sm:px-0 sm:max-w-[460px] sm:mx-auto']").should('contain', 'Invalid Otp')
  })
  it('Admin log in - Valid credentials', () => {
    cy.get("[type$='text']").type("engineering2@heymoni.com")
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.get("[class$='relative z-[1] flex justify-between gap-4 mb-6 outline-none cursor-text']").type("000000")
    cy.url().should('include', '/customers')
  })
})