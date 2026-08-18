import { GetOtpOptions } from './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      findRowAcrossPages(
        rowText: string,
        rowSelector: string,
        nextButtonSelector: string
      ): Chainable<boolean>;

      /**
       * Polls the admin mailbox via IMAP until an OTP email arrives, then returns the 6-digit code.
       */
      getOtpFromEmail(options?: GetOtpOptions): Chainable<string>;
    }
  }
}

export {};