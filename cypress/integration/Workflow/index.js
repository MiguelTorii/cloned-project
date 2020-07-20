const url = 'http://dev-app2.circleinapp.com/'

describe('Workflow', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Creates task', () => {
    cy.visit(url)
    cy.get('[style="background-color: rgb(196, 89, 97);"] > .MuiGrid-direction-xs-column > :nth-child(2) > .MuiButtonBase-root > .MuiButton-label').click()
    cy.get('.MuiInputBase-root').type('Create Test Task')
    cy.get('.MuiButton-contained').click()
    cy.contains('Congratulations Felipe, you have just earned 1000 points. Good Work!')
  })

  it('Edit task', () => {
    cy.contains('Create Test Task').click()
    cy.get('[rows="1"]').clear().type('Create Test Task Edit')
    cy.contains('Save').click()
  })

  it('Moves task to done', () => {
    cy.contains('Create Test Task Edit')
      .trigger("dragstart")
      .trigger("dragleave");

    cy.get('[style="background-color: rgb(116, 193, 130);"] > .jss222')
      .trigger("dragenter")
      .trigger("dragover")
      .trigger("drop")
      .trigger("dragend");
  })

  it('Deletes task', () => {
    cy.contains('Create Test Task Edit').trigger('mouseover')
      .get('.MuiGrid-grid-xs-4 > .MuiIconButton-root > .MuiIconButton-label > .MuiSvgIcon-root > path').click()
    cy.contains('Delete').click()
  })

  it('Create/Delete task in List View', () => {
    cy.contains('List View').click()
    cy.get('.MuiInputBase-input').click().type('Create Test Task List View')
    cy.contains('Add Task').click()
    cy.contains('Create Test Task List View').click()
    cy.contains('Delete').click()
    cy.wait(500)
    cy.contains('Delete').click()
  })
})
