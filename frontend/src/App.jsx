/** @format */

import React from 'react';
import './App.css';
import { CssBaseline } from '@material-ui/core';
import AppRoute from './views/AppRoutes';
import NavBar from './NavBar'
const App = () => {
  return (
    <div>
      <CssBaseline></CssBaseline>
      <NavBar />
      <AppRoute></AppRoute>
    </div>
  );
};

export default App;
