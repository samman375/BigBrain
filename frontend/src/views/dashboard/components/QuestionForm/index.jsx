import QuestionPropertyFields from './QuestionPropertyFields';
import OptionsFields from './OptionsField';
import AnswersField from './AnswersField';
import MetaField from './MetaField';
import { Button, makeStyles, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
/**
 * @param {object} question
 * @param {string} question.desc
 * @param {string[]} question.options
 * @param {string[]} question.answers
 * @param {string} question.videoUrl
 * @param {int} question.points
 * @param {int} question.duration
 */
const validateTypes = (question) => {
  const errors = [];
  const createMsg = (key, expect, got) => {
    return `Invalid type for ${key}, got ${got}, expect ${expect}\n`
  }
  if ((typeof question.desc) !== 'string') {
    errors.push(createMsg('desc', 'string', typeof question.desc))
  }
  if (!(question.options instanceof Array)) {
    errors.push(createMsg('options', 'array', typeof question.options))
  }
  if (!(question.answers instanceof Array)) {
    errors.push(createMsg('answers', 'array', typeof question.answers))
  }
  if ((typeof question.duration) !== 'number') {
    errors.push(createMsg('duration', 'number', typeof question.duration))
  }
  if ((typeof question.points) !== 'number') {
    errors.push(createMsg('points', 'number', typeof question.points))
  }
  if ((typeof question.type) !== 'string') {
    errors.push(createMsg('type', 'string', typeof question.type))
  }
  return errors
}

/**
 * @param {object} initialValues
 * @param {string} initialValues.desc
 * @param {string[]} initialValues.options
 * @param {string} initialValues.videoUrl
 * @param {int} initialValues.points
 * @param {int} initialValues.duration
 */
export const validateQuestion = (state) => {
  const errors = {};
  const keys = Object.keys(state);
  // checking keys
  const requiredKeys = [
    'desc', 'options', 'points', 'duration', 'answers', 'type'
  ]
  const missingKeys = []
  for (const requiredKey of requiredKeys) {
    if (keys.indexOf(requiredKey) === -1) {
      missingKeys.push(requiredKey)
    }
  }
  if (missingKeys.length > 0) {
    errors.missingKeys = 'Missing Keys: ' + missingKeys.join(', ')
    return errors
  }
  // type checking
  const typeErrors = validateTypes(state);
  if (typeErrors.length > 0) {
    errors.typeErrors = typeErrors
    return errors
  }
  // dec cannot be empty
  if (state.desc.length === 0) {
    errors.desc = 'You must enter the question';
  }
  if (['single', 'multi'].indexOf(state.type) === -1) {
    errors.type = 'type can only be "single" or "multi"'
  }

  // Options cannot be empty
  const optionErrors = {};
  state.options.forEach((v, i) => {
    if (v.length === 0) {
      optionErrors[i] = 'Option cannot be empty';
    }
  });
  if (state.options.length < 2 || state.options.length > 6) {
    state.options.forEach((_, idx) => {
      optionErrors[idx] = 'You can only have 4~6 options';
    });
  }
  if (Object.entries(optionErrors).length > 0) {
    errors.options = optionErrors;
  }

  // validate points
  if (state.points < 1) {
    errors.points = 'Questions should have at least 1 point';
  }

  // validate duration
  if (!(state.duration >= 5 && state.duration <= 300)) {
    errors.duration = 'Duration should between 5s and 5mins (300s)';
  }

  // validate answers
  if (state.answers.length === 0) {
    errors.answers = 'You must have at least one answer';
  }
  if ([...state.answers].sort()[0] < 0 ||
    [...state.answers].sort().reverse()[0] >= state.options.length) {
    errors.answers = 'Answers should be non negative and less than the number of options';
  }

  return errors;
};

export const useStyles = makeStyles(theme => ({
  description: {
    marginBottom: theme.spacing(2)
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(5)
  },
  option: {
    marginBottom: theme.spacing(1),
  },
  formField: {
    margin: theme.spacing(1, 1)
  },
  questionProperties: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    color: 'white'
  },
  buttonBar: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: theme.spacing(2, 1, 1, 1)
  },
  imgLabel: {
    margin: theme.spacing(1, 0)
  },
  imgContainer: {
    margin: theme.spacing(1, 0)
  }
}));

const useQuestionFormState = (initialValues) => {
  const [desc, setDesc] = useState(initialValues.desc);
  const [options, setOptions] = useState(initialValues.options);
  const [questionType, setQuestionType] = useState(initialValues.type);
  const [duration, setDuration] = useState(initialValues.duration);
  const [imgFile, setImgFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(initialValues.videoUrl);
  const [points, setPoints] = useState(initialValues.points);
  const [answers, setAnswers] = useState(initialValues.answers);
  const [errors, setErrors] = useState({});
  const durationSetter = (val) => {
    const v = parseInt(val);
    setDuration(v);
  };
  const pointsSetter = (val) => {
    const v = parseInt(val);
    setPoints(v);
  };
  const answersSetter = (val) => {
    if (val instanceof Array) {
      setAnswers(val);
    } else {
      setAnswers([val]);
    }
  };
  const state = {
    desc,
    options,
    questionType,
    duration,
    imgFile,
    videoUrl,
    points,
    answers
  };
  const setters = {
    desc: setDesc,
    options: setOptions,
    questionType: setQuestionType,
    duration: durationSetter,
    imgFile: setImgFile,
    videoUrl: setVideoUrl,
    points: pointsSetter,
    answers: answersSetter
  };

  return { state, setters, errors, setErrors };
};

export default function QuestionForm (props) {
  const classes = useStyles();
  const {
    state,
    setters,
    errors,
    setErrors
  } = useQuestionFormState(props.initialValues);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const payload = { ...state, type: state.questionType }
    const errs = validateQuestion(payload);
    if (Object.entries(errs).length !== 0) {
      setErrors(errs);
      return;
    }
    props.onSubmit(ev, payload);
    props.onClose();
  };

  const questionForm = (
    <form onSubmit={ev => handleSubmit(ev)}>
      <QuestionPropertyFields
        state={state}
        setters={setters}
        errors={errors}
        setErrors={setErrors}
      />
      <OptionsFields
        state={state}
        setters={setters}
        errors={errors}
        setErrors={setErrors}
      />
      <AnswersField
        errors={errors}
        state={state}
        setErrors={setErrors}
        setters={setters}
      />
      <MetaField
        state={state}
        setters={setters}
      />
      <div className={classes.buttonBar}>
        <Button
          id='question-form-cancel'
          variant='contained'
          onClick={props.onClose}
        >
          CANCEL
        </Button>
        <Button
          color='primary'
          variant='contained'
          className={classes.submitButton}
          onClick={(ev) => handleSubmit(ev)}
          type='submit'
        >
          {props.confirmBtnText || 'Submit'}
        </Button>
      </div>
    </form>
  );
  return props.paper
    ? <Paper className={classes.paper}>{questionForm}</Paper>
    : questionForm;
}

QuestionForm.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  paper: PropTypes.bool,
  confirmBtnText: PropTypes.string,
  initialValues: PropTypes.object
};
