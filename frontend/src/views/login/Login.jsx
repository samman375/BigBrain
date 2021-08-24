import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/userSlice';
import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Paper,
  Link
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  heading: {
    textAlign: 'center',
    fontWeight: 'normal',
    marginBottom: theme.spacing(2),
  },
  errorMsg: {
    textAlign: 'center',
    fontWeight: 'normal',
    color: theme.palette.error.main
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3)
  },
  textField: {
    display: 'block',
    marginBottom: theme.spacing(2),
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  button: {
    color: 'white',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  }
}));

const LoginScreen = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  /**
   * hanles login when the form is submitted
   * @param {Event} ev native event
   */
  const handleLogin = (ev) => {
    ev.preventDefault()
    // If either email or password is empty
    // prompts user with message
    // and early terminates login
    if (email.length === 0 || password.length === 0) {
      setEmailError(email.length === 0);
      setPasswordError(password.length === 0);
      setErrMsg('Empty email or password')
      return;
    }
    // dispatch login action
    // if there is an error
    // prompts user error message
    dispatch(login({ email, password }))
      .then(unwrapResult)
      .catch((msg) => {
        setLoginError(true);
        setErrMsg(msg)
      })
  };
  /**
   * handler for handling input changes
   * upates input value with corresponding setter
   **/
  const handleInputChange = (setter, val) => {
    setLoginError(false);
    setter(val);
  };
  return (
    <Grid container justify='center'>
      <Grid item xs={10} sm={4} >
        <Paper className={ classes.paper }>
          <Typography component='h1' variant='h4' className={classes.heading}>
            Login
          </Typography>
          {(loginError || emailError || passwordError) &&
          <Typography component='p' variant='body1' className={ classes.errorMsg }>
            {errMsg}
          </Typography>
          }
          <form noValidate className={ classes.form }>
            <TextField
              error={ loginError || emailError }
              helperText={ loginError || emailError ? 'invalid username' : ''}
              fullWidth
              id='email'
              label='Email'
              variant='outlined'
              required
              value={ email }
              className= { classes.textField }
              type='email'
              onChange={(ev) => handleInputChange(setEmail, ev.target.value)}
            />
            <TextField
              fullWidth
              error={ loginError || passwordError }
              helperText={ loginError || passwordError ? 'invalid password' : '' }
              id='password'
              variant='outlined'
              required
              label='Password'
              value={ password }
              type= 'password'
              className={ classes.textField }
              onChange={(ev) => handleInputChange(setPassword, ev.target.value)}
            />
            <Button
              type='submit'
              fullWidth
              color='primary'
              variant='contained'
              className={ classes.button }
              onClick= { handleLogin }
              onSubmit={ handleLogin }
            >
              Login
            </Button>
            <Link href='/' variant='body2' onClick={() => history.push('/register')}>
              {"Don't have an account? Sign up"}
            </Link>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
};

export default LoginScreen;
