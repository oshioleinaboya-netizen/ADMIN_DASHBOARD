describe('List of Users', ()=> {
  let b: string = 'Boy'
  /* BDD - "Given - being in the Customers area, 
Then - I should be able to see a list of all registered users/clients (With all associated column details - i.e. phone number, e-mail, etc)" 
Then - I should be able to see the amount of customer list table pages. And upon navigation, I should be able to see the particular list page I am at every given page
Then - I should be able to see the total number of customers, and the total number of customers should correlate with the number of customers from the list
Note - the total number of customers shown by the pagination indication below the table should correlate with the number of customer on each page and their serial (focus - 1-20 out of 900 entries. Then the number of entries should be 20 on that particular page. And the serial should be correctly 1 to 20)
Then - I should be able to slide through the whole list (That is, each individual customer list page contains 10 customers. You have to go to page 2,3,4,... and so on. In order to see the rest part of the customer list, by using the navigations provided - both by tapping th numbers and the directional buttons [<], [>]).
*/
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
  })
  it('Total users', ()=> {
    cy.get('p.font-bold.text-2xl')
    .first() // gets the first match if there are multiple
    .invoke('text')
    .then((totalText) => {
      const totalCustomers = Number(totalText.replace(/,/g, '').trim()); // convert "1,419" → 1419

      // Now get the text showing total entries at the bottom
      cy.contains('Showing')
        .invoke('text')
        .then((entriesText) => {
          // Extract the number after "of"
          const match = entriesText.match(/of\s([\d,]+)/); //Extracts number right after of
          expect(match, 'should contain "of ### entries"').to.not.be.null;
          const totalEntries = Number(match[1].replace(/,/g, ''));

          // Compare both
          expect(totalEntries).to.eq(totalCustomers);
        });
    });
  })
  it('Next page/Previous page navigation', ()=> {
    cy.get("[aria-label$='Next page']").click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20).first().within(() => {
      cy.get('td').eq(0).should('not.contain', '+2348123444444')
    })
    // Page navigation indication
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 21 - 40')
    cy.get("[aria-label$='Previous page']").click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20).first().within(() => {
      cy.get('td').eq(0).should('contain', '+2348123444444')
    })
    // Page navigation indication
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 1 - 20')
  })
  it('Mid point between table pages', ()=> {
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20).first().within(() => {
      cy.get('td').eq(1).should('contain', 'Ayodeji Samuel Ogundijo')
    })
    cy.get("[aria-hidden$='true']").click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20).first().within(() => {
      cy.get('td').eq(1).should('not.contain', 'Ayodeji Samuel Ogundijo')
    })
    // Midpoint "..." click - Page land check
    cy.get("[data-testid$='pagination-button-1']").click()
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-hidden$='true']").click()
    cy.get("[aria-current$='page']")
      .invoke('text')
      .then((text) => {
        const currentPage = Number(text.trim());
        expect(currentPage).to.be.oneOf([33, 34, 35, 36, 37]); // any valid values
      });
  })
  it.only('Previous page disabled - First page | next page disabled - Last page', ()=> {
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-label$='Previous page']").should('be.disabled')
    cy.get("[data-testid$='pagination-button-72']").click()
    cy.get("[aria-current$='page']").should('contain', 71)
    cy.get("[aria-label$='Next page']").should('be.disabled')
    cy.get("[aria-label$='Previous page']").should('not.be.disabled')
  })
  it('Table page list size', ()=> {
    cy.get("[data-testid$='table-page-size-select']").select("Show 10");
    cy.wait(6000);

    // -------------- 10
    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 10) {
        expect(rowCount).to.eq(10);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 10')
      } else if (rowCount < 10) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 20
    cy.get("[data-testid$='table-page-size-select']").select("Show 20");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 20) {
        expect(rowCount).to.eq(20);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 20')
      } else if (rowCount < 20) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 50
    cy.get("[data-testid$='table-page-size-select']").select("Show 50");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 50) {
        expect(rowCount).to.eq(50);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 50')
      } else if (rowCount < 50) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 100
    cy.get("[data-testid$='table-page-size-select']").select("Show 100");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 500) {
        expect(rowCount).to.eq(500);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 100')
      } else if (rowCount < 500) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 200
    cy.get("[data-testid$='table-page-size-select']").select("Show 200");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 200) {
        expect(rowCount).to.eq(200);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 200')
      } else if (rowCount < 200) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 500
    cy.get("[data-testid$='table-page-size-select']").select("Show 500");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 500) {
        expect(rowCount).to.eq(500);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 500')
      } else if (rowCount < 500) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });

  })
  it('Pagination indication functionality', ()=> {
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 1 - 20')
    cy.get("[data-testid$='pagination-button-2']").click()
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 21 - 40')
    cy.get("[data-testid$='pagination-button-3']").click()
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 41 - 60')
    cy.get("[data-testid$='pagination-button-4']").click()
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 61 - 80')
    cy.get("[data-testid$='pagination-button-5']").click()
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 81 - 100')
  })
})