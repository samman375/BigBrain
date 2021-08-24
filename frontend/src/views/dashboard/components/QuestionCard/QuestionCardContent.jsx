import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import { Typography } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
    // marginBottom: theme.spacing(1),
    alignItems: 'start',
  },
  title: {
    marginRight: theme.spacing(1),
    ontWeight: 'bold',
  },
  icons: {
    display: 'inline-block',
    marginLeft: theme.spacing(1),
  },
  metaInfo: {
    display: 'flex',
    alignItems: 'center'
  },
  infoBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}));

const DurationAndPoints = (props) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.icons}>
        <Typography
          variant='body1'
          component='span'
          color='textSecondary'
          className={classes.metaInfo}
          aria-label='duration'
        >
          <AccessAlarmIcon aria-label='duration-icon'/>
          {props.duration} s
        </Typography>
      </div>
      <div className={classes.icons}>
        <Typography
          variant='body1'
          component='span'
          color='textSecondary'
          className={classes.metaInfo}
          aria-label='points'
        >
          <AssignmentIcon aria-label='points-icon'/>
          {props.points} pts
        </Typography>
      </div>
    </div>
  );
};

/**
 * Component for showing question content
 * including question index, duration, points...
 **/
const QuestionCardContent = (props) => {
  const classes = useStyles();
  return <>
    <div className={classes.header}>
      <Typography className={classes.title} component='p' variant='h6'>
        {`Question ${props.index}`}
      </Typography>
      <div className={classes.infoBar}>
        <Typography
          component='p'
          variant='body1'
          color="textSecondary"
        >
          {props.type === 'multi' ? 'Multiple Choice' : 'Single Choice'}
        </Typography>
        <DurationAndPoints
          duration={props.duration}
          points={props.points}
        />
      </div>
    </div>
    <div>
      <Typography variant='body1' component='p' className={classes.desc}>
        {props.desc}
      </Typography>
    </div>
  </>;
};

DurationAndPoints.propTypes = {
  duration: PropTypes.number,
  points: PropTypes.number
};

QuestionCardContent.propTypes = {
  classes: PropTypes.any,
  index: PropTypes.number,
  type: PropTypes.string,
  duration: PropTypes.number,
  points: PropTypes.number,
  desc: PropTypes.string
};

export default QuestionCardContent;
