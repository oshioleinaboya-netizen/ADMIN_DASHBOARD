describe('template spec', () => {
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
  it('Get particular a customer - Account Information UI Check', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Account Information').click()
      cy.wait(8000)
    })
    cy.url().should('include', '/account-information')
    cy.get("[class$='flex justify-between items-center']").within(()=> {
      cy.contains('Rank')
      cy.contains('Customers')
      cy.wait(8000)
    })
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Naira Account balance')
      cy.contains('Ledger balance')
      cy.contains('Account Name')
      cy.contains('Bank')
      cy.contains('Account No')
      cy.contains('Main Account')
      // <> Table ---------------------------
      /*cy.contains('AMOUNT');
      cy.contains("FEES");
      cy.contains('REFERENCE');
      cy.contains('STATUS');
      cy.contains('DATE');
      cy.contains('BALANCE BEFORE');
      cy.contains('BALANCE AFTER');
      cy.contains('DESTINATION NAME');
      cy.contains('DESTINATION ACCOUT');
      cy.contains('DESTINATION BANK');
      cy.contains('FLAG');
      cy.get("[class$='w-full border-collapse border-none'] tbody tr").should('not.be.empty')*/
      // </>

      cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
        cy.contains('Sort').should('be.visible');
        cy.get("[alt$='sort icon']").should('exist');
        cy.root().should('not.be.disabled');
      });
      cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
        cy.contains('Filter').should('be.visible');
        cy.get("[alt$='filter icon']").should('exist');
        cy.root().should('not.be.disabled');
      });
      cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
        cy.contains('Export').should('be.visible');
        cy.root().should('not.be.disabled');
      });
      cy.get("[class$='w-1/3 flex']").should('exist').and('not.be.disabled');
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'Showing')
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'entries')
      cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible')
      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist')
        cy.get("[aria-label$='Next page']").should('not.be.disabled')
        cy.get("[aria-current$='page']").should('not.be.disabled')
      })
      cy.contains('Customer Management')
      cy.get("[alt$='profile image']").should('be.visible')
      cy.get("[class$='font-bold text-[20px]']").should('be.visible')
      cy.get("[class$='text-[24px] font-bold']").should('be.visible')
    })
  })
})