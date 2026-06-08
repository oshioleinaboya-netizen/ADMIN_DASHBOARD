// cypress/support/helpers.js
import { faker, fi } from '@faker-js/faker';
import { partnerLink, partnerEmail, stagingOtp, partnerPassword } from "cypress/support/env";
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

export function partnerSignup() {
  cy.visit(partnerLink) // Visit the partner signup page
  cy.wait(4000) // Wait for the page to load completely
        cy.contains('Sign up')
            .should('be.visible')
            .should('not.be.disabled')
            .click() // Signup button check and click action

        cy.url().should('include', '/register') // url check

        // Personal details flow point
        cy.contains('Personal Details').should('exist') // Page title check
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '1') // Progress bar check
        
        cy.contains('Back').should('exist').should('not.be.disabled') // Back to personal details button check

        cy.get("[class*='text-sm font-medium uppercase tracking-wide text-muted-foreground']").contains('1') // Step check
        // Empty input state check
        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click()
        const emptyFieldErrors: string[] = [
            'Email is required',
            //'Password is required',
            'First name is required',
            'Last name is required',
            'Please confirm your password'
        ]
        emptyFieldErrors.forEach((text) => {
            cy.contains(text).should('be.visible')
        }) // Error check

        const email = faker.internet.email()
        cy.contains('Email Address').parent().find('input').type(email) // email input
        cy.log(`Generated email: ${email}`)

        cy.contains('First Name').parent().find('input').type(faker.person.firstName()) // first name input
        cy.contains('Last Name').parent().find('input').type(faker.person.lastName()) // last name input

        //Pasword inout progress check
        cy.contains('Password').parent().find('input').type('George')
        cy.contains('Password').parent().within(() => {
            const PasswordInputProgressCheck: string[] = [
                'At least 8 characters',
                'Contains a number',
                'Contains an uppercase letter',
                'Contains a lowercase letter',
                'Contains a special character'
            ]
            PasswordInputProgressCheck.forEach((text) => {
                cy.contains(text).scrollIntoView().should('be.visible')
            }) // Error check
        })

        //Pasword confirmation inout progress check
        cy.contains('Confirm Password').parent().find('input').type('Geor@')
        cy.contains('Confirm Password').parent().within(() => {
            const PasswordInputProgressCheck: string[] = [
                'At least 8 characters',
                'Contains a number',
                'Contains an uppercase letter',
                'Contains a lowercase letter',
                'Contains a special character'
            ]
            PasswordInputProgressCheck.forEach((text) => {
                cy.contains(text).scrollIntoView().should('be.visible')
            }) // Error check
        })

        cy.contains('Passwords do not match').scrollIntoView().should('exist') // Password match check

        cy.contains('Password').parent().find('input').clear().type(partnerPassword) // password input
        cy.contains('Confirm Password').parent().find('input').clear().type(partnerPassword) // confirm password input

        // Hide and show password check
        cy.get("[aria-label*='Show password']").eq(0).click()
        // Now it should be text
        cy.get('input').eq(3)
        .should('have.attr', 'type', 'text') // Password show check
        cy.get("[aria-label*='Hide password']").click()
        cy.get('input').eq(3)
        .should('have.attr', 'type', 'password') // Password hide check
        // -- Repeat for confirm password field
        cy.get("[aria-label*='Show password']").eq(1).click()
        cy.get('input').eq(4)
        .should('have.attr', 'type', 'text') // Confirm Password show check
        cy.get("[aria-label*='Hide password']").click()
        cy.get('input').eq(4)
        .should('have.attr', 'type', 'password') // ConfirmPassword hide check

        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue to the next flow point
        
        cy.wait(3000) // wait for the next page to load

        
        //Email verification flow point
        cy.contains('Verify Email Address').should('be.visible') // Page title check
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '2') // Progress bar check
        
        cy.contains('Back').should('be.visible').should('not.be.disabled') // Back to personal details button check
        
        cy.url().should('include', '/verify-email') // url check
        cy.get("[class*='text-sm font-medium uppercase tracking-wide text-muted-foreground']").contains('2') // Step check

        cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point without OTP input
        cy.get("[data-slot*='field-error']").contains('Enter 6 digit code').should('be.visible') // Error check for empty OTP input
        
        // Resend OTP check
        cy.contains('Resend OTP').should('be.visible').click()
        cy.contains('Email verification code sent successfully').should('be.visible') // Resend OTP check
        cy.wait(4000)

        //Wrong OTP Input and verification check
        function handleWrongOtp() {
            const otpSelector = "input[data-input-otp='true'], input[autocomplete='one-time-code']"
            cy.get('body').then($body => {
                if ($body.find(otpSelector).length) {
                    cy.get(otpSelector, { timeout: 10000 }).eq(0).type("123456", { force: true })
                    cy.contains('Continue').click() // Continue to trigger OTP verification
                } else {
                    cy.log('No OTP field found, skipping OTP input.')
                }
            })
        } handleWrongOtp()
        cy.wait(2000) // Wait for potential error message to appear
        cy.contains("Invalid verification code. Please try again").should('be.visible') // Wrong OTP verification check

        //OTP Input and verification check
        function handleOtp() {
            const otpSelector = "input[data-input-otp='true'], input[autocomplete='one-time-code']"
            cy.get('body').then($body => {
                if ($body.find(otpSelector).length) {
                    cy.get(otpSelector, { timeout: 10000 }).eq(0).clear({force: true}).type(stagingOtp, { force: true })
                    cy.contains('Continue').click() // Continue to trigger OTP verification
                } else {
                    cy.log('No OTP field found, skipping OTP input.')
                }
            })
        } handleOtp()
        cy.wait(2000) // Wait for potential error message to appear
        cy.contains("Email verified successfully").should('be.visible') // OTP verification check

        cy.wait(3000) // wait for the next page to load

       
        // Company profile page check
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '3') // Progress bar check
        cy.contains('Company Profile').should('be.visible') // Page title check
        cy.url().should('include', '/company-profile') // url check
        cy.contains('Back').should('be.visible').should('not.be.disabled') // Back to email verification button check

       // Empty state check
       cy.contains('Continue').click() // Empty state check
       cy.get("[data-slot*='field-error']").should('have.length', 7)

       // Business name input check
       cy.contains('CAC/RC Number').parent().find('input').scrollIntoView().type('8428273', {force: true}) // CAC/RC Number input check
       cy.contains('Use RC/BN followed by numbers').should('be.visible') // CAC/RC Number format error check
       cy.contains('Business Name').parent().should('exist')//.find('input').should('be.disabled') // Business name input disabled check
       cy.contains('Physical Address').parent().find('input').scrollIntoView().type('Lagos, Nigeria', {force: true}) 
       // Remember to add a valisations for the "Use this name" flow, where the system is validating existence of the CAC number provided

       //Industry input and option check
       cy.contains('Industry').parent().within(()=> {
            cy.get("[data-slot*='popover-trigger']").click().should('have.attr', 'aria-expanded', 'true') // Industry input check
       })
       cy.get("[data-value*='Technology']").should('have.attr', 'data-selected', 'false').click() // Industry option check
       cy.contains('Industry').parent().within(()=> {
            cy.get("[data-slot*='popover-trigger']").should('contain', 'Technology') // Industry input check
       })
       // Employment type input and option check
         cy.contains('Employer Type').parent().within(()=> {
                cy.get("[data-slot*='popover-trigger']").click().should('have.attr', 'aria-expanded', 'true') // Employment type input check
         })
            cy.get("[data-slot*='command-group']").eq(0).within(() => {
                cy.get("[data-slot*='command-item']").should('have.length.at.least', 1)
            })
            cy.get("[data-value*='Global Tech Firms']").click() // Employment type option check
        // Tax number input check    
        cy.contains('Tax Number').parent().find('input').scrollIntoView().click().type('HDH333', {force: true}) // Tax number input check
        // Year of Incorporation input check with date formatting
        const inputDate = '14/02/2020'
        const [day, month, year] = inputDate.split('/')
        const formattedDate = `${year}-${month}-${day}`
        cy.contains('Year of Incorporation').parent()
            .find('input').click({force: true}).type(formattedDate, {force: true}) // Year of Incorporation input check

        cy.contains('Number of Staffs').parent().find('input').scrollIntoView().should('have.attr', 'min', '0').type('10')
        
        cy.contains('CAC/RC Number').parent().scrollIntoView().find('input').clear().type('RC8428273', {force: true}) // Correcting the CAC/RC Number input
        cy.contains('Use this name')
                .should('be.visible')
                .and('not.be.disabled')
                .click();

        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue to the next flow point
        
        cy.contains('already exists').scrollIntoView().should('have.length', 1).should('be.visible')
        cy.wait(4000)

        // Correcting the CAC/RC Number input
        const rcNumber = Array.from({ length: 7 }, () =>
            faker.number.int({ min: 1, max: 8 })
        ).join('');
        
        cy.contains('CAC/RC Number').parent().scrollIntoView().find('input').clear().type('RC' + rcNumber, {force: true})
        cy.get("[data-slot*='field-error']").should('have.length', 0) // Error check for company profile page
        cy.contains('Match found')
            .parent()
            .should('be.visible')
            .and('not.be.empty')
            .invoke('text')
            .then((text) => {
                const businessName = text
                .replace('Match found', '')
                .trim();

                cy.contains('Use this name')
                .should('be.visible')
                .and('not.be.disabled')
                .click();
                /*
                cy.contains('Business Name')
                .parent()
                .find('input')
                .should('have.value', businessName);*/
            });
        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue to the next flow point
        
        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)
        
        cy.contains('already exists').scrollIntoView().should('have.length', 1).should('be.visible')
        cy.wait(4000)

        const suffix = Array.from({ length: 4 }, () =>
            faker.number.int({ min: 1, max: 8 })
        ).join('');
        cy.contains('Tax Number').parent().find('input').scrollIntoView().clear().type('NG-'+suffix, {force: true}) // Tax number uniqueness check
        cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)

        
        // Contact details page check
        cy.contains('Contact Details').should('exist') // Page title check
        cy.url().should('include', '/contact-details') // url check
        cy.contains('Back').should('exist').should('not.be.disabled') // Back to company profile button check
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '4') // Progress bar check
       
        // Empty state check
       cy.contains('Continue').click() // Empty state check
       cy.get("[data-slot*='field-error']").should('have.length', 3)

       //Matching contacts input check
       cy.contains('Full Name').parent().find('input').type('Jiam Jiad') // Full name input check
       cy.contains('Email').parent().find('input').type('jiam@hjs.com') // email input check
       cy.contains('Phone Number').parent().find('input').type('+2347038299283') // phone number input check

        cy.contains('Add another contact').should('be.visible').click() // Add another contact button check

        cy.get("[type*='text']").eq(3).type('Jiam Jiad') // Full name input check
       cy.get("[type*='email']").eq(1).type('jiam@hjs.com') // email input check
       cy.get("[type*='tel']").eq(1).type('+2347038299283') // phone number input check
       cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)

        cy.get("[data-slot*='field-error']").should('have.length', 6) // Duplicate contact error check
       
        // Actual flow
        cy.contains('Remove').should('exist').should('not.be.disabled').click() // Remove contact button check
       cy.contains('Full Name').parent().find('input').clear().type(faker.person.fullName()) // Full name input check
       cy.contains('Email').parent().find('input').clear().type(faker.internet.email()) // email input check
       const suffix2 = Array.from({ length: 8 }, () =>
            faker.number.int({ min: 1, max: 8 })
        ).join('');
       cy.contains('Phone Number').parent().find('input').clear().type('+23470' + suffix2) // phone number input check
       
       cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)


        //Payroll Configuration page check
        cy.contains('Payroll Configuration').should('exist') // Page title check
        cy.url().should('include', '/payroll-config') // url check
        cy.contains('Back').should('exist').should('not.be.disabled') // Back to contact details button check
        cy.get("[role*='progressbar']").should('have.attr', 'aria-valuenow', '5') // Progress bar check

        // Empty state check
       cy.contains('Continue').click() // Empty state check
       cy.get("[data-slot*='field-error']").should('have.length', 4)

        cy.contains('Payroll Frequency') //
        .parent()
        .scrollIntoView()
        .within(() => {
            cy.get("[data-slot='popover-trigger']")
            .click()
        })
        //
        cy.contains('Monthly')
        .should('be.visible')
        .click()
        //
        cy.get("[data-slot='popover-trigger']")
        .should('contain', 'Monthly')

        cy.contains('Payroll Currency') // Payroll currency input and option check
        .parent()
        .scrollIntoView()
        .within(() => {
            cy.get("[data-slot='popover-trigger']")
            .click()
        })
        //
        cy.contains('NGN')
        .should('be.visible')
        .click()
        //
        cy.get("[data-slot='popover-trigger']")
        .should('contain', 'NGN')

        cy.contains('Payroll Method') // Payroll method input and option check
        .parent()
        .scrollIntoView()
        .within(() => {
            cy.get("[data-slot='popover-trigger']")
            .click()
        })
        //
        cy.contains('Bank Transfer')
        .should('be.visible')
        .click()
        //
        cy.get("[data-slot='popover-trigger']")
        .should('contain', 'Bank Transfer')

        cy.contains('Payroll Day') // Payroll day input and option check
        .parent()
        .scrollIntoView()
        .within(() => {
            cy.get("[data-slot='popover-trigger']")
            .click()
        })
        //
        cy.contains('5th Day')
            .scrollIntoView()
            .should('be.visible')
            .click()
        //
        cy.get("[data-slot='popover-trigger']")
            .should('contain', '5th Day')

        cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)

        // Document upload page check
        cy.get("[for*='pension_remittance']").selectFile('cypress/fixtures/media.jpeg', { force: true }) // Document upload check
        cy.get("[for*='tax_clearance_certificate']").selectFile('cypress/fixtures/media.jpeg', { force: true }) // Document upload check
        cy.get("[for*='tax_id']").selectFile('cypress/fixtures/media.jpeg', { force: true }) // Document upload check
        cy.get("[for*='business_operation_license']").selectFile('cypress/fixtures/media.jpeg', { force: true }) // Document upload check

        cy.contains('Continue').should('not.be.disabled').click() // Continue to the next flow point
        cy.wait(4000)

        return cy.wrap(email)
}

export function partnerSignout() {
  // Login first
        cy.contains('Email').parent().find('input').type(partnerEmail)
        cy.contains('Password').parent().find('input').type(partnerPassword)
        cy.get("[type*='submit']").click()
        cy.wait(4000) // wait for login to complete and dashboard to load
        
        // Wait for dashboard to load
        cy.url().should('include', '.africa')

        // Sign out process
        cy.get("[data-slot*='dropdown-menu-trigger']").eq(1).click() // Click on profile dropdown
        cy.contains('Log out').should('be.visible').should('not.be.disabled').click() // Click on log out button
        cy.url().should('include', '/login') // Check if redirected to login page after logout
}





