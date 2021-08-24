import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

/**
 * Creates a button that creates modal on click to delete a game on dashboard
 * @param {Object} props
 * @param {Number} props.quizId
 * @param {Function} props.fn - hook to delete game
 * @param {Function} props.set - set function to reload Dashboard on change
 */
const DeleteGameAlert = (props) => {
  // Used to track if delete button on modal was clicked
  const [deleteClicked, setDeleteClicked] = useState(false);

  // Used to open and close modal
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Make delete quiz request
  const useDeleteQuiz = props.fn;
  useDeleteQuiz(props.quizId, deleteClicked, props.set);

  return (
    <div>
      <Button size="small" color="primary" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Are you sure you want to delete this game?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This game will be permanently deleted. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => { handleClose(); setDeleteClicked(true); }}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DeleteGameAlert.propTypes = {
  quizId: PropTypes.number,
  fn: PropTypes.func,
  set: PropTypes.func
}

export default DeleteGameAlert;
