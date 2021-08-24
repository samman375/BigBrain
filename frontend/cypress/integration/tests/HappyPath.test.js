context('Successful usage - Happy path', () => {
  const username = Math.random().toString(36).substring(7);
  const email = Math.random().toString(36).substring(7);
  const password = Math.random().toString(36).substring(7);
  const newGameTitle = Math.random().toString(36).substring(7);

  const login = () => {
    cy.visit('localhost:3000/#/login');
    cy.get('#email')
      .focus()
      .type(email);

    cy.get('#password')
      .focus()
      .type(password);
    cy.get('button[type=submit]')
      .click();
  }

  it('Register', () => {
    cy.visit('localhost:3000/#/register');

    cy.get('input[name=name]')
      .focus()
      .type(username);

    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=password]')
      .focus()
      .type(password);

    cy.get('button[type=submit]')
      .click();

    // Will show Dashboard if successful
    cy.contains('Dashboard');
  });

  it('Create new game', () => {
    cy.get('#new-game-button')
      .click();

    cy.get('#gameName')
      .focus()
      .type(newGameTitle);

    cy.get('#confirm-create-button')
      .click();

    cy.get('button[id=editGame]')
      .click();
  });

  it('Add new question', () => {
    cy.get('#create-new-question')
      .click();

    cy.get('#desc')
      .focus()
      .type('What is 5 + 20?');

    cy.get('#points')
      .focus()
      .type('1');

    cy.get('#duration')
      .focus()
      .type('5');

    cy.get('#question-type-select')
      .click();

    cy.get('#question-type-single')
      .click();

    cy.get('#option-0')
      .focus()
      .type('520');

    cy.get('#option-1')
      .focus()
      .type('25');

    cy.get('#question-answer-select')
      .click();

    cy.get('#answer-option-0')
      .click();

    cy.get('button[type=submit]')
      .click();

    // Will return to questions page if successful
    cy.contains('Quiz Questions');

    cy.get('div[name=questionCard]').should('have.length', 1);
  });

  it('Start game', () => {
    cy.visit('localhost:3000/#/dashboard');
    login();

    cy.get('#start-game-button')
      .click();

    cy.contains('Game started successfully');
  });

  it('End game', () => {
    cy.get('#stop-game-button')
      .click();

    cy.contains('Game ended successfully');
  });

  it('Show results', () => {
    cy.get('#view-results-button')
      .click();

    cy.url().should('contain', '/results');
  });

  it('Log out', () => {
    cy.get('#logout-button')
      .click();

    // Redirected to login if successful
    cy.url().should('contain', '/login');
  });

  it('Log in', () => {
    login();

    // Redirected to dashboard if successful
    cy.url().should('contain', '/dashboard');
  });
});
