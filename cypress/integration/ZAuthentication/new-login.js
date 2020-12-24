const url = Cypress.env('url')

describe('New Authentication', () => {
  it('Selects school', () => {
    cy.visit(`${url}new`)
    cy.contains('Search your school/college').click().type('Demo school')
    cy.contains('Demo School 10').click()
    cy.contains('Select School').click()
  })

  it('Selects Role Student', () => {
    cy.get('#role-select').click()
    cy.contains('Student').click()
    cy.contains('Select Role').click()
  })

  it('Student Login', () => {
    cy.get('#email-login').click().type('felipe.machado+demo10@toptal.com')
    cy.get('#password-login').click().type('bababa')
    cy.contains('Login').click()
  })

  it('Logout', () => {
    cy.get('#avatar-menu').click()
    cy.contains('Logout').click()
  })

})
