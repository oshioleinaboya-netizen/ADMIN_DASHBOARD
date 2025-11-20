describe('Password invalidity attempts', () => {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('Password invalidity attempts', () => {
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
    cy.get("[type$='submit']").click()
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").should('contain', 'Invalid email or password. You have 2 attempt(s) left.')
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").within(()=> {
      cy.get("[alt$='caution icon']").should('be.visible')
    })
    cy.get("[type$='submit']").click()
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").should('contain', 'Invalid email or password. You have 1 attempt(s) left.')
    cy.get("[type$='submit']").click()
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").should('contain', 'Account is locked due to too many failed login attempts. Please contact admin.')
    cy.get("[type$='password']").clear()
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='submit']").click()
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").should('contain', 'Account is locked due to too many failed login attempts. Please contact admin.')
  });
});