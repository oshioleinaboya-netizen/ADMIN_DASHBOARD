import { adminEmail, adminPassword, rankLink } from "@support/env";

describe('Savings plans table navigation', () => {
  beforeEach(() => {
    cy.visit(rankLink)
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
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
  it('Savings - Table navigation', ()=> {
    cy.wait(5000)
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Savings').click()
      cy.wait(5000)
    })
    cy.url().should('include', '/savings')
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      // <> Table ---------------------------
      cy.get("[data-slot$='table-container'] thead tr th")
      .should('have.length', 7)
      .and('be.visible')
      .then(($th) => {
        const headers: string[] = [
          'Plan type',
          "Savings plan ID",
          'Plan name',
          'Savings balance',
          'Interest earned',
          'Status',
          'Start date'
        ];
        headers.forEach((header, i) => {
          expect($th.eq(i)).to.contain(header);
        });
      });
      cy.get("[class$='font-medium lg:text-base text-sm']")
      .eq(2) // gets the first match if there are multiple
      .invoke('text')
      .then((totalText) => {
        const totalCustomers = Number(totalText.replace(/,/g, '').trim()); // convert "1,419" → 1419

        // Text showing total entries at the bottom
        cy.contains('Showing')
          .invoke('text')
          .then((entriesText) => {
            // Extracting the number after "of"
            const match = entriesText.match(/of\s([\d,]+)/); //Extracts number right after of
            expect(match, 'should contain "of ### entries"').to.not.be.null;
            const totalEntries = Number(match[1].replace(/,/g, ''));

            // Compare both
            expect(totalEntries).to.eq(totalCustomers);
          });
      });
      cy.get("[data-slot$='table-container'] tbody tr td:nth-child(2)").should('not.be.empty')
      cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.be.empty')
      cy.get("[data-slot$='table-container'] tbody tr td:nth-child(4)").should('contain', '₦')
      cy.get("[data-slot$='table-container'] tbody tr td:nth-child(5)").should('contain', '₦')
      cy.get("[data-slot$='table-container'] tbody tr").each(($row, index) => {
        cy.wrap($row).within(() => {
          cy.get(`[class$='flex w-fit items-center bg rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800']`).invoke('text').then((text) => {
            const status = text.trim();

            if (status === 'Active') {
              cy.wrap($row).should('contain.text', 'Active');
            } else if (status === 'Inactive') {
              cy.wrap($row).should('contain.text', 'Inactive');
            } else {
              cy.log(`⚠️ Row ${index + 1}: Invalid status "${status}"`);
            }
          });
        });
      });

      cy.get("[class$='flex items-center justify-between w-full']").within(() => {
        cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing')
        cy.get("[class$='text-sm text-gray-600']").should('contain', 'entries')

        cy.get("[aria-label$='Pagination']").within(() => {
          cy.get("[aria-label$='Previous page']").should('exist');
          cy.get("[aria-label$='Next page']").should('not.be.disabled');
          cy.get("[aria-current$='page']").should('not.be.disabled');
        });
      });
      cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 10).eq(1).within(() => {
      cy.get('td').eq(2).should('contain', 'House in Lekki')
    })
    cy.get("[aria-hidden$='true']").click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 10).eq(1).within(() => {
      cy.get('td').eq(2).should('not.contain', 'House in Lekki')
    })

    // Midpoint "..." click - Page land check
    cy.get("[data-testid$='pagination-button-1']").click()
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-hidden$='true']").click()
    cy.get("[aria-current$='page']")
      .invoke('text')
      .then((text) => {
        const currentPage = Number(text.trim());
        expect(currentPage).to.be.oneOf([9, 10, 11, 12, 13]); // any valid values
      });
    cy.get("[data-testid$='pagination-button-1']").click()

    // Savings table page list
    cy.get("[data-testid$='table-page-size-select']").select("Show 10");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 10) {
        expect(rowCount).to.eq(10);
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
})
})