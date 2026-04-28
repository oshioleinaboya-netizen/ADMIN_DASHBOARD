import { partnerLink } from "cypress/support/env";
describe('Terms of service & Policy check', () => {
    beforeEach(() => {
        cy.visit(partnerLink);
    })

    it('Terms of service', () => {
        cy.contains('Terms of Service').should('be.visible').and('not.be.disabled').click() // Terms of service button check and click action
        cy.url().should('include', 'terms-of-service') // url check
        cy.contains('Rank Capital Limited Terms of Use').should('be.visible') // Page title check

        cy.contains('Back to sign in').should('be.visible').should('not.be.disabled').click() // Back to sign in button check and click action
        cy.url().should('include', '/login') // url check after navigating back to sign in
    })

    it('Privacy Policy check', () => {
        cy.contains('Privacy Policy').should('be.visible').and('not.be.disabled').click() // Terms of service button check and click action
        cy.url().should('include', 'privacy-policy') // url check
        cy.contains('Rank Capital Limited Privacy Policy').should('be.visible') // Page title check

        cy.contains('Back to sign in').should('be.visible').should('not.be.disabled').click() // Back to sign in button check and click action
        cy.url().should('include', '/login') // url check after navigating back to sign in
    })
})