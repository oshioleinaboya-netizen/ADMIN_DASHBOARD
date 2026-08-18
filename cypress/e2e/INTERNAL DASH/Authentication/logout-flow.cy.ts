import { adminEmail, adminPassword,stagingOtp, prodLink, prodEmail, prodPassword } from "cypress/support/env"
describe('Log out flow', () => {
  const otpCode = stagingOtp

  beforeEach(() => {
    cy.visit(prodLink);
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
    const otpSelector = "[class$='relative z-[1] flex justify-between gap-4 mb-6 outline-none cursor-text']"
    const loginStartedAt = Date.now();
    // Login/
    cy.get("[type$='text']").type(prodEmail)
    cy.get("[type$='password']").type(prodPassword)
    cy.get("[type$='submit']").click()

    //Handle New device detected
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']", { timeout: 10000 })
    cy.contains('Continue').click()

    cy.get(otpSelector).should('be.visible');

    cy.getOtpFromEmail({ afterTimestamp: loginStartedAt, timeout: 30000, interval: 3000 }).then((otp) => {
      cy.get(otpSelector).type(otp);
      // cy.get('#otp-submit').click();
    });

    cy.url().should('include', '/admin/dashboard');

    // Logout
    cy.get("[class$='flex h-[48px] w-max items-center justify-between gap-2 border border-[#470C00] bg-[#470C00] rounded-full p-3 text-sm font-medium hover:bg-[#452a25] mb-1']").click()
    cy.contains('Logout').click()
  })
})

