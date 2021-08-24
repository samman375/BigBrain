import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import StopGame from './StopGame';
import StartGameButton from './StartGameButton';
import api from '../../../client';
import { useSnackbar } from 'notistack';
import { setSessionId } from '../../../store/userSlice';
import StartGamePopupContent from './StartGamePopup';

const { advanceGame } = api;

/**
 * Defines styles used on GameStart popup from material-ui
 * @param theme - optional materiul-ui theme
 */
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

// Material-component for popup
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose
        ? (<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon aria-label='close-icon'/>
        </IconButton>)
        : null}
    </MuiDialogTitle>
  );
});

// Material-component for popup
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

/**
 * Calls advance game request
 * @param {Number} quizId
 * @param {Number} advance - tracks state of session
 * @param {Number} nQuestions
 * @param {Function} setStopClicked - to show game ended when advanced to end
 * @param {Function} setOpenEndGame - to show game ended when advanced to end
 * @param {Boolean} advanceClicked - to track if 'advance' button is clicked
 * @param {Function} setAdvanceClicked - function to reset advanceClicked state
 */
const useAdvanceGame = (
  quizId,
  advance,
  nQuestions,
  setStopClicked,
  setOpenEndGame,
  advanceClicked,
  setAdvanceClicked
) => {
  const token = useSelector(state => state.user.token);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // Only makes request if 'Advance Game' button on popup is clicked && game is not ended
    if (advance <= nQuestions && advanceClicked) {
      /**
       * Makes advance game request
       * Creates success/error popup depending on result
       */
      const advanceGameRequest = async () => {
        try {
          await advanceGame(token, quizId);
          enqueueSnackbar('Game advanced', { variant: 'success' });
        } catch (e) {
          enqueueSnackbar('An error occured', { variant: 'error' });
        }
      };
      advanceGameRequest();
    } else if (advance > nQuestions) {
      // Show game ended popup
      setStopClicked(true);
      setOpenEndGame(true);
    }
    setAdvanceClicked(false);
  }, [advanceClicked]);
}

/**
 * When 'Start' button clicked raises popup displaying sessionId
 * Stop button also displayed on popup
 * @param {Object} props
 * @param {String} props.quizName
 * @param {Number} props.quizId
 * @param {String} props.quizActive
 * @param {Number} props.nQuestions - number of questions in quiz
 * @param {Function} props.fnStart - hook for start game onClick
 * @param {Function} props.fnStop - hook for stop game onClick
 * @param {Function} props.set - set state function to reload dashboard
 * @returns GameStart popup component
 */
const GameStarted = (props) => {
  // Used to track when start, stop, and advance buttons clicked
  const [startClicked, setStartClicked] = useState(false);
  const [stopClicked, setStopClicked] = useState(false);
  const [advanceClicked, setAdvanceClicked] = useState(false);

  // Used to track state of session
  const [advance, setAdvance] = useState(0);

  // Used to provide feedback when copied to clipboard
  const { enqueueSnackbar } = useSnackbar();

  // Used to open and close view results popup
  const [openEndGame, setOpenEndGame] = useState(false);

  const quizName = props.quizName;
  const quizActive = props.quizActive;
  // Used to disable start button if no questions in quiz
  const noQuestions = (props.nQuestions === 0);

  // Handle open and closed popup state
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (quizActive) {
      dispatch(setSessionId(quizActive))
    }
  }, [])
  // Make start game request when start clicked
  const useStartGame = props.fnStart;
  useStartGame(
    props.quizId,
    startClicked,
    props.set,
    quizActive,
    setStartClicked
  );

  // Make end game request when stop clicked
  const useEndGame = props.fnStop;
  useEndGame(
    props.quizId,
    stopClicked,
    props.set,
    quizActive,
    setStopClicked
  );

  // Make advance game request when advance clicked
  useAdvanceGame(
    props.quizId,
    advance,
    props.nQuestions,
    setStopClicked,
    setOpenEndGame,
    advanceClicked,
    setAdvanceClicked
  );

  /**
   * Copies url for given session to clipboard
   * Shows success message
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:3000/#/join/${quizActive}`);
    enqueueSnackbar('Copied to clipboard', { variant: 'success' });
  };

  const startGameOnClick = (sessionId) => {
    handleClickOpen();
    setStartClicked(true);
    sessionId !== null && setAdvance(0);
  }

  return (
    <div>
      <StartGameButton
        sessionId={quizActive}
        startOnClick={startGameOnClick}
        noQuestions={noQuestions}
      />
      <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth={true}>
        <DialogTitle onClose={handleClose}>
          Game running: {quizName}
        </DialogTitle>
        <StartGamePopupContent sessionId={quizActive} copyOnClick={copyToClipboard} advance={advance} />
        <DialogActions>
          <Button
            color="primary"
            onClick={() => { setAdvance(state => state + 1); setAdvanceClicked(true); }}
            disabled={quizActive === null}
          >Advance Game</Button>
          <StopGame
            sessionId={quizActive}
            closeStartGame={handleClose}
            setStopClicked={setStopClicked}
            openEndGame={openEndGame}
            setOpenEndGame={setOpenEndGame}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

GameStarted.propTypes = {
  quizName: PropTypes.string.isRequired,
  quizId: PropTypes.number.isRequired,
  quizActive: PropTypes.number,
  nQuestions: PropTypes.number.isRequired,
  fnStart: PropTypes.func.isRequired,
  fnStop: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired
}

export default GameStarted;
