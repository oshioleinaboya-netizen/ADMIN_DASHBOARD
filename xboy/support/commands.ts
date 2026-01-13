// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types="cypress" />

/// <reference types="cypress" />

//Find across pages/
Cypress.Commands.add(
  "findRowAcrossPages",
  (
    rowText: string,
    rowSelector: string,
    nextButtonSelector: string
  ): Cypress.Chainable<boolean> => {
    const searchPage = (): Cypress.Chainable<boolean> => {
      return cy.get(rowSelector).then(($rows) => {
        const rowsArray = Array.from($rows);
        const matchingRow = rowsArray.find((row) =>
          row.innerText.includes(rowText)
        );

        if (matchingRow) {
          cy.wrap(matchingRow).click();
          return cy.wrap(true);
        }

        return cy.get("body").then(($body) => {
          const nextBtn = $body.find(nextButtonSelector);

          if (nextBtn.length === 0 || nextBtn.prop("disabled")) {
            return cy.wrap(false);
          }

          cy.get(nextButtonSelector).click();
          cy.wait(700);
          return searchPage();
        });
      });
    };

    return searchPage();
  }
);
