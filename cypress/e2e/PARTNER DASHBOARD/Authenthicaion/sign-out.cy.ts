import { partnerLink, partnerEmail, partnerPassword } from "cypress/support/env";
describe('Sign out', () => {
    beforeEach(() => {
        cy.visit(partnerLink);
    })

    it('Signout flow', () => {
        // Login first
        cy.contains('Email').parent().find('input').type(partnerEmail)
        cy.contains('Password').parent().find('input').type(partnerPassword)
        cy.get("[type*='submit']").click()
        cy.wait(4000) // wait for login to complete and dashboard to load
        
        // Wait for dashboard to load
        cy.url().should('include', '.africa')

        // Sign out process
        cy.get("[data-slot*='dropdown-menu-trigger']").eq(1).click() // Click on profile dropdown
        cy.contains('Log out').should('be.visible').should('not.be.disabled').click() // Click on log out button
        cy.url().should('include', '/login') // Check if redirected to login page after logout
    })
})