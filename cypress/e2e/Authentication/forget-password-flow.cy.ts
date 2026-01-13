import { adminEmail } from "cypress/support/env";
describe('Forget password flow', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.window().then((win) => {
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
    });
  }) //
  it('Forget password flow - Email invalidation', () => {
    cy.get("[class$='text-sm text-customBlue hover:text-blue-700']").click()
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('be.visible').within(() => {
      cy.get("[data-nimg$='1']").should('be.visible')
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('be.visible').and('contain', 'Reset your password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('be.visible').and('contain', "Enter your registered email address and we'll send you a link to reset your password")
      cy.get("[name$='email']").type('hhdhdhdhdhhgmail.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Invalid email address')
    })
  })
  it('Forget password flow - Email invalidation', () => {
    cy.get("[class$='text-sm text-customBlue hover:text-blue-700']").click()
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('be.visible').within(() => {
      cy.get("[data-nimg$='1']").should('be.visible')
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('be.visible').and('contain', 'Reset your password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('be.visible').and('contain', "Enter your registered email address and we'll send you a link to reset your password")
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Email is required')
      cy.get("[name$='email']").type('dhdhdhdhdhgmail.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Invalid email address')
      cy.get("[name$='email']").clear()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Email is required')
      cy.get("[name$='email']").type('dhdhdhdg@.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Invalid email address')
      cy.get("[name$='email']").clear()
      cy.get("[name$='email']").type('hdhdhdhgmail.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Invalid email address')
      cy.get("[name$='email']").clear()
      cy.get("[name$='email']").type('shshhsing@gmailcom')
      cy.get("[type$='submit']").click()
      cy.get("[class$='w-full text-red-500 text-sm text-center']").should('contain', 'email must be an email')
    })
  })
  it('Forget password flow - Admin user does not exist', () => {
    cy.get("[class$='text-sm text-customBlue hover:text-blue-700']").click()
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('be.visible').within(() => {
      cy.get("[data-nimg$='1']").should('be.visible')
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('be.visible').and('contain', 'Reset your password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('be.visible').and('contain', "Enter your registered email address and we'll send you a link to reset your password")
      cy.get("[name$='email']").type('hdhhdjj@gmail.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='w-full text-red-500 text-sm text-center']").should('contain', 'Admin user not found')
    })
  })
  it('Forget password flow', () => {
    cy.get("[class$='text-sm text-customBlue hover:text-blue-700']").click()
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('be.visible').within(() => {
      cy.get("[data-nimg$='1']").should('be.visible')
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('be.visible').and('contain', 'Reset your password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('be.visible').and('contain', "Enter your registered email address and we'll send you a link to reset your password")
      cy.get("[name$='email']").type(adminEmail)
      cy.get("[type$='submit']").click()
    })
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").within(() => {
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('contain', 'Reset password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('contain', 'We have sent a reset password link to').within(() => {
        cy.get("[class$='font-semibold']").should('be.visible')
      })
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('contain', '@')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('contain', '.com')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('contain', '@')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('contain', '.com')
      cy.get("[data-nimg$='1']").should('be.visible')
      cy.get("[class$='text-gray-600 text-sm md:text-base']").should('contain', 'Follow the instruction in the email to reset your password.')
      cy.get("[type$='submit']").click()
    })
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('not.exist')
  })
})