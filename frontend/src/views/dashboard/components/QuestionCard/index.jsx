import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Avatar, CardMedia, Collapse, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import HelpIcon from '@material-ui/icons/Help';
import QuestionCardContent from './QuestionCardContent';
import QuestionCardAction from './QuestionCardActions';
import QuestionCardCollapse from './QuestionCardCollapse';

const useStyles = makeStyles((theme) => ({
  questionCardRoot: {
    margin: theme.spacing(1)
  },
  mediaContainer: {
    height: '250px',
    objectFit: 'contain'
  },
  avatar: {
    height: '100%',
    width: '100%',
    backgroundColor: 'orange'
  },
  icon: {
    fontSize: '100pt'
  },
  img: {
    height: '100%'
  }
}));

/** custom hooks for handling collapse */
const useExpanded = () => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);
  return { expanded, toggleExpanded };
};

/** component for showing the question */
const QuestionCard = (props) => {
  const classes = useStyles();
  const { expanded, toggleExpanded } = useExpanded();
  return (
    <Card className={classes.questionCardRoot} name='questionCard'>
      <div className={classes.mediaContainer}>
        {props.img
          ? <CardMedia
            src={props.img}
            alt={props.alt}
            component='img'
            className={classes.img}
          />
          : <Avatar variant="square" className={classes.avatar} aria-lable='question-icon'>
            <HelpIcon className={classes.icon} aria-label='question-icon'/>
          </Avatar>
        }
      </div>
      <CardContent>
        <QuestionCardContent
          classes={classes}
          index={props.index}
          type={props.type}
          duration={props.duration}
          points={props.points}
          desc={props.desc}
        />
      </CardContent>
      <CardActions>
        <QuestionCardAction
          id={props.id}
          expanded={expanded}
          onExpandClick={toggleExpanded}
        />
      </CardActions>
      <Collapse in={expanded}>
        <QuestionCardCollapse
          id={props.id}
          options={props.options}
          correctAnswers={props.correctAnswers}
        />
      </Collapse>
    </Card>
  );
};

QuestionCard.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  desc: PropTypes.string,
  correctAnswers: PropTypes.arrayOf(PropTypes.number),
  updateTrigger: PropTypes.func,
  index: PropTypes.number,
  img: PropTypes.string,
  alt: PropTypes.string,
  duration: PropTypes.number,
  points: PropTypes.number
};

export default QuestionCard;
