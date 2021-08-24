import { v4 as uuidv4 } from 'uuid';
let email;
const name = 'Test admin';
const password = 'password';

const simulateQuestionInput = ({
  desc = 'test desc',
  points = 1,
  type = 'single',
  duration = 10,
  answers = [0],
  options = ['A', 'B'],
  videoUrl = null
}) => {
  desc && cy.get('#desc')
    .focus()
    .type(desc);
  cy.get('#points')
    .focus()
    .type(points >= 0 ? `${points}` : '{downarrow}'.repeat(0 - points))
    .blur();

  cy.get('#duration')
    .focus()
    .type(duration);

  // select question type
  cy.get('#question-type-select')
    .click();

  cy.get(`#question-type-${type}`)
    .click();

  // answers
  if (answers.length > 0) {
    cy.get('#question-answer-select')
      .click();

    answers.forEach((v, i) => {
      cy.get(`#answer-option-${v}`)
        .click();
    });
  }

  options.forEach((v, i) => {
    if (i > 1) {
      cy.get('#add-option-button')
        .click();
    }
    cy.get(`#option-${i}`)
      .focus()
      .type(v);
  })
  videoUrl && cy.get('#video-url')
    .focus()
    .type(videoUrl);
}

context('Test adding a new quiz', () => {
  it('Register successfully', () => {
    cy.visit('localhost:3000/#/register');
    email = uuidv4() + '@test.com';
    cy.get('input[name=name]')
      .focus()
      .type(name);

    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=password]')
      .focus()
      .type(password);

    cy.get('button[type=submit]')
      .click();

    cy.url().should('contain', '/dashboard');
  })

  it('Go to login and create new game', () => {
    cy.visit('localhost:3000/#/dashboard')
    cy.wait(500);

    cy.get('#email')
      .focus()
      .type(email);

    cy.get('#password')
      .focus()
      .type(password);

    cy.get('button[type=submit]')
      .click();

    cy.url().should('contain', '/dashboard');

    cy.wait(500);

    const quizId = uuidv4().substr(0, 5)
    cy.get('#new-game-button')
      .click();

    cy.get('#gameName')
      .focus()
      .type(quizId);

    cy.get('#confirm-create-button')
      .click();
  })
});

context('test adding question', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/#/login');
    cy.get('#email')
      .focus()
      .type(email);

    cy.get('#password')
      .focus()
      .type(password);
    cy.get('button[type=submit]')
      .click();
    cy.wait(500);
    cy.get('button[name="edit-quiz-button"]').click();
    cy.wait(500);
    cy.get('#create-new-question').click();
  });

  it('test submit question without desc', () => {
    simulateQuestionInput({ desc: '' });
    cy.get('button[type=submit]')
      .click();
    cy.get('#desc-helper-text').should('include.text', 'You must enter the question');
  });
  it('test submit question negative points', () => {
    simulateQuestionInput({ points: 0 });
    cy.get('button[type=submit]')
      .click();
    cy.get('#points-helper-text').should('include.text', 'Questions should have at least 1 point');
  });
  it('submit question too short duration', () => {
    simulateQuestionInput({ duration: 0 });
    cy.get('button[type=submit]')
      .click();
    cy.get('#duration-helper-text').should('include.text', 'Duration should between 5s and 5mins (300s)');
  })
  it('submit question too long duration', () => {
    simulateQuestionInput({ duration: 3000 });
    cy.get('button[type=submit]')
      .click();
    cy.get('#duration-helper-text').should('include.text', 'Duration should between 5s and 5mins (300s)');
  })
  it('submit empty options', () => {
    simulateQuestionInput({ options: [] });
    cy.get('button[type=submit]')
      .click();
    cy.get('#option-0-helper-text').should('include.text', 'Option cannot be empty');
    cy.get('#option-1-helper-text').should('include.text', 'Option cannot be empty');
  });
  it('submit no answers', () => {
    simulateQuestionInput({ answers: [] });
    cy.get('button[type=submit]')
      .click();
    cy.get('#answer-field-error-text').should('include.text', 'You must have at least one answer');
  })
  it('submit questions successfully', () => {
    simulateQuestionInput({});
    cy.get('button[type=submit]')
      .click();
    cy.get('div[name=questionCard]').should('have.length', 1);
  })
})
