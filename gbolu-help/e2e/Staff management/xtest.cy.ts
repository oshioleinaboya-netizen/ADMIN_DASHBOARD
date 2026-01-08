import { adminEmail, adminPassword } from 'gbolu-help/support/env';
import { faker } from '@faker-js/faker';

describe('xtest', () => {
  it('xtest', () => {

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

    //
    // ----------------------------------------------
    // 1. Prepare all faker data OUTSIDE cy.origin()
    // ----------------------------------------------
    //
    const staffFirstName = faker.person.firstName().toLowerCase();
    const surName = faker.person.lastName();
    const phone = '080' + Math.floor(10000000 + Math.random() * 90000000);

    let staffEmail: string;

    //
    // ----------------------------------------------
    // 2. Get email from inboxes.com
    // ----------------------------------------------
    //
    cy.visit('https://yopmail.com');

    cy.get("[id*='login']").type(`${staffFirstName}.rank`)
    cy.get("[class*='material-icons-outlined f36']").click()
    cy.wait(5000)

    cy.get("[class*='bname']")
      .invoke('text')
      .then((text: string) => {
        staffEmail = text.trim();
      })
      .then(() => {

        //
        // ----------------------------------------------
        // 3. Login + invite staff INSIDE origin
        // ----------------------------------------------
        //
        cy.origin('/',
          {
            args: {
              adminEmail,
              adminPassword,
              staffEmail,
              staffFirstName,
              surName,
              phone
            }
          },
          ({ adminEmail, adminPassword, staffEmail, staffFirstName, surName, phone }) => {

            // Login
            cy.visit("/");
            cy.wait(5000)

            // Clear IndexDB inside the new origin
            cy.window().then((win) => {
              return win.indexedDB.databases().then((dbs) => {
                dbs.forEach((db) => win.indexedDB.deleteDatabase(db.name));
              });
            });

            cy.get("[type='text']").type(adminEmail);
            cy.get("[type='password']").type(adminPassword);
            cy.get("[type='submit']").click();
            cy.wait(3000)

            // New device detected
            cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
            cy.contains('Continue').click()

            cy.get('body').then(($body) => {
              if ($body.find("[class*='cursor-text']").length) {
                cy.get("[class*='cursor-text']").type('000000');
              }
            });

            cy.get("[class*='animate-spin']").should('not.exist');
            cy.url().should('include', '/customers');

            // Staff management
            cy.get("[data-testid='nav-link-staff-management']").click();
            cy.contains('Invite a staff').click();

            //
            // Selectors + helpers MUST be declared here
            //
            const selectors = {
              firstName: "First name",
              surName: "Surname",
              email: "Email address",
              phone: "Phone Number",
              jobTitle: "Job title",
              department: "Department",
              level: "Level",
              country: "Country of operation",
              domains: "Domains",
              inviteButton: "Invite Staff",
            };

            const typeInput = (label, value) => {
              cy.contains(label).parent().find("input, textarea").first().clear().type(value);
            };

            const selectDropdown = (label, optionText) => {
              cy.contains(label).parent().find("[class*='flex flex-wrap']").click();
              cy.get("[class*='absolute z-10']").contains(optionText).click();
            };

            const checkPermissions = () => {
              cy.get("[id*='permissions-scroll-container']").eq(0).within(() => {
                cy.get("[class*='flex items-center gap-x-2']").each(($el) => {
                  cy.wrap($el).find("input[type='checkbox']").check({ force: true });
                });
              });
            };

            //
            // Fill the invite form
            //
            typeInput(selectors.firstName, staffFirstName);
            typeInput(selectors.surName, surName);
            typeInput(selectors.email, staffEmail);
            typeInput(selectors.phone, phone);
            typeInput(selectors.jobTitle, "Automation Personnel");

            selectDropdown(selectors.department, "FINANCE");
            selectDropdown(selectors.level, "LEAD");
            checkPermissions();
            selectDropdown(selectors.country, "NIGERIA");
            selectDropdown(selectors.domains, "RANK MFB");

            cy.contains("button", selectors.inviteButton).click();

            cy.get("[class*='font-semibold']")
              .should('contain', 'Invitation sent successfully');

            cy.contains('Ok').click()
            cy.wait(4000)
            cy.get("[class*='focus-visible:outline-none ml-2 w-full']").type(`${staffFirstName} ${surName}`)
            cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).first().within(() => {
              cy.get('td').eq(0).should('contain', staffFirstName);
              cy.get('td').eq(5).should('contain', 'INVITED');
            })
          }
        );
      });
    cy.visit("https://yopmail.com"); // Email generator site revisit
    cy.wait(3000);
    //cy.get("[id*='login']").should('contain', `${staffFirstName}.rank`)
    cy.get("[class*='material-icons-outlined f36']").click()
    cy.wait(5000)

    cy.get("[id*='refresh']").click() // Refresh inbox
    cy.get("[style*='padding: 40px']").within(() => {
      cy.get("[href*='https://moni-admin-fe.staging.rank.africa/create-password?reset_token=XpHA37YfRNd6ak9Km&email=frederik.rank@yopmail.com&first_name=frederik']").scrollIntoView().click({ force: true })
    });
    cy.wait(3000)
  });
});
