describe('Classes', () => {
  beforeEach(() => {
    cy.loginUser1();
  });

  it('Renders classes page', () => {
    cy.wait(5000);
    cy.visit(`${Cypress.env('url')}classes`);
    cy.contains('CircleIn101');
  });
});
