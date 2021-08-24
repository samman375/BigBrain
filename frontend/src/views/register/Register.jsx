import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../store/userSlice';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { RegisterForm } from './RegisterForm';

/**
 * Creates and displays register form
 * @returns register screen
 */
const RegisterScreen = () => {
  // Used to store token after successful register
  const dispatch = useDispatch();
  // Used to route to Login page when
  // 'Already have an account' link is clicked
  const history = useHistory();
  const showLogin = () => {
    history.push('/login');
  };

  const [registerError, setRegisterError] = useState(false);

  /**
   * Calls register fetch request on form submit
   * @param {Event} e - native event
  */
  const handleRegister = (e, payload) => {
    e.preventDefault();
    // Dispatch register action
    // Prompts user with on-screen error message if there is an error
    dispatch(register(payload))
      .then(unwrapResult)
      .catch(() => setRegisterError(true));
  };

  return (
    <Grid container justify='center'>
      <Grid item xs={10} sm={4}>
        <RegisterForm
          registerError={registerError}
          onSubmit={handleRegister}
          onLinkClick={showLogin}
          setError={setRegisterError}
        />
      </Grid>
    </Grid>
  );
}

export default RegisterScreen;
