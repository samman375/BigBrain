import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { fetchPlayerCurrentQuestion } from '../../client';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack'

/**
 * Pulls from server every second to check if a game has start
 * Once started redirect to the questions
 */
const useWaitScreenState = () => {
  const [started, setStarted] = useState(false);
  const playerId = useSelector(state => state.game.playerId);
  const [error, setError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // Pulls from server every second
  // if the game is not started
  useEffect(() => {
    const watchStarted = () => {
      let timer;
      if (!started) {
        timer = setInterval(async () => {
          fetchPlayerCurrentQuestion(playerId)
            .then(() => {
              clearInterval(timer);
              setStarted(true);
            })
            .catch(err => {
              if (!error && err.message !== 'Session has not started yet') {
                enqueueSnackbar(err.message, { variant: 'error' })
                setError(true)
              }
            });
        }, 1000);
      }
      // the cleaner function that
      // clears the interval if the game is not started
      // otherwise to nothing
      const dispose = () => {
        if (!started) {
          return () => clearInterval(timer);
        }
      };
      return dispose;
    };
    const dispose = watchStarted();
    return dispose;
  }, []);
  return started;
}

const useStyles = makeStyles({
  waitContainer: {
    textAlign: 'center'
  }
});
const WaitScreen = () => {
  const started = useWaitScreenState();
  return (
    <div>
      {started ? <Redirect to='/question' /> : <SpinningWheel /> }
    </div>
  );
};

const SpinningWheel = () => {
  const classes = useStyles();
  return (
    <div className={classes.waitContainer}>
      <CircularProgress />
      <Typography variant='h5'>
        Wait for the admin to start the quiz
      </Typography>
    </div>
  )
};

export default WaitScreen;
