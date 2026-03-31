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
    cy.get("[data-slot*='table-row']").eq(1).within(() => {
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
      cy.get("[class*='max-h-60 overflow-auto']").eq(1).within(() => {
        cy.contains('Generate Web Link (Recommended)').click()
      })
      const staffPhone1 = `070${faker.string.numeric(8)}`
      cy.get("[type*='tel']").type(staffPhone1) // type staff's phone number

      cy.contains('Continue').click() // Get web link after this action
      cy.wait(3000)

      cy.get("[class*='truncate text-paragraph']").invoke('text').then(weblink => {
        cy.intercept("GET", "**/face_detection/**", {
          statusCode: 200,
          body: {
            success: true,
            message: "Face detection passed",
          },
        }).as("faceDetection");

        cy.visit(weblink.trim()) // Visit the generated weblink
        cy.wait(5000)
      })

      // Weblink Onboarding flow
      const last10Digits = staffPhone1.slice(-10);
      cy.get("[inputmode*='tel']") // Verify phone number is prefilled
        // .should('have.attr', 'readonly')
        .invoke('val')
        .should(value => {
          expect(value).to.include(last10Digits);
        })
      cy.contains('Continue').click()
      cy.wait(3000)

      // OTP input
      cy.contains('Enter the code sent').parent().within(() => {
        cy.get("[aria-label*='PIN input 1 of 6']").type('0')
        cy.get("[aria-label*='PIN input 2 of 6']").type('0')
        cy.get("[aria-label*='PIN input 3 of 6']").type('0')
        cy.get("[aria-label*='PIN input 4 of 6']").type('0')
        cy.get("[aria-label*='PIN input 5 of 6']").type('0')
        cy.get("[aria-label*='PIN input 6 of 6']").type('0')
      }) // Enter OTP
      cy.wait(2000)

      // NIN input
      const ninNumber = '00000' + faker.string.numeric(6);
      cy.contains('Enter your NIN').parent().find("input").type(ninNumber)
      cy.contains('Continue').click() // Auto cotinues after NIN input
      cy.wait(3000)

      // BVN input
      const bvnNumber = '000000' + faker.string.numeric(5);
      cy.contains('Enter your BVN').parent().find("input").type(bvnNumber)
      cy.contains('Continue').click() // Auto cotinues after BVN input
      cy.wait(4000)

      // Face capture step
      cy.contains('Capture picture').click() // Capture functionality check
      cy.wait(2000)
      cy.contains('Use this photo').click() // Confirm captured photo

      // Create & Confirm PIN 
      cy.contains('Your pin').parent().within(() => {
        cy.get("[aria-label*='PIN input 1 of 6']").type('0')
        cy.get("[aria-label*='PIN input 2 of 6']").type('0')
        cy.get("[aria-label*='PIN input 3 of 6']").type('0')
        cy.get("[aria-label*='PIN input 4 of 6']").type('0')
        cy.get("[aria-label*='PIN input 5 of 6']").type('0')
        cy.get("[aria-label*='PIN input 6 of 6']").type('0')
      }) // Create PIN
      cy.contains('Enter the code sent').parent().within(() => {
        cy.get("[aria-label*='PIN input 1 of 6']").type('0')
        cy.get("[aria-label*='PIN input 2 of 6']").type('0')
        cy.get("[aria-label*='PIN input 3 of 6']").type('0')
        cy.get("[aria-label*='PIN input 4 of 6']").type('0')
        cy.get("[aria-label*='PIN input 5 of 6']").type('0')
        cy.get("[aria-label*='PIN input 6 of 6']").type('6')
      }) // PIN mismatch confirmation to trigger error
      cy.wait(2000)
      cy.contains('Pins must match').should('be.visible') // Verify mismatch error

      cy.contains('Enter the code sent').parent().within(() => {
        cy.get("[aria-label*='PIN input 6 of 6']").clear().type('0')
      }) // Confrim PIN
      cy.wait(3000)

      // Sucess page check
      cy.contains('Complete')

      // Return to admin portal
      cy.get('@savePageUrl').then((url: any) => {
        cy.visit(url)
      })
      cy.wait(5000)
    })
  })
})