import { adminEmail, adminPassword, rankLink } from "@support/env";
describe('Change staff role', () => {
    beforeEach(() => {
      //Authentication check - Login
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
      cy.get('body').then(($body) => {
        const timerExists = $body.find("[class$='self-center space-y-2']").length > 0;
        if (timerExists) {
          cy.get("[class$='self-center space-y-2']").should('exist').within(()=>{
            cy.get("[class$='font-semibold']").should('be.visible')
          })
        } else {
          cy.log('No timer exists');
        }
      })
   
      cy.get('body').then(($body) => {
        const otpField = $body.find("[class*='cursor-text']").length > 0;
        if (otpField) {
          cy.get("[class*='cursor-text']").type('000000');
        } else {
          cy.log('No OTP field found, skipping OTP input.');
        }
        $body.find("[class*='animate-spin']")
      });
      cy.wait(5000)
      cy.location().then((loc) => {
        cy.log('Current URL:', loc.href)
      })
      cy.url({ timeout: 30000 }).should('include', '/customers')
      cy.get("[data-testid*='nav-link-staff-management']").click()
      cy.url({ timeout: 30000 }).should('include', '/staff-mgt')
    })
  it('Change staff role', () => {
    cy.get("[class*='focus-visible:outline-none ml-2 w-full']").type('Billy Rank') // Staff search
    cy.wait(3000)

    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).click() // Table selection
    cy.contains('Change staff role').click()
    
    //Inputs
    cy.contains("Job title").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter job title"]`).should('exist')
      }).type('Automation Personnel')
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Change Role")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click
    
    //
    cy.contains("Department").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose department')
      }).click()
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').within(()=> {
      cy.get("[data-testid*='dropdown-option-0']").should('contain', 'ACCOUNT OFFICER').click()
    }) //Finance input
    cy.contains("Department").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').and('contain', 'ACCOUNT OFFICER')
    }) //Placeholder check
    cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']").should('exist').and('contain', 'Select all').and('not.contain', 'Deselect all')
    cy.get("[id*='permissions-scroll-container']").eq(0).within(()=> {
      cy.get("[class*='flex items-center gap-x-2']").should('have.length.at.least', 2).should('be.visible')
      cy.get("[class*='peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#D4D4D8] checked:border-black checked:bg-black']").should('have.length.at.least', 2).should('be.visible')
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Change Role")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click
    //
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
    cy.get(`[type*='button']`)
    .filter(':contains("Change Role")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click

    //Country of operation
    cy.contains("Country of operation").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose countries')
      }).click()
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('be.visible').within(()=> {
      cy.get("[data-testid*='dropdown-option-2']").should('contain', 'NIGERIA').click()
      //cy.get("[data-testid*='dropdown-option-2']").should('contain', 'Nigeria').click()
    }) //Option click
    cy.contains("Country of operation").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white text-gray-800 border border-gray-300 px-2 py-0.5 text-xs pr-1']`).should('exist').and('contain', 'NIGERIA')
        cy.get(`[aria-label*='Remove badge']`).should('exist').click()
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose countries')
      })// Badge appearance | Remove badge
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('be.visible').within(()=> {
      cy.get("[data-testid*='dropdown-option-2']").should('contain', 'NIGERIA').click()
    }) //Option click
    cy.contains("Country of operation").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white text-gray-800 border border-gray-300 px-2 py-0.5 text-xs pr-1']`).should('exist').and('contain', 'NIGERIA')
      })// Badge appearance
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").within(()=> {
      cy.get("[data-testid*='dropdown-option-2']").should('contain', 'NIGERIA').click()
    }) //UNSELECT option click
    cy.contains("Country of operation").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose countries')
      })// Unselect check
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
    cy.get(`[type*='button']`)
    .filter(':contains("Chhange Role")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click


    //Domains
    cy.contains("Domains").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='text-gray-400']`).should('exist').and('contain', 'Choose Domains')
      }).click()
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('be.visible').within(()=> {
      cy.get("[data-testid*='dropdown-option-4']").should('contain', 'RANK MFB').click()
      cy.get("[data-testid*='dropdown-option-0']").should('contain', 'BETA MONI').click()
    }) //Option click
    cy.contains("Domains").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[class*='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white text-gray-800 border border-gray-300 px-2 py-0.5 text-xs pr-1']`).eq(0).should('exist').and('contain', 'RANK MFB')
        cy.get(`[class*='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white text-gray-800 border border-gray-300 px-2 py-0.5 text-xs pr-1']`).eq(1).should('exist').and('contain', 'BETA MONI')
      }).click()
    })
    cy.contains("Domains").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').within(()=>{
        cy.get(`[aria-label*='Remove badge']`).eq(1).should('exist').click()
        cy.get(`[class*='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white text-gray-800 border border-gray-300 px-2 py-0.5 text-xs pr-1']`).should('exist').and('contain', 'RANK MFB').and('not.contain', 'BETA MONI')
      })// Badge appearance | Remove badge
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).click();
    }); //Button enabled check and click
    cy.wait(5000)
  })
})