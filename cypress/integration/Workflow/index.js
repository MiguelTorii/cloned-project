import moment from 'moment';

describe('Workflow', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Creates task', () => {
    cy.visit(`${Cypress.env('url')}workflow`);
    cy.get('#board-Overdue .create-task-button').click();
    cy.get('.text-area').type('Create Test Task');
    cy.get('.add-workflow-button').click();
    cy.contains('Congratulations cypress, you have just earned 1000 points. Good Work!');
  });

  it('Edit task', () => {
    cy.contains('Create Test Task').click();
    cy.get('[rows="1"]').clear().type('Create Test Task Edit');
    cy.contains('Time')
      .parent()
      .within(() => {
        cy.get('input').click();
      });
    cy.contains('3:00 PM').click({ force: true });
    cy.contains('Save').click();
    cy.contains(moment().format('MMM D'));
  });

  it('Moves task to done', () => {
    cy.contains('Create Test Task Edit').trigger('dragstart').trigger('dragleave');

    cy.get('#board-Done')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    cy.contains('Congratulations cypress, you have just earned 1500 points. Good Work!');
  });

  it('Deletes task', () => {
    cy.contains('Create Test Task Edit').trigger('mouseover').get('#board-Done .delete').click();
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
