declare namespace Cypress {
  interface Chainable {
    findRowAcrossPages(
      rowText: string,
      rowSelector: string,
      nextButtonSelector: string
    ): Chainable<boolean>;
  }
}