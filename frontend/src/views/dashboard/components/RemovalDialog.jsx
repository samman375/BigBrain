import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  removeButton: {
    color: theme.palette.error.main
  }
}));
/**
 * Component for simple removal dialog
 * @param {object} props
 * @param {boolean} props.open controlls the open status
 * @param {string} props.title the title of the dialog
 * @param {string} props.desc the description of the dialog
 * @param {Function} props.onClose
 * @param {Function} props.onRemoval
 **/
const RemovalDialog = (props) => {
  const classes = useStyles();
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labledby="removal-dialog"
    >
    <DialogTitle>{props.title}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {props.desc}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose} color="primary">CANCEL</Button>
      <Button
        onClick={props.onRemoval}
        className={classes.removeButton}
      >
        DELELTE
      </Button>
    </DialogActions>
    </Dialog>
  )
}
RemovalDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  desc: PropTypes.string,
  onClose: PropTypes.func,
  onRemoval: PropTypes.func
}
export default RemovalDialog;
