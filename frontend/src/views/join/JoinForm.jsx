import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { joinQuiz } from '../../store/gameSlice';
import { useParams } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    textAlign: 'center'
  },
  form: {
    padding: theme.spacing(1)
  },
  formField: {
    margin: theme.spacing(1, 0),
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  },
}));

/**
 * Encapsulates the logics behind the join form
 * Returns everything needed for the form
 */
export const useJoinGameState = () => {
  const { urlSessionId } = useParams();
  const [sessionId, setSessionId] = useState(urlSessionId || '');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState({
    hasError: false,
    msg: false
  });
  const dispatch = useDispatch();
  // validate and dispatch the redux action for joining game
  // Shows an messge on error
  const onJoinClick = async (ev) => {
    ev.preventDefault();
    if (sessionId === '' || playerName === '') {
      setError({
        hasError: true,
        msg: 'Session ID or player name is empty'
      });
      return;
    }
    dispatch(joinQuiz({ sessionId, playerName }))
      .then(unwrapResult)
      .catch(msg => setError({
        hasError: true,
        msg: msg
      }));
  };
  return {
    sessionId,
    setSessionId,
    playerName,
    setPlayerName,
    error,
    onJoinClick
  };
};

export function JoinForm (props) {
  const {
    sessionId,
    setSessionId,
    playerName,
    setPlayerName,
    error,
    onJoinClick
  } = useJoinGameState();
  const classes = useStyles();

  return <>
    <Typography variant='h4' component='h1'>
      Join Game
    </Typography>
    {error.hasError &&
    <Typography variant='body1' component='p' color='error'>
      {error.msg}
    </Typography>}
    <form
      className={classes.form}
      onSubmit={onJoinClick}
    >
      <div className={classes.formField}>
        <TextField
          fullWidth
          variant='outlined'
          value={sessionId}
          onChange={ev => setSessionId(ev.target.value)}
          label='Session ID'
        />
      </div>
      <div className={classes.formField}>
        <TextField
          fullWidth
          onChange={ev => setPlayerName(ev.target.value)}
          value={playerName}
          variant='outlined'
          label='Player name'
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant='contained'
          className={classes.button}
          onClick={onJoinClick}
        >
          Join!
        </Button>
      </div>
    </form>
  </>;
}
