import { partnerSignIn } from "cypress/support/helper";
const employeeUploadFilePath = 'cypress/fixtures/employees_template.csv'
const schemaHeaders = ["Employee Number", "First Name", "Last Name", "Sex", "Date Deployed", "Date of Birth", "Address", "Phone Number"]
const schemaHeadersTablePreview = ["Employee Number", "First Name", "Last Name", "Sex", "Date Deployed", "Date Of Birth", "Address", "Phone Number", "Status", "Action"]

const buildEmployeeCsv = (runId: number) => {
    const employees = Array.from({ length: 5 }, (_, index) => {
        const employeeNumber = `${runId}${index + 1}`
        const phoneNumber = `070${String((runId + index) % 100000000).padStart(8, '0')}`

        return {
            employeeNumber,
            firstName: ['Zazu', 'Bintu', 'Kanti', 'Dora', 'Glory'][index],
            lastName: 'Rank',
            sex: index % 2 === 0 ? 'M' : 'F',
            dateDeployed: `2024-0${index + 1}-15`,
            dateOfBirth: `199${index}-05-12`,
            address: `${index + 1} Test Upload Street Lagos`,
            phoneNumber
        }
    })

    return {
        csv: [
            'Employee Number,First Name,Last Name,Sex,Date Deployed,Date of Birth,Address,Phone Number',
            ...employees.map(employee => [
                employee.employeeNumber,
                employee.firstName,
                employee.lastName,
                employee.sex,
                employee.dateDeployed,
                employee.dateOfBirth,
                employee.address,
                employee.phoneNumber
            ].join(','))
        ].join('\n'),

        employees,
        previewEmployeeNumber: employees[4].employeeNumber
    }
}

const mapHeader = (header: string, index: number) => {
    cy.get("[data-slot*='select-value']").eq(index).then(($selectValue) => {
        if (!$selectValue.text().includes(header)) {
            cy.wrap($selectValue).click()
            cy.contains("[role*='option']", header).should('be.visible').click()
        }
    })

    cy.get("[data-slot*='select-value']").eq(index).should('contain', header)
}

const clickDataPreview = () => {
    cy.contains('Data preview')
        .scrollIntoView()
        .should('exist')
        .click()
}
const formatDate = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${Number(month)}/${Number(day)}/${year}`
}

describe('Employee upload', () => {
    beforeEach(() => {
        partnerSignIn()
    })

    it('Employee upload - Check for file upload functionality', () => {
        const employeeUpload = buildEmployeeCsv(Date.now())

        cy.writeFile(employeeUploadFilePath, employeeUpload.csv)

        cy.get("[data-slot*='sidebar-menu-item']").eq(2).should('contain', 'Employee').click() // Navigate to Employees page
        cy.url().should('include', '/employee') // Check if URL includes /employee
        cy.wait(2000) // wait for employee page to load

        const uploadOptions = [
            /Upload (your )?employee list|Upload employees|Bulk upload/i,
            /Download and use our template|Download template/i,
            /Add employees one at a time|Add employee manually|Add manually/i
        ]

        cy.get('body').then(($body) => {
            if (!uploadOptions[0].test($body.text())) {
                cy.contains('button, a, [role="button"]', /Add New Employee|Add Employee|Add employees|New Employee/i)
                    .should('be.visible')
                    .click()
            }
        })

        uploadOptions.forEach(option => {
            cy.contains(option, { timeout: 10000 }).should('be.visible') // Check if upload options are visible
        });

        // Upload your employee list option check
        cy.contains(uploadOptions[0]).click()
        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button after selecting upload option

        cy.url().should('include', '/employee/upload') // Check if URL includes /employee/upload
        cy.contains('Continue').should('be.disabled') // Check if continue button is disabled before file upload
        cy.get("#csv-file-input").selectFile(employeeUploadFilePath, { force: true }) // Upload employee list template
        cy.contains('Uploading').should("be.visible") // Upload progress check
        cy.wait(5000) // wait for file upload to process
        cy.contains('100%').should("be.visible") // Check if upload progress reaches 100%
        cy.contains('Completed').should("be.visible") // Check if upload also returns as completed
        cy.wait(5000) 
        cy.contains('employees_template.csv').should("be.visible") // Check if uploaded file name is displayed
      
        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button after selecting upload option

        cy.wait(5000) 
        // matching headers check
        cy.url().should('include', '/employee/upload') // Check if URL includes /employee/upload
        
        cy.get("[data-slot*='card-content']").should('have.length', 2) // check for mmatchh ehaders card, and data preview card
        
        schemaHeaders.forEach((header, index) => {
            mapHeader(header, index)
        })
        cy.contains('Employee Number').click() // click out of window to close the dropdown and view the data preview table

        //data preview
        cy.wait(2000)
        clickDataPreview() // Data preview check
        cy.contains('Continue').should('not.be.disabled').click() // Click on continue button after selecting upload option
        cy.wait(3000)
        //
        cy.url().should('include', 'employee/upload') // Upload preview page check
        cy.get("[data-slot*='table-container']").within(() => {
            cy.get('thead tr th').should('have.length', 10) // Check if table headers match the schema headers length
            schemaHeadersTablePreview.forEach((header, index) => {
                cy.get('thead tr th').eq(index).should('contain', header) // Check if each table header matches the schema header
            })
            cy.get('tbody tr').should('have.length', 5) // Check if table has 5 rows of data
        })
        cy.contains(employeeUpload.previewEmployeeNumber).should('be.visible') // Check if the last employee number is visible in the table
        employeeUpload.employees.forEach((employee, index) => {
            cy.get("[data-slot*='table-container'] tbody tr")
                .eq(index)
                .within(() => {
                    cy.get('td').eq(0).should('contain', employee.employeeNumber)
                    cy.get('td').eq(1).should('contain', employee.firstName)
                    cy.get('td').eq(2).should('contain', employee.lastName)
                    cy.get('td').eq(3).should('contain', employee.sex)

                    // Optional: Verify the remaining columns too
                    cy.get('td').eq(4).should('contain', formatDate(employee.dateDeployed))
                    cy.get('td').eq(5).should('contain', formatDate(employee.dateOfBirth))
                    cy.get('td').eq(6).should('contain', employee.address)
                    cy.get('td').eq(7).should('contain', employee.phoneNumber)
                })
        })
        const tableAnalyticsCards = [
            'Uploaded',
            'Successful'
        ]
        tableAnalyticsCards.forEach((card) => {
            cy.contains(card).parent().should('contain', 5) // Check if analytics cards are visible
        })
        cy.contains('Continue').scrollIntoView().should('not.be.disabled').click() // Continue after previewing the uploaded data
        cy.contains('Done').should('be.visible').should('not.be.disabled').click() // Complete employee upload flow
    })
})