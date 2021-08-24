import React from 'react';
import { AppBar, Button, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from './store/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((_) => ({
  title: {
    flexGrow: 1,
    color: 'white',
    fontWeight: 'bold'
  },
  logoutIcon: {
    color: 'white',
    fontWeight: 'bold'
  }
}));

/** Navbar fo the app */
const NavBar = () => {
  const classes = useStyles();
  const loggedIn = useSelector(state => state.user.loggedIn);
  return (
    <AppBar position='static'>
      <Toolbar color='inherit'>
        <Typography variant='h5' className={classes.title}>
          Big Brain
        </Typography>
        {loggedIn ? <LogoutButton /> : <LoginButton /> }
      </Toolbar>
    </AppBar>
  )
};

/**
 * functional component for login
 * Once user pressed the button, they will be directed to login page
 */
const LoginButton = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Button onClick={() => history.push('/login')} className={ classes.logoutIcon }>
      LOG IN
    </Button>
  )
};

/** functional component for login */
const LogoutButton = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const classes = useStyles();
  const handleLogout = () => {
    // dispatch the logout action
    // if there's any error, send an error message as popup
    // otherwise send a "successfully logged out" notification
    dispatch(logout())
      .then(unwrapResult)
      .then(() => {
        enqueueSnackbar('You have logged out successfully', { variant: 'success' });
        history.push('/');
      })
      .catch(() => enqueueSnackbar('Logout failed', {
        variant: 'error',
      }));
  }
  return (
    <Button
      onClick={ handleLogout }
      className={ classes.logoutIcon }
      id='logout-button'
    >
      LOG OUT
    </Button>
  )
};

export default NavBar;
