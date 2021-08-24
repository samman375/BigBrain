import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { useHistory, useParams } from 'react-router-dom';
// import QuestionForm from '../components/QuestionForm';
import { useDispatch, useSelector } from 'react-redux';
import { fileToDataUrl } from '../../../helpers';
import { fetchQuestions, updateQuestion } from '../../../store/questionsSlice';
import QuestionForm from '../components/QuestionForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

function useEditQuestionState () {
  const { questionId, quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const questions = useSelector(state => state.questions.questions);
  const currQuestion = questions.filter(q => q.id === parseInt(questionId))[0];
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const onSubmit = async (ev, state) => {
    ev.preventDefault();
    let img = null;
    if (state.imgFile) {
      img = await fileToDataUrl(state.imgFile);
    }
    const payload = {
      quizId: quizId,
      question: {
        type: state.questionType,
        desc: state.desc,
        options: state.options,
        answers: state.answers,
        videoUrl: state.videoUrl,
        duration: state.duration,
        points: state.points,
        id: currQuestion.id
      }
    };
    if (img) {
      payload.question.img = img;
    }
    dispatch(updateQuestion(payload))
      .then(unwrapResult)
      .then(enqueueSnackbar('Question has been updated successfully', {
        variant: 'success'
      }))
      .catch(() => enqueueSnackbar('Ureating the question failed', {
        variant: 'error'
      }));
  };
  useEffect(() => {
    dispatch(fetchQuestions(quizId))
      .then(unwrapResult)
      .then(() => setLoading(false));
  }, []);
  const onClose = () => history.goBack();
  return { loading, currQuestion, onSubmit, onClose };
}

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    backgroundColor: theme.palette.background.paper,
    textAlign: 'center',
    padding: theme.spacing(6, 0)
  }
}));
const Header = () => {
  const classes = useStyles();
  return (
      <Typography variant='h2' component='h1' className={classes.header}>
        Update Question
      </Typography>
  );
};
// Allows user to edit the question
const EditQuestionView = () => {
  const classes = useStyles();
  const { loading, currQuestion, onSubmit, onClose } = useEditQuestionState();
  return (
      <div>
        <Header></Header>
        <Container maxWidth="md" className={classes.container}>
          {loading
            ? <CircularProgress/>
            : <QuestionForm
                  initialValues={currQuestion}
                  paper
                  onSubmit={onSubmit}
                  onClose={onClose}
              />}
        </Container>
      </div>
  );
};

export default EditQuestionView;
