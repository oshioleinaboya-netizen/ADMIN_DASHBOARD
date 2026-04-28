import { partnerLink, partnerEmail, partnerPassword } from "cypress/support/env";
import { faker } from "@faker-js/faker";

describe('Forget password flow', () => {
    beforeEach(() => {
        cy.visit(partnerLink);
    })

    it('Flow start', () => {
        cy.contains('Forgot your password?').should('be.visible').should('not.be.disabled').click() // Forget password button check and click action
        cy.url().should('include', '/forgot-password') // url check

        cy.contains('Forgot Password?').should('be.visible') // Page title check
        cy.contains('Back to Sign in').should('be.visible').should('not.be.disabled').click() // Back to sign in button check

        cy.contains('Forgot your password?').should('be.visible').should('not.be.disabled').click() // Forget password button check and click action

        cy.contains('Email').parent().find('input').type(faker.internet.email()) // email input
        cy.contains('Continue').should('not.be.disabled').click() // Continue button check and click action

        cy.contains('If the email exists, a password reset code has been sent.').should('be.visible') // Success message check
    })
})