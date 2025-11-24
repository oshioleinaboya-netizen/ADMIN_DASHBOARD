import { adminEmail, adminPassword, rankLink } from "@support/env";
import { inviteStaff } from '@support/helper';
import { findRowAcrossPages } from '@support/helper';

describe('Roles & permissions', () => {
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
      cy.wait(5000)
  })
  it('Check if admin has permission to invite staff', () => {
    inviteStaff()
  })
  it.only("Checks invitation statuses across ALL pages", () => {
    // === ACTIVE (button disabled) ===
    findRowAcrossPages(row => /(^|\s)ACTIVE(\s|$)/.test(row.innerText))
      .then(activeRow => {
        if (!activeRow) return; // If ACTIVE does not exist anywhere

        cy.wrap(activeRow).within(() => {
          cy.get("td").eq(6).within(() => {
            cy.get("button").should("be.disabled");
          });
        });
      });

    // === INVITED (button disabled) ===
    findRowAcrossPages(row => row.innerText.includes("INVITED"))
      .then(invitedRow => {
        if (!invitedRow) return;

        cy.wrap(invitedRow).within(() => {
          cy.get("td").eq(6).within(() => {
            cy.get("button").should("be.disabled");
          });
        });
      });

    // === INACTIVE (click ellipsis → resend visible) ===
    findRowAcrossPages(row => row.innerText.includes("INACTIVE"))
      .then(inactiveRow => {
        if (!inactiveRow) return;

        cy.wrap(inactiveRow).within(() => {
          cy.get("td").eq(6).within(() => {
            cy.get("button").should("be.disabled")
          });
        });
      });

    // === EXPIRED (→ resend visible) ===
    findRowAcrossPages(row => row.innerText.includes("EXPIRED"))
      .then(expiredRow => {
        if (!expiredRow) return;

        cy.wrap(expiredRow).within(() => {
          cy.get("td").eq(6).within(() => {
            cy.get("button")
              .should("not.be.disabled")
              .click();
              cy.wait(2000)
          });
        });

        cy.get("[data-slot*='dropdown-menu-item']")
          .contains("Resend")
          .should("be.visible")
          .click();
      });

    // === NOT EXPIRED row check across all pages ===
    findRowAcrossPages(row => !row.innerText.includes("EXPIRED"))
      .should("exist");
  });
})