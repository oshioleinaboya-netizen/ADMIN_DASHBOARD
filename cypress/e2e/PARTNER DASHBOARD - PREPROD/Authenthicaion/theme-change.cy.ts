import { partnerLink } from "cypress/support/env";
describe('Theme change', () => {
    beforeEach(() => {
        cy.visit(partnerLink);
    })

    it('Theme selector check', () => {
        cy.get("[aria-label*='Dark theme']").should('have.attr', 'aria-pressed', 'false').click() // Dark theme selector check and click action
        cy.get("[aria-label*='Dark theme']").should('have.attr', 'aria-pressed', 'true') // Dark theme state check

        cy.get("[aria-label*='Light theme']").should('have.attr', 'aria-pressed', 'false').click() // Light theme selector check and click action
        cy.get("[aria-label*='Light theme']").should('have.attr', 'aria-pressed', 'true') // Light theme state check
        
        cy.get("[aria-label*='System theme']").should('have.attr', 'aria-pressed', 'false').click() // System theme selector check and click action
        cy.get("[aria-label*='System theme']").should('have.attr', 'aria-pressed', 'true') // System theme state check
    })
})