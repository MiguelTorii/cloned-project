import moment from 'moment'

describe('Workflow', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Creates task', () => {
    cy.visit(Cypress.env('url'))
    cy.get('[style="background-color: rgb(196, 89, 97);"] > .MuiGrid-direction-xs-column > :nth-child(2) > .MuiButtonBase-root > .MuiButton-label').click()
    cy.get('.MuiInputBase-root').type('Create Test Task')
    cy.get('.MuiButton-contained').click()
    cy.contains('Congratulations Felipe, you have just earned 1000 points. Good Work!')
  })

  it('Edit task', () => {
    cy.contains('Create Test Task').click()
    cy.get('[rows="1"]').clear().type('Create Test Task Edit')
    cy.contains('Time').parent().within(() => {
      cy.get('input').click()
    })
    cy.contains('3:00 PM').click({ force: true })
    cy.contains('Save').click()
    cy.contains(moment().format('MMM D'))
  })

  it('Moves task to done', () => {
    cy.contains('Create Test Task Edit')
      .trigger("dragstart")
      .trigger("dragleave");

    cy.get('#board-Done')
      .trigger("dragenter")
      .trigger("dragover")
      .trigger("drop")
      .trigger("dragend");

    cy.contains('Congratulations Felipe, you have just earned 1500 points. Good Work!')
  })

  it('Deletes task', () => {
    cy.contains('Create Test Task Edit').trigger('mouseover')
      .get('.MuiGrid-grid-xs-4 > .MuiIconButton-root > .MuiIconButton-label > .MuiSvgIcon-root > path').click()
    cy.contains('Delete').click()
  })

  it('List View', () => {
    cy.contains('List View').click({ force: true })
    cy.contains('Add Task')
    cy.contains('Due Date')
  })

  it('Calendar View', () => {
    cy.contains('Calendar View').click({ force: true })
    cy.contains('Add Task')
    cy.contains('Wed')
  })
})
