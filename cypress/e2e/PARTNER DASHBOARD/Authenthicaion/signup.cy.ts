import { partnerEmail, partnerPassword, partnerLink, stagingOtp } from "cypress/support/env";
import { faker } from "@faker-js/faker"; 

describe('Partner Dashboard Signup Flow', () => {
    beforeEach(() => {
        cy.visit(partnerLink, {timeout: 40000} ) // Visit the partner dashboard link before each test;
    })

    it('Flow start', () => {
        cy.wait(4000) // Wait for the page to load completely
        cy.contains('Sign up')
            .should('be.visible')
            .should('not.be.disabled')
            .click() // Signup button check and click action

        cy.url().should('include', '/register') // url check

        // Personal details flow point
        cy.contains('Personal Details').should('exist') // Page title check
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '1') // Progress bar check
        
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
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '2') // Progress bar check
        
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
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '3') // Progress bar check
        cy.contains('Company Profile').should('be.visible') // Page title check
        cy.url().should('include', '/company-profile') // url check
        cy.contains('Back').should('be.visible').should('not.be.disabled') // Back to email verification button check

       // Empty state check
       cy.contains('Continue').click() // Empty state check
       cy.get("[data-slot*='field-error']").should('have.length', 7)

       // Business name input check
       cy.contains('CAC/RC Number').parent().find('input').scrollIntoView().type('8428273', {force: true}) // CAC/RC Number input check
       cy.contains('Use RC/BN followed by numbers').should('be.visible') // CAC/RC Number format error check
       cy.contains('Business Name').parent().should('exist')//.find('input').should('be.disabled') // Business name input disabled check
       cy.contains('Physical Address').parent().find('input').scrollIntoView().type('Lagos, Nigeria', {force: true}) 
       // Remember to add a valisations for the "Use this name" flow, where the system is validating existence of the CAC number provided

       //Industry input and option check
       cy.contains('Industry').parent().within(()=> {
            cy.get("[data-slot*='popover-trigger']").click().should('have.attr', 'aria-expanded', 'true') // Industry input check
       })
       cy.get("[data-value*='Technology']").should('have.attr', 'data-selected', 'false').click() // Industry option check
       cy.contains('Industry').parent().within(()=> {
            cy.get("[data-slot*='popover-trigger']").should('contain', 'Technology') // Industry input check
       })
       // Employment type input and option check
         cy.contains('Employer Type').parent().within(()=> {
                cy.get("[data-slot*='popover-trigger']").click().should('have.attr', 'aria-expanded', 'true') // Employment type input check
         })
            cy.get("[data-slot*='command-group']").eq(0).within(() => {
                cy.get("[data-slot*='command-item']").should('have.length.at.least', 1)
            })
            cy.get("[data-value*='Global Tech Firms']").click() // Employment type option check
        // Tax number input check    
        cy.contains('Tax Number').parent().find('input').scrollIntoView().click().type('HDH333', {force: true}) // Tax number input check
        // Year of Incorporation input check with date formatting
        const inputDate = '14/02/2020'
        const [day, month, year] = inputDate.split('/')
        const formattedDate = `${year}-${month}-${day}`
        cy.contains('Year of Incorporation').parent()
            .find('input').click({force: true}).type(formattedDate, {force: true}) // Year of Incorporation input check

        cy.contains('Number of Staffs').parent().find('input').scrollIntoView().should('have.attr', 'min', '0').type('10')
        
        cy.contains('CAC/RC Number').parent().scrollIntoView().find('input').clear().type('RC8428273', {force: true}) // Correcting the CAC/RC Number input
        cy.contains('Use this name')
                .should('be.visible')
                .and('not.be.disabled')
                .click();

        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue to the next flow point
        
        cy.contains('already exists').scrollIntoView().should('have.length', 1).should('be.visible')
        cy.wait(4000)

        // Correcting the CAC/RC Number input
        const rcNumber = Array.from({ length: 7 }, () =>
            faker.number.int({ min: 1, max: 8 })
        ).join('');
        
        cy.contains('CAC/RC Number').parent().scrollIntoView().find('input').clear().type('RC' + rcNumber, {force: true})
        cy.get("[data-slot*='field-error']").should('have.length', 0) // Error check for company profile page
        cy.contains('Match found')
            .parent()
            .should('be.visible')
            .and('not.be.empty')
            .invoke('text')
            .then((text) => {
                const businessName = text
                .replace('Match found', '')
                .trim();

                cy.contains('Use this name')
                .should('be.visible')
                .and('not.be.disabled')
                .click();
                /*
                cy.contains('Business Name')
                .parent()
                .find('input')
                .should('have.value', businessName);*/
            });
        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue to the next flow point
        
        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)
        
        cy.contains('already exists').scrollIntoView().should('have.length', 1).should('be.visible')
        cy.wait(4000)

        const suffix = Array.from({ length: 4 }, () =>
            faker.number.int({ min: 1, max: 8 })
        ).join('');
        cy.contains('Tax Number').parent().find('input').scrollIntoView().clear().type('NG-'+suffix, {force: true}) // Tax number uniqueness check
        cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)

        
        // Contact details page check
        cy.contains('Contact Details').should('exist') // Page title check
        cy.url().should('include', '/contact-details') // url check
        cy.contains('Back').should('exist').should('not.be.disabled') // Back to company profile button check
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '4') // Progress bar check
       
        // Empty state check
       cy.contains('Continue').click() // Empty state check
       cy.get("[data-slot*='field-error']").should('have.length', 3)

       //Matching contacts input check
       cy.contains('Full Name').parent().find('input').type('Jiam Jiad') // Full name input check
       cy.contains('Email').parent().find('input').type('jiam@hjs.com') // email input check
       cy.contains('Phone Number').parent().find('input').type('+2347038299283') // phone number input check

        cy.contains('Add another contact').should('be.visible').click() // Add another contact button check

        cy.get("[type*='text']").eq(3).type('Jiam Jiad') // Full name input check
       cy.get("[type*='email']").eq(1).type('jiam@hjs.com') // email input check
       cy.get("[type*='tel']").eq(1).type('+2347038299283') // phone number input check
       cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)

        cy.get("[data-slot*='field-error']").should('have.length', 6) // Duplicate contact error check
       
        // Actual flow
        cy.contains('Remove').should('exist').should('not.be.disabled').click() // Remove contact button check
       cy.contains('Full Name').parent().find('input').clear().type(faker.person.fullName()) // Full name input check
       cy.contains('Email').parent().find('input').clear().type(faker.internet.email()) // email input check
       const suffix2 = Array.from({ length: 8 }, () =>
            faker.number.int({ min: 1, max: 8 })
        ).join('');
       cy.contains('Phone Number').parent().find('input').clear().type('+23470' + suffix2) // phone number input check
       
       cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)


        //Payroll Configuration page check
        cy.contains('Payroll Configuration').should('exist') // Page title check
        cy.url().should('include', '/payroll-config') // url check
        cy.contains('Back').should('exist').should('not.be.disabled') // Back to contact details button check
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '5') // Progress bar check

        // Empty state check
       cy.contains('Continue').click() // Empty state check
       cy.get("[data-slot*='field-error']").should('have.length', 4)

        cy.contains('Payroll Frequency') //
        .parent()
        .scrollIntoView()
        .within(() => {
            cy.get("[data-slot='popover-trigger']")
            .click()
        })
        //
        cy.contains('Monthly')
        .should('be.visible')
        .click()
        //
        cy.get("[data-slot='popover-trigger']")
        .should('contain', 'Monthly')

        cy.contains('Payroll Currency') // Payroll currency input and option check
        .parent()
        .scrollIntoView()
        .within(() => {
            cy.get("[data-slot='popover-trigger']")
            .click()
        })
        //
        cy.contains('NGN')
        .should('be.visible')
        .click()
        //
        cy.get("[data-slot='popover-trigger']")
        .should('contain', 'NGN')

        cy.contains('Payroll Method') // Payroll method input and option check
        .parent()
        .scrollIntoView()
        .within(() => {
            cy.get("[data-slot='popover-trigger']")
            .click()
        })
        //
        cy.contains('Bank Transfer')
        .should('be.visible')
        .click()
        //
        cy.get("[data-slot='popover-trigger']")
        .should('contain', 'Bank Transfer')

        cy.contains('Payroll Day') // Payroll day input and option check
        .parent()
        .scrollIntoView()
        .within(() => {
            cy.get("[data-slot='popover-trigger']")
            .click()
        })
        //
        cy.contains('5th Day')
            .scrollIntoView()
            .should('be.visible')
            .click()
        //
        cy.get("[data-slot='popover-trigger']")
            .should('contain', '5th Day')

        cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)

        // Document upload page check
        cy.get("[for*='pension_remittance']").selectFile('cypress/fixtures/media.jpeg', { force: true }) // Document upload check
        cy.get("[for*='tax_clearance_certificate']").selectFile('cypress/fixtures/media.jpeg', { force: true }) // Document upload check
        cy.get("[for*='tax_id']").selectFile('cypress/fixtures/media.jpeg', { force: true }) // Document upload check
        cy.get("[for*='business_operation_license']").selectFile('cypress/fixtures/media.jpeg', { force: true }) // Document upload check

        cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)
    })
})