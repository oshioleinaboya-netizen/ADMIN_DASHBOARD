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
  /*let beforeSort;
  let filtersPrimary;
  let secondaryFilters;
  let beforeFilt;*/
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
    const countries: string[] = ['Angola', 'Brazil', 'Canada', 'Dominica', 'Egypt', 'France', 'Gambia', 'Hong Kong', 'India', 'Japan', 'Kenya', 'Liberia', 'Mali', 'Nepal', 'Oman', 'Pakistan', 'Qatar', 'Romania', 'Samoa', 'Tunisia', 'Uganda', 'Viet Nam', 'Western Sahara', 'Yemen', 'Zambia'];
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