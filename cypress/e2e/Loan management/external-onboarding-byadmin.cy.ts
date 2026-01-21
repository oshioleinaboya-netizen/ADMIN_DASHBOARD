import { adminEmail, adminPassword } from "cypress/support/env";
import { faker, fi } from '@faker-js/faker';

// Helper functions/
const typeInput = (label: string, value: string) => {
  cy.contains(label).parent().find("input, textarea").first().clear().type(value);
};

const selectDropdown = (label: string, optionText: string) => {
  cy.contains(label).parent().find("[class*='flex flex-wrap']").click();
  cy.get("[class*='absolute z-10']").contains(optionText).click();
};

function findFirstActiveAndOnboard(statusText: string) {
  const searchPage = (): Cypress.Chainable => {
    return cy
      .get("[data-slot*='table-container']")
      .eq(1) // second table
      .find("tbody tr")
      .then($rows => {
        // find FIRST row with the stated status 
        const matchingRow = [...$rows].find(row =>
          row.innerText.includes(statusText.toUpperCase())
        );

        if (matchingRow) {
            // Decide which action to click
            const actionText = statusText.toUpperCase() === "ACTIVE" ? "Onboard" : "Edit";

          return cy
            .wrap(matchingRow)
            .find("td")
            .eq(3) // Staff's phone number column
            .invoke("text")
            .then(phone => {
                const staffPhone = phone.trim()

                return cy
                .wrap(matchingRow)
                .find("td")
                .eq(11) // column 11
                .should("contain.text", actionText)
                .click() // click Onboard or Edit button
                .wait(2000)
                .then(() => staffPhone);
            })
        }

        // move to next page if no Active row found
        return cy.get("[data-testid*='pagination-arrow-next']").then($next => {
          if ($next.is(":disabled")) {
            throw new Error("No Active row with Onboard found in any page");
          }

          cy.wrap($next).click();
          return searchPage();
        });
      });
  };

  return searchPage();
}


describe('External Onboardng', () => {
  beforeEach(() => {
    // Clear index DB
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
  it("External Onboarding", () => {
    // Click on the loan product
    cy.contains('Civic Loan').click()
    cy.wait(3000)

    // Search for uploaded business line
    cy.get("[data-testid*='search-bar-button']").type('novarium engineering')

    // Check table for the business line
    cy.get("[data-slot*='table-row']").eq(1).within(()=> {
        cy.contains('novarium engineering').should('exist')
        cy.get('td').eq(4).click() // contains('ACTIVE')
        cy.wait(20000)
    })
    cy.url().as("savedPageUrl");

    // Corrupted | conflicted staff data
    // findFirstActiveAndOnboard("Corrupted")
    // cy.wait(3000)

    // Input details for corrupted staff
    /*cy.get("[class*='flex flex-col justify-between w-[700px] bg-white h-screen p-10 pt-10  overflow-auto']").within(()=> {
        typeInput('NIN', faker.string.numeric(11))
        typeInput('BVN', faker.string.numeric(11))
        /*cy.contains('Date Of Birth').parent().within(()=> {
            cy.get("[type*='date']").click().type('08151990')
        })*/ // Date of Birth field is not interactable directly
        /*selectDropdown('SEX', 'Male')
        typeInput('ADDRESS', faker.location.streetAddress())
        typeInput('Phone Number', '080' + faker.string.numeric(8))
        typeInput('EMAIL', `user_${Date.now()}@test.com`)
        typeInput('Full Name', faker.person.fullName())
        typeInput('Last Name', faker.person.lastName())
        typeInput('First Name', faker.person.firstName())
        typeInput('Middle Name', faker.person.middleName())
        cy.contains('Save Changes').should('not.be.disabled').click()
    })*/


    // Check staff list table
    findFirstActiveAndOnboard("ACTIVE").then(() => {
        // Fill out modal
        cy.contains('Onboarding Method').parent().within(() => {
            cy.get("[class*='flex flex-wrap gap-2 flex-1']").click()
        }) // Drawdown input field click
        cy.get("[class*='max-h-60 overflow-auto']").eq(1).within(()=> {
            cy.contains('Admin Onboarding').click()
        })
    })
    })
})