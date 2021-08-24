// EditScreen.jsx
import React, { useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import { useSelector, useDispatch } from 'react-redux';
// import { useParams } from 'react-router-dom';
import {
  fetchQuestions,
  closeRemoveQuestionDialog,
  removeQuestion,
  showNewQuestionDialog
} from '../../../store/questionsSlice'
import { useSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  makeStyles,
  Grid,
  Typography,
  Container,
  Button
} from '@material-ui/core';
import RemovalDialog from '../components/RemovalDialog';
import { useParams } from 'react-router';
import NewQuestionDialog from '../components/NewQuestionDialog';

/**
 * Fetches questions on mounted
 * @returns {object[]}
 */
const useQuestions = () => {
  const questions = useSelector(state => state.questions.questions);
  const dispatch = useDispatch();
  const { quizId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    dispatch(fetchQuestions(quizId))
      .then(unwrapResult)
      .catch(msg => enqueueSnackbar(msg, { variant: 'error' }))
  }, [])
  return questions
}
const useStyles = makeStyles(theme => ({
  editScreenRoot: {
    marginTop: theme.spacing(2),
    alignItems: 'strech'
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
    color: 'white',
  }
}));

/**
 * Controlls the state of the removal dialog
 * @returns { object }
 **/
const useRemovalDialogState = () => {
  const opened = useSelector(
    state => state.questions.removeQuestionModalOpened
  );
  const selectedQuestion = useSelector(
    state => state.questions.selectedQuestion
  );

  const dispatch = useDispatch();
  const { quizId } = useParams();
  const { enqueueSnackbar } = useSnackbar()
  const onClose = () => dispatch(closeRemoveQuestionDialog());

  // dispatch the remove action on click
  // sends an notification
  const onRemoval = () => {
    dispatch(removeQuestion({
      quizId: quizId,
      questionId: selectedQuestion
    }))
      .then(unwrapResult)
      .catch(msg => enqueueSnackbar(msg, { variant: 'error' }))
      .finally(dispatch(closeRemoveQuestionDialog()))
  }
  return { opened, onClose, onRemoval };
}

const QuestionRemovalDialog = () => {
  const { opened, onClose, onRemoval } = useRemovalDialogState();
  return (
    <RemovalDialog
      open={opened}
      onClose={onClose}
      onRemoval={onRemoval}
      title="Confirmation"
      desc="Are you sure you want to remove this question?"
    />
  )
}

/**
 * Allows users to see overviews of the questions
 * Will show a spinning wheel whenloading
 **/
const QuestionsView = () => {
  const classes = useStyles();
  const questions = useQuestions();
  const dispatch = useDispatch()
  return (
  <div>
    <div className={classes.heroContent}>
      <Container maxWidth="sm" align='center'>
        <Typography component="h1" variant="h2" color="textPrimary" gutterBottom>
          Quiz Questions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          id='create-new-question'
          className={classes.heroButtons}
          onClick={() => dispatch(showNewQuestionDialog())}
        >
          Create new question
        </Button>
      </Container>
    </div>
    <Container maxWidth='md'>
      <Grid
        container
        className={classes.editScreenRoot}
        alignItems='stretch'
      >
        {questions.map((q, idx) => (
          <Grid
            item
            key={`question-${idx}}`}
            xs={12}
            sm={6}
            md={4}
            >
            <QuestionCard
              options={q.options}
              desc={q.desc}
              correctAnswers={q.answers}
              type={q.type}
              index={idx + 1}
              id={q.id}
              alt={`question ${idx} img`}
              img={q.img ? q.img : null}
              duration={q.duration}
              points={q.points}
            />
          </Grid>
        ))
        }
      </Grid>
    </Container>
    <QuestionRemovalDialog />
    <NewQuestionDialog />
  </div>
  );
}

export default QuestionsView;
