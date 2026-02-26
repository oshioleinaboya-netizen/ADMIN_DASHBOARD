import {adminEmail, adminPassword} from "cypress/support/env";
import {loanApplicationAndApproval} from "cypress/support/helper"

const selectDropdown = (label: string, optionText: string) => {
  cy.contains(label).parent().find("[class*='flex flex-wrap']").click();
  cy.get("[class*='absolute z-10']").contains(optionText).click();
};

describe ('Apply for loan', () => {
    beforeEach(()=> {
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

        //Loan management navigation
        cy.get("[data-testid*='nav-link-loan']").click()
        cy.wait(1000)
        cy.contains('Loan Management').click()
        cy.wait(3000)
    })

    it.only('Apply for laon | Loan acceptance', ()=> {
        //Loan Application and Approval
        loanApplicationAndApproval()
    })

    it.only('Apply for laon | Loan Rejection', ()=> {
        // Click on loan product
        cy.contains("Civic Loan").click()
        cy.wait(3000)

        // Search for business line
        cy.get("[data-testid*='search-bar-button']").type("Users for ROSCA")
        cy.wait(2000)
        
        // Get table value
        cy.get("[data-slot*='table-body']").within(() => {
            cy.get("tr").first().click()
        })
        cy.wait(4000)

        // NAvigate to the active staffs tab
        cy.contains('Active Staff').scrollIntoView().click()
        cy.wait(10000)

        // Select staff
        cy.get("[data-slot*='table-body']").eq(1).within(() => {
            cy.get('tr').eq(2).within(()=> {
                cy.get('td').eq(1).click()
            })
        })
        cy.wait(5000)

        // Navigate to apply for loan
        cy.contains('Customer Actions').click()
        cy.get("[role*='menu']").eq(0).within(()=> {
            cy.get("[role*='menuitem']").eq(3).contains('Apply for loan').click()
            cy.wait(1500)
        })

        // Fill out loan application form
        cy.contains('Loan Type').parent().within(()=> {
            cy.get("[class*='flex flex-wrap gap-2 flex-1']").click() 
        })
        cy.contains('Civic Loan').click()
        cy.wait(500)

        cy.contains('CHECKING LOAN ELIGIBILITY').should('exist')
        cy.wait(5000)
        cy.contains('LOAN OFFER FOUND').scrollIntoView().should('be.visible')

        cy.contains('Customer can get up to').parent().should('be.visible')
        cy.contains('Customer can get up to').parent().within(()=> {
            cy.get("[class*='font-medium lg:text-base text-sm text-black']").invoke('text').then((maxLoanAmount)=>{
                const maxAmountNum = parseFloat(maxLoanAmount.replace(/[^0-9.-]+/g,""))
                cy.wrap(maxAmountNum).as('maxAmount')
            })
        })
        const getInputLabel = (label: string) => {
            return cy.contains('label', label)
            .closest('div')
            .find('input')
            .scrollIntoView()
            .should('be.visible')
        }
        cy.get('@maxAmount').then((maxAmountNum)=> {

                // -------- Loan Amount Validations --------
                
                // Type in ammount more than the max amount to test validation
                getInputLabel('Loan Amount (₦)').clear().type(maxAmountNum.toString() + '10000')

                // Loan Tenor ()
                getInputLabel('Loan Tenor').clear().type('5')

                // Loan Purpose
                selectDropdown('Loan Purpose', 'Education')

                // Create Loan Application
                cy.contains('Create Loan').click()
                cy.wait(3000)

                // Error message assertion
                cy.contains('Loan amount cannot exceed the maximum approved amount of').scrollIntoView().should('be.visible')

                // --------

                // Type in ammount lower than minimum amount to test validation
                getInputLabel('Loan Amount (₦)').clear().type('50')

                // Loan Tenor ()
                getInputLabel('Loan Tenor').clear().type('5')

                // Loan Purpose
                selectDropdown('Loan Purpose', 'Education')

                // Create Loan Application
                cy.contains('Create Loan').click()
                cy.wait(3000)

                // Error message assertion
                cy.get("[alt*='caution icon']").scrollIntoView().should('be.visible')

                // --------

                // Type in max amount to test validation pass
                getInputLabel('Loan Amount (₦)').clear().type(maxAmountNum.toString())

                // Loan Tenor ()
                getInputLabel('Loan Tenor').clear().type('5')

                // Loan Purpose
                selectDropdown('Loan Purpose', 'Education')

                // Create Loan Application
                //cy.contains('Create Loan').click()
                //cy.wait(3000)


                // -------- Loan Tenor Validations --------
                
                // Loan Tenor (Above maximum tenor to test validation)
                getInputLabel('Loan Tenor').clear().type('13')

                // Loan amount entry
                getInputLabel('Loan Amount (₦)').clear().type('50000')
                
                // Loan Purpose
                selectDropdown('Loan Purpose', 'Education')

                // Create Loan Application
                cy.contains('Create Loan').click()
                cy.wait(3000)

                // Error message assertion
                cy.get("[alt*='caution icon']").scrollIntoView().should('be.visible')

                // --------

                // Loan Tenor (below minimum tenor to test validation)
                getInputLabel('Loan Tenor').clear().type('0')

                // Loan amount entry
                getInputLabel('Loan Amount (₦)').clear().type('50000')
                
                // Loan Purpose
                selectDropdown('Loan Purpose', 'Education')

                // Create Loan Application
                cy.contains('Create Loan').click()
                cy.wait(3000)

                // Error message assertion
                cy.get("[alt*='caution icon']").scrollIntoView().should('be.visible')

                // --------

                // Loan Tenor (exactly the minimum tenor to test validation)
                getInputLabel('Loan Tenor').clear().type('3')

                // Loan amount entry
                getInputLabel('Loan Amount (₦)').clear().type('100')
                
                // Loan Purpose
                selectDropdown('Loan Purpose', 'Education')

                // Create Loan Application
                cy.contains('Create Loan').click()
                cy.wait(100)
                
                // Error message assertion
                cy.get('body').find("[alt*='caution icon']").should('not.exist')

                // Success assertion
                //cy.contains('Successful').should('exist')
            })

        // Laon table check
        cy.contains("Loans").click()
        cy.wait(5000)
        cy.get("[data-slot*='table-body']").within(() => {
            cy.get("tr").first().should('contain.text', 'REQUESTED').within(() => {
                cy.get("td").eq(2).should('contain.text', '₦100.00').click()
                cy.wait(5000)
            })
        })
        // Assert loan status is requested
        cy.contains('Loan Status').parent().within(() => {
            cy.contains('Requested').should('exist')
        })

        // Reject loan application
        cy.get("[data-testid*='dropdown-button']").eq(1).click()
        cy.get("[role*='menu']").first().within(()=> {
            cy.get("[role*='menuitem']").eq(1).contains('Decline loan').click()
            cy.wait(3000)
        })

        cy.get("[class*='modal-content-right']").within(() => {
            // Accept button check
            cy.contains('button', 'Decline').eq(1).should('contain.text', 'Decline').should('be.visible')//.and('be.disabled')

            //Acceptance comment
            cy.get("[rows*='4']").type('Nah my guy, give am the loan')

            // Accept button check
            cy.contains('button', 'Decline').eq(1).should('contain.text', 'Decline').should('be.visible').click()
            cy.wait(3000)
        })

        //Loan rejection success page
        cy.contains('Loan declined successfully').should('be.visible')
        cy.contains('Ok').click() // Close success page
        cy.wait(5000)

        // Assert loan status change to Rejected
        cy.reload() // Refresh the page to get the updated loan status
        cy.wait(5000)

        // Assert loan status is Rejected
        cy.contains('Loan Status').parent().within(() => {
            cy.contains('Rejected').should('exist')
        })

        // Assert that the actions dropdown no longer exists
        cy.get('body').find("[data-testid*='dropdown-button']").eq(1).should('not.exist')
    })
})