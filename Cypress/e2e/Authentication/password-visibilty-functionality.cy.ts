describe('Password visibility toggle', () => {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('should toggle password visibility when clicking the button', () => {
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[class$='relative -top-[11px] -right-[6px]']").should('be.visible')
    cy.get("[alt$='show password icon']").click()
    cy.get("[class$='relative  ']").should('be.visible')
  });
});