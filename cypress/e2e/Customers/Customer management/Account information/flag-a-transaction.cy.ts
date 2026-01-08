import { adminEmail, adminPassword } from "cypress/support/env";

const WAIT_LONG = 30000;
const WAIT_MED = 8000;

describe('Flag a transacton', () => {
  beforeEach(() => {
    cy.visit("/");
    // Clear index DB
    cy.window().then((win) => {
      if (win.indexedDB?.databases) {
        win.indexedDB.databases().then((dbs) => {
          dbs.forEach((db) => {
            if (db.name) {
              win.indexedDB.deleteDatabase(db.name);
            }
          });
        });
      }
    });
    cy.get("[type$='text']", { timeout: WAIT_LONG }).type(adminEmail);
    cy.get("[type$='password']", { timeout: WAIT_LONG }).type(adminPassword);
    cy.get("[type$='submit']", { timeout: WAIT_LONG }).click();

    // New device detected/
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    cy.get("[class$='self-center space-y-2']", { timeout: WAIT_LONG }).should('exist').within(() => {
      cy.get("[class$='font-semibold']").should('be.visible');
    });

    cy.get('body').then(($body) => {
      if ($body.find("[class*='cursor-text']").length) {
        cy.get("[class*='cursor-text']").type('000000');
      }
      if ($body.find("[class*='animate-spin']").length) {
        cy.get("[class*='animate-spin']", { timeout: WAIT_LONG }).should('not.exist');
      }
    });

    cy.url({ timeout: WAIT_LONG }).should('include', '/customers');
    cy.wait(3000)

    cy.get("#search-bar-button", { timeout: WAIT_MED }).within(() => {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist');
    });

    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']", { timeout: WAIT_MED })
      .type('bills billers');
    cy.wait(3000)

    cy.get("[data-slot$='table-container'] tbody tr").first().within(() => {
      cy.get("td").eq(1).click();
    })
    cy.url({ timeout: WAIT_LONG }).should('include', '/customers/');
    cy.wait(3000)
  });

  it('Flag a transaction flow - Yes flow (Escalation)', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Account Information').click();
      cy.wait(5000);
    }); // Go to Account Information tab

    cy.url({ timeout: WAIT_LONG }).should('include', '/account-information');

    cy.get("[data-slot*='table-body']").then(($rows) => {
      cy.wrap($rows)
        .find('td')
        .eq(11)
        .should('exist')
        .and('contain.text', 'Flag')
        .click();
    }); // get flas component on the table

    cy.get("[class*='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").within(() => {
      cy.contains('Cancel').click()
    }) // Close the flag modal

    cy.wait(1000);

    cy.get("[data-slot*='table-body']").then(($rows) => {
      cy.wrap($rows)
        .find('td')
        .eq(11)
        .should('exist')
        .and('contain.text', 'Flag')
        .click();
    });

    cy.get("[class*='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").within(() => {
      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Flag').and('be.disabled') // Flag button should be disbaled

      cy.get("[class*='text-xl font-semibold mb-4']").contains('Flag Transaction').should('be.visible'); // Header check
      // cy.contains('Report and flag a suspicious activity for further review by assigning reason, severity and action type.').should('be.vivible') // Description check - Bug here: Description is not fetchable

      cy.contains('Reason (Trigger type)').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('contain.text', 'Select reason').click();
      }) // Open reason dropdown

      cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').should('have.length.at.least', 1).within(() => {
        cy.get("[data-testid*='dropdown-option-1']").click(); // Option selection
      })

      cy.contains('Reason (Trigger type)').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('not.be.empty')
      }) // After selection check

      cy.contains('Security Level').parent().should('be.visible').within(() => {
        cy.get("[name*='securityLevel']")
          .should('have.attr', 'readonly')
          .should('not.be.empty')
      }) // Security level check

      cy.contains('Flag type').parent().should('be.visible').within(() => {
        cy.get("[name*='flagTyp']")
          .should('have.attr', 'readonly')
          .should('not.be.empty')
      }) // Fag type check

      cy.contains('Comment').parent().should('be.visible').within(() => {
        cy.get("[class*='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']").type('Why you never pay tax since?')
      }) // Comment input check

      cy.contains('Do you want to escalate this?').parent().should('be.visible').within(() => {
        cy.contains('Yes').click()
      }) // Escalation check

      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Flag').and('be.disabled') // Flag button should be disbaled

      cy.contains('Escalate to a team').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('contain.text', 'Select team').click()
      }) // Escalation check

      cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').should('have.length.at.least', 1).within(() => {
        cy.get("[data-testid*='dropdown-option-1']").click(); // Option selection
      })

      cy.contains('Escalate to a team').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('not.be.empty')
      }) // After selection check

      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Flag').and('not.be.disabled') // Flag button should be disbaled

      cy.contains('Escalation Note').parent().should('be.visible').within(() => {
        cy.get("[class*='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']").type('You go tell us when you take turn father Christmas')
      }) // Optional escalation note input check - Flag button shoulf be enabled with or without text in this field

      cy.get("[type*='button']").eq(1).should('contain.text', 'Flag').and('not.be.disabled').click() // Flag button should be enabled now
      // Admin is unable to flag customer transaction at the moment - Bug
      // Where is an admin meant to see flagged transactions?
    })
    cy.contains('Transaction flagged successfully').should('be.visible'); // Success page check
    cy.contains('Ok').click(); // Close success page
  });

  it.only('Flag a transaction flow - No flow (Escalation)', () => {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(() => {
      cy.contains('Account Information').click();
      cy.wait(5000);
    }); // Go to Account Information tab

    cy.url({ timeout: WAIT_LONG }).should('include', '/account-information');

    cy.get("[data-slot*='table-body']").then(($rows) => {
      cy.wrap($rows)
        .find('td')
        .eq(11)
        .should('exist')
        .and('contain.text', 'Flag')
        .click();
    }); // get flas component on the table

    cy.get("[class*='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").within(() => {
      cy.contains('Cancel').click()
    }) // Close the flag modal

    cy.wait(1000);

    cy.get("[data-slot*='table-body']").then(($rows) => {
      cy.wrap($rows)
        .find('td')
        .eq(11)
        .should('exist')
        .and('contain.text', 'Flag')
        .click();
    });

    cy.get("[class*='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").within(() => {
      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Flag').and('be.disabled') // Flag button should be disbaled

      cy.get("[class*='text-xl font-semibold mb-4']").contains('Flag Transaction').should('be.visible'); // Header check
      // cy.contains('Report and flag a suspicious activity for further review by assigning reason, severity and action type.').should('be.vivible') // Description check - Bug here: Description is not fetchable

      cy.contains('Reason (Trigger type)').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('contain.text', 'Select reason').click();
      }) // Open reason dropdown

      cy.get("[class*='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").should('not.be.empty').should('have.length.at.least', 1).within(() => {
        cy.get("[data-testid*='dropdown-option-1']").click(); // Option selection
      })

      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Flag').and('be.disabled') // Flag button should be disbaled

      cy.contains('Reason (Trigger type)').parent().should('be.visible').within(() => {
        cy.get("[class*='flex flex-wrap gap-2 flex-1']").should('not.be.empty')
      }) // After selection check

      cy.contains('Security Level').parent().should('be.visible').within(() => {
        cy.get("[name*='securityLevel']")
          .should('have.attr', 'readonly')
          .should('not.be.empty')
      }) // Security level check

      cy.contains('Flag type').parent().should('be.visible').within(() => {
        cy.get("[name*='flagTyp']")
          .should('have.attr', 'readonly')
          .should('not.be.empty')
      }) // Fag type check

      cy.contains('Comment').parent().should('be.visible').within(() => {
        cy.get("[class*='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']").type('Why you never pay tax since?')
      }) // Comment input check

      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Flag').and('not.be.disabled') // Flag button should be enabled

      cy.contains('Do you want to escalate this?').parent().should('be.visible').within(() => {
        cy.contains('Yes').click()
      }) // Escalation check

      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Flag').and('be.disabled') // Flag button should be disbaled

      cy.contains('Do you want to escalate this?').parent().should('be.visible').within(() => {
        cy.contains('No').click()
      }) // Escalation check

      cy.get("[type*='button']").eq(1).scrollIntoView().should('contain.text', 'Flag').and('not.be.disabled').click() // Flag button should be enabled now
      // Where is an admin meant to see flagged transactions?
    })
    cy.contains('Transaction flagged successfully').should('be.visible'); // Success page check
    cy.contains('Ok').click(); // Close success page
  });
});