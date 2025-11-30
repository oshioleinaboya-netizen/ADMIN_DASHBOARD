import { adminEmail, adminPassword, rankLink } from "@support/env";
describe('template spec', () => {
  beforeEach(() => {
      //Authentication check - Login
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
      cy.wait(5000)
      cy.location().then((loc) => {
        cy.log('Current URL:', loc.href)
      })
      cy.url({ timeout: 30000 }).should('include', '/customers')
      cy.get("[data-testid*='nav-link-staff-management']").click()
      cy.url({ timeout: 30000 }).should('include', '/staff-mgt')
    })

  it('Mid point between table pages', ()=> {
    cy.wait(3000);

    // make sure row exists
    cy.get("[data-slot$='table-container'] tbody tr")
      .should("have.length.at.most", 20)
      .its('length')
      .should('be.gte', 6); // ensure eq(5) is safe

    // extract text from row 5, cell index 1, then continue outside the row scope
    cy.get("[data-slot$='table-container'] tbody tr")
      .eq(5)
      .find("td")
      .eq(1)
      .invoke("text")
      .then((text) => {
        const storedValue = text.trim();
        cy.log("storedValue:", storedValue);

        // Now we're outside the row scope — click the midpoint component
        cy.get("[data-testid*='pagination-numbers']").within(()=> {
          cy.get("[aria-hidden$='true']").click();
          cy.wait(1000);
        })

        // Assert that the storedValue does not appear anywhere in the current table
        cy.get("[data-slot$='table-container'] tbody tr td")
          .should("not.contain", storedValue);
      });

    // Midpoint "..." click - Page land check
    cy.get("[data-testid$='pagination-button-1']").click()
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[data-testid*='pagination-numbers']").within(()=> {
      cy.get("[aria-hidden$='true']").click();
      cy.wait(1000);
    })
    cy.get("[aria-current$='page']")
      .invoke('text')
      .then((text) => {
        const currentPage = Number(text.trim());
        expect(currentPage).to.be.oneOf([2, 3, 4, 5]); // any valid values
      });
  })

  it('Previous page disabled - First page | next page disabled - Last page', ()=> {
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-label$='Previous page']").should('be.disabled')
    cy.get("[data-testid$='pagination-button-10']").click()
    cy.get("[aria-current$='page']").should('contain', 10)
    cy.get("[aria-label$='Next page']").should('be.disabled')
    cy.get("[aria-label$='Previous page']").should('not.be.disabled')
  }) // Awaiting last page to be uniquely fetchable.

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

  it('Table rows - At most 20 rows displayed per page', () => {
    cy.get(`[data-slot*='table-container']`).within(() => {
      cy.get('tbody').find('tr').then((rows) => {
        expect(rows.length).to.be.at.most(20);
      });
    });
  })
})