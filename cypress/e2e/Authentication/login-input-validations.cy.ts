import { adminEmail, adminPassword } from "cypress/support/env"

describe('Admin Login - Input validations', () => {

  beforeEach(() => {
    cy.visit("/");
  })

  // Helper to type credentials and submit/
  const submitLogin = (email: string, password: string) => {
    if (email) cy.get("[type$='text']").clear().type(email)
    if (password) cy.get("[type$='password']").clear().type(password)
    cy.get("[type$='submit']").click()
  }

  const assertErrorContains = (selector: string, text: string) => {
    cy.get(selector, { timeout: 10000 }) // wait up to 10s
      .should('be.visible')
      .and('contain', text)
  }

  it('Admin log in - Invalid credentials (No @)', () => {
    submitLogin("heymoni.com", adminPassword)
    assertErrorContains("[class$='text-red text-[14px]']", 'Invalid')
  })

  it('Admin log in - Invalid credentials (No .com)', () => {
    submitLogin("heymo@nicom", adminPassword)
    assertErrorContains("[class$='text-nowrap text-[13px] font-regular']", 'email must be an email')
  })

  it('Admin log in - Invalid credentials (@.com)', () => {
    submitLogin("heymoni@.com", adminPassword)
    assertErrorContains("[class$='text-red text-[14px]']", 'Invalid')
  })

  it('Admin log in - Incorrect credentials (Email)', () => {
    submitLogin("gsghshhsnn90@heyoni.com", adminPassword)
    assertErrorContains("[class$='text-nowrap text-[13px] font-regular']", 'Your credentials are incorrect')
  })

  it('Admin log in - Incorrect credentials (Password)', () => {
    submitLogin(adminEmail, "hdhdjdjdjjdj")
    assertErrorContains("[class$='text-nowrap text-[13px] font-regular']", 'Invalid email or password')
  })

  it('Admin log in - Missing credentials', () => {
    submitLogin("", "")
    assertErrorContains("[class$='text-red text-[14px]']", 'is required')
  })

  it('Admin log in - Missing password', () => {
    submitLogin(adminEmail, "")
    assertErrorContains("[class$='text-red text-[14px]']", 'is required')
  })

  it('Admin log in - Missing email', () => {
    submitLogin("", adminPassword)
    assertErrorContains("[class$='text-red text-[14px]']", 'is required')
  })

  // Clear out state tests
  it.only('Admin log in - Clear out state tests', () => {
    const cases = [
      { email: "hshshhshs90@heyoni.com", password: adminPassword, clear: 'text', expectedError: 'is required' },
      { email: adminEmail, password: "hdhjsnjjnhhdn", clear: 'password', expectedError: 'is required' },
      { email: "", password: "", clear: 'both', expectedError: 'is required' },
      { email: adminEmail, password: "", clear: 'password', expectedError: 'is required' },
      { email: "", password: adminPassword, clear: 'both', expectedError: 'is required' },
    ]

    cases.forEach((c) => {
      submitLogin(c.email, c.password)

      if (c.clear === 'text' || c.clear === 'both') {
        cy.get("[type$='text']").clear()
      }
      if (c.clear === 'password' || c.clear === 'both') {
        cy.get("[type$='password']").clear()
      }

      assertErrorContains("[class$='text-red text-[14px]']", c.expectedError)
    })
  })
})
