import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core';
import TableFooter from '@material-ui/core/TableFooter';
import { calculatePlayerScore } from '../../helpers';
import { zip } from 'lodash';
const useStyles = makeStyles(theme => ({
  correct: {
    color: theme.palette.success.main
  },
  wrong: {
    color: theme.palette.error.main
  },
  tableFooter: {
    color: theme.palette.text.primary,
    fontSize: '12pt'
  },
  title: {
    padding: theme.spacing(1, 0)
  }
}));
const AnswersTable = (props) => {
  const classes = useStyles();
  const correct = props.results.filter(v => v.correct).length;
  const total = props.results.length;
  const scores = zip(props.results, props.questions).map(v => {
    const [result, question] = v;
    return calculatePlayerScore(result, question)
  })
  return (
    <>
      <Typography variant='h5' component='h1' className={classes.title}>
        Breakdown
      </Typography>
      <TableContainer>
        <Table stickyHeader aria-label='player performance table'>
          <TableHead>
            <TableRow>
              <TableCell>Question ID</TableCell>
              <TableCell>Your answer</TableCell>
              <TableCell>Time spent (s)</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.results.map((row, idx) => {
              const answerTime = new Date(row.answeredAt)
              const startTime = new Date(row.questionStartedAt)
              const timeSpent = (answerTime - startTime) / 1000;
              return (
              <TableRow key={`perf-${idx}`}>
                <TableCell>Question {idx}</TableCell>
                <TableCell>
                  {row.answerIds.map(v => 'ABCDEF'[v]).join(', ')}
                </TableCell>
                <TableCell>
                  {timeSpent.toFixed(1)}
                </TableCell>
                <TableCell
                  className={row.correct ? classes.correct : classes.wrong}
                >
                  {row.correct ? 'Correct' : 'Wrong'}
                </TableCell>
                <TableCell
                  className={row.correct ? classes.correct : classes.wrong}
                >
                  {scores[idx].toFixed(1)}
                </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={3}
                align='right'
                className={classes.tableFooter}
              >
                Total:
              </TableCell>
              <TableCell className={classes.tableFooter} colSpan={3}>
                {`${correct}/${total} (${(correct / total * 100).toFixed(0)})`}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5} align={'right'}>
                <Typography>
                  * Player Score sums up <b>correctness x points x speed</b>
                  {' '}for each question
                </Typography>
                <Typography>
                  speed = 100 / time spent
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

AnswersTable.propTypes = {
  results: PropTypes.array,
  questions: PropTypes.array
};

export default AnswersTable;
