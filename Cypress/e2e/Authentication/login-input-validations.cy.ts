describe('Admin Login - Input validations', () => {
  // Input Validations-------------------------------------------------------
  it.only('Admin log in - Invalid credentials (No @)', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("heymoni.com")
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='submit']").click()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'Invalid')
  })
  it('Admin log in - Invalid credentials (No .com)', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("heymo@nicom")
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd") 
    cy.get("[type$='submit']").click()
    cy.get("[class$='text-nowrap text-[13px] font-regular']").should('be.visible').and('contain', 'email must be an email')
  })
  it('Admin log in - Invalid credentials (@.com)', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("heymoni@.com") //
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd") 
    cy.get("[type$='submit']").click()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'Invalid')
  })
  //------------------------------------------------------
  it('Admin log in - Incorrect credentials (Email)', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("engineering90@heymoni.com")
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd") //For sign in, why does it show "Password must be 8 characters"?
    cy.get("[type$='submit']").click()
    cy.get("[class$='text-nowrap text-[13px] font-regular']").should('be.visible').and('contain', 'Your credentials are incorrect')
  })
  it('Admin log in - Incorrect credentials (Password)', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("engineering2@heymoni.com")
    cy.get("[type$='password']").type("myAwesomeP@ssw0r") //For sign in, why does it show "Password must be 8 characters"?
    cy.get("[type$='submit']").click()
    cy.get("[class$='text-nowrap text-[13px] font-regular']").should('be.visible').and('contain', 'Invalid email or password')
  })
  //-----------------------------------------------------
  it('Admin log in - Missing credentials (2)', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='submit']").click()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
  })
  it('Admin log in - Missing credential (Password)', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("engineering2@heymoni.com")
    cy.get("[type$='submit']").click()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
  })
  it('Admin log in - Missing credential (Email)', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='submit']").click()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
  })
  //Password/email clear out state------------------------------------------------------
  it('Admin log in - Clear out state 1', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("engineering90@heymoni.com")
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='submit']").click()
    cy.get("[type$='text']").clear()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
  })
  it('Admin log in - Clear out state 2', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("engineering2@heymoni.com")
    cy.get("[type$='password']").type("myAwesomeP@ssw0r")
    cy.get("[type$='submit']").click()
    cy.get("[type$='password']").clear()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
  })
  it('Admin log in - Clear out state 3', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='submit']").click()
    cy.get("[type$='text']").type("engineering2@heymoni.com")
    cy.get("[type$='password']").clear()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='password']").clear()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
  })
  it('Admin log in - Clear out state 4', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='text']").type("engineering2@heymoni.com")
    cy.get("[type$='submit']").click()
    cy.get("[type$='password']").clear()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='password']").clear()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
  })
  it('Admin log in - Clear out state 5', () => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='submit']").click()
    cy.get("[type$='password']").clear()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
    cy.get("[type$='text']").type("engineering2@heymoni.com")
    cy.get("[type$='password']").clear()
    cy.get("[class$='text-red text-[14px]']").should('be.visible').and('contain', 'is required')
  })
})