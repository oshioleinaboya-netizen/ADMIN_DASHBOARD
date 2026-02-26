import {adminEmail, adminPassword, roscaUserPhone} from "cypress/support/env"
import {loanApplicationAndApproval} from "cypress/support/helper"

const selectDropdown = (label: string, optionText: string) => {
  cy.contains(label).parent().find("[class*='flex flex-wrap']").click();
  cy.get("[class*='absolute z-10']").contains(optionText).click();
};

describe('Generate loan contract && Resend loan contract', () => {
    beforeEach(() => {
        // Clear Index DB
                cy.window().then((win) => {
                    if (win.indexedDB?.databases) {
                        win.indexedDB.databases().then((dbs) => {
                        dbs.forEach((db) => {
                            if (db.name) {
                            win.indexedDB.deleteDatabase(db.name);
                            }
                        });
                        });
                    }
                });
        
                // Authentication check - Login
                cy.visit("/");
                
                cy.get("[type$='text']").type(adminEmail);
                cy.get("[type$='password']").type(adminPassword);
                cy.get("[type$='submit']").click();
                cy.wait(3000)
        
                // New device detected
                cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
                cy.contains('Continue').click()
        
                // Handle optional OTP
                cy.get('body').then(($body) => {
                    if ($body.find("[class*='cursor-text']").length) {
                        cy.get("[class*='cursor-text']", { timeout: 5000 }).type('000000');
                    }
                });
        
                // Wait until spinner disappears and URL includes '/customers'
                cy.get("[class*='animate-spin']", { timeout: 10000 }).should('not.exist');
                cy.url({ timeout: 30000 }).should('include', '/customers');
                cy.wait(3000)
    })

    it.only('Generate Loan contract', () => {

        //Loan Application and Approval
        loanApplicationAndApproval()

        // Contract Link parent should be empty before generation
        cy.contains('Contract Link').parent().should('be.empty')

        // Generate contract
        cy.get("[data-testid*='dropdown-button']").eq(1).click()
        cy.get("[role*='menu']").first().within(()=> {
            cy.get("[role*='menuitem']").eq(0).contains('Generate loan contract').click()
            cy.wait(3000)
        })

        // Contract admin inputs
        selectDropdown('Template', 'Public Loan')
        cy.contains('name').parent().find('input').type('Roscauser1') // Name input
        cy.contains('phone number').parent().find('input').type(roscaUserPhone) // Phone number input

        cy.get("[type*='button']").should('contain.text', 'Generate Contract'). and('not.be.disabled').click() // Button click
        cy.wait(3000)

        // Success modal assertion and close
        cy.contains('Contract generated successfully').should('be.visible') // Assertion
        cy.get("[type*='button']").should('contain.text', 'Ok').and('not.be.disabled').click() // Close out success modal

        // Page reload and assertion for contract generation
        cy.reload( {timeout: 20000} )
        cy.wait(10000)

        // Contract Link parent should not be empty after generation
        cy.contains('Contract Link').parent().should('not.be.empty').within(() => {
            cy.contains('a', 'View Contract').should('be.visible').click()
        })
    })

    it('Resend Loan contract -', () => {

        //Loan Application and Approval
        loanApplicationAndApproval()

        // Contract Link parent should be empty before generation
        cy.contains('Contract Link').parent().should('be.empty')

        // Generate contract
        cy.get("[data-testid*='dropdown-button']").eq(1).click()
        cy.get("[role*='menu']").first().within(()=> {
            cy.get("[role*='menuitem']").eq(0).contains('Generate loan contract').click()
            cy.wait(3000)
        })

        // Contract admin inputs
        selectDropdown('Template', 'Public Loan')
        cy.contains('name').parent().find('input').type('Roscauser1') // Name input
        cy.contains('phone number').parent().find('input').type(roscaUserPhone) // Phone number input

        cy.get("[type*='button']").should('contain.text', 'Generate Contract'). and('not.be.disabled').click() // Button click
        cy.wait(3000)

        // Success modal assertion and close
        cy.contains('Contract generated successfully').should('be.visible') // Assertion
        cy.get("[type*='button']").should('contain.text', 'Ok').and('not.be.disabled').click() // Close out success modal

        // Page reload and assertion for contract generation
        cy.reload( {timeout: 20000} )
        cy.wait(10000)

        // Contract Link parent should not be empty after generation
        cy.contains('Contract Link').parent().should('not.be.empty').within(() => {
            cy.contains('a', 'View Contract').should('be.visible').click()
        })
    })
})