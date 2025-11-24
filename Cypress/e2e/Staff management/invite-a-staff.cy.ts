import { adminEmail, adminPassword, rankLink } from "@support/env";
import { faker, fi } from '@faker-js/faker';

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
    cy.url({ timeout: 30000 }).should('include', '/staff-mgt')
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
  it('Functionality check', ()=> {
    cy.contains('Invite a staff').click()
    cy.url({ timeout: 30000 }).should('include', '/invite')
    //Go-back feature
    cy.get("[class*='flex items-center gap-x-2']").eq(0).click()
    cy.url({ timeout: 30000 }).should('include', '/staff-mgt')
    cy.wait(5000)

    //Re-access invite staff page
    cy.contains('Invite a staff').click()
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    cy.get("[class*='border-[#D4D4D8] border px-3 p-1 text-black text-[14px] rounded-lg hover:cursor-pointer']").should('exist').and('contain', 'Deselect all').and('not.contain', 'Select all')
    
    //Input fields functionality check
    const firstName: string = faker.person.firstName();
    cy.contains("First name").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter first name"]`).should('exist')
      }).type(firstName)
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    const surName: string = faker.person.lastName();
    cy.contains("Surname").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter surname"]`).should('exist')
      }).type(surName)
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    //
    const email = `user_${Date.now()}@test.com`; // Unique email address
    cy.contains("Email address").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter email address"]`).should('exist')
      }).type(email)
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    //
    const phone = '080' + Math.floor(10000000 + Math.random() * 90000000); // Unique Nigerian phone number
    cy.contains("Phone Number").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter phone number"]`).should('exist')
      }).type(phone)
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    //
    cy.contains("Job title").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter job title"]`).should('exist')
      }).type('Automation Personnel')
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('be.disabled');
    }); //Button enabled check and click
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    //
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
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
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
    .filter(':contains("Invite Staff")').eq(0)
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
    .filter(':contains("Invite Staff")').eq(0)
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

    // Sucessful invite page check
    cy.get("[class*='flex flex-col inset-0 h-screen fixed z-50 bg-[#FAFAFA] w-screen p-10']")
      cy.get("[class*='font-semibold text-[24px] text-center']").should('contain', 'Invitation sent successfully')
      cy.get("[class*='text-[#646464] text-center']").eq(0).within(()=> {
        cy.get("[class*='text-black']").should('be.visible')
        cy.contains('You have successfully sent an invite to')
        cy.contains('This link will expire in 24hours if they do not accept the invitation')
      })
      cy.get("[class*='flex justify-end p-4 hover:cursor-pointer items-center']").should('be.visible')
      cy.get("[alt*='document logo']").should('be.visible')
      cy.contains('Ok').click()
      cy.wait(5000)

    //Table check for new staff
    cy.get("[class*='focus-visible:outline-none ml-2 w-full']").type(firstName + ' ' + surName)
    cy.wait(3000)

    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).first().within(() => {
      cy.get('td').eq(0).should('contain', firstName + ' ' + surName);
      cy.get('td').eq(5).should('contain', 'INVITED');
      cy.get('td').eq(3).should('contain', 'finance');
      cy.get('td').eq(2).should('contain', email);
    })

    //Role name
    /*cy.contains("Role Name").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=>{
        cy.get(`[placeholder$="Enter role name"]`).should('exist')
      })
    })
    cy.contains("Role Name").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').type('Test')
    })*/
  })
  it('Staff email already exist - Email', ()=> {
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
    }); //Button enabled check and click
    cy.wait(3000)
  })
  it('Staff email already exist - Phone number', ()=> {
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
    const email = `user_${Date.now()}@test.com`; // Unique email address
    cy.contains("Email address").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter email address"]`).should('exist')
      }).type(email)
    })
    cy.get("[class*='text-[12px] text-[#71717A]']").eq(1).should('exist').and('contain', 'No permissions available for selected team')
    
    // Phone number input
    cy.contains("Phone Number").parent().within(()=> {
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter phone number"]`).should('exist')
      }).type('08049994882')
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
      .should('be.visible').and('contain', 'Phone is already in use.')
    })
    const phone = '080' + Math.floor(10000000 + Math.random() * 90000000); // Unique Nigerian phone number
    cy.contains("Phone Number").parent().within(()=> {
      cy.get("[class*='relative']").clear()
      cy.get("[class*='relative']").should('exist').within(()=> {
        cy.get(`[placeholder$="Enter phone number"]`).should('exist')
      }).type(phone)
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .scrollIntoView({ ensureScrollable: false })
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).click();
    }); //Button enabled check and click
    cy.wait(3000)
  })
  it.only('Input validations', ()=> {
    //No .com
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
      }).type('cxadmin@blondmail')
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
      .should('be.visible').and('contain', 'email must be an email')
    })

    const invalidEmails = [
      "abc", 
      "abc@", 
      "abcgmail.com", 
      "abc@gmail.", 
      "@gmail.com",
      "abc@@gmail.com",
      "abc@gmail..com"
    ];

    invalidEmails.forEach((invalidEmail) => {
      cy.contains("Email address").parent().within(()=> {
        cy.get(`input[placeholder="Enter email address"]`).should('exist')
        .clear()
        .type(invalidEmail)
      })
      cy.get("[class*='text-[14px] text-red-500 pt-1']").should('contain', 'Invalid email')
      cy.get(`[type*='button']`)
        .filter(':contains("Invite Staff")').eq(0)
        .scrollIntoView({ ensureScrollable: false })
        .should('have.length', 1)
        .then(($matched) => {
          cy.wrap($matched).should('be.disabled');
        }); //Button enabled check and click
      cy.get("[class*='bg-[#FEE7EF] flex gap-x-8 justify-between p-2 rounded-lg mb-6 undefined']").eq(0).within(()=> {
        cy.get("[class*='flex items-center gap-x-1 ']")
        .scrollIntoView({ ensureScrollable: false })
        .should('be.visible').and('contain', 'email must be an email')
      })  
    })

    //Final correct format check
    const email = `user_${Date.now()}@test.com`; // Unique email address
    cy.contains("Email address").parent().within(()=> {
      cy.get(`input[placeholder="Enter email address"]`).should('exist')
      .clear()
      .type(email)
    })
    cy.get(`[type*='button']`)
    .filter(':contains("Invite Staff")').eq(0)
    .scrollIntoView({ ensureScrollable: false })
    .should('have.length', 1)
    .then(($matched) => {
      cy.wrap($matched).should('not.be.disabled').click();
    }); //Button enabled check and click
    cy.wait(3000)
  })
})