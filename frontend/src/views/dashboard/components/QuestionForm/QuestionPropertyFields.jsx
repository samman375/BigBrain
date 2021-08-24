import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import PropTypes from 'prop-types'
import { useStyles } from './index'
/**
 * Allows users to edit question description,
 * points and duration.
 */
const QuestionPropertyFields = (props) => {
  const classes = useStyles()
  const { setters, state, errors } = props;
  return (
    <div>
      <TextField
          className={classes.description}
          error={errors.desc && errors.desc.length > 0}
          helperText={errors.desc}
          id='desc'
          required
          variant="outlined"
          fullWidth
          value={state.desc}
          onChange={(ev) => setters.desc(ev.target.value)}
          label="Question Description"
        />
        <TextField
          className={classes.description}
          error={errors.points && errors.points.length > 0}
          helperText={errors.points}
          required
          fullWidth
          type='number'
          id='points'
          value={state.points.toString()}
          onChange={(ev) => setters.points(ev.target.value)}
          label="Points"
        />
        <div className={classes.questionProperties}>
          <FormControl fullWidth className={classes.formField}>
            <InputLabel id="question-type-select-label">Question type</InputLabel>
            <Select
              id='question-type-select'
              labelId='question-type-select-label'
              value={state.questionType}
              onChange={ev => setters.questionType(ev.target.value)}
            >
              <MenuItem value={'single'} id='question-type-single'>Single Choice</MenuItem>
              <MenuItem value={'multi'} id='question----type-multi'>Multiple Choice</MenuItem>
            </Select>
          </FormControl>
            <TextField
              value={state.duration.toString()}
              id='duration'
              error={errors.duration && errors.duration.length > 0}
              helperText={errors.duration}
              className={classes.formField}
              fullWidth
              label='Duration (seconds)'
              type='number'
              onChange={ev => setters.duration(ev.target.value)}
            />
        </div>
      </div>
  )
}

QuestionPropertyFields.propTypes = {
  state: PropTypes.object,
  setters: PropTypes.object,
  errors: PropTypes.object,
  setErrors: PropTypes.func
}

export default QuestionPropertyFields;
