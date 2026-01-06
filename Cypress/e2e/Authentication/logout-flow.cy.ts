import { adminEmail, adminPassword } from "@support/env"
describe('Log out flow', () => {
  const otpCode = '000000'

  beforeEach(() => {
    cy.visit("/");
    cy.window().then(win => win.sessionStorage.clear())
  })

  function handleOtp() {
    const otpSelector = "[class*='cursor-text']"
    cy.get('body').then($body => {
      if ($body.find(otpSelector).length) {
        cy.get(otpSelector, { timeout: 10000 }).should('be.visible').type(otpCode)
      } else {
        cy.log('No OTP field found, skipping OTP input.')
      }
    })
  }

  it('Admin logout/Re-login flow', () => {
    // Login/
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[type$='submit']").click()

    // New device detected
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    handleOtp()
    cy.get("[class*='animate-spin']").should('exist')

    // Logout
    cy.get("[class$='flex h-[48px] w-max items-center justify-between gap-2 border border-[#470C00] bg-[#470C00] rounded-full p-3 text-sm font-medium hover:bg-[#452a25] mb-1']").click()
    cy.contains('Logout').click()
  })
})

