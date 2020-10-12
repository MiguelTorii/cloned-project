describe('Notes', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Creates note', () => {
    cy.visit(`${Cypress.env('url')}notes`)
    cy.contains('My Notes').parent().within(() => {
      cy.contains('Pipe Welding').click()
    })
    cy.contains('Now, you can type class notes right inside of CircleIn.')
    cy.contains('Organization just got so much easier.')
    cy.contains('Get Started').click({ force: true })
    cy.get('input[placeholder="Untitled"]').clear().type('Test Note')
    cy.wait(2000)
    // cy.get('div[contenteditable="true"]').type('Test content')
    cy.contains('Visible to you only')
    cy.contains('Last Saved a few seconds ago')
    cy.contains('Exit NoteTaker').click()
  })

  it('Deletes Note', () => {
    cy.contains('Test Note').trigger('mouseover')
    cy.get('button[aria-label="delete"]').click()
    cy.contains('This action is permanent.')
    cy.contains("You're about to delete these notes. Once you do this, you cannot get them back.")
    cy.contains('Delete').click()
    cy.contains('Now, you can type class notes right inside of CircleIn.')
  })
})
