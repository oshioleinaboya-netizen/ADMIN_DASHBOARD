describe('Customer Management - UI', () => {
  beforeEach(() => {
    //Authentication check - Login
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    /*cy.window().then((win) => {
      win.sessionStorage.clear();
    });*/
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
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
    cy.wait(10000)
    cy.location().then((loc) => {
      cy.log('Current URL:', loc.href)
    })
    cy.url({ timeout: 30000 }).should('include', '/customers')
  })
  it('Should have all expected clickable components visible', () => {
    // Wait for page readiness
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 10000 }).should('be.visible');

    // Assertions
    cy.get('body').within(() => {
      cy.get("[alt$='Rank Logo']", { timeout: 10000 }).should('exist');

      cy.get("[data-testid$='nav-link-customers']", { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Customers')
        .and('not.be.disabled');

      cy.get("[data-testid$='nav-link-text-staff-management']")
        .should('be.visible')
        .and('not.be.disabled');

      cy.get("[data-testid$='nav-link-text-fraud-management']")
        .should('be.visible')
        .and('not.be.disabled');

      cy.get("[data-testid$='nav-link-text-loan']")
        .should('be.visible')
        .and('not.be.disabled');

      cy.get("[class$='flex h-[48px] w-max items-center justify-between gap-2 border border-[#470C00] bg-[#470C00] rounded-full p-3 text-sm font-medium hover:bg-[#452a25] mb-1']")
        .should('be.visible')
        .and('not.be.disabled');
    });
  });
  it('Customer management UI - 1', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[class$='rounded-lg bg-white transition-shadow duration-200 border border-gray-200 p-4 flex py-8 mb-8']")
      .should('exist')
      .within(() => {
        cy.get("[class$='ml-8 pr-8']")
          .should('be.visible')
          .and('contain', 'Tier 0')
          .and('contain', 'Tier 1')
          .and('contain', 'Tier 2')
          .and('contain', 'Tier 3');
        cy.get("[class$='ml-8 border-r pr-8']").should('contain', 'Onboarded users');
        cy.get("[class$='ml-8 border-r pr-8']").should('contain', 'Total customers');
      });

    cy.get("[class$='font-bold text-[14px]']").should('be.visible');
    cy.get("[class*='flex items-center']").should('be.visible');
    cy.get("[alt$='right arrow']").should('be.visible');
    cy.get("[class$='text-[#71717A]']").should('contain', 'Rank');
    cy.get("[class$='text-[#1E4D37] hover:cursor-pointer']").should('be.visible');
    cy.get("[class$='__className_b9c7ce antialiased bg-[#fafafa]']")
      .should('contain', 'Create a client')
      .and('contain', 'Drafts')
      .and('not.be.disabled');
  }); //

  // CUSTOMERS UI 2 ===
  it('Customer management UI - 2', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[class$='font-bold text-[14px]']")
      .should('be.visible')
      .and('contain', 'Total number of customers by period');
    cy.get("[class$='font-bold text-[30px]']").should('be.visible');
    cy.get("[class$='__className_b9c7ce antialiased bg-[#fafafa]']")
      .should('contain', 'Active clients');

    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Sort').should('be.visible');
      cy.get("[alt$='sort icon']").should('exist');
      cy.contains('Filter').should('be.visible');
      cy.get("[alt$='filter icon']").should('exist');
      cy.contains('Export').should('be.visible');
    });

    cy.get("#search-bar-button").should('be.visible').and('not.be.disabled');
  });

  // CUSTOMERS MANAGEMENT UI TABLE ===
  it('Customer management UI - Table', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[data-slot$='table-container'] thead tr th")
      .should('have.length', 8)
      .and('be.visible')
      .then(($th) => {
        const headers = [
          'Phone number',
          "Customer's Name",
          'Email address',
          'Created At',
          'Gender',
          'Nationality',
          'Place of birth',
          'Monitag',
        ];
        headers.forEach((header, i) => {
          expect($th.eq(i)).to.contain(header);
        });
      });

    cy.get("[data-slot$='table-container'] tbody tr")
      .should('have.length.at.most', 20)
      .first()
      .within(() => {
        cy.get('td').each(($td) => {
          cy.wrap($td).should('not.be.empty');
        });
      });
  });

  // CUSTOMERS UI PAGINATION ===
  it('Customer UI - Pagination', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[class$='flex items-center justify-between w-full']").within(() => {
      cy.get("[class$='flex items-center gap-4']").within(() => {
        cy.contains('Show').should('be.visible');
        cy.get("[class$='text-sm text-gray-600']").should('exist');
      });

      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist');
        cy.get("[aria-label$='Next page']").should('not.be.disabled');
        cy.get("[aria-current$='page']").should('not.be.disabled');
      });
    });
  })
})