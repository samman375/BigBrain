import React from 'react';
import Button from '@material-ui/core/Button';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Material-component for popup
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const startGamePopupContent = (props) => {
  return (
    <DialogContent dividers>
      <Typography gutterBottom>
        Session Id: {props.sessionId}
      </Typography>
      <Typography gutterBottom>
        Game State: {props.advance === 0 ? 'Lobby' : 'Question ' + props.advance}
      </Typography>
      <Button
        color="primary"
        onClick={props.copyOnClick}
      >Copy URL</Button>
    </DialogContent>
  )
}

export default startGamePopupContent;

startGamePopupContent.propTypes = {
  sessionId: PropTypes.number,
  copyOnClick: PropTypes.func,
  advance: PropTypes.number
}
