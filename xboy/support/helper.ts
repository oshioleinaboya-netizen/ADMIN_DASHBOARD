// cypress/support/helpers.js
import { faker, fi } from '@faker-js/faker';
export function inviteStaff() {
  cy.contains('Invite a staff').click()
    cy.url({ timeout: 30000 }).should('include', '/invite')
    
    //Input fields functionality check
    // First name input
    const firstName: string = faker.person.firstName();
    cy.contains("First name").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter first name"]`).should('exist')
      }).type(firstName)
    })
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    
    // Last name input
    const surName: string = faker.person.lastName();
    cy.contains("Surname").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter surname"]`).should('exist')
      }).type(surName)
    })
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    
    // Email input
    cy.contains("Email address").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter email address"]`).should('exist')
      }).type('cxadmin@blondmail.com')
    })
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    
    // Phone number input
    const phone = '080' + Math.floor(10000000 + Math.random() * 90000000); // Unique Nigerian phone number
    cy.contains("Phone Number").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter phone number"]`).should('exist')
      }).type(phone)
    })
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    
    // Job title input
    cy.contains("Job title").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter job title"]`).should('exist')
      }).type('Automation Personnel')
    })
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    
    // Department selection
    cy.contains("Department").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose department')
      }).click()
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').within(()=> {
      cy.get("[data-testid*='dropdown-option-4']").should('contain', 'FINANCE').click()
    }) //Finance input
    cy.contains("Department").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').and('contain', 'FINANCE')
    }) //Placeholder check
    cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']").should('exist').and('contain', 'Select all').and('not.contain', 'Deselect all')
    cy.get("[id*='permissions-scroll-container']").eq(0).within(()=> {
      cy.get("[class*='flex items-center gap-x-2']").should('have.length.at.least', 2).should('be.visible')
      cy.get("[class*='peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#D4D4D8] checked:border-black checked:bg-black']").should('have.length.at.least', 2).should('be.visible')
    })

    // Level selection
    cy.contains("Level").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose level')
      }).click()
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').within(()=> {
      cy.get("[data-testid*='dropdown-option-1']").should('contain', 'LEAD').click()
    }) //Option click
    cy.contains("Level").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').and('contain', 'LEAD')
    }) //Placeholder check
    cy.get("[id*='permissions-scroll-container']").eq(0).within(()=> {
      cy.get("[class*='flex items-center gap-x-2']").should('have.length.at.least', 2).should('be.visible')
      cy.get("[class*='absolute left-0 top-0 h-4 w-4 pointer-events-none']").should('have.length.at.least', 2).should('be.visible')
    }) //Persmission check
    cy.get("[id*='permissions-scroll-container']").eq(0).within(()=> {
      cy.get("[class*='flex items-center gap-x-2']").last().scrollIntoView({ ensureScrollable: false });
    })// Scroll to bottom of permission list

    //uncheck checkboxes
    cy.get("[class*='text-[12px] text-[#71717A]']").should('contain', 'Select the permissions that the user should have access to')
    cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']").should('exist').and('contain', 'Deselect all').and('not.contain', 'Select all')
    cy.get("[id*='permissions-scroll-container']").eq(0).within(()=> {
      cy.get("[class*='flex items-center gap-x-2']").first().should('exist').click()
      cy.get("[class*='peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#D4D4D8] checked:border-black checked:bg-black']").first().should('be.visible').should('not.be.checked')
      cy.get("[class*='flex items-center gap-x-2']").eq(2).should('exist').click()
      cy.get("[class*='peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#D4D4D8] checked:border-black checked:bg-black']").eq(1).should('be.visible').should('not.be.checked') //Persmission check
    })
    //cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']")eq(0).should('exist').and('contain', 'Select all').and('not.contain', 'Deselect all').click()
    cy.get("[id*='permissions-scroll-container']").eq(0).within(()=> {
      cy.get("[class*='flex items-center gap-x-2']").first().should('exist').click()
      cy.get("[class*='peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#D4D4D8] checked:border-black checked:bg-black']").first().should('be.visible').should('be.checked')
      cy.get("[class*='flex items-center gap-x-2']").eq(2).should('exist').click()
      cy.get("[class*='peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#D4D4D8] checked:border-black checked:bg-black']").eq(1).should('be.visible').should('be.checked')
    })//Persmission re-check

    //Country of operation
    cy.contains("Country of operation").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose countries')
      }).click()
    })
    // Application country selection complete
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").within(()=> {
      cy.get("[data-testid*='dropdown-option-2']").should('contain', 'NIGERIA').click()
      cy.get("[data-testid*='dropdown-option-0']").should('contain', 'BENIN').click()
    }) //UNSELECT option click
    cy.contains("Country of operation").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white text-gray-800 border border-gray-300 px-2 py-0.5 text-xs pr-1']`).eq(0).should('exist').and('contain', 'NIGERIA')
        cy.get(`[class*='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white text-gray-800 border border-gray-300 px-2 py-0.5 text-xs pr-1']`).eq(1).should('exist').and('contain', 'BENIN')
      }).click()// Badge appearance
    })


    //Domains
    cy.contains("Domains").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose Domains')
      }).click()
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('be.visible').within(()=> {
      cy.get("[data-testid*='dropdown-option-4']").should('contain', 'RANK MFB').click()
    }) //Option click
    cy.contains("Domains").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white text-gray-800 border border-gray-300 px-2 py-0.5 text-xs pr-1']`).should('exist').and('contain', 'RANK MFB')
      }).click()
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).click();
    }); //Button enabled check and click
    cy.wait(3000)
    cy.get("[class*='bg-[#FEE7EF] flex gap-x-8 justify-between p-2 rounded-lg mb-6 undefined']").eq(0).within(()=> {
      cy.get("[class*='flex items-center gap-x-1 ']")
      .scrollIntoView({ ensureScrollable: false })
      .should('be.visible').and('contain', 'Email is already in use.')
    })
    const email = `user_${Date.now()}@test.com`; // Unique email address
    cy.contains("Email address").parent().within(()=> {
      cy.get("[class*='relative']").clear()
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter email address"]`).should('exist')
      }).type(email)
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .scrollIntoView({ ensureScrollable: false })
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).click();
    }); //Button enabled check and click/
    cy.wait(3000)
}

// Additional helper functions can be added here
export function findRowAcrossPages(matchFn: (row: HTMLElement) => boolean) {
  function searchPage() {
    return cy.get("[data-slot*='table-container'] tbody tr").then(rows => {
      const found = [...rows].find(row => matchFn(row));

      if (found) {
        return cy.wrap(found);
      }

      // Check for NEXT button
      return cy.get("[data-testid*='pagination-arrow-next']").then($next => {
        if ($next.is(':disabled')) return null; // no more pages

        cy.wrap($next).click();
        return searchPage();
      });
    });
  }

  return searchPage();
}

// Additional helper check
export function checkColumnAcrossAllPages(columnIndex: number, expectedValues: string[]) {
  const checkPage = (): Cypress.Chainable<any> => {
    // Case: No results found
    const noResultSelector = "[class*='flex flex-col items-center']";
    return cy.get("body").then($body => {
      if ($body.find(noResultSelector).text().match(/No result(s)? found!?/i)) {
        return cy.get(noResultSelector)
          .contains(/No result(s)? found!?/i)
          .should("be.visible")
          .then(() => cy.wrap(void 0));
      }

      // Table exists → check all rows on this page
      return cy.get("[data-slot$='table-container'] tbody tr").each($row => {
        cy.wrap($row)
          .find("td")
          .eq(columnIndex)
          .invoke("text")
          .then(text => {
            const cellText = text.trim().toUpperCase();
            expectedValues.forEach(val => {
              if (cellText.includes(val.toUpperCase())) {
                cy.log(`Found expected value: ${val}`);
              }
            });
          });
      }).then(() => {
        // Check for NEXT button
        return cy.get("[data-testid*='pagination-arrow-next']").then($next => {
          if ($next.is(':disabled')) return cy.wrap(void 0); // no more pages
          cy.wrap($next).click();
          cy.wait(500); // wait for table to render
          return checkPage(); // continue to next page
        });
      });
    });
  };

  return checkPage();
}







