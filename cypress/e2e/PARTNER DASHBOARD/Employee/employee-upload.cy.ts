import { partnerSignup } from "cypress/support/helper";
import { partnerSignout } from "cypress/support/helper";
import { partnerPassword } from "cypress/support/env";

describe('Employee upload', () => {
    beforeEach(() => {
        partnerSignup().then((email) => {
            cy.wait(3000) // wait for signup to complete and dashboard to load
            
            // Sign out process
            cy.get("[data-slot*='dropdown-menu-trigger']").click() // Click on profile dropdown
            cy.contains('Log out').should('be.visible').should('not.be.disabled').click() // Click on log out button
            cy.url().should('include', '/login') // Check if redirected to login page after logout

            cy.wait(2000) // wait for signout to complete and login page to load

            cy.contains('Email').parent().find('input').type(email) // Login with the newly signed up partner credentials
            cy.contains('Password').parent().find('input').type(partnerPassword)
            cy.get("[form*='form-signin']").click()
            cy.wait(3000) // wait for login to complete and dashboard to load
        }) // Sign up a new partner before each test
    })

    it('Employee upload - Check for file upload functionality', () => {
        cy.get("[data-slot*='sidebar-menu-item']").eq(2).should('contain', 'Employee').click() // Navigate to Employees page
        cy.url().should('include', '/employee') // Check if URL includes /employee
        cy.wait(2000) // wait for employee page to load

        const uploadOptions = ["[alt*='Upload your employee list']", "[alt*='Download and use our template']", "[alt*='Add employees one at a time']"]

        uploadOptions.forEach(element => {
            cy.get(element).should('be.visible').should('not.be.disabled') // Check if upload options are visible and enabled
        });

        // Upload your employee list option check
        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button after selecting upload option
        cy.url().should('include', '/employee') // Check if URL includes /employee/upload
        cy.get(uploadOptions[0]).click()
        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button after selecting upload option

        cy.url().should('include', '/employee/upload') // Check if URL includes /employee/upload
        cy.contains('Continue').should('be.disabled') // Check if continue button is disabled before file upload
        cy.get("#csv-file-input").selectFile('cypress/fixtures/employees_template.csv', { force: true }) // Upload employee list template
        cy.contains('Uploading').should("be.visible") // Upload progress check
        cy.wait(5000) // wait for file upload to process
        cy.contains('100%').should("be.visible") // Check if upload progress reaches 100%
        cy.contains('Completed').should("be.visible") // Check if upload also returns as completed
        cy.contains('employees_template.csv').should("be.visible") // Check if uploaded file name is displayed
        
        //cy.get("[d*='M18 6 6 18']").click() // Cancel upload check
        cy.get("#csv-file-input").selectFile('cypress/fixtures/employees_template.csv', { force: true }) // Upload employee list template
        cy.wait(5000) // wait for file upload to process
        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button after selecting upload option

        
        // matching headers check
        cy.url().should('include', '/employee/upload') // Check if URL includes /employee/upload
        cy.get("[data-slot*='card-content']").should('have.length', 2) // check for mmatchh ehaders card, and data preview card
        
        cy.contains('500').should('exist')
        cy.get("[tabindex*='0']").eq(12).scrollIntoView().click()
        cy.contains('500').should('not.be.visible') // Change of attribute to be previewed
        //
        cy.get("[data-slot*='select-value']").eq(0).should('contain', 'Employee Number') // Click on the first dropdown to select the header mapping
        cy.get("[data-slot*='select-value']").eq(1).should('contain', 'First Name')
        cy.get("[data-slot*='select-value']").eq(2).should('contain', 'Last Name')
        cy.get("[data-slot*='select-value']").eq(3).should('contain', 'Sex')
        cy.get("[data-slot*='select-value']").eq(0).should('contain', 'Date Deployed')
        cy.get("[data-slot*='select-value']").eq(0).should('contain', 'Date of Birth')
        cy.get("[data-slot*='select-value']").eq(0).should('contain', 'Address')
        cy.get("[data-slot*='select-value']").eq(0).should('contain', 'Phone Number')
        
        // Cancle match
        cy.get("[d*='M18 6 6 18']").eq(0).click()
        cy.get("[data-slot*='select-value']").eq(0).should('not.contain', 'Employee Number')
        cy.get("[data-slot*='select-value']").eq(0).click()
        cy.get("[role*='option']").eq(0).should('contain', 'Employee Number').click() // rematch the header
        cy.get("[data-slot*='select-value']").eq(0).should('contain', 'Employee Number') // check if the header is rematched successfully

        //schema preview
        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button after selecting upload option
        cy.url().should('include', 'employee/upload')
        //header check
        const schemaHeaders = ["Employee Number", "First Name", "Last Name", "Sex", "Date Deployed", "Date of Birth", "Address", "Phone Number"]
        schemaHeaders.forEach((header, index) => {
            cy.get("[data-slot*='table-head']").eq(index).should('contain', header) // Check if the schema preview headers are correct
        })
    })
})