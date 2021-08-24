import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { JoinForm } from './JoinForm';
import { useSelector } from 'react-redux';
import WaitScreen from './WaitScreen';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  paperRoot: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const JoinGameView = () => {
  const classes = useStyles();
  const playerJoined = useSelector(state => !!(state.game.playerId));
  return (
    <Grid container justify='center' className={classes.root}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper className={classes.paperRoot}>
          {playerJoined ? <WaitScreen /> : <JoinForm />}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default JoinGameView;
