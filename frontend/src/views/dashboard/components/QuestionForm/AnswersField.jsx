import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * The field that allows users to choose the right answer
 * if the question is a multiple-choice
 * it will show checkbox in front of hte options
 **/
const AnswersField = (props) => {
  const { state, setters, errors } = props;
  const ALPHABETS = 'ABCDEF';
  const hasError = errors.answers && errors.answers.length > 0;
  return (
    <div>
      <FormControl
        fullWidth
        error={hasError}
      >
        <InputLabel id="answers-select-label">Answers</InputLabel>
        <Select
          id='question-answer-select'
          multiple={state.questionType !== 'single'}
          labelId='question-type-select-label'
          value={state.answers}
          renderValue={(selected) => selected.map((v) => state.options[v]).join(', ')}
          onChange={ev => setters.answers(ev.target.value)}
        >
          {state.options.map((val, idx) => (
            <MenuItem key={`answer-option-${idx}`} value={idx}
                      id={`answer-option-${idx}`}>
              {state.questionType === 'multi' &&
              <Checkbox checked={state.answers.indexOf(idx) > -1}
                        id={`answer-checkbox-${idx}`}/>
              }
              <ListItemText primary={`${ALPHABETS.charAt(idx)}. ${val}`}/>
            </MenuItem>
          ))}
        </Select>
        {hasError &&
        <FormHelperText
          id='answer-field-error-text'>{errors.answers}</FormHelperText>
        }
      </FormControl>
    </div>
  );
};

AnswersField.propTypes = {
  state: PropTypes.object,
  setters: PropTypes.object,
  errors: PropTypes.object,
  setErrors: PropTypes.func
};

export default AnswersField;
