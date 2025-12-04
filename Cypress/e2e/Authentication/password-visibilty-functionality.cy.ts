import { rankLink, adminPassword } from "@support/env"
describe('Password visibility toggle', () => {
  beforeEach (()=>{
    cy.visit(rankLink)
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('should toggle password visibility when clicking the button', () => {
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[class$='relative -top-[11px] -right-[6px]']").should('be.visible')
    cy.get("[alt$='show password icon']").click()
    cy.get("[class$='relative  ']").should('be.visible')
  });
});