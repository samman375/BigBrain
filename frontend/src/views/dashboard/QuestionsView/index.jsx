import { useRouteMatch, Switch, Route } from 'react-router-dom'
import React from 'react'
import QuestionsView from './QuestionsView';
import EditQuestionView from './EditQuestionView';

// Routings for question
const QuestionsRoute = () => {
  const { path } = useRouteMatch();
  /**
   * Edit Question -> /dashboard/:quizid/:questionId
   * View all the Questions -> /dashboard/:quizId/
   */
  return (
    <Switch>
      <Route path={`${path}/:questionId`}>
        <EditQuestionView />
      </Route>
      <Route exact path={path}>
        <QuestionsView />
      </Route>
    </Switch>
  )
}
export default QuestionsRoute;
