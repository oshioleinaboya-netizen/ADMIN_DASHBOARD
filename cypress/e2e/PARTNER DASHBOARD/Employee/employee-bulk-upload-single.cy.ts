import { partnerSignIn } from "cypress/support/helper";
describe('Employee upload', () => {
    beforeEach(() => {
        partnerSignIn()
    })

    it('Employee upload - Check for file upload functionality', () => {
        cy.get("[data-slot*='sidebar-menu-item']").eq(2).should('contain', 'Employee').click() // Navigate to Employees page
        cy.url().should('include', '/employee') // Check if URL includes /employee
        cy.wait(2000) // wait for employee page to load

        const uploadOptions = [
            /Upload (your )?employee list|Upload employees|Bulk upload/i,
            /Download and use our template|Download template/i,
            /Add employees one at a time|Add employee manually|Add manually/i
        ]

        cy.get('body').then(($body) => {
            if (!uploadOptions[0].test($body.text())) {
                cy.contains('button, a, [role="button"]', /Add New Employee|Add Employee|Add employees|New Employee/i)
                    .should('be.visible')
                    .click()
            }
        })

        uploadOptions.forEach(option => {
            cy.contains(option, { timeout: 10000 }).should('be.visible') // Check if upload options are visible
        });

        // Upload your employee list option check
        cy.contains(uploadOptions[2]).click()
        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button after selecting upload option

        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button to initiate the empty statte check
        cy.get("[data-slot*='field-error']").should('have.length', 8) // Check empty state error messages for each required field
        
        // Imput data into the required fields
        const employeeId = `EMP${Math.floor(10000 + Math.random() * 90000)}`
        const inputFunction = (label: string, value: string, id: number) => {
            cy.contains(label).parent()
            cy.get("[data-slot*='input']").eq(id).type(value)
        }
        const selectDropdownOption = (
            option: string
        ) => {
            cy.get("[data-slot*='sheet-content']").within(() => {
                cy.get("[id*='base-ui-_r_mg_']")
                    .click()

                cy.contains("[role='option']", option)
                    .click()

                cy.get("[id*='base-ui-_r_mg_']")
                    .should('contain', option)
            })
        }

        inputFunction('Employee Number', employeeId, 1)
        selectDropdownOption('Male')
        inputFunction('First Name', 'John', 2)
        inputFunction('Last Name', 'Doe', 4)
    })
})