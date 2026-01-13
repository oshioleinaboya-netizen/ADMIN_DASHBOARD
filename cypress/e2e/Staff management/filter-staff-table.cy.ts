import { adminEmail, adminPassword } from "cypress/support/env";

describe('template spec', () => {
  beforeEach(() => {
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

    //Authentication check - Login
    cy.visit("/");
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.get("[type$='text']").type(adminEmail)
    cy.get("[type$='password']").type(adminPassword)
    cy.get("[type$='submit']").click()
    cy.wait(3000)

    // New Device Login/
    cy.get("[class$='flex flex-col gap-y-4 items-center px-8 py-6']")
    cy.contains('Continue').click()

    cy.wait(2000);
    cy.get('body').then(($body) => {
      const timerExists = $body.find("[class$='self-center space-y-2']").length > 0;
      if (timerExists) {
        cy.get("[class$='self-center space-y-2']").should('exist').within(() => {
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
    cy.wait(4000)
  })
  it('Filter staff table', () => {
    const levels = ['ASSOCIATE', 'MANAGER', 'LEAD']
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Filter').should('be.visible')
      cy.get("[alt*='close sort']").should('be.visible')

      // Options check - Level
      cy.contains("Level").parent().within(() => {
        levels.forEach((level) => {
          cy.contains(level).should('be.visible')
        })
      })
      // Options check - Status
      const statuses = ['Active', 'Inactive', 'Invited', 'Invitation Expired'];
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible')
        })
      })
      // Options check - Team
      const teams = ['FINANCE', 'INVESTMENT', 'MARKETING', 'COMPLIANCE', 'OPERATIONS', 'ACCOUNT OFFICER', 'CX', 'RISK', 'BUSINESS DEVELOPMENT OFFICER'];
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible')
        })
      })
    })
  })
  it('Filter staff table - Single filter selection (Levels)', () => {
    function pickRandomStaffAfterFilter() {
      cy.get("[data-slot$='table-container'] tbody tr").first().click()
    }
    const levels = ['ASSOCIATE', 'MANAGER', 'LEAD']
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Filter').should('be.visible')
      cy.get("[alt*='close sort']").should('be.visible')

      // Options check - Level (Lead)
      cy.contains("Level").parent().within(() => {
        levels.forEach((level) => {
          cy.contains(level).should('be.visible').click()
        })
      })
      cy.contains("Level").parent().within(() => {
        cy.contains('ASSOCIATE').should('be.visible').click()
        cy.contains('MANAGER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    pickRandomStaffAfterFilter() // Table check
    cy.wait(3000)
    cy.contains("Level").parent().within(() => {
      cy.contains('lead').should('be.visible')
    })
    cy.get("[class^='flex']").filter(':contains("Staff list")').eq(0).within(() => {
      cy.get("[class*='text-[#71717A] hover:cursor-pointer']").should('contain', 'Staff list').click()
    })
    cy.wait(3000)

    // Options check - Level (Manager)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Filter').should('be.visible')
      cy.get("[alt*='close sort']").should('be.visible')

      //
      cy.contains("Level").parent().within(() => {
        levels.forEach((level) => {
          cy.contains(level).should('be.visible').click()
        })
      })
      cy.contains("Level").parent().within(() => {
        cy.contains('ASSOCIATE').should('be.visible').click()
        cy.contains('LEAD').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    pickRandomStaffAfterFilter() // Table check
    cy.wait(3000)
    cy.contains("Level").parent().within(() => {
      cy.contains('manager').should('be.visible')
    })
    cy.get("[class^='flex']").filter(':contains("Staff list")').eq(0).within(() => {
      cy.get("[class*='text-[#71717A] hover:cursor-pointer']").should('contain', 'Staff list').click()
    })
    cy.wait(3000)

    // Options check - Level (Associate)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Filter').should('be.visible')
      cy.get("[alt*='close sort']").should('be.visible')

      //
      cy.contains("Level").parent().within(() => {
        levels.forEach((level) => {
          cy.contains(level).should('be.visible').click()
        })
      })
      cy.contains("Level").parent().within(() => {
        cy.contains('MANAGER').should('be.visible').click()
        cy.contains('LEAD').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    pickRandomStaffAfterFilter() // Table check
    cy.wait(3000)
    cy.contains("Level").parent().within(() => {
      cy.contains('associate').should('be.visible')
    })
    cy.get("[class^='flex']").filter(':contains("Staff list")').eq(0).within(() => {
      cy.get("[class*='text-[#71717A] hover:cursor-pointer']").should('contain', 'Staff list').click()
    })
    cy.wait(3000)
  })
  it('Filter staff table - Single filter selection (Status)', () => {
    const statuses = ['Active', 'Inactive', 'Invited', 'Invitation Expired'];
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    function checkStatusColumnForActiveOnlyI() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("ACTIVE");
          });
      });
    }
    function checkStatusColumnForActiveOnlyII() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("INACTIVE");
          });
      });
    }
    function checkStatusColumnForActiveOnlyIII() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("INVITED");
          });
      });
    }
    function checkStatusColumnForActiveOnlyIV() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("INVITATION_EXPIRED");
          });
      });
    }
    // Filter - Status (Active)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible').click()
        })
      })
      cy.contains("Status").parent().within(() => {
        cy.contains('Inactive').should('be.visible').click()
        cy.contains('Invited').should('be.visible').click()
        cy.contains('Invitation Expired').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkStatusColumnForActiveOnlyI()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()


    // Filter - Status (Inctive)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible').click()
        })
      })
      cy.contains("Status").parent().within(() => {
        cy.contains('Active').should('be.visible').click()
        cy.contains('Invited').should('be.visible').click()
        cy.contains('Invitation Expired').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkStatusColumnForActiveOnlyII()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (INVITED)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible').click()
        })
      })
      cy.contains("Status").parent().within(() => {
        cy.contains('Active').should('be.visible').click()
        cy.contains('Inactive').should('be.visible').click()
        cy.contains('Invitation Expired').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkStatusColumnForActiveOnlyIII()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (Invitation expired)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible').click()
        })
      })
      cy.contains("Status").parent().within(() => {
        cy.contains('Active').should('be.visible').click()
        cy.contains('Invited').should('be.visible').click()
        cy.contains('Inactive').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkStatusColumnForActiveOnlyIV()
  })
  it('Filter staff table - Single filter selection (Team)', () => {
    const teams = ['FINANCE', 'INVESTMENT', 'MARKETING', 'COMPLIANCE', 'OPERATIONS', 'ACCOUNT OFFICER', 'CX', 'RISK', 'BUSINESS DEVELOPMENT OFFICER'];
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    function teamI() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const teamText = text.trim().toUpperCase();
            expect(teamText).to.equal("FINANCE");
          });
      });
    }
    function teamII() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("INVESTMENT");
          });
      });
    }
    function teamIII() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("MARKETING");
          });
      });
    }
    function teamIV() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("COMPLIANCE");
          });
      });
    }
    function teamV() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("OPERATIONS");
          });
      });
    }
    function teamVI() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("ACCOUNT-OFFICER");
          });
      });
    }
    function teamVII() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("CX");
          });
      });
    }
    function teamVIII() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("RISK");
          });
      });
    }
    function teamIX() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(statusText).to.equal("BUSINESS-DEVELOPMENT-OFFICER");
          });
      });
    }

    // Filter - Status (FINANCE)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamI()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()


    // Filter - Status (INVESTMENT)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('FINANCE').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamII()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (MARKETING)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('FINANCE').should('be.visible').click()
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamIII()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (COMPLIANCE)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('FINANCE').should('be.visible').click()
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamIV()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (OPERATIONS)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('FINANCE').should('be.visible').click()
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamV()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (ACCOUNT OFFICER)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('FINANCE').should('be.visible').click()
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamVI()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (CX)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('FINANCE').should('be.visible').click()
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamVII()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (RISK)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('FINANCE').should('be.visible').click()
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamVIII()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()

    // Filter - Status (BUSINESS DEVELOPMENT OFFICER)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('FINANCE').should('be.visible').click()
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    teamIX()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
  })
  it('Filter staff table - Multiple filter selection (Same parent - Status)', () => {
    const statuses = ['Active', 'Inactive', 'Invited', 'Invitation Expired'];
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    function checkStatusColumnForActiveOnlyI() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(['ACTIVE', 'INACTIVE']).to.include(statusText);
          });
      });
    }
    function checkStatusColumnForActiveOnlyII() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(['ACTIVE', 'INVITED']).to.include(statusText);
          });
      });
    }
    // Filter - Status (Active - Inactive)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible').click()
        })
      })
      cy.contains("Status").parent().within(() => {
        cy.contains('Invited').should('be.visible').click()
        cy.contains('Invitation Expired').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkStatusColumnForActiveOnlyI()
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()


    // Filter - Status (Active - Invited)
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').should('be.visible').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible').click()
        })
      })
      cy.contains("Status").parent().within(() => {
        cy.contains('Inactive').should('be.visible').click()
        cy.contains('Invitation Expired').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkStatusColumnForActiveOnlyII()
  })
  it('Filter staff table - Multiple filter selection (Same parent - Level)', () => {
    const levels = ['ASSOCIATE', 'MANAGER', 'LEAD'];

    function applyLevelFilter(selectedLevels = levels) {
      cy.get("[class*='relative']").filter(':contains(\"Filter\")').eq(1).click();
      cy.contains("Level").parent().within(() => {
        selectedLevels.forEach((level) => {
          cy.contains(level).should('be.visible').click();
        });
      });
      cy.contains("Level").parent().within(() => {
        cy.contains('ASSOCIATE').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click();
    }

    function pickStaffSequentially(rowIndex = 0) {
      // Get all rows in the table
      cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
        if (rowIndex >= $rows.length) return; // stop if we reached the end

        const $row = $rows.eq(rowIndex);
        cy.wrap($row).click();
        cy.wait(2000);

        // Check Level
        cy.contains("Level").parent().within(() => {
          cy.contains(/lead|manager/).should('exist');
        });

        // Go back to Staff list
        cy.get("[class^='flex']")
          .filter(':contains(\"Staff list\")').eq(0)
          .within(() => {
            cy.get("[class*='text-[#71717A] hover:cursor-pointer']")
              .should('contain', 'Staff list')
              .click();
          });

        cy.wait(2000);

        // Re-apply filter
        applyLevelFilter();
        cy.wait(1000);

        // Recurse to the next row
        pickStaffSequentially(rowIndex + 1);
      });
    }

    // Apply initial filter and start sequential iteration
    applyLevelFilter();
    pickStaffSequentially();

  })
  it('Filter staff table - Multiple filter selection (Same parent - Team)', () => {
    const teams = ['FINANCE', 'INVESTMENT', 'MARKETING', 'COMPLIANCE', 'OPERATIONS', 'ACCOUNT OFFICER', 'CX', 'RISK', 'BUSINESS DEVELOPMENT OFFICER'];
    function checkTeamColumnForMultiple() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(['FINANCE', 'MARKETING']).to.include(statusText);
          });
      });
    }
    function checkTeamColumnForMultiple2() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(['FINANCE', 'MARKETING', 'ACCOUNT-OFFICER']).to.include(statusText);
          });
      });
    }
    function checkTeamColumnForMultiple3() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(['FINANCE', 'MARKETING', 'ACCOUNT-OFFICER', 'COMPLIANCE']).to.include(statusText);
          });
      });
    }
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkTeamColumnForMultiple()

    // Three filter options
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.contains("Team").parent().within(() => {
      teams.forEach((team) => {
        cy.contains(team).should('be.visible').click()
      })
    })
    cy.contains("Team").parent().within(() => {
      cy.contains('INVESTMENT').should('be.visible').click()
      cy.contains('COMPLIANCE').should('be.visible').click()
      cy.contains('OPERATIONS').should('be.visible').click()
      cy.contains('CX').should('be.visible').click()
      cy.contains('RISK').should('be.visible').click()
      cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
    })
    cy.contains('Apply').should('be.visible').click()
    checkTeamColumnForMultiple2()

    // Four filter options
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains('Clear').click()
    })
    cy.wait(3000)
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.contains("Team").parent().within(() => {
      teams.forEach((team) => {
        cy.contains(team).should('be.visible').click()
      })
    })
    cy.contains("Team").parent().within(() => {
      cy.contains('INVESTMENT').should('be.visible').click()
      cy.contains('OPERATIONS').should('be.visible').click()
      cy.contains('CX').should('be.visible').click()
      cy.contains('RISK').should('be.visible').click()
      cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
    })
    cy.contains('Apply').should('be.visible').click()
    checkTeamColumnForMultiple3()
  })
  it('Filter staff table - Multiple filter selection (Different parents - Status/Team (SINGLE OPTION EACH))', () => {
    const teams = ['FINANCE', 'INVESTMENT', 'MARKETING', 'COMPLIANCE', 'OPERATIONS', 'ACCOUNT OFFICER', 'CX', 'RISK', 'BUSINESS DEVELOPMENT OFFICER'];
    const statuses = ['Active', 'Inactive', 'Invited', 'Invitation Expired'];
    function checkTeamStatusColumnForMultiple() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(['ACTIVE']).to.include(statusText);
          });

        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const teamText = text.trim().toUpperCase();
            expect(['FINANCE']).to.include(teamText);
          });
      });
    }
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible').click()
        })
      })
      cy.contains("Status").parent().within(() => {
        cy.contains('Inactive').should('be.visible').click()
        cy.contains('Invited').should('be.visible').click()
        cy.contains('Invitation Expired').should('be.visible').click()
      })
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('COMPLIANCE').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkTeamStatusColumnForMultiple()
  })
  it('Filter staff table - Multiple filter selection (Different parents - Status/Team (MULTIPLE OPTIONS EACH))', () => {
    const teams = ['FINANCE', 'INVESTMENT', 'MARKETING', 'COMPLIANCE', 'OPERATIONS', 'ACCOUNT OFFICER', 'CX', 'RISK', 'BUSINESS DEVELOPMENT OFFICER'];
    const statuses = ['Active', 'Inactive', 'Invited', 'Invitation Expired'];
    function checkTeamStatusColumnForMultiple() {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(5)
          .invoke("text")
          .then((text) => {
            const statusText = text.trim().toUpperCase();
            expect(['ACTIVE', 'INVITED']).to.include(statusText);
          });

        cy.wrap($row)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((text) => {
            const teamText = text.trim().toUpperCase();
            expect(['FINANCE', 'COMPLIANCE']).to.include(teamText);
          });
      });
    }
    cy.get("[class*='relative']")
      .filter(':contains("Filter")').eq(1).click()
    cy.get("[class*='absolute -left-[50px] py-[10px] mt-2 rounded-2xl font-semibold border bg-white z-50']").within(() => {
      cy.contains("Status").parent().within(() => {
        statuses.forEach((status) => {
          cy.contains(status).should('be.visible').click()
        })
      })
      cy.contains("Status").parent().within(() => {
        cy.contains('Inactive').should('be.visible').click()
        cy.contains('Invitation Expired').should('be.visible').click()
      })
      cy.contains("Team").parent().within(() => {
        teams.forEach((team) => {
          cy.contains(team).should('be.visible').click()
        })
      })
      cy.contains("Team").parent().within(() => {
        cy.contains('INVESTMENT').should('be.visible').click()
        cy.contains('MARKETING').should('be.visible').click()
        cy.contains('OPERATIONS').should('be.visible').click()
        cy.contains('ACCOUNT OFFICER').should('be.visible').click()
        cy.contains('CX').should('be.visible').click()
        cy.contains('RISK').should('be.visible').click()
        cy.contains('BUSINESS DEVELOPMENT OFFICER').should('be.visible').click()
      })
      cy.contains('Apply').should('be.visible').click()
    })
    checkTeamStatusColumnForMultiple()
  })
})