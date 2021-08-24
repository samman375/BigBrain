import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Creates Stop game button component
 * Raises another popup onClick to view results
 * @param {Object} props
 * @param {Number} props.sessionId
 * @param {Function} props.closeStartGame - closes popup from StartGame
 * @param {Function} props.setStopClicked - Used to track when stop game button clicked
 * @param {Boolean} props.openEndGame - Used to open end game popup
 * @param {Function} props.setOpenEndGame - Used to reset open end game popup
 * @returns Stop Game button component + view results dialog
 */
const EndGameButton = (props) => {
  const handleClickOpen = () => {
    props.setOpenEndGame(true);
  };
  const handleClose = () => {
    props.setOpenEndGame(false);
  };
  const sessionId = useSelector(state => state.user.sessionId);
  const history = useHistory();
  const showResults = () => {
    history.push(`/results/${sessionId}`);
  };

  const closeStartGame = props.closeStartGame;
  const setStopClicked = props.setStopClicked;

  return (
    <div>
      <Button
        onClick={() => { setStopClicked(true); handleClickOpen(); }}
        color="secondary"
        id="stop-game-button"
        disabled={sessionId === null}
      >
        Stop Game
      </Button>
      <Dialog
        open={props.openEndGame}
        onClose={handleClose}
      >
        <DialogTitle>Session ended</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to view the Results?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => { handleClose(); closeStartGame(); }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => { handleClose(); closeStartGame(); showResults(); }}
            color="primary"
            autoFocus
            id="view-results-button"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

EndGameButton.propTypes = {
  sessionId: PropTypes.number,
  closeStartGame: PropTypes.func.isRequired,
  setStopClicked: PropTypes.func.isRequired,
  openEndGame: PropTypes.bool.isRequired,
  setOpenEndGame: PropTypes.func.isRequired
}

export default EndGameButton;
