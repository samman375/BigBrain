import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  collapse: {
    padding: theme.spacing(1, 2)
  },
}))

/** Part for displaying answers and options */
export default function QuestionCardCollapse (props) {
  const ALPHABETS = 'ABCDEF';
  const classes = useStyles();
  return (
    <CardContent className={classes.collapse}>
      <Typography variant='h6'>Options: </Typography>
      <List dense type='A'>
        {props.options.map((val, idx) => (
          <ListItem key={`Option-${props.id}-${idx}`}>
            <ListItemText>
              {`${ALPHABETS.charAt(idx)}. ${val}`}
            </ListItemText>
          </ListItem>))}
      </List>
      <div>
        <Typography>
          <b>Correct Answer: </b>
          {
            props.correctAnswers
              .map(val => ALPHABETS.charAt(val))
              .join(', ')
          }
        </Typography>
      </div>
    </CardContent>
  );
}

QuestionCardCollapse.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  correctAnswers: PropTypes.arrayOf(PropTypes.number),
  id: PropTypes.number
};
