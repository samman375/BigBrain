import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

/**
 * Start Game Button component
 * Button changes to 'Running' if already started
 * @param {Object} props
 * @param {Function} props.startOnClick - onClick function to run when start clicked
 * @param {Number} props.sessionId
 * @param {Boolean} props.noQuestions - check whether quiz contains questions
 * @returns Start Game Button component
 */
const StartGameButton = (props) => {
  const sessionId = props.sessionId;

  return (
    <Button
      size="small"
      color="primary"
      id="start-game-button"
      onClick={() => { props.startOnClick(sessionId); }}
      disabled={props.noQuestions}
    >
      {(sessionId === null || props.noQuestions) ? 'Start' : 'Running'}
    </Button>);
}

export default StartGameButton;

StartGameButton.propTypes = {
  startOnClick: PropTypes.func,
  sessionId: PropTypes.number,
  noQuestions: PropTypes.bool
}
