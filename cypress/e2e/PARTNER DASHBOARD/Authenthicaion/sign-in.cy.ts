import { partnerLink, partnerEmail, partnerPassword } from "cypress/support/env";
import { faker } from "@faker-js/faker";

describe('Input validations', () => {
    beforeEach(() => {
        cy.visit(partnerLink);
    })

    // Helper to type credentials and submit/
    const submitLogin = (email: string, password: string) => {
        if (email) cy.contains('Email').parent().find('input').clear().type(email)
        if (password) cy.contains('Password').parent().find('input').clear().type(password)
        cy.get("[type$='submit']").click()
    }

    const assertErrorContains = (selector: string, text: string) => {
        cy.get(selector, { timeout: 10000 }) // wait up to 10s
          .should('be.visible')
          .and('contain', text)
      }

    it('Empty fields', () => {
        cy.url().should('include', '/login') // url check

        // Empty input state check
        cy.get("[type*='submit']").should('be.visible').should('not.be.disabled').click()
        const emptyFieldErrors: string[] = [
            'Please enter a valid email address',
            'Please enter your password'
        ]
        emptyFieldErrors.forEach((error) => {
            cy.contains(error).should('be.visible')
        }) // Error check
    })
    
    it('Admin log in - Invalid credentials (No @)', () => {
        submitLogin("heymoni.com", partnerPassword)
        assertErrorContains("[data-slot*='field-error']", 'Please enter a valid email address')
    })
    
    it('Admin log in - Invalid credentials (No .com)', () => {
        submitLogin("heymo@nicom", partnerPassword)
        assertErrorContains("[data-slot*='field-error']", 'Please enter a valid email address')
    })
    
    it('Admin log in - Invalid credentials (@.com)', () => {
        submitLogin("heymoni@.com", partnerPassword)
        assertErrorContains("[data-slot*='field-error']", 'Please enter a valid email address')
    })
    
    it('Admin log in - Incorrect credentials (Email)', () => {
        submitLogin("gsghshhsnn90@heyoni.com", partnerPassword)
        assertErrorContains("[tabindex*='0']", 'Invalid credentials')
    })
    
    it('Admin log in - Incorrect credentials (Password)', () => {
        submitLogin(partnerEmail, "hdhdjdjdjjdj")
        assertErrorContains("[tabindex*='0']", 'Invalid credentials')
    })
    
    
    it('Admin log in - Missing password', () => {
        submitLogin(partnerEmail, "")
        assertErrorContains("[data-slot*='field-error']", 'Please enter your password')
    })
    
    it('Admin log in - Missing email', () => {
        submitLogin("", partnerPassword)
        assertErrorContains("[data-slot*='field-error']", 'Please enter a valid email address')
    })
    
    // Clear out state tests
    it('Admin log in - Clear out state tests', () => {
        cy.get("[type*='submit']").should('be.visible').should('not.be.disabled').click() // Submit with empty fields to trigger errors
        
        const cases = [
        { email: "hshshhshs90@heyoni.com", password: partnerPassword, clear: 'text', expectedError: ['Please enter a valid email address', 'Please enter your password'] },
        ]

        cases.forEach((c) => {
            cy.contains('Email').parent().find('input').type(c.email).clear() // Type email and clear it
            cy.contains('Password').parent().find('input').type(c.password).clear() // Type password and clear it
            cy.get("[data-slot*='field-error']").eq(0).should('contain', c.expectedError[0]) // Check error after email input clear
            cy.get("[data-slot*='field-error']").eq(1).should('contain', c.expectedError[1]) // Check error after password input clear

            cy.contains('Email').parent().find('input').type(c.email) // retype email
            cy.contains('Password').parent().find('input').type(c.password) // retype password
            cy.get("[data-slot*='field-error']").should('not.exist') // Errors should be gone after retyping valid credentials 
        })
    })
})

describe('Sign in', () => {
    beforeEach(() => {
        cy.visit(partnerLink);
    })

    // Helper to type credentials and submit/
    const submitLogin = (email: string, password: string) => {
        if (email) cy.contains('Email').parent().find('input').clear().type(email)
        if (password) cy.contains('Password').parent().find('input').clear().type(password)
        cy.get("[type$='submit']").click()
    }

    it('Partner log in - Valid credentials', () => {

        // Hide and show password check
        cy.contains('Password').parent().find('input').type(partnerPassword) // password input
        cy.get("[aria-label*='Show password']").click()
        // Now it should be text
        cy.get('input').eq(1)
        .should('have.attr', 'type', 'text') // Password show check
        cy.get("[aria-label*='Hide password']").click()
        cy.get('input').eq(1)
        .should('have.attr', 'type', 'password') // Password hide check

        submitLogin(partnerEmail, partnerPassword) // Partner Sign in
        cy.wait(3000) // Await partner dshboard to load after successful sign in
        cy.url().should('include', '.africa') // url check after successful login

    })
})