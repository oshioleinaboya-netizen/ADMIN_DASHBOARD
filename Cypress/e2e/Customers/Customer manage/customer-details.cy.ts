describe('Customer Details', ()=> {
  const customerDetails: string[] = [
    'First name',
    'Middle name',
    'Surname',
    'Customer ID',
    'Date Created',
    'Gender',
    'Marital status',
    'Nationality',
    'Birth country',
    'Birth state',
    'Date of birth',
    'Referred by',
    'Monitag', 
    'Status',
    '1.0 migration status',
    'Manual verification',
    'Business domain',
    'Highest educational degree',
    'Employment status',
    'Name of school',
    'Course of study',
    'School address',
    'Home address'
  ]
  const tableHeaders: string[] = [
    'Name',
    'Name/Value',
    'Document',
    'Country',
    'Verification status',
    'Verification type',
    'Action'
  ]
  beforeEach(() => {
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
    cy.get("[type$='submit']").click()
    /*cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()*/
    cy.wait(2000);
    cy.get("[class$='self-center space-y-2']").should('exist').within(()=>{
      cy.get("[class$='font-semibold']").should('be.visible')
    })
 
    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000');
      } else {
        cy.log('No OTP field found, skipping OTP input.');
      }
      cy.get("[class*='animate-spin']").should('be.visible')
    });
    cy.wait(3000)
    cy.url().should('include', '/customers')
    cy.wait(8000)
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('bills billers')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.url().should('include', '/customers/')
  })
  it('Get particular a customer - Details UI Check', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      customerDetails.forEach((customerDetail) => {
        cy.contains(customerDetail).should('be.visible');
      });
      cy.contains("KYC").should('be.visible')
      cy.contains("Customer Management").should('be.visible')
      cy.get("[alt$='profile image']").should('be.visible')
      cy.contains("Customer's Details").should('be.visible')
      //cy.get("[class$='text-white bg-[#F31260] rounded-full px-6 py-1 w-min h-min text-[10px] text-nowrap']")
      cy.get("[type$='button']").should('contain', 'Customer Actions').and('be.visible')
      cy.get("[class$='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-[#17C964] text-white px-[12px] py-[6px] px-5']")
      cy.contains('Details')
      cy.contains('Account Information')
      cy.contains('Fraud')
      cy.contains('Loans')
      cy.contains('Savings')
      cy.contains('Next of kin details')
      cy.contains('Phone number')
      cy.contains('Name')
      cy.contains('Email address')
      cy.contains('Relationship')
      tableHeaders.forEach((tableHeader) => {
        cy.contains(tableHeader).should('be.visible');
      });
    })
    cy.contains('Customer Management')
    cy.get("[alt$='profile image']").should('be.visible')
    cy.get("[class$='flex items-center']").within(()=> {
      cy.contains('Rank')
      cy.contains('Customers')
      cy.wait(6000)
    })
  })
  it('Customer ID check', ()=> {
    cy.get("[class$='font-medium lg:text-base text-sm']").eq(3).invoke('text').then((customerId) => {
      const trimmedId = customerId.trim()
      cy.url().should('include', `/${trimmedId}/`)
    })    
  })
})