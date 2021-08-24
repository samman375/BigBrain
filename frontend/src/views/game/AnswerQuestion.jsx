import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import api from '../../client';
import Video from './Video';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import { useSnackbar } from 'notistack';
import { addQuestion } from '../../store/gameSlice';

const { getQuestion, submitAnswer, getCorrectAnswer } = api;

// Adapted material ui styles
const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  correct: {
    color: theme.palette.success.main
  },
  wrong: {
    color: theme.palette.error.main
  },
  results: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

// Hook to fetch question data, correct answers, and set timer
const useAnswerQuestionState = () => {
  const [question, setQuestion] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(null);
  // Used to store timer countdown
  const [counter, setCounter] = useState(-1);
  // Used to store collected answers
  const [userChoice, setUserChoice] = useState([-1]);
  // Used to fetch question after question ends
  const [intervalId, setIntervalId] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
  // Get playerId from redux
  const playerId = useSelector(state => state.game.playerId);
  // Get correct answers request
  const getAnswersFetch = async () => {
    const resp = await getCorrectAnswer(playerId);
    dispatch(addQuestion(question))
    setCorrectAnswers(resp.answerIds);
  };
  // Get question data request
  const getQuestionFetch = async () => {
    const resp = await getQuestion(playerId);
    return resp;
  };
  // Looks to see if quiz has moved to next question every second
  const watchQuestionChange = () => {
    const interval = setInterval(async () => {
      try {
        const resp = await getQuestionFetch()
        if (resp.question.id > question.id) {
          setQuestion(resp.question);
          setCounter(resp.question.duration);
          setUserChoice([]);
          setCorrectAnswers(null);
          clearInterval(intervalId);
          setIntervalId(null);
        }
      } catch (err) {
        if (err.message === 'Session ID is not an active session') {
          history.push('/perf');
        } else {
          enqueueSnackbar(err.message, { variant: 'error' });
        }
      } finally {
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null)
        }
      }
    }, 1000);
    setIntervalId(interval);
  };
  const dispose = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  };
  // Fetch quesion and setup timers
  useEffect(() => {
    getQuestionFetch().then(resp => {
      setQuestion(resp.question);
      setCounter(resp.question.duration);
    });
  }, []);
  // Countdown timer
  useEffect(() => {
    const timerCountDown = async () => {
      if (counter === -1) {
        return;
      }
      if (counter > 0) {
        setTimeout(() => setCounter(counter - 1), 1000);
      } else {
        setTimeout(async () => {
          await getAnswersFetch();
          watchQuestionChange();
        }, 2200)
      }
    };
    timerCountDown();
    return dispose;
  }, [counter]);

  // Submit chosen answer
  const onOptionsChange = async (val) => {
    if (question.type === 'single') {
      setUserChoice(() => {
        submitAnswer(playerId, [val]);
        return [val];
      });
    } else {
      setUserChoice((prevState) => {
        let answers;
        if (userChoice.indexOf(val) === -1) {
          // Not already selected: add option
          answers = [...prevState, val];
        } else {
          // Already selected: remove option
          answers = prevState.filter(v => v !== val);
        }
        submitAnswer(playerId, answers);
        return answers;
      });
    }
  };

  return {
    question,
    correctAnswers,
    counter,
    userChoice,
    setUserChoice,
    onOptionsChange,
  };
};

/**
 * Generates question page
 * @returns Question component
 */
const Question = () => {
  const classes = useStyles();
  const {
    question,
    counter,
    onOptionsChange,
    correctAnswers,
    userChoice,
  } = useAnswerQuestionState();

  // Checks if given option has previously been chosen
  // Used for multiple answer questions
  const isChecked = (option) => {
    return userChoice.indexOf(option) > -1;
  };

  // Given an option checks if option is correct
  const isCorrect = () => {
    if (userChoice.length !== correctAnswers.length) {
      return false;
    }
    for (const v of userChoice) {
      if (correctAnswers.indexOf(v) === -1) {
        return false;
      }
    }
    return true;
  };

  // Creates string to display correct answers
  const createCorrectAnswersString = (correctAnswers) => {
    let newString = 'Correct Answers: ';
    correctAnswers.forEach((answer) => {
      newString += `${question.options[answer]}, `;
    });
    newString = newString.slice(0, -2);
    return newString;
  };
  return (
    !question
      ? <CircularProgress/>
      : <>
        <CssBaseline/>
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center"
                      color="textPrimary" gutterBottom>
            {counter}
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary">
            Question {question.id + 1}: {question.desc}
          </Typography>
          {question.videoUrl && <Video url={question.videoUrl}/>}
        </Container>
        <Container maxWidth="md" component="main">
          {correctAnswers &&
          <Typography className={classes.results} variant="h6" align="left"
                      color="textPrimary" gutterBottom>
            {isCorrect()
              ? <DoneIcon className={classes.correct} aria-label='correct-answer'/>
              : <ClearIcon className={classes.wrong} aria-label='wrong-answer'/>}
            {createCorrectAnswersString(correctAnswers)}
          </Typography>}
          {question.type === 'single' &&
          <FormControl component="fieldset">
            <FormLabel component="legend">Options:</FormLabel>
            {question.options && question.options.map((option, idx) => (
              <RadioGroup
                key={option}
                value={userChoice[0] === -1 ? null : userChoice[0]}
                onChange={ev => onOptionsChange(parseInt(ev.target.value))}
              >
                <FormControlLabel
                  value={idx}
                  control={<Radio/>}
                  label={option}
                  disabled={counter === 0}
                />
              </RadioGroup>
            ))}
          </FormControl>
          }
          {question.type !== 'single' &&
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Options: (You can select more than
              one)</FormLabel>
            {question.options && question.options.map((option, idx) => (
              <FormGroup key={option}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked(idx)}
                      onChange={() => onOptionsChange(idx)}
                      name={option}
                    />}
                  label={option}
                  disabled={counter === 0}
                />
              </FormGroup>
            ))}
          </FormControl>
          }
        </Container>
      </>
  );
};

export default Question;
