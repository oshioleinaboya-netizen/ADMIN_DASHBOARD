import { adminEmail, adminPassword, rankLink } from "@support/env";

describe('Invite staff', () => {
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
  })
  it('UI check', ()=> {
    // Text input fields
    cy.contains('Invite a staff').click()
    cy.contains("First name").parent().within(()=> {
      cy.get("[class*='relative']").should('exist')
    })
    cy.contains("Surname").parent().within(()=> {
      cy.get("[class*='relative']").should('exist')
    })
    cy.contains("Email address").parent().within(()=> {
      cy.get("[class*='relative']").should('exist')
    })
    cy.contains("Phone Number").parent().within(()=> {
      cy.get("[class*='relative']").should('exist')
    })
    cy.contains("Job title").parent().within(()=> {
      cy.get("[class*='relative']").should('exist')
    })
    cy.contains("Department").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist')
    })
    cy.contains("Level").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist')
    })
    cy.contains("Country of operation").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist')
    })
    cy.contains("Domains").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist')
    })
    cy.get("[class*='text-[32px] font-bold']").should('contain', 'Invite new staff')
    cy.get("[class*='mt-2 text-[#71717A]']").should('contain', 'Enter the following information to invite a new staff for collaborations')
    cy.get("[class*='flex items-center gap-x-2 cursor-pointer']").within(()=> {
      cy.contains('Back')
      cy.get("[alt*='back arrow']").should('exist')
    })
    cy.get("[[class*='m-4']").should('exist').within(()=> {
      cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']").should('contain', 'Deselect all')
    })
    cy.contains('Review permission')
    cy.contains('Select the permissions that the user should have access to')
    cy.get("[type*='button']").should('exist')
  })
  it.only('Functionality check', ()=> {
    cy.contains('Invite a staff').click()
    cy.contains("First name").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').type('Automation Test')
    })
    cy.get("[type*='button']").should('exist').and('be.disabled')
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    cy.contains("Surname").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').type('1')
    })
    cy.get("[type*='button']").should('exist').and('be.disabled')
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    //
    cy.contains("Email address").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').type('automationtest@gmail.com')
    })
    cy.get("[type*='button']").should('exist').and('be.disabled')
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    //
    cy.contains("Phone Number").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').type('07087654678')
    })
    cy.get("[type*='button']").should('exist').and('be.disabled')
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    //
    cy.contains("Job title").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').type('Automation Personnel')
    })
    cy.get("[type*='button']").should('exist').and('be.disabled')
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    //
    cy.contains("Department").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').click()
    })
    cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').within(()=> {
      cy.get("[data-testid*='dropdown-option-2']").should('contain', 'COMPLIANCE').click()
    }) //Compliance input
    cy.contains("Department").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').and('contain', 'COMPLIANCE')
    }) //Placeholder check
    cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']").should('exist').and('contain', 'Select all').and('not.contain', 'Deselect all')
    cy.get("[id*='permissions-scroll-container']").eq(0).within(()=> {
      cy.get("[class*='flex items-center gap-x-2']").should('have.length.at.least', 2).should('be.visible')
      cy.get("[class*='peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#D4D4D8] checked:border-black checked:bg-black']").should('have.length.at.least', 2).should('be.visible')
    })
    cy.get("[type*='button']").should('exist').and('be.disabled')
    //
    cy.contains("Level").parent().within(()=> {
      cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('exist').click()
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
    })

    //uncheck checkboxes
    cy.get("[class*='flex items-center gap-x-2']").eq(0).click()
    cy.get("[class*='text-[12px] text-[#71717A]']").should('have.length.at.most', 1)
    cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']").should('exist').and('contain', 'Deselect all').and('not.contain', 'Select all')
    cy.get("[class*='flex items-center gap-x-2']").eq(0).click()
    cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']").should('exist').and('contain', 'Select all').and('not.contain', 'Deselect all')


    //Role name
    cy.get("[class*='w-full mb-4']").should('exist').within(()=> {
      cy.get("[class*='relative']").should('exist')
      cy.contains('Role name')
    })
  })
})