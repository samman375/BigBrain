import { IconButton, Button, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { useStyles } from './index';
import PropTypes from 'prop-types';

/**
 * The fields that allows users to add / remove / edit
 * options.
 * Users can add up to 6 questions and must have at least 2
 * options
 */
const OptionsFields = (props) => {
  const classes = useStyles()
  const ALPHABETS = 'ABCDEF'
  const { setters, state, errors } = props;
  const setOption = (option, idx) => {
    const newOptions = [...(state.options)]
    newOptions[idx] = option
    setters.options(newOptions)
  }
  const addOption = () => {
    setters.options([...(state.options), ''])
  }
  const removeOption = (idx) => {
    setters.options(state.options.filter((_, i) => i !== idx))
  }
  const optionHasError = (idx) => {
    const res = (errors.options &&
            errors.options[idx] &&
            errors.options[idx].length > 0)
    return res
  }
  return (
    <>
      {
        state.options.map((option, idx) => (
          <div
            key={`newQuestionDialogOption-${idx}`}
            className={classes.optionContainer}
          >
            <TextField
              fullWidth
              id={`option-${idx}`}
              error={optionHasError(idx)}
              helperText={optionHasError(idx) ? errors.options[idx] : ''}
              className={classes.option}
              value={`${option}`}
              onChange={(ev) => setOption(ev.target.value, idx)}
              label={`Option ${ALPHABETS.charAt(idx)}`}
            />
            <IconButton
              onClick={() => removeOption(idx)}
              id='add-option-button'
              disabled={state.options.length <= 2}
              aria-label={`delete-option-${idx}`}
            >
              <DeleteIcon
                aria-label='delete'
                color={state.options.length <= 2 ? 'disabled' : 'error'}
              />
            </IconButton>
          </div>
        ))
      }
      <div>
        <Button
          disabled={state.options.length >= 6}
          onClick={addOption}
          color="primary"
        >
          Add Option
        </Button>
      </div>
    </>
  )
}

OptionsFields.propTypes = {
  state: PropTypes.object,
  setters: PropTypes.object,
  errors: PropTypes.object,
  setErrors: PropTypes.func
}
export default OptionsFields
