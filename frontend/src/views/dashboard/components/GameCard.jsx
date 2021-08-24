import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import HelpIcon from '@material-ui/icons/Help';
import DeleteGameAlert from './DeleteGameAlert';
import StartGame from './StartGame';
import { makeStyles, Avatar } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router';

/**
 * Defines styles used on Dashboard
 * @param theme - optional materiul-ui theme
 */
const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    height: '100%',
  },
  cardContent: {
    flexGrow: 1,
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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}))

/**
 * Creates a card component for a game on dashboard
 * @param {Object} props
 * @param {Object} props.quiz - Object with game data
 * @param {Function} props.fnDelete - hook for delete game onClick
 * @param {Function} props.fnStart - hook for start game onClick
 * @param {Function} props.fnStop - hook for stop game onClick
 * @param {Function} props.set - set function to reload Dashboard on change
 * @returns GameCard component for given game
 */
const GameCard = (props) => {
  const classes = useStyles();
  const quiz = props.quiz;
  const history = useHistory();
  const { url } = useRouteMatch();

  const nQuestions = quiz.questions.length;

  // Calculates duration of quiz to display
  let quizDuration = 0;
  if (nQuestions !== 0) {
    for (let i = 0; i < nQuestions; i++) {
      quizDuration += quiz.questions[i].duration;
    }
  }

  return (
    <Card className={classes.card}>
      <div className={classes.mediaContainer}>
        {quiz.thumbnail
          ? <CardMedia
          className={classes.cardMedia}
          image={quiz.thumbnail}
        />
          // Gives default image if none provided
          : <Avatar variant="square" className={classes.avatar} aria-label='quiz-label-container'>
            <HelpIcon className={classes.icon} aria-label='quiz-icon'/>
          </Avatar>
        }
      </div>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {quiz.name}
        </Typography>
        <Typography>
          {nQuestions} questions
        </Typography>
        <Typography>
          Estimated {quizDuration} seconds to complete
        </Typography>
      </CardContent>
      <CardActions>
        <StartGame
          quizName={quiz.name}
          quizId={quiz.id}
          quizActive={quiz.active}
          nQuestions={nQuestions}
          fnStart={props.fnStart}
          fnStop={props.fnStop}
          set={props.set}
        />
        <Button
          size="small"
          name='edit-quiz-button'
          color="primary"
          id="editGame"
          onClick={() => history.push(`${url}/${quiz.id}`)}
        >
          Edit
        </Button>
        <DeleteGameAlert quizId={quiz.id} fn={props.fnDelete} set={props.set} />
      </CardActions>
    </Card>
  )
}

GameCard.propTypes = {
  quiz: PropTypes.object.isRequired,
  fnDelete: PropTypes.func.isRequired,
  fnStart: PropTypes.func.isRequired,
  fnStop: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired,
  onEditClick: PropTypes.func,
}

export default GameCard;
