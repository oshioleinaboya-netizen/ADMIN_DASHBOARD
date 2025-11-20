describe ('Get a user', ()=>{
  /*BDD - "Given - being in the Customers area, 
Then - I should be able to see the ""Search bar tool""."
Note - I have to input in the Name, Phone number, Monitag of the cutomer I'm looking for that customer, in order to filter search
"Given - After input has been carried out, 
When - the search button is clicked or clicking on the enter key on my keyboard. Then - the search should go through"
"Given - If the customer name is not part of records, 
Then - I should get a ""No result found message"". 
But, Given - if customer name is found, 
Then - the details of the customer should show" */
  beforeEach(() => {
    // Aunthentication check
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
  it('Filter by search - Phone number', ()=> {
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('+2348123444444')
    cy.wait(3000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).first().within(() => {
      cy.get('td').eq(0).should('contain', '+2348123444444');
    })
    cy.get("[type$='button']").should('contain', 'Search').click()
    cy.get("[data-slot$='table-container'] tbody tr").first().within(() => {
      cy.get('td').eq(0).should('contain', '+2348123444444');
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20)
  })
  it('Filter by search - Monitag', ()=> {
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('new_hahaII')
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).first().within(() => {
      cy.get('td').eq(7).should('contain', 'new_hahaII');
    })
    cy.get("[type$='button']").should('contain', 'Search').click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).first().within(() => {
      cy.get('td').eq(7).should('contain', 'new_hahaII');
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20)
  })
  it('Filter by search - Name', ()=> {
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('bills billers')
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).last().within(() => {
      cy.get('td').eq(1).should('contain', 'bills payments billers');
    })
    cy.get("[type$='button']").should('contain', 'Search').click()
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).last().within(() => {
      cy.get('td').eq(1).should('contain', 'bills payments billers');
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20)
  })
  it('Filter by search - Empty table body', ()=> {
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('iiiiiiiiiiiiii')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 0)
    cy.get("[alt$='empty box']").should('be.visible')
    cy.get("[class$='font-semibold text-[2rem] text-center']").should('contain', 'No result found!')
    cy.get("[class$='text-gray-600 text-center']").should('contain', "We couldn't find any result for this query. Try adjusting the search again")
    cy.get("[class$='text-gray-600 text-center']").should('contain', "Try adjusting the search again")
  })
  it('Filter by search - letter population', ()=> {
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('j')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 1)
  })
})