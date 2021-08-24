import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fileToDataUrl } from '../../../helpers';
import {
  closeNewQuestionDialog,
  createQuestion
} from '../../../store/questionsSlice';
import QuestionForm from './QuestionForm';
import { useSnackbar } from 'notistack'
import { unwrapResult } from '@reduxjs/toolkit';

// Handles internal logics od the new question
const useNewQuestionDialogState = () => {
  const opened = useSelector(state => state.questions.newQuestionModalOpened);
  const dispatch = useDispatch();
  const { quizId } = useParams();
  const { enqueueSnackbar } = useSnackbar()

  // uploads the question once pressed submit
  const onSubmit = async (ev, state) => {
    ev.preventDefault()
    let img = null;
    if (state.imgFile) {
      img = await fileToDataUrl(state.imgFile)
    }
    // create payload
    const question = {
      type: state.questionType,
      desc: state.desc,
      options: state.options,
      answers: state.answers,
      videoUrl: state.videoUrl,
      duration: state.duration,
      points: state.points
    }
    if (img) {
      question.img = img;
    }
    // dispatch the action to redux store
    // push notification when it completes
    dispatch(createQuestion({ question, quizId }))
      .then(unwrapResult)
      .then(enqueueSnackbar('Question has been created successfully', {
        variant: 'success'
      }))
      .catch(() => enqueueSnackbar('Creating the question failed', {
        variant: 'error'
      }))
  }
  const onClose = () => dispatch(closeNewQuestionDialog());
  return { opened, onSubmit, onClose }
}
/** New dialog for creating new question */
const NewQuestionDialog = () => {
  const { opened, onSubmit, onClose } = useNewQuestionDialogState()
  const initialValues = {
    desc: '',
    options: ['', ''],
    duration: 0,
    points: 0,
    type: 'single',
    videoUrl: '',
    answers: []
  }
  return (
    <Dialog
      open={opened}
      onClose={onClose}
    >
      <DialogTitle>New Question</DialogTitle>
      <DialogContent>
        <QuestionForm
          initialValues={initialValues}
          confirmBtnText='Submit'
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default NewQuestionDialog;
