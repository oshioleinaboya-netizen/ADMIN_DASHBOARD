// Filter Savings table by search
import { adminEmail, adminPassword, rankLink } from "@support/env";

describe('Filtering savings table', ()=> {
  beforeEach(() => {
    cy.visit(rankLink)
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.wait(2000);
    cy.get("[class$='self-center space-y-2']").should('exist').within(()=>{
      cy.get("[class$='font-semibold']").should('be.visible')
    })
 
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000');
      } else {
        cy.log('No OTP field found, skipping OTP input.');
      }
      cy.get("[class*='animate-spin']").should('be.visible')
    });
    cy.wait(3000)
    cy.url().should('include', '/customers')
    cy.wait(8000)
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('bills billers')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.url().should('include', '/customers/')
  })
  it('Filtering', ()=> {
    const tags: string[] = [
      'Target',
      'Reserves',
      'Goals',
      'Naira Reserve',
      'Periodic'
    ]
    const savingssortBy: string[] = [
      'Start date',
      'Maturity date',
      'Balance',
      'Principal',
      'Interest earned',
      'Interest withdrawn',
      'Interest available to the withdrawn',
      'Auto topup amount'
    ]
    // Filtering User Savings table
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('be.visible').within(()=> {
      cy.get("[class$='text-base font-semibold']").should('contain', 'Filter')
      cy.get("[class$='md:text-base text-sm font-semibold text-gray-900']").eq(0).should('contain', 'Tag')
      cy.get("[class$='md:text-base text-sm font-semibold text-gray-900']").eq(0).should('contain', 'Sort by')
      cy.get("[aria-hidden*='true']").should('exist')
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-white text-black border border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm px-4 !bg-gray-200 border-0']").should('exist').and('contain', 'Clear all filters')
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply')
    })
    //Filter options availability check
    tags.forEach((tag: any) => {
      cy.get("[class$='space-y-2']").eq(1).within(()=> {
        cy.get("[class$='flex w-max py-1 px-3 border border-[#E4E4E7] rounded-full hover:cursor-pointer items-center font-normal text-sm transition-colors duration-200 text-black']").should('contain', tag)
      })
    })
    savingssortBy.forEach((item: any) => {
      cy.get("[class$='space-y-2']").eq(1).within(()=> {
        cy.get("[class$='flex w-max py-1 px-3 border border-[#E4E4E7] rounded-full hover:cursor-pointer items-center font-normal text-sm transition-colors duration-200 text-black']").should('contain', item)
      })
    })
    //Apply filter check (Single) - TAG
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.contains('Reserve').click()
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply').click()
    })
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.contain', 'Reserve')
    //Apply filter check (Single) - Sort by
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.contains('Start date').click()
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply').click()
    })
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(7)").eq(1).should('not.contain', 'Oct 28, 2025')

    // ---= Multiple Tag/Tag
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.contains('Naira reserve').click()
      cy.contains('Goals').click()
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply').click()
    })
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.contain', 'Reserve')
    // ---= Multiple Tag/Sort by
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.contains('Goals').click()
      cy.contains('Start date').click()
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply').click()
    })
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.contain', 'Reserve')
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(7)").eq(0).should('not.contain', '')

    //Close feature
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.get("[aria-hidden*='true']").should('exist').click()
    })
    cy.get("[data-testid$='filters-content']").should('not.exist')
    //Clear all filters
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-white text-black border border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm px-4 !bg-gray-200 border-0']").should('exist').and('contain', 'Clear all filters').click()
    })
    cy.get("[data-testid$='filters-content']").should('exist')

    // Valid Letter population
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by plan type or plan name"]`).should('exist')
    })
    cy.get("#search-bar-button").type('h')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 1)
  })
})
