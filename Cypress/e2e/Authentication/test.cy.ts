it("can reach homepage", () => {
  cy.visit("/");
  cy.contains("Login", { timeout: 20000 }).should("be.visible");
});