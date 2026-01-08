it("can reach homepage", () => {
    cy.visit("/");
    cy.wait(5000); // wait 5 seconds
    cy.screenshot("homepage"); // save a screenshot
});