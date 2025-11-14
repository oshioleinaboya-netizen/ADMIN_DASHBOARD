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

describe('Login flow', ()=> {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('Admin log in - Valid credentials | OTP Validation', () => {
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("qa@userank.com")
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.get("[class$='relative z-[1] flex justify-between gap-4 mb-6 outline-none cursor-text']").type("111111")
    cy.get("[class$='w-full sm:px-0 sm:max-w-[460px] sm:mx-auto']").should('contain', 'Invalid Otp')
  })
  it('Admin log in - Valid credentials', () => {
    cy.get("[type$='text']").type("engineering2@heymoni.com")
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.get("[class$='relative z-[1] flex justify-between gap-4 mb-6 outline-none cursor-text']").type("000000")
    cy.url().should('include', '/customers')
  })
})

describe('Log out flow', ()=> {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('Admin logout/Re-login flow', () => {
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000');
      } else {
        cy.log('No OTP field found, skipping OTP input.');
      }
      cy.get("[class*='animate-spin']").should('be.visible')
    });
    cy.get("[class$='flex h-[48px] w-max items-center justify-between gap-2 border border-[#470C00] bg-[#470C00] rounded-full p-3 text-sm font-medium hover:bg-[#452a25] mb-1']").click()
    cy.get("[class$='p-3 w-full bg-white rounded-md hover:cursor-pointer hover:bg-[#452a25] hover:text-white']").within(()=> {
      cy.contains('Logout').click()
    })
    // Re-Login User ---------------------------
    cy.get("[class$='flex flex-col gap-y-4 items-start justify-start p-4']")
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("qa@userank.com")
    cy.get("[type$='submit']").click()
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000');
      } else {
        cy.log('No OTP field found, skipping OTP input.');
      }
      cy.get("[class*='animate-spin']").should('be.visible')
    });
  })
})

describe('Password visibility toggle', () => {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('should toggle password visibility when clicking the button', () => {
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[class$='relative -top-[11px] -right-[6px]']").should('be.visible')
    cy.get("[alt$='show password icon']").click()
    cy.get("[class$='relative  ']").should('be.visible')
  });
});

describe('Forget password flow', ()=> {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('Forget password flow - Email invalidation', () =>{
    cy.get("[class$='text-sm text-customBlue hover:text-blue-700']").click()
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('be.visible').within(()=> {
      cy.get("[data-nimg$='1']").should('be.visible')
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('be.visible').and('contain', 'Reset your password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('be.visible').and('contain', "Enter your registered email address and we'll send you a link to reset your password")
      cy.get("[name$='email']").type('engineering2gmail.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Invalid email address')
    })
  })
  it('Forget password flow - Email invalidation', () =>{
    cy.get("[class$='text-sm text-customBlue hover:text-blue-700']").click()
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('be.visible').within(()=> {
      cy.get("[data-nimg$='1']").should('be.visible')
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('be.visible').and('contain', 'Reset your password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('be.visible').and('contain', "Enter your registered email address and we'll send you a link to reset your password")
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Email is required')
      cy.get("[name$='email']").type('engineering2gmail.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Invalid email address')
      cy.get("[name$='email']").clear()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Email is required')
      cy.get("[name$='email']").type('engineering@.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Invalid email address')
      cy.get("[name$='email']").clear()
      cy.get("[name$='email']").type('engineering2gmail.com')
      cy.get("[type$='submit']").click()
      cy.get("[class$='text-red text-[14px]']").should('contain', 'Invalid email address')
      cy.get("[name$='email']").clear()
      cy.get("[name$='email']").type('engineering@gmailcom')
      cy.get("[type$='submit']").click()
      cy.get("[class$='w-full text-red-500 text-sm text-center']").should('contain', 'email must be an email')
    })
  })
  it('Forget password flow - Admin user does not exist', ()=>{
    cy.get("[class$='text-sm text-customBlue hover:text-blue-700']").click()
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('be.visible').within(()=> {
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
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").should('be.visible').within(()=> {
      cy.get("[data-nimg$='1']").should('be.visible')
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('be.visible').and('contain', 'Reset your password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('be.visible').and('contain', "Enter your registered email address and we'll send you a link to reset your password")
      cy.get("[name$='email']").type('engineering2@heymoni.com')
      cy.get("[type$='submit']").click()
    })
    cy.get("[class$='relative flex flex-col bg-white w-[592px] rounded-[14px] md:rounded-[18px] h-full']").within(()=> {
      cy.get("[class$='font-semibold text-[1.75rem] md:text-[2rem]']").should('contain', 'Reset password')
      cy.get("[class$='text-gray-600 text-sm md:text-base mt-2']").should('contain', 'We have sent a reset password link to').within(()=> {
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

describe('Password invalidity attempts', () => {
  beforeEach (()=>{
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  })
  it('Password invalidity attempts', () => {
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
    cy.get("[type$='submit']").click()
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").should('contain', 'Invalid email or password. You have 2 attempt(s) left.')
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").within(()=> {
      cy.get("[alt$='caution icon']").should('be.visible')
    })
    cy.get("[type$='submit']").click()
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").should('contain', 'Invalid email or password. You have 1 attempt(s) left.')
    cy.get("[type$='submit']").click()
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").should('contain', 'Account is locked due to too many failed login attempts. Please contact admin.')
    cy.get("[type$='password']").clear()
    cy.get("[type$='password']").type("myAwesomeP@ssw0rd")
    cy.get("[type$='submit']").click()
    cy.get("[class$='w-full sm:max-w-[460px] mx-auto']").should('contain', 'Account is locked due to too many failed login attempts. Please contact admin.')
  });
});

describe('Resend OTP flow', ()=> {
  it.only('Resend OTP', ()=> {
  cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.wait(3000)
    cy.get("[class$='self-center space-y-2']").should('exist').within(()=>{
      cy.get("[class$='font-semibold']").should('be.visible')
    })
    cy.wait(300000)
    cy.contains('Resend OTP').click()
    cy.contains('Resending')
    cy.wait(2000)
    cy.get("[class$='self-center space-y-2']").should('exist').within(()=>{
      cy.get("[class$='font-semibold']").should('be.visible')
    })
  })
})