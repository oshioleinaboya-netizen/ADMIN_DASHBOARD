import dotenv from 'dotenv';
import { defineConfig } from 'cypress';
import allureWriter from '@shelex/cypress-allure-plugin/writer';
import Imap from 'imap';
import { simpleParser, ParsedMail } from 'mailparser';

dotenv.config();
if (!process.env.CI) {
  dotenv.config({ path: 'retest.env' });
}

interface FetchOtpArgs {
  afterTimestamp: number;
}

interface OtpCandidate {
  seqno: number;
  otp: string;
  date: Date;
}

/**
 * Fetches the OTP from a Gmail/IMAP inbox.
 * - Only considers emails received AFTER `afterTimestamp` (avoids stale OTPs)
 * - Marks the matched email as \Seen so it isn't picked up again
 * - Resolves null if nothing found on this attempt (poll loop handles retries)
 */
function fetchOtpFromEmail({ afterTimestamp }: FetchOtpArgs): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: process.env.CYPRESS_OUTLOOK_EMAIL as string,
      password: process.env.CYPRESS_OUTLOOK_PASSWORD as string,
      host: process.env.CYPRESS_IMAP_HOST || 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    const finish = (result: string | null) => {
      try { imap.end(); } catch (_) { /* noop */ }
      resolve(result);
    };

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err) => {
        if (err) return reject(err);

        const sinceDate = new Date(afterTimestamp);

        imap.search(
          ['Rank', ['SINCE', sinceDate], ['SUBJECT', 'Admin OTP']],
          (err, results) => {
            if (err) return reject(err);
            if (!results || !results.length) return finish(null);

            const sorted = results.sort((a, b) => b - a);
            const f = imap.fetch(sorted, { bodies: '', markSeen: false });
            const candidates: OtpCandidate[] = [];
            let pending = sorted.length;

            f.on('message', (msg, seqno: number) => {
              msg.on('body', (stream) => {
                simpleParser(stream as any, (err: Error | null, parsed: ParsedMail) => {
                  pending -= 1;

                  if (!err && parsed.date && parsed.date.getTime() >= afterTimestamp) {
                    const match = parsed.text && parsed.text.match(/\b\d{6}\b/);
                    if (match) {
                      candidates.push({ seqno, otp: match[0], date: parsed.date });
                    }
                  }

                  if (pending === 0) {
                    if (!candidates.length) return finish(null);

                    candidates.sort((a, b) => b.date.getTime() - a.date.getTime());
                    const winner = candidates[0];

                    imap.addFlags(winner.seqno, ['\\Seen'], () => {
                      finish(winner.otp);
                    });
                  }
                });
              });
            });

            f.once('error', reject);
          }
        );
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
}

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{ts,js}',
    supportFile: 'cypress/support/e2e.ts',
    chromeWebSecurity: false,
    baseUrl: process.env.RANK_LINK,
    setupNodeEvents(on, config) {
      // Allure reporting
      allureWriter(on, config);

      // OTP email task
      on('task', {
        fetchOtpFromEmail,
      });

      // Browser-side env (accessible via Cypress.env(...) in specs)
      config.env = {
        ...config.env,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        RANK_LINK: process.env.RANK_LINK,
        PARTNER_EMAIL: process.env.PARTNER_EMAIL,
        PARTNER_PASSWORD: process.env.PARTNER_PASSWORD,
        PARTNER_LINK: process.env.PARTNER_LINK,
        P_LINK_PD: process.env.P_LINK_PD,
        P_EMAIL_PD: process.env.P_EMAIL_PD,
        P_PASSWORD_PD: process.env.P_PASSWORD_PD,
        STAGING_OTP: process.env.STAGING_OTP,
        PROD_LINK: process.env.PROD_LINK,
        PROD_EMAIL: process.env.PROD_EMAIL,
        PROD_PASSWORD: process.env.PROD_PASSWORD,
        CYPRESS_IMAP_HOST: process.env.CYPRESS_IMAP_HOST,
      };

      return config;
    },
  },
});