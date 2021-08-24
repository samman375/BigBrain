import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import QuestionsRoutes from './QuestionsView';
import Dashboard from './Dashboard';
const DashboardRoutes = () => {
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route path={`${path}/:quizId`}>
        <QuestionsRoutes />
      </Route>
      <Route path={path}>
        <Dashboard />
      </Route>
    </Switch>
  )
}

export default DashboardRoutes;
