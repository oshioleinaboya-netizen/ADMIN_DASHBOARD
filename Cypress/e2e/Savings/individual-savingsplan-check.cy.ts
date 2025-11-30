import { adminEmail, adminPassword, rankLink } from "@support/env";

describe('Customer savings plan management', ()=> {
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
    cy.wait(5000)
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('billers')
    cy.wait(3000)
    cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.url().should('include', '/customers/')
  })
  const analyticsChecks: string[] = [
    'Plan Type',
    'Savings plan ID',
    'Savings balance',
    'Total interest earned',
    'Start date',
    'Maturity date',
    'Interest Balance',
    'Interest available to',
    'Interest withdrawn',
    'Interest withdrawal',
    'Interest rate',
    'Progress'
  ]
  it.only('Individual savings plan management check', ()=> {
    let status = "";

    function findStatus() {
      analyticsChecks.forEach((item)=> {
        cy.contains(item).parent().should('be.visible')
      })
      cy.get("[data-slot$='table-container']").within(() => {
        cy.get("tbody tr")
          .filter((i, row) => {
            const text = row.innerText.trim();
            return text.includes("Successful")
          })
          .first()
          .then($row => {
            // Extract name from first td
            status = ($row[0] as HTMLTableRowElement).cells[4].innerText.trim();

            cy.wrap($row).click();  // ✅ CLICK ROW
          });
      });
    }
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Savings').click() //Savings tab click
      cy.wait(3000)
    })
    cy.get("[data-slot$='table-container'] tbody tr").eq(1).click()  //Click page 20
    cy.wait(3000)
    //cy.get("[class$='text-xl font-bold text-gray-900 mb-6']").eq(2).should('exist').and('contains', 'Testing')
    //cy.get("[data-slot$='table-container'] tbody tr").first().click()
    findStatus()
    cy.wait(3000)
    cy.get("[data-slot$='drawer-content']").within(()=> {
      cy.contains('Amount').parent().should('be.visible')
      cy.contains('Transaction type').should('be.visible')
      cy.contains('Status').should('be.visible')
      cy.contains('Balance before').should('be.visible')
      cy.contains('Balance after').should('be.visible')
      cy.contains('Method').should('be.visible')
      cy.contains('Transaction ID').should('be.visible')
      cy.contains('Date & time created').should('be.visible')
      cy.contains('Paid at').should('be.visible')
      cy.contains('Processed by').should('be.visible')
      //cy.contains(status)
      cy.get("[class*='lucide lucide-copy w-3.5 h-3.5']").should('not.be.disabled').click()
      cy.wait(200)
      cy.contains('Copied to clipboard')

      cy.get("[class$='lucide lucide-copy w-3.5 h-3.5']").should('be.visible').click()
      cy.get("[class$='flex items-center text-sm']").contains('Close').click()
    })
    cy.get("[data-slot$='drawer-content']").should('not.be.visible')
  })
})