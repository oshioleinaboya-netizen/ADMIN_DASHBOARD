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

export function loanApplicationAndApproval() {
  const selectDropdown = (label: string, optionText: string) => {
    cy.contains(label).parent().find("[class*='flex flex-wrap']").click();
    cy.get("[class*='absolute z-10']").contains(optionText).click();
  };
  // This function can be implemented to handle the loan application and approval process
  // Click on loan product

        //Loan management navigation
        cy.get("[data-testid*='nav-link-loan']").click()
        cy.wait(1000)
        cy.contains('Loan Management').click()
        cy.wait(3000)

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
                cy.contains('Successful').should('exist')
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

        // Accept loan application
        cy.get("[data-testid*='dropdown-button']").eq(1).click()
        cy.get("[role*='menu']").first().within(()=> {
            cy.get("[role*='menuitem']").eq(0).contains('Accept loan').click()
            cy.wait(3000)
        })

        cy.get("[class*='modal-content-right']").within(() => {
            // Accept button check
            //cy.contains('button', 'Accept').eq(1).should('contain.text', 'Accept').should('be.visible')//.and('be.disabled')

            //Acceptance comment
            cy.get("[rows*='4']").type('Nah my guy, give am the loan')

            // Accept button check
            cy.contains('button', 'Accept').eq(1).should('contain.text', 'Accept').should('be.visible').click()
            cy.wait(3000)
        })

        //Loan acceptance success page
        cy.contains('Loan approved successfully').should('be.visible')
        cy.contains('Ok').click() // Close success page
        cy.wait(5000)

        // Assert loan status change to accepted
        cy.reload( {timeout: 20000} )
        cy.wait(10000)

        // Assert loan status is approved
        cy.contains('Loan Status').parent().within(() => {
            cy.contains('Approved').should('exist')
        })
}

export function checkTableData() {
  cy.contains('Employee').click() // Navigate to Employees page
  cy.wait(2000) // wait for employee table to load
  cy.get("[data-slot*='table-body'] tr").eq(0).should('be.visible').then(() => {
      cy.get('td').eq(1).invoke('text').then((text) => {
          cy.wrap(text).as('EmployeeNumber') // Store first employee name for later comparison
      })
  })
  cy.get("[aria-label*='Page 2']").click()
  cy.wait(3000) // wait for page 2 to load
  cy.get("[aria-label*='Page 2']").should('have.attr', 'data-active', 'true') // Navigate back to page 1

  cy.get("[data-slot*='table-body'] tr").eq(0).should('be.visible').then(() => {
      cy.get('td').eq(1).invoke('text').then((text) => {
          cy.get('@EmployeeNumber').then((EmployeeNumber) => {
              expect(text).to.not.equal(EmployeeNumber) // Employee name on page 2 should be different from page 1
          })
      })
  })

  cy.get("[aria-label*='Page 1']").click()
  cy.wait(3000) // wait for page 1 to load
  cy.get("[aria-label*='Page 1']").should('have.attr', 'data-active', 'true') // Navigate back to page 1

  cy.get("[data-slot*='table-body'] tr").eq(0).should('be.visible').then(() => {
    cy.get('td').eq(1).invoke('text').then((text) => {
        cy.get('@EmployeeNumber').then((EmployeeNumber) => {
            expect(text).to.equal(EmployeeNumber) // Employee name on page 1 should match original name
        })
    })
  })
}







