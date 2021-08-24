import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import DashboardRoutes from './dashboard';
import ResultsView from './results';
import JoinGameView from './join';
import PlayerPerformance from '../components/PlayerPerformance';
import Lobby from './Lobby/Lobby';
import AnswerQuestion from './game/AnswerQuestion';

const AppRoute = () => {
  const loggedIn = useSelector(state => state.user.loggedIn);
  // check login status from redux store
  // if they are logged in
  // they will be redirected to dashboard when visiting /login and /register
  // otherwise, they will be redirected to login if attempt to visit /dashboard
  return (
    <Switch>
      <Route path="/login">
        { loggedIn ? <Redirect to='/dashboard'/> : <Login /> }
      </Route>
      <Route path="/register">
        { loggedIn ? <Redirect to='/dashboard'/> : <Register /> }
      </Route>
      <Route exact path="/">
        { loggedIn ? <Redirect to='/dashboard'/> : <Redirect to='/login'/> }
      </Route>
      <Route path="/dashboard">
        { loggedIn ? <DashboardRoutes /> : <Redirect to='/login'/> }
      </Route>
      <Route path='/results'>
        { loggedIn ? <ResultsView /> : <Redirect to='/login'/> }
      </Route>
      <Route path='/join/:urlSessionId?'>
        <JoinGameView />
      </Route>
      <Route path='/perf'>
       <PlayerPerformance />
      </Route>
      <Route path='/lobby/:sessionId'>
        <Lobby />
      </Route>
      <Route path="/question">
        <AnswerQuestion />
      </Route>
    </Switch>
  );
};
export default AppRoute;
