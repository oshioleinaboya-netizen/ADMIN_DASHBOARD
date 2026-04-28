import { partnerLink, partnerEmail, partnerPassword } from "cypress/support/env";
import { faker } from "@faker-js/faker";

describe('Employee table interaction', () => {
    beforeEach(() => {
        cy.visit(partnerLink);
        cy.contains('Email').parent().find('input').type(partnerEmail)
        cy.contains('Password').parent().find('input').type(partnerPassword)
        cy.get("[type$='submit']").click()
        cy.wait(2000) // wait for login to complete and dashboard to load
    })

    it('Employee table - Check for employee details visibility', () => {
        cy.contains('Employee').click() // Navigate to Employees page
        cy.contains('Employee').should('have.attr', 'data-active') // Check if Employee page is active
        cy.contains('Total Employees').should('be.visible') // Check for employee title page
        cy.wait(3000) // wait for employee table to load

        cy.get("[data-testid*='pagination-page-size']").click()
        cy.contains('Showing 100 entries').click().click() // Change pagination to 100 rows per page
        cy.wait(2000) // wait for employee details to load

        //table count check
        cy.get("[data-slot*='card-description']").invoke('text').then((text) => {
            const employeeCount = Number(text.replace(/[^0-9]/g, '')) // Extract employee count from text
            cy.wrap(employeeCount).as('employeeCount') // Store employee count for later use
        })

        cy.get("[data-slot*='table-body'] tr").should('be.visible').then(($rows) => {
            const rowCount = $rows.length
            cy.wrap(rowCount).as('rowCount') // Store row count for later use
        })

        cy.get('@rowCount').then((rowCount) => {
            cy.get('@employeeCount').then((employeeCount) => {
                expect(employeeCount).to.equal(rowCount) // Compare employee count with row count
            })
        })
    })

    it('Pagination navigation check', () => {
        cy.contains
    })
})