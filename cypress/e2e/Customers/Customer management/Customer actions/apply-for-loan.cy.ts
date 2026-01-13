it('Customer Actions - Apply for loan', ()=> {
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(()=> {
      cy.contains('Apply for loan').click()
    })
    /*cy.get("[class$='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").should('exist').within(()=> {
      cy.get("[class$='text-xl font-semibold mb-4']").should('contain', 'Flag User')
      cy.contains('Report and flag a suspicious activity for further review by assigning reason, severity and action type.')
      cy.contains('Reason (Trigger type)')
      cy.contains('Comment')
      cy.contains('Do you want to escalate this?')
      cy.contains('Yes')
      cy.contains('No')
      cy.get("[type$='button']").should('contain', 'Cancel')
      cy.get("[type$='button']").should('contain', 'Flag')
      cy.get("[class$='flex flex-wrap gap-2 flex-1']").should('contain', 'Select reason')
      cy.get("[class$='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']")
    })*/
    cy.get("[type$='button']").should('contain', 'Cancel').click()
  })