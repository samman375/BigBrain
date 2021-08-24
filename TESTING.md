**Component Testing:**

Mount had to be used in every test instead of shallow as each component contained child components that were vital to testing the component.

AverageResponseTime:
- One of the chart on the results page.
- We tested this as it's an important component that can easily malfunction.
- It is important that this works as it is used not only for the results of the whole game but for each user.

QuestionForm:
- Used to edit/create a question for a quiz.
- We tested this as we used many similar forms throughout our app, with this being the most complicated one.
- The question form has many different error checks for most fields.

Register:
- Used to register an account.
- This was tested as it is similar to login but more complicated.
- The app cannot be used if a user cannot create an account to access the app.

StartGameButton:
- Button used to start a game.
- This was tested as it is very easy to contain bugs due to the multiple different conditions and states.

StartGamePopup:
- Popup shown when 'Start' button for a quiz is clicked.
- Multiple popups are used throughout the app similar to this one.
- This one was chosen as it was the most testable one.

Video:
- Element containing any embedded provided video for a question.
- This was tested as it is also easy to contain bugs.

**UI Testing:**

Happy path:
- An extra test for add a question was added due to our implementation of the start game button being disabled with no questions.

Additional path:
- An additional path was done that tests all of the errors that occur when adding/editing a question.
- This was done as it was decided this is the most likely place a user could run into an error as there are many different inputs.
- Tests are put in place to check an error occuring at any stage of the create/edit question form.