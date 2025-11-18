describe('Customer Management - UI', () => {
  beforeEach(() => {
    //Authentication check - Login
    cy.visit('https://moni-admin-fe.staging.rank.africa/')
    /*cy.window().then((win) => {
      win.sessionStorage.clear();
    });*/
    cy.get("[type$='text']").type("qa@userank.com")
    cy.get("[type$='password']").type("Password@Rank1234")
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
    cy.wait(10000)
    cy.location().then((loc) => {
      cy.log('Current URL:', loc.href)
    })
    cy.url({ timeout: 30000 }).should('include', '/customers')
  })
  it('Should have all expected clickable components visible', () => {
    // Wait for page readiness
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 10000 }).should('be.visible');

    // Assertions
    cy.get('body').within(() => {
      cy.get("[alt$='Rank Logo']", { timeout: 10000 }).should('exist');

      cy.get("[data-testid$='nav-link-customers']", { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Customers')
        .and('not.be.disabled');

      cy.get("[data-testid$='nav-link-text-staff-management']")
        .should('be.visible')
        .and('not.be.disabled');

      cy.get("[data-testid$='nav-link-text-fraud-management']")
        .should('be.visible')
        .and('not.be.disabled');

      cy.get("[data-testid$='nav-link-text-loan']")
        .should('be.visible')
        .and('not.be.disabled');

      cy.get("[class$='flex h-[48px] w-max items-center justify-between gap-2 border border-[#470C00] bg-[#470C00] rounded-full p-3 text-sm font-medium hover:bg-[#452a25] mb-1']")
        .should('be.visible')
        .and('not.be.disabled');
    });
  });
  it('Customer management UI - 1', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[class$='rounded-lg bg-white transition-shadow duration-200 border border-gray-200 p-4 flex py-8 mb-8']")
      .should('exist')
      .within(() => {
        cy.get("[class$='ml-8 pr-8']")
          .should('be.visible')
          .and('contain', 'Tier 0')
          .and('contain', 'Tier 1')
          .and('contain', 'Tier 2')
          .and('contain', 'Tier 3');
        cy.get("[class$='ml-8 border-r pr-8']").should('contain', 'Onboarded users');
        cy.get("[class$='ml-8 border-r pr-8']").should('contain', 'Total customers');
      });

    cy.get("[class$='font-bold text-[14px]']").should('be.visible');
    cy.get("[class*='flex items-center']").should('be.visible');
    cy.get("[alt$='right arrow']").should('be.visible');
    cy.get("[class$='text-[#71717A]']").should('contain', 'Rank');
    cy.get("[class$='text-[#1E4D37] hover:cursor-pointer']").should('be.visible');
    cy.get("[class$='__className_b9c7ce antialiased bg-[#fafafa]']")
      .should('contain', 'Create a client')
      .and('contain', 'Drafts')
      .and('not.be.disabled');
  }); //

  // CUSTOMERS UI 2 ===
  it('Customer management UI - 2', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[class$='font-bold text-[14px]']")
      .should('be.visible')
      .and('contain', 'Total number of customers by period');
    cy.get("[class$='font-bold text-[30px]']").should('be.visible');
    cy.get("[class$='__className_b9c7ce antialiased bg-[#fafafa]']")
      .should('contain', 'Active clients');

    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Sort').should('be.visible');
      cy.get("[alt$='sort icon']").should('exist');
      cy.contains('Filter').should('be.visible');
      cy.get("[alt$='filter icon']").should('exist');
      cy.contains('Export').should('be.visible');
    });

    cy.get("#search-bar-button").should('be.visible').and('not.be.disabled');
  });

  // CUSTOMERS MANAGEMENT UI TABLE ===
  it('Customer management UI - Table', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[data-slot$='table-container'] thead tr th")
      .should('have.length', 8)
      .and('be.visible')
      .then(($th) => {
        const headers = [
          'Phone number',
          "Customer's Name",
          'Email address',
          'Created At',
          'Gender',
          'Nationality',
          'Place of birth',
          'Monitag',
        ];
        headers.forEach((header, i) => {
          expect($th.eq(i)).to.contain(header);
        });
      });

    cy.get("[data-slot$='table-container'] tbody tr")
      .should('have.length.at.most', 20)
      .first()
      .within(() => {
        cy.get('td').each(($td) => {
          cy.wrap($td).should('not.be.empty');
        });
      });
  });

  // CUSTOMERS UI PAGINATION ===
  it('Customer UI - Pagination', () => {
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.get("[class$='flex items-center justify-between w-full']").within(() => {
      cy.get("[class$='flex items-center gap-4']").within(() => {
        cy.contains('Show').should('be.visible');
        cy.get("[class$='text-sm text-gray-600']").should('exist');
      });

      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist');
        cy.get("[aria-label$='Next page']").should('not.be.disabled');
        cy.get("[aria-current$='page']").should('not.be.disabled');
      });
    });
  })
})

describe('Sorting & Filtering - Functionality check', () => {
  const sections = [
    'Phone Number',
    'Customer Name',
    'Email Address',
    'Date Created',
    'Gender',
    'Nationality',
    'Place of Birth',
    'Monitag'
  ];
  let beforeSort;
  let filtersPrimary;
  let secondaryFilters;
  let beforeFilt;
  beforeEach(() => {
    //Authentication check - Login
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
  it('Sorting Functionality', () => {
    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Sort').should('be.visible').click();
    })
    sections.forEach((section) => {
      cy.contains("[class$='border-b-2 p-2 text-[16px] text-[#3F3F46]']", section).within(() => {
        cy.contains("Ascending")
        cy.contains("Descending") // Moni tag is not fetchable
      })
    });
  })
  it('Sort application', () => {
    // Single sort application
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(2)").first().should('contain', 'Ayodeji Samuel Ogundijo')
    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Sort').should('be.visible').click();
    })
    cy.get("[class$='w-[415px] p-2 flex flex-col justify-between']")
    cy.get("[class$='text-[14px] pl-4']").should('contain', 'Sort');

    cy.contains("[class$='border-b-2 p-2 text-[16px] text-[#3F3F46]']", 'Customer Name').within(() => {
      cy.contains('Ascending').click();
      cy.contains('Descending').click();
    });
    cy.get("[class$='bg-black h-full px-3 py-1 ml-2 text-white rounded-lg flex justify-center items-center hover:cursor-pointer']").click(); // CLick apply
    cy.wait(8000)
    cy.get("[class$='w-[415px] p-2 flex flex-col justify-between']").should('not.exist');
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(2)").first().should('not.contain', 'Ayodeji Samuel Ogundijo')

    // Multiple sort applicartion (2)
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(4)").first().should('contain', 'Oct 10, 2023')
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(4)").first().should('contain', 'Ayodeji Samuel Ogundijo')
    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Sort').should('be.visible').click();
    })
    cy.get("[class$='w-[415px] p-2 flex flex-col justify-between']")
    cy.get("[class$='text-[14px] pl-4']").should('contain', 'Sort');

    cy.contains("[class$='border-b-2 p-2 text-[16px] text-[#3F3F46]']", 'Customer Name').within(() => {
      cy.contains('Ascending').click();
      cy.contains('Descending').click();
    });
    cy.contains("[class$='border-b-2 p-2 text-[16px] text-[#3F3F46]']", 'Customer Name').within(() => {
      cy.contains('Ascending').click();
      cy.contains('Descending').click();
    });
    cy.get("[class$='bg-black h-full px-3 py-1 ml-2 text-white rounded-lg flex justify-center items-center hover:cursor-pointer']").click(); // CLick apply
    cy.wait(8000)
    cy.get("[class$='w-[415px] p-2 flex flex-col justify-between']").should('not.exist');
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(2)").first().should('not.contain', 'Ayodeji Samuel Ogundijo')
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(4)").first().should('contain', 'Oct 10, 2023')

    //Clear sort options --------------------------------------------------
    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Sort').should('be.visible').click();
    })
    cy.get("[class$='w-[415px] p-2 flex flex-col justify-between']")
    cy.get("[class$='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer']").click()
    cy.get("[class$='w-[415px] p-2 flex flex-col justify-between']").should('not.exist');

    //Cancel feature (x) --------------------------------------------------------
    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Sort').should('be.visible').click();
    })
    cy.get("[class$='w-[415px] p-2 flex flex-col justify-between']")
    cy.get("[data-nimg$='1']").click()
    cy.get("[class$='w-[415px] p-2 flex flex-col justify-between']").should('not.exist');
  })

  //Filtering -------------------------------------------------------------------
  it('Filtering Check', () => {
    filtersPrimary = {
      'Phone Verification': ['Verified', 'Not Verified'],
      'Email Verification': ['Verified', 'Not Verified'],
      'Date created': ['Last 7 days', 'Last 30 days', 'Last 6 months', 'Last year'],
      'Marital status': ['Single', 'Married', 'Divorced', 'Widowed'],
      'Employment status': ['Employed', 'Unemployed', 'Self Employed', 'Student'],
      'Status': ['Active', 'Inactive'],
      'Migration status': ['Migrated', 'Not Migrated'],
      'Manual verification': ['Verified', 'Not Verified'],
      'Business Domain': ['CBA', 'App', 'Admin', 'Ajomoney'],
      'Educational level': ['High School', 'Bachelor', 'Masters', 'Ph.D'],
      'Tier Level': ['Tier 1', 'Tier 2', 'Tier 3']
    };
    secondaryFilters = {
      'Date created': ['Start date', 'End date',],
      'Nationality': ['Select up to 5 countries'],
      'Birth state': ['Select state'],
      'Country of registration': ['Select country']
    }
    let countries;
    countries = ['Angola', 'Brazil', 'Canada', 'Dominica', 'Egypt', 'France', 'Gambia', 'Hong Kong', 'India', 'Japan', 'Kenya', 'Liberia', 'Mali', 'Nepal', 'Oman', 'Pakistan', 'Qatar', 'Romania', 'Samoa', 'Tunisia', 'Uganda', 'Viet Nam', 'Western Sahara', 'Yemen', 'Zambia'];
    // Open filter
    cy.get("[class*='w-full flex justify-between mb-[24px]']").contains('Filter').should('be.visible').click();
    cy.get("[class*='p-4 h-[685px] overflow-auto']").should('exist').within(() => {
      cy.contains('Phone verification').parent().within(() => {
        cy.contains('Verified').click();
        cy.contains('Not Verified').click();
        //----------------------------------
        cy.contains('Verified').click();
        cy.contains('Not Verified').click();
      });
    });
    // Reset filter
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    // Email verification filter
    cy.contains('Email verification').parent().within(() => {
      cy.contains('Verified').click();
      cy.contains('Not Verified').click();
      //----------------------------------
      cy.contains('Verified').click();
      cy.contains('Not Verified').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    // Date created filter
    cy.contains('Date created').parent().within(() => {
      cy.contains('Last 7 days').click();
      cy.contains('Last 30 days').click();
      cy.contains('Last 6 months').click();
      cy.contains('Last year').click();
      //-----------------------------------
      cy.contains('Last 7 days').click();
      cy.contains('Last 30 days').click();
      cy.contains('Last 6 months').click();
      cy.contains('Last year').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    // Marital status filter
    cy.contains('Marital status').parent().within(() => {
      cy.contains('Single').click();
      cy.contains('Married').click();
      cy.contains('Divorced').click();
      cy.contains('Widowed').click();
      //-----------------------------------
      cy.contains('Single').click();
      cy.contains('Married').click();
      cy.contains('Divorced').click();
      cy.contains('Widowed').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    // Emplyoment status filter
    cy.contains('Employment status').parent().within(() => {
      cy.contains('Employed').click();
      cy.contains('Unemployed').click();
      cy.contains('Self Employed').click();
      cy.contains('Student').click();
      //-----------------------------------
      cy.contains('Employed').click();
      cy.contains('Unemployed').click();
      cy.contains('Self Employed').click();
      cy.contains('Student').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    // Status filter
    cy.contains('Status').parent().within(() => {
      cy.contains('Active').click();
      cy.contains('Inactive').click();
      //----------------------------------
      cy.contains('Active').click();
      cy.contains('Inactive').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    // Migration Status filter
    cy.contains('Migration status').parent().within(() => {
      cy.contains('Migrated').click();
      cy.contains('Not Migrated').click();
      //----------------------------------
      cy.contains('Migrated').click();
      cy.contains('Not Migrated').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    // Manual Verificatoon filter
    cy.contains('Manual Verification').parent().within(() => {
      cy.contains('Verified').click();
      cy.contains('Not Verified').click();
      //----------------------------------
      cy.contains('Verified').click();
      cy.contains('Not Verified').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    // Business Domain filter
    cy.contains('Business Domain').parent().within(() => {
      cy.contains('CBA').click();
      cy.contains('App').click();
      cy.contains('Admin').click();
      cy.contains('Ajomoney').click();
      //-----------------------------------
      cy.contains('CBA').click();
      cy.contains('App').click();
      cy.contains('Admin').click();
      cy.contains('Ajomoney').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();
    
    // Education level filter
    cy.contains('Employment status').parent().within(() => {
      cy.contains('Employed').click();
      cy.contains('Unemployed').click();
      cy.contains('Self Employed').click();
      cy.contains('Student').click();
      //-----------------------------------
      cy.contains('Employed').click();
      cy.contains('Unemployed').click();
      cy.contains('Self Employed').click();
      cy.contains('Student').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();
    
    // Tier Level filter
    cy.contains('Tier Level').parent().within(() => {
      cy.contains('Tier 1').click();
      cy.contains('Tier 2').click();
      cy.contains('Tier 3').click();
      //-----------------------------------
      cy.contains('Tier 1').click();
      cy.contains('Tier 2').click();
      cy.contains('Tier 3').click();
    });
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    //Nationality filter
    cy.contains('Nationality').parent().within(() => {
      cy.get("[class$='w-full bg-white relative undefined']").click()
    })
    cy.get("[class$='p-4 border mt-2 w-full max-h-[400px] rounded-lg shadow-sm bg-white absolute z-10 ']")
    cy.get("[class$='flex border border-grey p-2 rounded-full bg-white w-full ']").within(()=> {
      cy.get(`[placeholder$="search countries"]`).should('exist')
    })
    cy.get("[class$='overflow-y-auto max-h-[235px] px-4']").within(() => {
      countries.forEach((country) => {
        cy.contains("[class$='border-b w-full py-3 flex justify-between']", country).click({ force: true });
      });
      //cy.contains("[class$='border-b w-full py-3 flex justify-between']", 'Angola').click({ force: true });
    });
    cy.get("[id$='customerCountry-add']").click()
    cy.contains("[class$='py-2 flex flex-wrap']", 'Angola')
    cy.contains("[class$='py-2 flex flex-wrap']", 'Brazil')
    cy.contains("[class$='py-2 flex flex-wrap']", 'Canada')
    cy.contains("[class$='py-2 flex flex-wrap']", 'Dominica')
    cy.contains("[class$='py-2 flex flex-wrap']", 'Egypt')
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    //Birth state
    cy.contains('Birth state').parent().within(() => {
      cy.get(`[id$='dropdown']`).should('contain', 'Select state')
      cy.get("[id$='dropdown']").click()
    })
    cy.get("[class$='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").within(()=> {
      cy.get("[id$='dropdown-option-0']").click({ force: true });
    })
    cy.contains('Birth state').parent().within(() => {
      cy.get("[id$='dropdown']").should('contain', 'ABIA')
    })
    //------------------------------------------------
    cy.contains('Birth state').parent().within(() => {
      cy.get("[id$='dropdown']").click()
    })
    cy.get("[class$='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").within(()=> {
      cy.get("[id$='dropdown-option-24']").click({ force: true });
    })
    cy.contains('Birth state').parent().within(() => {
      cy.get("[id$='dropdown']").should('contain', 'LAGOS')
    })
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    //Country of registration
    cy.contains('Country of registration').parent().within(() => {
      cy.get(`[id$='dropdown']`).should('contain', 'Select country')
      cy.get("[id$='dropdown']").click()
    })
    cy.get("[class$='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").within(()=> {
      cy.get("[id$='dropdown-option-1']").click({ force: true });
    })
    cy.contains('Country of registration').parent().within(() => {
      cy.get("[id$='dropdown']").should('contain', 'Afghanistan')
    })
    //------------------------------------------------
    cy.contains('Country of registration').parent().within(() => {
      cy.get("[id$='dropdown']").click()
    })
    cy.get("[class$='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto']").within(()=> {
      cy.get("[id$='dropdown-option-20']").click({ force: true });
    })
    cy.contains('Country of registration').parent().within(() => {
      cy.get("[id$='dropdown']").should('contain', 'Belarus')
    })
    cy.get("[class*='px-4 py-2 bg-[#E4E4E7] text-black rounded-lg']").should('be.visible').click();

    //Date created
    cy.contains('Date created').parent().within(() => {
      cy.get(`[data-testid$='filter-customer-date-start']`).should('contain', 'Start date').click()
    })
    cy.get("[class$='w-full max-w-md bg-white rounded-lg shadow-lg p-4']").within(()=> {
      cy.contains('SUN')
      cy.contains('MON')
      cy.contains('TUE')
      cy.contains('WED')
      cy.contains('THU')
      cy.contains('FRI')
      cy.contains('SAT')
      cy.contains("October 2025")
      cy.contains("1")
      cy.contains("10")
      cy.contains("18")
      cy.contains("29")
      cy.get("[aria-label$='Previous month']").should('exist')
      cy.get("[aria-label$='Next month']").should('exist')
      cy.get("[data-testid$='calendar-cancel']").should('exist')
      cy.get("[data-testid$='calendar-done']").should('exist').click()
    })
    // --------------------------------------- End date
    cy.contains('Date created').parent().within(() => {
      cy.get(`[data-testid$='filter-customer-date-end']`).should('contain', 'End date').click()
    })
    cy.get("[class$='w-full max-w-md bg-white rounded-lg shadow-lg p-4']").within(()=> {
      cy.contains('SUN')
      cy.contains('MON')
      cy.contains('TUE')
      cy.contains('WED')
      cy.contains('THU')
      cy.contains('FRI')
      cy.contains('SAT')
      cy.contains("October 2025")
      cy.contains("1")
      cy.contains("10")
      cy.contains("18")
      cy.contains("29")
      cy.get("[aria-label$='Previous month']").should('exist')
      cy.get("[aria-label$='Next month']").should('exist')
      cy.get("[data-testid$='calendar-cancel']").should('exist')
      cy.get("[data-testid$='calendar-done']").should('exist').click()
    })
  })
  it('Filtering Application', ()=> {
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").eq(1).should('be.visible')

    //Cancel feature (x) --------------------------------------------------------
    cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
      cy.contains('Filter').should('be.visible').click();
    })
    cy.get("[class$='flex flex-col h-[605px]']").should('exist').within(()=> {
      cy.get("[alt$='close']").click()
    })
    cy.get("[class$='flex flex-col h-[605px]']").should('not.exist');

    // application
    cy.get("[class*='w-full flex justify-between mb-[24px]']").contains('Filter').should('be.visible').click();
    cy.get("[class*='p-4 h-[685px] overflow-auto']").should('exist').within(() => {
      cy.contains('Phone verification').parent().within(() => {
        cy.contains('Verified').click();
      })
    })
    cy.get("[class$='px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800']").click()
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").eq(1).should('not.be.visible')
  })

  it('Secondary filters check - Date created', ()=> {
    // Start date check
    cy.get("[class*='w-full flex justify-between mb-[24px]']").contains('Filter').should('be.visible').click();
    cy.contains('Date created').parent().within(() => {
      cy.get(`[data-testid$='filter-customer-date-start']`).should('contain', 'Start date').click()
    })
    cy.get("[class$='w-full max-w-md bg-white rounded-lg shadow-lg p-4']").within(()=> {
      cy.contains('SUN')
      cy.contains('MON')
      cy.contains('TUE')
      cy.contains('WED')
      cy.contains('THU')
      cy.contains('FRI')
      cy.contains('SAT')
      cy.contains("October 2025")
      cy.contains("10").click()
    })
    cy.contains('Date created').parent().within(() => {
      cy.get(`[data-testid$='filter-customer-date-start']`).should('contain', 'October 10, 2025')
    })

    // End date check
    cy.contains('Date created').parent().within(() => {
      cy.get(`[data-testid$='filter-customer-date-end']`).should('contain', 'End date').click()
    })
    cy.get("[class$='w-full max-w-md bg-white rounded-lg shadow-lg p-4']").within(()=> {
      cy.contains('SUN')
      cy.contains('MON')
      cy.contains('TUE')
      cy.contains('WED')
      cy.contains('THU')
      cy.contains('FRI')
      cy.contains('SAT')
      cy.contains("October 2025")
      cy.contains("10").click()
    })
    cy.contains('Date created').parent().within(() => {
      cy.get(`[data-testid$='filter-customer-date-end']`).should('contain', 'October 10, 2025')
    })
    cy.get("[class$='px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800']").click()
    cy.wait(8000)
  })
})

describe ('Filter by search', ()=>{
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

describe('List of Users', ()=> {
  /* BDD - "Given - being in the Customers area, 
Then - I should be able to see a list of all registered users/clients (With all associated column details - i.e. phone number, e-mail, etc)" 
Then - I should be able to see the amount of customer list table pages. And upon navigation, I should be able to see the particular list page I am at every given page
Then - I should be able to see the total number of customers, and the total number of customers should correlate with the number of customers from the list
Note - the total number of customers shown by the pagination indication below the table should correlate with the number of customer on each page and their serial (focus - 1-20 out of 900 entries. Then the number of entries should be 20 on that particular page. And the serial should be correctly 1 to 20)
Then - I should be able to slide through the whole list (That is, each individual customer list page contains 10 customers. You have to go to page 2,3,4,... and so on. In order to see the rest part of the customer list, by using the navigations provided - both by tapping th numbers and the directional buttons [<], [>]).
*/
  beforeEach(() => {
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
  it('Total users', ()=> {
    cy.get('p.font-bold.text-2xl')
    .first() // gets the first match if there are multiple
    .invoke('text')
    .then((totalText) => {
      const totalCustomers = Number(totalText.replace(/,/g, '').trim()); // convert "1,419" → 1419

      // Now get the text showing total entries at the bottom
      cy.contains('Showing')
        .invoke('text')
        .then((entriesText) => {
          // Extract the number after "of"
          const match = entriesText.match(/of\s([\d,]+)/); //Extracts number right after of
          expect(match, 'should contain "of ### entries"').to.not.be.null;
          const totalEntries = Number(match[1].replace(/,/g, ''));

          // Compare both
          expect(totalEntries).to.eq(totalCustomers);
        });
    });
  })
  it('Next page/Previous page navigation', ()=> {
    cy.get("[aria-label$='Next page']").click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20).first().within(() => {
      cy.get('td').eq(0).should('not.contain', '+2348123444444')
    })
    // Page navigation indication
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 21 - 40')
    cy.get("[aria-label$='Previous page']").click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20).first().within(() => {
      cy.get('td').eq(0).should('contain', '+2348123444444')
    })
    // Page navigation indication
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 1 - 20')
  })
  it('Mid point between table pages', ()=> {
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20).first().within(() => {
      cy.get('td').eq(1).should('contain', 'Ayodeji Samuel Ogundijo')
    })
    cy.get("[aria-hidden$='true']").click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 20).first().within(() => {
      cy.get('td').eq(1).should('not.contain', 'Ayodeji Samuel Ogundijo')
    })
    // Midpoint "..." click - Page land check
    cy.get("[data-testid$='pagination-button-1']").click()
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-hidden$='true']").click()
    cy.get("[aria-current$='page']")
      .invoke('text')
      .then((text) => {
        const currentPage = Number(text.trim());
        expect(currentPage).to.be.oneOf([33, 34, 35, 36, 37]); // any valid values
      });
  })
  it('Previous page disabled - First page | next page disabled - Last page', ()=> {
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-label$='Previous page']").should('be.disabled')
    cy.get("[data-testid$='pagination-button-71']").click()
    cy.get("[aria-current$='page']").should('contain', 71)
    cy.get("[aria-label$='Next page']").should('be.disabled')
    cy.get("[aria-label$='Previous page']").should('not.be.disabled')
  })
  it('Table page list size', ()=> {
    cy.get("[data-testid$='table-page-size-select']").select("Show 10");
    cy.wait(6000);

    // -------------- 10
    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 10) {
        expect(rowCount).to.eq(10);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 10')
      } else if (rowCount < 10) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 20
    cy.get("[data-testid$='table-page-size-select']").select("Show 20");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 20) {
        expect(rowCount).to.eq(20);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 20')
      } else if (rowCount < 20) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 50
    cy.get("[data-testid$='table-page-size-select']").select("Show 50");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 50) {
        expect(rowCount).to.eq(50);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 50')
      } else if (rowCount < 50) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 100
    cy.get("[data-testid$='table-page-size-select']").select("Show 100");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 500) {
        expect(rowCount).to.eq(500);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 100')
      } else if (rowCount < 500) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 200
    cy.get("[data-testid$='table-page-size-select']").select("Show 200");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 200) {
        expect(rowCount).to.eq(200);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 200')
      } else if (rowCount < 200) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 500
    cy.get("[data-testid$='table-page-size-select']").select("Show 500");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 500) {
        expect(rowCount).to.eq(500);
        cy.get("[class$='flex items-center justify-between w-full']").should('contain', 'Showing 1 - 500')
      } else if (rowCount < 500) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });

  })
  it('Pagination indication functionality', ()=> {
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 1 - 20')
    cy.get("[data-testid$='pagination-button-2']").click()
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 21 - 40')
    cy.get("[data-testid$='pagination-button-3']").click()
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 41 - 60')
    cy.get("[data-testid$='pagination-button-4']").click()
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 61 - 80')
    cy.get("[data-testid$='pagination-button-5']").click()
    cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing 81 - 100')
  })
})

describe('Customer Management', ()=> {
  let customerDetails;
  let tableHeaders;
  let tags;
  let customerId;
  let savingssortBy;
  customerDetails = [
    'First name',
    'Middle name',
    'Surname',
    'Customer ID',
    'Date Created',
    'Gender',
    'Marital status',
    'Nationality',
    'Birth country',
    'Birth state',
    'Date of birth',
    'Referred by',
    'Monitag', 
    'Status',
    '1.0 migration status',
    'Manual verification',
    'Business domain',
    'Highest educational degree',
    'Employment status',
    'Name of school',
    'Course of study',
    'School address',
    'Home address'
  ]
  tableHeaders = [
    'Name',
    'Name/Value',
    'Document',
    'Country',
    'Verification status',
    'Verification type',
    'Action'
  ]
  beforeEach(() => {
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
    cy.wait(8000)
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('bills billers')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.url().should('include', '/customers/')
  })
  /*it.only('Check', ()=> {
    cy.wait(5000)
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Savings').click()
      cy.wait(5000)
    })
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)")
  })*/
  it('Get particular a customer - Details UI Check', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      customerDetails.forEach((customerDetail) => {
        cy.contains(customerDetail).should('be.visible');
      });
      cy.contains("KYC").should('be.visible')
      cy.contains("Customer Management").should('be.visible')
      cy.get("[alt$='profile image']").should('be.visible')
      cy.contains("Customer's Details").should('be.visible')
      //cy.get("[class$='text-white bg-[#F31260] rounded-full px-6 py-1 w-min h-min text-[10px] text-nowrap']")
      cy.get("[type$='button']").should('contain', 'Customer Actions').and('be.visible')
      cy.get("[class$='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-[#17C964] text-white px-[12px] py-[6px] px-5']")
      cy.contains('Details')
      cy.contains('Account Information')
      cy.contains('Fraud')
      cy.contains('Loans')
      cy.contains('Savings')
      cy.contains('Next of kin details')
      cy.contains('Phone number')
      cy.contains('Name')
      cy.contains('Email address')
      cy.contains('Relationship')
      customerId = cy.get("[class$='font-medium lg:text-base text-sm']").eq(3).invoke('text').then((customerId) => {
        const trimmedId = customerId.trim()
        cy.url().should('include', `/${trimmedId}/`)
      })
      tableHeaders.forEach((tableHeader) => {
        cy.contains(tableHeader).should('be.visible');
      });
    })
    cy.contains('Customer Management')
    cy.get("[alt$='profile image']").should('be.visible')
    cy.get("[class$='flex items-center']").within(()=> {
      cy.contains('Rank')
      cy.contains('Customers')
      cy.wait(6000)
    })
  })
  it('Get particular a customer - Account Information UI Check', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Account Information').click()
      cy.wait(8000)
    })
    cy.url().should('include', '/account-information')
    cy.get("[class$='flex justify-between items-center']").within(()=> {
      cy.contains('Rank')
      cy.contains('Customers')
      cy.wait(8000)
    })
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Naira Account balance')
      cy.contains('Ledger balance')
      cy.contains('Account Name')
      cy.contains('Bank')
      cy.contains('Account No')
      cy.contains('Main Account')
      // <> Table ---------------------------
      /*cy.contains('AMOUNT');
      cy.contains("FEES");
      cy.contains('REFERENCE');
      cy.contains('STATUS');
      cy.contains('DATE');
      cy.contains('BALANCE BEFORE');
      cy.contains('BALANCE AFTER');
      cy.contains('DESTINATION NAME');
      cy.contains('DESTINATION ACCOUT');
      cy.contains('DESTINATION BANK');
      cy.contains('FLAG');
      cy.get("[class$='w-full border-collapse border-none'] tbody tr").should('not.be.empty')*/
      // </>

      cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
        cy.contains('Sort').should('be.visible');
        cy.get("[alt$='sort icon']").should('exist');
        cy.root().should('not.be.disabled');
      });
      cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
        cy.contains('Filter').should('be.visible');
        cy.get("[alt$='filter icon']").should('exist');
        cy.root().should('not.be.disabled');
      });
      cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
        cy.contains('Export').should('be.visible');
        cy.root().should('not.be.disabled');
      });
      cy.get("[class$='w-1/3 flex']").should('exist').and('not.be.disabled');
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'Showing')
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'entries')
      cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible')
      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist')
        cy.get("[aria-label$='Next page']").should('not.be.disabled')
        cy.get("[aria-current$='page']").should('not.be.disabled')
      })
      cy.contains('Customer Management')
      cy.get("[alt$='profile image']").should('be.visible')
      cy.get("[class$='font-bold text-[20px]']").should('be.visible')
      cy.get("[class$='text-[24px] font-bold']").should('be.visible')
    })
  })

  it('Get particular a customer - Fraud UI Check', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Fraud').click()
      cy.wait(8000)
    })
    cy.url().should('include', '/fraud')
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      // <> Table ---------------------------
      /*cy.contains('AMOUNT');
      cy.contains("FEES");
      cy.contains('REFERENCE');
      cy.contains('STATUS');
      cy.contains('DATE');
      cy.contains('BALANCE BEFORE');
      cy.contains('BALANCE AFTER');
      cy.contains('DESTINATION NAME');
      cy.contains('DESTINATION ACCOUT');
      cy.contains('DESTINATION BANK');
      cy.contains('FLAG');
      cy.get("[class$='w-full border-collapse border-none'] tbody tr").should('not.be.empty')*/
      // </>
      cy.get("[class$='w-full flex justify-between mb-6']").within(() => {
        cy.contains('Filter').should('be.visible');
        cy.get("[alt$='filter icon']").should('exist');
        cy.root().should('not.be.disabled');
      });
      cy.get("[class$='w-full flex justify-between mb-6']").within(() => {
        cy.contains('Export').should('be.visible');
        cy.root().should('not.be.disabled');
      });
      cy.get("[id$='search-bar-button']").should('exist').and('not.be.disabled');
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'Showing')
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'entries')
      cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible')
      cy.get("[aria-label$='Pagination']").within(() => {
        cy.get("[aria-label$='Previous page']").should('exist')
        cy.get("[aria-label$='Next page']").should('exist')
        cy.get("[aria-current$='page']").should('exist')
      })
      cy.get("[class$='font-bold text-[20px]']").should('be.visible')
      cy.get("[alt$='profile image']").should('be.visible')
      cy.contains('Customer Management')
    })
    cy.get("[class$='flex justify-between items-center']").within(()=> {
        cy.contains('Rank')
        cy.contains('Customers')
        cy.wait(8000)
    })
  })
  it('Get particular a customer - Savings UI Check', ()=> {
    cy.wait(5000)
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Savings').click()
      cy.wait(5000)
    })
    cy.url().should('include', '/savings')
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      // <> Table ---------------------------
      cy.get("[data-slot$='table-container'] thead tr th")
      .should('have.length', 7)
      .and('be.visible')
      .then(($th) => {
        const headers = [
          'Plan type',
          "Savings plan ID",
          'Plan name',
          'Savings balance',
          'Interest earned',
          'Status',
          'Start date'
        ];
        headers.forEach((header, i) => {
          expect($th.eq(i)).to.contain(header);
        });
      });
      cy.get("[class$='font-medium lg:text-base text-sm']")
      .eq(2) // gets the first match if there are multiple
      .invoke('text')
      .then((totalText) => {
        const totalCustomers = Number(totalText.replace(/,/g, '').trim()); // convert "1,419" → 1419

        // Text showing total entries at the bottom
        cy.contains('Showing')
          .invoke('text')
          .then((entriesText) => {
            // Extracting the number after "of"
            const match = entriesText.match(/of\s([\d,]+)/); //Extracts number right after of
            expect(match, 'should contain "of ### entries"').to.not.be.null;
            const totalEntries = Number(match[1].replace(/,/g, ''));

            // Compare both
            expect(totalEntries).to.eq(totalCustomers);
          });
      });
      cy.get("[data-slot$='table-container'] tbody tr td:nth-child(2)").should('not.be.empty')
      cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.be.empty')
      cy.get("[data-slot$='table-container'] tbody tr td:nth-child(4)").should('contain', '₦')
      cy.get("[data-slot$='table-container'] tbody tr td:nth-child(5)").should('contain', '₦')
      cy.get("[data-slot$='table-container'] tbody tr").each(($row, index) => {
        cy.wrap($row).within(() => {
          cy.get(`[class$='flex w-fit items-center bg rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800']`).invoke('text').then((text) => {
            const status = text.trim();

            if (status === 'Active') {
              cy.wrap($row).should('contain.text', 'Active');
            } else if (status === 'Inactive') {
              cy.wrap($row).should('contain.text', 'Inactive');
            } else {
              cy.log(`⚠️ Row ${index + 1}: Invalid status "${status}"`);
            }
          });
        });
      });

      cy.get("[class$='flex items-center justify-between w-full']").within(() => {
        cy.get("[class$='text-sm text-gray-600']").should('contain', 'Showing')
        cy.get("[class$='text-sm text-gray-600']").should('contain', 'entries')

        cy.get("[aria-label$='Pagination']").within(() => {
          cy.get("[aria-label$='Previous page']").should('exist');
          cy.get("[aria-label$='Next page']").should('not.be.disabled');
          cy.get("[aria-current$='page']").should('not.be.disabled');
        });
      });
      cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 10).eq(1).within(() => {
      cy.get('td').eq(2).should('contain', 'House in Lekki')
    })
    cy.get("[aria-hidden$='true']").click()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.most', 10).eq(1).within(() => {
      cy.get('td').eq(2).should('not.contain', 'House in Lekki')
    })

    // Midpoint "..." click - Page land check
    cy.get("[data-testid$='pagination-button-1']").click()
    cy.get("[aria-current$='page']").should('contain', 1)
    cy.get("[aria-hidden$='true']").click()
    cy.get("[aria-current$='page']")
      .invoke('text')
      .then((text) => {
        const currentPage = Number(text.trim());
        expect(currentPage).to.be.oneOf([9, 10, 11, 12, 13]); // any valid values
      });
    cy.get("[data-testid$='pagination-button-1']").click()

    // Savings table page list
    cy.get("[data-testid$='table-page-size-select']").select("Show 10");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 10) {
        expect(rowCount).to.eq(10);
      } else if (rowCount < 10) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 20
    cy.get("[data-testid$='table-page-size-select']").select("Show 20");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 20) {
        expect(rowCount).to.eq(20);
      } else if (rowCount < 20) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 50
    cy.get("[data-testid$='table-page-size-select']").select("Show 50");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 50) {
        expect(rowCount).to.eq(50);
      } else if (rowCount < 50) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 100
    cy.get("[data-testid$='table-page-size-select']").select("Show 100");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 500) {
        expect(rowCount).to.eq(500);
      } else if (rowCount < 500) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 200
    cy.get("[data-testid$='table-page-size-select']").select("Show 200");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 200) {
        expect(rowCount).to.eq(200);
      } else if (rowCount < 200) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });
    // -------------- 500
    cy.get("[data-testid$='table-page-size-select']").select("Show 500");
    cy.wait(6000);

    cy.get("[data-slot$='table-container'] tbody tr").then(($rows) => {
      const rowCount = $rows.length;
      cy.log(`Found ${rowCount} rows`);

      if (rowCount === 500) {
        expect(rowCount).to.eq(500);
      } else if (rowCount < 500) {
        cy.get("[class$='font-medium lg:text-base text-sm']")
          .eq(2)
          .then(($el) => {
            expect($el).to.exist;
          });
      } else {
        cy.log('Invalid');
      }
    });

    // Filter Savings table by search
    // Plan type
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by plan type or plan name"]`).should('exist')
    })
    cy.get("#search-bar-button").type('reserve')
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('contain', 'Reserve')
    cy.get("[class$='focus-visible:outline-none ml-2 w-full']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 10)
    // ------------------
    /*cy.get("#search-bar-button").type('goals')
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('contain', 'Goals')
    cy.get("[class$='focus-visible:outline-none ml-2 w-full']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 10)*/

    // Plan name - Fetch by name
    cy.get("#search-bar-button").type('bzbdb')
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 1).first().within(() => {
      cy.get('td').eq(2).should('contain', 'bzbdb');
    })
    cy.get("[class$='focus-visible:outline-none ml-2 w-full']").clear()
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 10)
  
    // Unavailable plan type/name
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by plan type or plan name"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('iiiiiiiiiiiiii')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length', 0)
    cy.get("[alt$='empty box']").should('be.visible')
    cy.get("[class$='font-semibold text-[2rem] text-center']").should('contain', 'No result found!')
    cy.get("[class$='text-gray-600 text-center']").should('contain', "We couldn't find any result for this query.")
    cy.get("[class$='text-gray-600 text-center']").should('contain', "Try adjusting the search again")
    cy.get("[class$='focus-visible:outline-none ml-2 w-full']").clear()

    tags = [
      'Target',
      'Reserves',
      'Goals',
      'Naira Reserve',
      'Periodic'
    ]
    savingssortBy = [
      'Start date',
      'Maturity date',
      'Balance',
      'Principal',
      'Interest earned',
      'Interest withdrawn',
      'Interest available to the withdrawn',
      'Auto topup amount'
    ]
    // Filtering User Savings table
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('be.visible').within(()=> {
      cy.get("[class$='text-base font-semibold']").should('contain', 'Filter')
      cy.get("[class$='md:text-base text-sm font-semibold text-gray-900']").eq(0).should('contain', 'Tag')
      cy.get("[class$='md:text-base text-sm font-semibold text-gray-900']").eq(0).should('contain', 'Sort by')
      cy.get("[aria-hidden*='true']").should('exist')
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-white text-black border border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm px-4 !bg-gray-200 border-0']").should('exist').and('contain', 'Clear all filters')
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply')
    })
    //Filter options availability check
    tags.forEach((tag) => {
      cy.get("[class$='space-y-2']").eq(1).within(()=> {
        cy.get("[class$='flex w-max py-1 px-3 border border-[#E4E4E7] rounded-full hover:cursor-pointer items-center font-normal text-sm transition-colors duration-200 text-black']").should('contain', tag)
      })
    })
    savingssortBy.forEach((item) => {
      cy.get("[class$='space-y-2']").eq(1).within(()=> {
        cy.get("[class$='flex w-max py-1 px-3 border border-[#E4E4E7] rounded-full hover:cursor-pointer items-center font-normal text-sm transition-colors duration-200 text-black']").should('contain', item)
      })
    })
    //Apply filter check (Single) - TAG
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.contains('Reserve').click()
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply').click()
    })
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.contain', 'Reserve')
    //Apply filter check (Single) - Sort by
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.contains('Start date').click()
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply').click()
    })
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(7)").eq(1).should('not.contain', 'Oct 28, 2025')

    // ---= Multiple Tag/Tag
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.contains('Naira reserve').click()
      cy.contains('Goals').click()
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply').click()
    })
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.contain', 'Reserve')
    // ---= Multiple Tag/Sort by
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.contains('Goals').click()
      cy.contains('Start date').click()
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-[#191919] text-white hover:bg-gray-800 px-4 py-2 text-sm px-4 bg-black text-white hover:bg-gray-800']").should('exist').and('contain', 'Apply').click()
    })
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(1)").should('not.contain', 'Reserve')
    cy.get("[data-slot$='table-container'] tbody tr td:nth-child(7)").eq(0).should('not.contain', '')

    //Close feature
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.get("[aria-hidden*='true']").should('exist').click()
    })
    cy.get("[data-testid$='filters-content']").should('not.exist')
    //Clear all filters
    cy.get("[data-testid$='filters-trigger']").should('exist').click()
    cy.get("[data-testid$='filters-content']").should('exist').within(()=> {
      cy.get("[class$='flex items-center justify-center rounded-[8px] transition-colors duration-200 font-semibold bg-white text-black border border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm px-4 !bg-gray-200 border-0']").should('exist').and('contain', 'Clear all filters').click()
    })
    cy.get("[data-testid$='filters-content']").should('exist')

    // Valid Letter population
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by plan type or plan name"]`).should('exist')
    })
    cy.get("#search-bar-button").type('h')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").should('have.length.at.least', 1)

      cy.contains('Total Savings Balance');
      cy.contains('Total Interest Earned');
      cy.contains('Active Savings Plans');
      cy.contains('Closed Savings Plans');
      cy.contains('Active savings plans');
      cy.contains('Matured savings plans');
      cy.contains('Closed savings plans');
      cy.get("[class$='w-full flex justify-between mb-[24px]']").within(() => {
        cy.contains('Filter').should('be.visible');
        cy.root().should('not.be.disabled');
      });
      cy.get("[alt$='search icon']").should('exist').and('not.be.disabled');
      /*cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'Showing')
      cy.get("[class$='flex items-center justify-between mt-6']").should('contain', 'entries')*/
      cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible')
      cy.get("[class$='font-bold text-[20px]']").should('be.visible')
      cy.get("[alt$='profile image']").should('be.visible')
      cy.contains('Customer Management')
    })
    cy.get("[class$='flex justify-between items-center']").within(()=> {
      cy.contains('Rank')
      cy.contains('Customers')
      cy.get
      cy.wait(8000)
      customerId = cy.get("[class$='text-[#1E4D37]']").eq(2).invoke('text').then((customerId) => {
        const trimmedId = customerId.trim()
        cy.url().should('include', `/${trimmedId}/`)
      })
    })
    //Matured savings
    cy.contains('Matured savings plans').click()
    cy.get("[data-slot$='table-container']").should('exist')

    //Closed savings
    cy.contains('Closed savings plans').click()
    cy.get("[data-slot$='table-container']").should('exist')
  })
})

describe('Savings Interest Summation Validation', () => {
  beforeEach(() => {
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
    cy.wait(8000)
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('8156768888')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.url().should('include', '/customers/')
  })
  it.only('Total vs summation interest checks', () => {
    cy.contains('Savings').click()
    let totalInterest = 0;

    // Function: Add up interest from current page
    const sumInterestOnPage = () => {
      cy.get("[data-slot$='table-container'] tbody tr").each(($row) => {
        // Assuming "Interest" is the 5th column
        const interestText = $row.find('td').eq(4).text().trim();
        const interestValue = parseFloat(interestText.replace(/[^0-9.]/g, '')) || 0;
        totalInterest += interestValue;
      });
    };

    // Function: Handle pagination recursively
    const goToNextPage = () => {
      cy.get("[aria-label$='Next page']").then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.wait(2000);
          sumInterestOnPage();
          goToNextPage(); // continue
        } else {
          cy.log('✅ All pages scanned.');
        }
      });
    };

    // Start: wait for table to be ready
    cy.visit('https://moni-admin-fe.staging.rank.africa/customers/usr_86ea5878830a44289/savings');
    cy.get("[data-slot$='table-container'] tbody tr").should('exist');
    cy.wait(2000);

    // Sum from the first page
    sumInterestOnPage();

    // Go through other pages if available
    goToNextPage();

    // Compare with analytics summary
    cy.then(() => {
      cy.get('div')
        .contains('Total Interest Earned')
        .next() // or adjust to direct element
        .invoke('text')
        .then((summaryText) => {
          const analyticsInterest = parseFloat(summaryText.replace(/[^0-9.]/g, ''));

          cy.log(`Total Interest (summed): ${totalInterest}`);
          cy.log(`Analytics Interest: ${analyticsInterest}`);

          expect(totalInterest).to.eql(analyticsInterest);
        });
    });
  });
});


describe('Customer Management functionality check', ()=> {
  beforeEach(() => {
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
    cy.wait(8000)
    cy.get("#search-bar-button").within(()=> {
      cy.get(`[placeholder$="Search by customer's name, monitag or phone number"]`).should('exist')
    })
    cy.get("[class$='flex border border-grey p-1 rounded-md bg-white w-full h-min ']").type('billers')
    cy.wait(8000)
    cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.url().should('include', '/customers/')
  })
  it('Customer Actions - Flag customer', ()=> {
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(()=> {
      cy.contains('Flag customer').click()
    })
    cy.get("[class$='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").should('exist').within(()=> {
      /*cy.get("[class$='text-xl font-semibold mb-4']").should('contain', 'Flag User')
      cy.contains('Report and flag a suspicious activity for further review by assigning reason, severity and action type.')
      cy.contains('Reason (Trigger type)')
      cy.contains('Comment')
      cy.contains('Do you want to escalate this?')
      cy.contains('Yes')
      cy.contains('No')
      cy.get("[type$='button']").should('contain', 'Cancel')
      cy.get("[type$='button']").should('contain', 'Flag')
      cy.get("[class$='flex flex-wrap gap-2 flex-1']").should('contain', 'Select reason')
      cy.get("[class$='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500']")*/
    })
    cy.get("[type$='button']").should('contain', 'Cancel').click()
  })
  it('Customer Actions - Add to watchlist', ()=> {
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(()=> {
      cy.contains('Add to watchlist').click()
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
    cy.get("[class$='flex flex-col justify-between overflow-auto bg-white w-[592px] h-screen pt-10']").should('exist').within(()=> {
      cy.get("[type$='button']").should('contain', 'Cancel').click()
    })
  })
  it('Customer Actions - Remove from watchlist', ()=> {
    cy.get("[data-testid$='dropdown-button']").should('contain', 'Customer Actions').and('be.visible').click()
    cy.get("[role$='menu']").within(()=> {
      cy.contains('Remove from watchlist').click()
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

  let analyticsChecks;
  analyticsChecks = [
    'Plan type',
    'Savings plan ID',
    'Savings balance',
    'Total interest earned',
    'Start date',
    'Maturity date',
    'Interest Balance',
    'Interest available to',
    'Interest withdrawn',
    'Interest withdrawal',
    'Interest rate',
    'Progress'
  ]
  it('Individual savings plan management check', ()=> {
    cy.get("[class$='h-full flex flex-col flex-1 overflow-y-auto']").within(()=> {
      cy.contains('Savings').click()
      cy.wait(8000)
    })
    cy.get("[data-testid$='pagination-button-23']").click()
    cy.wait(5000)
    cy.get("[data-slot$='table-container'] tbody tr").last().click()
    cy.wait(7000)
    /*analyticsChecks.forEach((analyticsCheck) => {
      cy.get("[class*='lg:text-sm text-xs text-gray-600']".eq(i)).should('be.visible').and('contain', analyticsCheck)
    });*/
    cy.get("[class$='text-xl font-bold text-gray-900 mb-6']").eq(2).should('exist').and('contains', 'Traansactions')
    cy.get("[class$='text-xl font-bold text-gray-900 mb-6']").eq(2).should('exist').and('contains', 'Testing')
    //cy.get("[data-slot$='table-container'] tbody tr").first().click()
    cy.wait(8000)
    cy.get("[data-slot$='drawer-content']").within(()=> {
      cy.get("[class$='lucide lucide-copy w-3.5 h-3.5']").should('be.visible').click()
      cy.get("[class$='flex items-center text-sm']").contains('Close').click()
    })
  })
})