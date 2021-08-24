import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import GameCard from './components/GameCard';
import api from '../../client';
import CreateGame from './components/CreateGame';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { readTextFromFile } from '../../helpers';
import { validateQuestion } from './components/QuestionForm';

const {
  getQuizList,
  createQuizRequest,
  deleteQuizRequest,
  startGameRequest,
  endGameRequest,
  updateQuiz,
} = api;

/**
 * Defines styles used on Dashboard
 * @param theme - optional materiul-ui theme
 */
const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
    color: 'white',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  pastResults: {
    margin: theme.spacing(1, 0),
    color: theme.palette.primary.main,
  },
}));

/**
 * Fetches quiz list
 * @param {Number} quizChange - used to reload dashboard on change
 * @returns quizzes - List of quizzes
 */
const useQuizzesList = (quizChange) => {
  const [quizzes, setQuizzes] = useState([]);
  const token = useSelector(state => state.user.token);
  useEffect(() => {
    // Refetches list of quizzes whenever a change is made
    const getQuizzes = async () => {
      const resp = await getQuizList(token);
      setQuizzes(resp.quizzes);
    };
    getQuizzes();
  }, [quizChange]);
  return quizzes;
};

/**
 * Calls delete quiz request
 * Used in DeleteGameAlert.jsx
 * @param {Number} quizId
 * @param {Boolean} deleteClicked - tracks if delete button was clicked
 * @param {Function} setQuizChange - used to reload dashboard on change
 * @returns error - response from fetch request
 */
const useDeleteQuiz = (quizId, deleteClicked, setQuizChange) => {
  const token = useSelector(state => state.user.token);
  const [error, setError] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // Only makes request if 'Delete' button on form is clicked
    if (deleteClicked) {
      /**
       * Makes delete quiz request
       * Creates success/error popup depending on result
       * Changes quizChange to reload dashboard
       */
      const deleteQuiz = async () => {
        try {
          await deleteQuizRequest(token, quizId);
          enqueueSnackbar('Game deleted successfully', { variant: 'success' });
          setQuizChange(quiz => quiz + 1);
        } catch (e) {
          setError(e);
          enqueueSnackbar('An error occured', { variant: 'error' });
        }
      };
      deleteQuiz();
    }
  }, [deleteClicked]);
  return error;
};

/**
 * Calls start game request
 * Used in StartGame.jsx
 * @param {Number} quizId
 * @param {Boolean} startClicked - tracks if start button was clicked
 * @param {Function} setQuizChange - used to reload dashboard on change
 * @param {String} quizActive - sessionId of quiz
 * @param {Function} setStartClicked - function to reset startClicked state
 * @returns error - response from fetch request
 */
const useStartGame = (
  quizId,
  startClicked,
  setQuizChange,
  quizActive,
  setStartClicked,
) => {
  const token = useSelector(state => state.user.token);
  const [error, setError] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // Only makes request if 'Start' button on dashboard is clicked
    if (startClicked) {
      /**
       * Makes start game request
       * Creates success/error popup depending on result
       * Changes quizChange to reload dashboard
       */
      const startGame = async () => {
        try {
          await startGameRequest(token, quizId);
          enqueueSnackbar('Game started successfully', { variant: 'success' });
          setQuizChange(quiz => quiz + 1);
        } catch (e) {
          setError(e);
          enqueueSnackbar('An error occured', { variant: 'error' });
        }
      };
      // Only sends request if quiz is not active
      if (quizActive === null) {
        startGame();
      }
      setStartClicked(false);
    }
  }, [startClicked]);
  return error;
};

/**
 * Calls end game request
 * Used in StartGame.jsx
 * @param {Number} quizId
 * @param {Boolean} stopClicked - tracks if start button was clicked
 * @param {Function} setQuizChange - used to reload dashboard on change
 * @param {String} quizActive - sessionId of quiz
 * @param {Function} setStopClicked - function to reset stopClicked state
 * @returns error - response from fetch request
 */
const useEndGame = (
  quizId,
  stopClicked,
  setQuizChange,
  quizActive,
  setStopClicked,
) => {
  const token = useSelector(state => state.user.token);
  const [error, setError] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // Only makes request if 'Stop Game' button on popup is clicked
    if (stopClicked) {
      /**
       * Makes end game request
       * Creates success/error popup depending on result
       * Changes quizChange to reload dashboard
       */
      const stopGame = async () => {
        try {
          await endGameRequest(token, quizId);
          enqueueSnackbar('Game ended successfully', { variant: 'success' });
          setQuizChange(quiz => quiz + 1);
        } catch (e) {
          setError(e);
          enqueueSnackbar('An error occured', { variant: 'error' });
        }
      };
      // Only sends request if quiz is active
      if (quizActive !== null) {
        stopGame();
      }
      setStopClicked(false);
    }
  }, [stopClicked]);
  return error;
};

/**
 * Creates and displays Dashboard Screen
 * @returns dashboard screen
 */
const DashboardScreen = () => {
  const [quizChange, setQuizChange] = useState(0);
  const quizzes = useQuizzesList(quizChange);
  const token = useSelector(state => state.user.token);

  const handleQuizCreate = async (gameDetail) => {
    const { name, file } = gameDetail;
    if (quizzes.map(q => q.name).indexOf(name) > -1) {
      throw new Error('quiz already exists');
    }
    try {
      await createQuizRequest(token, name);
      if (file) {
        const quizList = await getQuizList(token)
        const currQuiz = quizList.quizzes.find(q => q.name === name);
        const text = await readTextFromFile(file)
        const questions = JSON.parse(text);
        for (const question of questions) {
          const err = validateQuestion(question)
          const entries = Object.entries(err);
          if (entries.length > 0) {
            const errMsg = entries.map((v) => {
              return `${v[0]}: ${v[1].toString()}`
            }).join('\n')
            throw new Error(errMsg)
          }
        }
        const validQuestions = questions.map((q, i) => ({ ...q, id: i }))
        await updateQuiz(token, currQuiz.id, { questions: validQuestions })
      }
      setQuizChange(quizChange + 1)
      return true
    } catch (e) {
      return false;
    }
  }
  const classes = useStyles();

  // Gets list of quizzes
  // Used to print 'No quizzes to display'
  const noQuizzes = (quizzes.length === 0);
  const history = useHistory()
  return (
    <React.Fragment>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm" align='center'>
            <Typography
              component="h1"
              variant="h2"
              color="textPrimary"
              gutterBottom
            >
              Dashboard
            </Typography>
            <CreateGame
              className={classes.heroButtons}
              onCreateClick={handleQuizCreate}
              set={setQuizChange}
            />
            <Button
              className={classes.pastResults}
              variant='text'
              onClick={() => history.push('/results')}
            >
              View Past Results
            </Button>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {noQuizzes &&
          <Typography>No quizzes to display. Create a quiz.</Typography>}
          <Grid container spacing={4}>
            {quizzes && quizzes.map((quiz) => (
              <Grid item key={quiz.id} xs={12} sm={6} md={4}>
                <GameCard
                  quiz={quiz}
                  fnDelete={useDeleteQuiz}
                  fnStart={useStartGame}
                  fnStop={useEndGame}
                  set={setQuizChange}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
};

export default DashboardScreen;
