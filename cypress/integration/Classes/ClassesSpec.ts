describe('Classes', () => {
  beforeEach(() => {
    cy.loginUser1();
  });

  it('Renders classes page', () => {
    cy.visit(`${Cypress.env('url')}classes`);
    // cy.contains('+ Add More Classes')
    cy.contains('cypress test 101');
  });

  // it('Navigates to feed', () => {
  // cy.contains('Fundamentals of Chemistry').click()
  // cy.contains('Felipe E2E Tests')
  // })

  // it('Navigates to question', () => {
  // cy.contains('Test Question').click()
  // cy.contains('Is it working?')
  // })

  // it('Navigates to flashcard', () => {
  // cy.get('#desktopMenu').within(() => {
  // cy.contains('Fundamentals of Chemistry').click()
  // })
  // cy.contains('Test Flashcard').click()
  // cy.contains('Enter Study Mode')
  // cy.contains('Enter Learning Mode')
  // cy.contains('Test question')
  // cy.contains('Test answer')
  // })

  // it('Navigates to link', () => {
  // cy.get('#desktopMenu').within(() => {
  // cy.contains('Fundamentals of Chemistry').click()
  // })
  // cy.contains('Test Link').click()
  // cy.contains('This is a link')
  // })

  // it('Navigates to note', () => {
  // cy.get('#desktopMenu').within(() => {
  // cy.contains('Fundamentals of Chemistry').click()
  // })
  // cy.contains('Test Note').click()
  // cy.contains('This is a note. More characters to complete the description')
  // })

  // it('Navigates back', () => {
  // cy.contains('Feed').click()
  // cy.contains('Felipe E2E Tests')
  // })

  // it('Navigates to bookmarks', () => {
  // cy.contains('Bookmarks').click()
  // cy.contains('Bookmark helpful study material to review later')
  // })

  // it('opens classmates dialog', () => {
  // cy.get('#desktopMenu').within(() => {
  // cy.contains('Classmates').click()
  // })
  // cy.contains('Classmates who have joined CircleIn')
  // cy.contains('Send Message')
  // cy.contains('Start Video')
  // })
});
