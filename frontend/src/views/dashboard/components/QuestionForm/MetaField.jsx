import { FormControl, FormLabel, TextField } from '@material-ui/core';
import React from 'react';
import { useStyles } from './index';
import PropTypes from 'prop-types';

/**
 * The field that allows user to upload images
 * and attach urls to videos
 */
const MetaField = (props) => {
  const { state, setters } = props;
  const classes = useStyles();
  return (
    <>
      <div>
        <FormControl className={classes.imgContainer}>
          <FormLabel className={classes.imgLabel}>Image</FormLabel>
          <input
            type='file'
            onChange={(ev) => setters.imgFile(ev.target.files[0])}
          />
        </FormControl>
      </div>
      <TextField
        fullWidth
        id='video-url'
        className={classes.description}
        label='Video URL'
        value={state.videoUrl}
        onChange={(ev) => setters.videoUrl(ev.target.value)}
      />
    </>
  );
};
MetaField.propTypes = {
  state: PropTypes.object,
  setters: PropTypes.object
};

export default MetaField;
