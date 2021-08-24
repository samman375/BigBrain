import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Defines styles used in RegisterScreen
 * @param theme - optional materiul-ui theme
 */
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
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textField: {
    display: 'block',
    marginBottom: theme.spacing(2),
  },
  button: {
    color: 'white',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  }
}));

export function RegisterForm (props) {
  /**
   * Sets given input field value
   * @param {*} setter - eg. setEmailText, etc.
   * @param {*} val - value to be set to
   */
  const handleInputChange = (setter, val) => {
    props.setError(false);
    setter(val);
  };

  const classes = useStyles();

  const [nameText, setNameText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  return <Paper className={classes.paper}>
    <Typography component="h1" variant="h4" className={classes.heading}>
      Register
    </Typography>
    {props.registerError &&
    <Typography component='p' variant='body1'
                className={classes.errorMsg}>
      Invalid name, email or password
    </Typography>
    }
    <form className={classes.form} noValidate autoComplete='off'
          onSubmit={(ev) => props.onSubmit(ev, {
            name: nameText,
            password: passwordText,
            email: emailText
          })}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={props.registerError}
            name="name"
            variant="outlined"
            required
            fullWidth
            id="name"
            className={classes.textField}
            label="Name"
            value={nameText}
            type='name'
            autoFocus
            onChange={ev => handleInputChange(setNameText, ev.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={props.registerError}
            variant="outlined"
            required
            fullWidth
            id="email"
            className={classes.textField}
            value={emailText}
            type='email'
            label="Email"
            name="email"
            onChange={ev => handleInputChange(setEmailText, ev.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={props.registerError}
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            value={passwordText}
            type="password"
            id="password"
            className={classes.textField}
            onChange={ev => handleInputChange(setPasswordText, ev.target.value)}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={(ev) => props.onSubmit(ev, {
          name: nameText,
          password: passwordText,
          email: emailText
        })}
      >
        Register
      </Button>
      <Link href="#" variant="body2" onClick={props.onLinkClick}>
        Already have an account? Log in
      </Link>
    </form>
  </Paper>;
}

RegisterForm.propTypes = {
  registerError: PropTypes.bool,
  onSubmit: PropTypes.func,
  onLinkClick: PropTypes.func,
  setError: PropTypes.func
};
