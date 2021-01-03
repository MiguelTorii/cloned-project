const url = Cypress.env('url')

describe('Authentication', () => {
  it('Greets user', () => {
    cy.visit(`${url}auth`)
    cy.contains("Enter your school's name")
  })

  it('Selects school wrong school goes back and change it', () => {
    // cy.contains('Search your school/college').click().type('Demo School 50')
    // cy.get('#react-select-2-option-0').click('center')
    // cy.contains('Select a Different School').click()
    cy.contains('Search your school/college').click().type('Demo School 10')
    cy.get('#react-select-3-option-0').click('center')
  })

  it('goes to registration page', () => {
    cy.contains('Email Address')
    cy.get('input').type('invalid+email@register.com')
    cy.contains('Next').click()
    cy.contains('Create your CircleIn Account')
  })

  it('uses wrong password', () => {
    cy.visit(`${url}auth`)
    cy.contains('Search your school/college').click().type('Demo School 10')
    cy.get('#react-select-3-option-0').click('center')
    cy.get('input').type('felipe.machado+demo10@toptal.com')
    cy.contains('Next').click()
    cy.contains('Password')
    cy.contains('Sign In').click()
    cy.contains('password is required')
    cy.get('input').type('wrong')
    cy.contains('Sign In').click()
    cy.contains("Something doesn't look right")
    cy.contains('Try Again').click()
  })

  it('logs in', () => {
    cy.get('input').clear().type('bababa')
    cy.contains('Sign In').click()
    cy.contains('Workflow')
  })
})
