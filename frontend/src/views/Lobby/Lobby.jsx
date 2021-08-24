import React, { useEffect, useState } from 'react';
import { fetchSessionStatus } from '../../client';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/PageHeader';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import { Avatar, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(1)
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  container: {
    textAlign: 'center'
  },
  btn: {
    color: 'white'
  }
}));

/**
 * Handles the state of the lobby
 * encapsulates every piece
 */
const useLobbyState = () => {
  const [players, setPlayers] = useState([]);
  const [timer, setTimer] = useState(null)
  const token = useSelector(state => state.user.token)
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // fetch session status every second from the server
    // and refreshes the lobby.
    const watchSessionStatus = () => {
      const _timer = setInterval(async () => {
        try {
          const resp = await fetchSessionStatus(token, '700989');
          setPlayers(resp.results.players)
        } catch (e) {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      }, 1000);
      setTimer(_timer);
    }
    // if the timer is set clear the timer before unmounging
    const dispose = () => {
      if (timer !== null) {
        clearInterval(timer)
      }
    }
    watchSessionStatus();
    return dispose
  }, [])
  return players;
}

const Lobby = () => {
  const players = useLobbyState();
  const classes = useStyles();
  const subTitle = (
    <Typography variant='h5' component='h2'>
      {`Current players count: ${players.length}`}
    </Typography>
  )
  return (
    <>
      <PageHeader
        title='Lobby'
        subTitle={subTitle}
      />
      <Container maxWidth='md' className={classes.container}>
        <div className={classes.chips}>
          {players.map((player, idx) => (
              <Chip
                variant='outlined'
                avatar={<Avatar>{player.charAt(0)}</Avatar>}
                label={player}
                className={classes.chip}
                key={`player-${idx}`}
              />
          ))}
        </div>
        <Button
          variant='contained'
          color='primary'
          className={classes.btn}
        >
          Start!
        </Button>
      </Container>
    </>
  )
}

export default Lobby;
