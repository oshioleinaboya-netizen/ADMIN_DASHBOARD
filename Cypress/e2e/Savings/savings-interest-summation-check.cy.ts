import { adminEmail, adminPassword, rankLink } from "@support/env";

describe('Savings Interest Summation Validation', () => {
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
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('8156768888')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.url().should('include', '/customers/')
  })
  it.only('Total vs summation interest checks', () => {
    cy.contains('Savings').click()
    let totalInterest = 0;

    // Function: Add up interest from current page
    const sumInterestOnPage = () => {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        // Assuming "Interest" is the 5th column
        const interestText = $row.find('td').eq(4).text().trim();
        const interestValue = parseFloat(interestText.replace(/[^0-9.]/g, '')) || 0;
        totalInterest += interestValue;
      });
    };

    // Function: Handle pagination recursively
    const goToNextPage = () => {
      cy.get("[aria-label$='Next page']").then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.wait(2000);
          sumInterestOnPage();
          goToNextPage(); // continue
        } else {
          cy.log('✅ All pages scanned.');
        }
      });
    };

    // Start: wait for table to be ready
    cy.visit('https://moni-admin-fe.staging.rank.africa/customers/usr_86ea5878830a44289/savings');
    cy.get("[data-slot$='table-container'] tbody tr").should('exist');
    cy.wait(2000);

    // Sum from the first page
    sumInterestOnPage();

    // Go through other pages if available
    goToNextPage();

    // Compare with analytics summary
    cy.then(() => {
      cy.get('div')
        .contains('Total Interest Earned')
        .next() // or adjust to direct element
        .invoke('text')
        .then((summaryText) => {
          const analyticsInterest = parseFloat(summaryText.replace(/[^0-9.]/g, ''));

          cy.log(`Total Interest (summed): ${totalInterest}`);
          cy.log(`Analytics Interest: ${analyticsInterest}`);

          expect(totalInterest).to.eql(analyticsInterest);
        });
    });
  });
});