import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { showRemoveQuestionDialog } from '../../../../store/questionsSlice';
import { useRouteMatch, useHistory } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  editButtons: {
    flexGrow: 1
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  removeButton: {
    color: theme.palette.error.main
  },
}));

/** Component for 'DELETE' and 'EDIT' button */
export default function QuestionCardAction (props) {
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={classes.actions}>
      <div className={classes.editButtons}>
        <Button
          size="small"
          color="primary"
          onClick={() => history.push(`${url}/${props.id}`)}
        >
          EDIT
        </Button>
        <Button
          size="small"
          onClick={() => dispatch(showRemoveQuestionDialog(props.id))}
        >
          <div className={classes.removeButton}>REMOVE</div>
        </Button>
      </div>
      <IconButton
        aria-label='expand-or-unexpand-icon'
        onClick={props.onExpandClick}
        className={props.expanded ? classes.expandOpen : classes.expand}
      >
        <ExpandMoreIcon/>
      </IconButton>
    </div>
  );
}

QuestionCardAction.propTypes = {
  id: PropTypes.number,
  expanded: PropTypes.bool,
  onExpandClick: PropTypes.func
};
