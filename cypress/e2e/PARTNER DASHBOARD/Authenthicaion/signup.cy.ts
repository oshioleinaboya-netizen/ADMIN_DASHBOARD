import { partnerEmail, partnerPassword, partnerLink, stagingOtp } from "cypress/support/env";
import { faker } from "@faker-js/faker"; 

describe('Partner Dashboard Signup Flow', () => {
    beforeEach(() => {
        cy.visit(partnerLink, {timeout: 40000} ) // Visit the partner dashboard link before each test;
    })

    it('Flow start', () => {
        cy.contains('Sign up')
            .should('be.visible')
            .should('not.be.disabled')
            .click() // Signup button check and click action

        cy.url().should('include', '/register') // url check

        // Personal details flow point
        cy.contains('Personal Details').should('exist') // Page title check
        
        cy.contains('Back').should('exist').should('not.be.disabled') // Back to personal details button check

        cy.get("[class*='text-sm font-medium uppercase tracking-wide text-muted-foreground']").contains('1') // Step check
        // Empty input state check
        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click()
        const emptyFieldErrors: string[] = [
            'Email is required',
            //'Password is required',
            'First name is required',
            'Last name is required',
            'Please confirm your password'
        ]
        emptyFieldErrors.forEach((text) => {
            cy.contains(text).should('be.visible')
        }) // Error check

        const email = faker.internet.email()
        cy.contains('Email Address').parent().find('input').type(email) // email input
        cy.log(`Generated email: ${email}`)

        cy.contains('First Name').parent().find('input').type(faker.person.firstName()) // first name input
        cy.contains('Last Name').parent().find('input').type(faker.person.lastName()) // last name input

        //Pasword inout progress check
        cy.contains('Password').parent().find('input').type('George')
        cy.contains('Password').parent().within(() => {
            const PasswordInputProgressCheck: string[] = [
                'At least 8 characters',
                'Contains a number',
                'Contains an uppercase letter',
                'Contains a lowercase letter',
                'Contains a special character'
            ]
            PasswordInputProgressCheck.forEach((text) => {
                cy.contains(text).scrollIntoView().should('be.visible')
            }) // Error check
        })

        //Pasword confirmation inout progress check
        cy.contains('Confirm Password').parent().find('input').type('Geor@')
        cy.contains('Confirm Password').parent().within(() => {
            const PasswordInputProgressCheck: string[] = [
                'At least 8 characters',
                'Contains a number',
                'Contains an uppercase letter',
                'Contains a lowercase letter',
                'Contains a special character'
            ]
            PasswordInputProgressCheck.forEach((text) => {
                cy.contains(text).scrollIntoView().should('be.visible')
            }) // Error check
        })

        cy.contains('Passwords do not match').scrollIntoView().should('exist') // Password match check

        cy.contains('Password').parent().find('input').clear().type(partnerPassword) // password input
        cy.contains('Confirm Password').parent().find('input').clear().type(partnerPassword) // confirm password input

        // Hide and show password check
        cy.get("[aria-label*='Show password']").eq(0).click()
        // Now it should be text
        cy.get('input').eq(3)
        .should('have.attr', 'type', 'text') // Password show check
        cy.get("[aria-label*='Hide password']").click()
        cy.get('input').eq(3)
        .should('have.attr', 'type', 'password') // Password hide check
        // -- Repeat for confirm password field
        cy.get("[aria-label*='Show password']").eq(1).click()
        cy.get('input').eq(4)
        .should('have.attr', 'type', 'text') // Confirm Password show check
        cy.get("[aria-label*='Hide password']").click()
        cy.get('input').eq(4)
        .should('have.attr', 'type', 'password') // ConfirmPassword hide check

        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue to the next flow point
        
        cy.wait(3000) // wait for the next page to load

        
        //Email verification flow point
        cy.contains('Verify Email Address').should('be.visible') // Page title check
        
        cy.contains('Back').should('be.visible').should('not.be.disabled') // Back to personal details button check
        
        cy.url().should('include', '/verify-email') // url check
        cy.get("[class*='text-sm font-medium uppercase tracking-wide text-muted-foreground']").contains('2') // Step check

        cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point without OTP input
        cy.get("[data-slot*='field-error']").contains('Enter 6 digit code').should('be.visible') // Error check for empty OTP input
        
        // Resend OTP check
        cy.contains('Resend OTP').should('be.visible').click()
        cy.contains('Email verification code sent successfully').should('be.visible') // Resend OTP check
        cy.wait(4000)

        //Wrong OTP Input and verification check
        function handleWrongOtp() {
            const otpSelector = "input[data-input-otp='true'], input[autocomplete='one-time-code']"
            cy.get('body').then($body => {
                if ($body.find(otpSelector).length) {
                    cy.get(otpSelector, { timeout: 10000 }).eq(0).type("123456", { force: true })
                    cy.contains('Continue').click() // Continue to trigger OTP verification
                } else {
                    cy.log('No OTP field found, skipping OTP input.')
                }
            })
        } handleWrongOtp()
        cy.wait(2000) // Wait for potential error message to appear
        cy.contains("Invalid verification code. Please try again").should('be.visible') // Wrong OTP verification check

        //OTP Input and verification check
        function handleOtp() {
            const otpSelector = "input[data-input-otp='true'], input[autocomplete='one-time-code']"
            cy.get('body').then($body => {
                if ($body.find(otpSelector).length) {
                    cy.get(otpSelector, { timeout: 10000 }).eq(0).clear({force: true}).type(stagingOtp, { force: true })
                    cy.contains('Continue').click() // Continue to trigger OTP verification
                } else {
                    cy.log('No OTP field found, skipping OTP input.')
                }
            })
        } handleOtp()
        cy.wait(2000) // Wait for potential error message to appear
        cy.contains("Email verified successfully").should('be.visible') // OTP verification check

        cy.wait(3000) // wait for the next page to load

       
        // Company profile page check
       // Empty state check
       cy.contains('Continue').click() // Empty state check
       cy.get("[data-slot*='field-error']").should('have.length', 7)

       // Business name input check
       cy.contains('Business Name').parent().find('input').type('Dell farms')
       cy.contains('CAC/RC Number').parent().find('input').type('12345678')
       cy.contains('Physical Address').parent().find('input').type('Lagos, Nigeria')
       cy.contains('Industry').parent().within(()=> {
            cy.get("[data-slot*='popover-trigger']").click().should('have.attr', 'aria-expanded', 'true') // Industry input check
       })
       cy.get("[data-value*='Technology']").should('have.attr', 'data-selected', 'false').click() // Industry option check
       cy.contains('Industry').parent().within(()=> {
            cy.get("[data-slot*='popover-trigger']").should('contain', 'Technology') // Industry input check
       })
        cy.contains('Tax Number').parent().find('input').type('1234567890')

        const inputDate = '14/02/2020'
        const [day, month, year] = inputDate.split('/')
        const formattedDate = `${day}-${month}-${year}`
        cy.contains('Year of Incorporation').parent()
            .find('input').click({force: true}).type(formattedDate, {force: true})

        // cy.get("[aria-label*='Open date picker']").invoke('showPicker').click()
       
        cy.contains('Business Name').parent().find('input').type(faker.company.name())
    })
})