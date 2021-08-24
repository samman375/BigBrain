import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  button: {
    color: 'white'
  }
}));

/**
 * Creates a button that creates modal on click to create a game on dashboard
 * Form can only be submitted when not empty
 * @param {Object} props
 * @param {Function} props.fn - hook to create game
 * @param {Function} props.set - set function to reload Dashboard on change
 */
const CreateGame = (props) => {
  const classes = useStyles();

  // Used to track when modal is open
  const [open, setOpen] = useState(false);
  // Used to track if create has been clicked
  // Used to reset name to empty when cancel or submit clicked
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const handleCreate = props.onCreateClick;

  const handleClickOpen = () => {
    setName('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <Button
        variant="contained"
        id='new-game-button'
        color="primary"
        onClick={handleClickOpen}
        className={classes.button}
      >
        Create New Game
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Create New Game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter title of new game:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="gameName"
            label="Title"
            type="text"
            autoComplete="off"
            fullWidth
            onChange={handleChange}
          />

          <Typography variant='body' color='textSecondary'>
            [Optional]: Upload Question from json file
          </Typography>
          <input
            type='file'
            onChange={ev => setFile(ev.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => { handleClose(); setName(''); }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const success = await handleCreate({ name: name, file: file })
              if (success) {
                handleClose()
              }
            }}
            disabled={!name}
            id='confirm-create-button'
            color="primary"
            name="create"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CreateGame.propTypes = {
  onCreateClick: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired
}

export default CreateGame;
