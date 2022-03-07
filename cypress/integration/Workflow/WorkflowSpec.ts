describe('Workflow', () => {
  beforeEach(() => {
    cy.loginUser1();
  });

  it('Creates task', () => {
    cy.visit(`${Cypress.env('url')}workflow`);
    cy.get('#board-Overdue .create-task-button').click();
    cy.get('.workflow-task-text-area').type('Create Test Task');
    cy.get('.add-workflow-button').click();
    cy.contains('Congratulations Cathy, you have just earned 1000 points. Good Work!');
  });

  it('Edit task', () => {
    cy.wait(1000);
    cy.contains('Create Test Task').click();
    cy.get('[rows="1"]').clear().type('Create Test Task Edit');
    cy.contains('Time')
      .parent()
      .within(() => {
        cy.get('input').click();
      });
    cy.contains('3:00 PM').click({ force: true });
    cy.contains('Save').click();
    cy.wait(1000);
  });
  
  it('Moves task to done', () => {
    cy.contains('Create Test Task Edit').trigger('dragstart').trigger('dragleave');
    cy.get('#board-Done')
    .trigger('dragenter')
    .trigger('dragover')
    .trigger('drop')
    .trigger('dragend');
    
    cy.contains('Congratulations Cathy, you have just earned 1500 points. Good Work!');
  });
  
  it('Deletes task', () => {
    cy.contains('Create Test Task Edit')
    .trigger('mouseover')
    .get('#board-Done .workflow-task-delete-button')
    .click();
    cy.wait(1000);
    cy.contains('Delete').click();
  });

  it('List View', () => {
    cy.contains('List View').click({ force: true });
    cy.contains('Add Task');
    cy.contains('Due Date');
  });

  it('Calendar View', () => {
    cy.contains('Calendar View').click({ force: true });
    cy.contains('Add Task');
    cy.contains('Wed');
  });
});
