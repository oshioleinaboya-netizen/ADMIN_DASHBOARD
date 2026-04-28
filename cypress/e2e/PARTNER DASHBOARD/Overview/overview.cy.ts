import { partnerLink, partnerEmail, partnerPassword } from "cypress/support/env";
import { faker } from "@faker-js/faker";

describe('Overview page', () => {
    beforeEach(() => {
        cy.visit(partnerLink);
        cy.contains('Email').parent().find('input').type(partnerEmail)
        cy.contains('Password').parent().find('input').type(partnerPassword)
        cy.get("[type$='submit']").click()
        cy.wait(2000) // wait for login to complete and dashboard to load
    })

    it('Sidebar menu - Overview shoud be active', () => {
        cy.contains('Overview').should('have.attr', 'data-active')
        cy.url().should('include', '.africa')
    })

    it('Quick actions check', () => {
        cy.contains('Quick actions')
        const quickActions: string[] = [
            'Confirm Repayment',
            'Add New Employee',
            'View Outstanding Balances',
            'Upload Payroll'
        ]
        quickActions.forEach((action) => {
            cy.contains(action).scrollIntoView().should('be.visible').and('not.be.disabled').click() // Quick action buttons check
            cy.contains('Overview').should('not.have.attr', 'data-active') // Check if Overview is not active after clicking quick action
            cy.contains('Overview').click() // Navigate back to overview for next action
        })
    })

    it('Financial summary - Check for key metrics', () => {
        cy.contains('Financial Summary')
        const financialMetricsParents: string[] = [
            `This Month's Repayment`,
            'Total Outstanding Balance',
        ]
        financialMetricsParents.forEach((text) => {
            cy.contains(text).parent().should('be.visible').and('not.empty') // Financial summary key metrics check
        })

        cy.get('body').then(($body) => {
            const existingCondition = $body.find(':contains("Repayment due")').length > 0

            if (existingCondition) {
                cy.contains('Repayment due').should('be.visible');
            } else {
                cy.contains('Repayment due').should('not.exist');
            }
        })

        cy.contains('Upload report').should('be.visible').and('not.be.disabled').click() // Upload report button check and click action
        cy.get("[data-slot*='sidebar-menu-item']").eq(3).within(() => {
            cy.contains('Repayments').should('have.attr', 'data-active')
        })
    })

    it('Employee with active repayments/Inactive', () => {
        cy.contains('Current Headcount')
        cy.contains('Employees with Active Repayment').parent().scrollIntoView().should('be.visible').and('not.empty') // Employees with active repayment check
        cy.contains('Inactive Employees').parent().scrollIntoView().should('be.visible').and('not.empty') // Inactive employees check
    })

    it.only('Employee with active repayments/Inactive', () => {
        cy.wait(2000) // Wait for charts to load
        cy.get("[class*='recharts-surface']").first().scrollIntoView().should('be.visible') // Chart visibility check
        cy.get("[class*='recharts-surface']").first().trigger('mouseover').within(() => {
            cy.get('.recharts-tooltip-wrapper').should('be.visible').within(()=> {
                cy.contains(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/).should('be.visible') // Tooltip month check

                cy.contains('₦').should('be.visible').and('have.length', 1)
            }) // Tooltip visibility check on chart hover
        }) // Trigger tooltip for chart hover check
    })
})