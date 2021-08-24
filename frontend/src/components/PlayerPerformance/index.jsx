import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPlayerResult } from '../../client';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import PageHeader from '../PageHeader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';
import AnswersTable from './AnswersTable';
import { zip, sum } from 'lodash';
import { calculatePlayerScore } from '../../helpers';

const useStyles = makeStyles(theme => ({
  chartContainer: {
    padding: theme.spacing(3, 2, 0),
    margin: theme.spacing(4, 0)
  },
}));

const usePlayerPerformanceState = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});
  const playerId = useSelector(state => state.game.playerId);
  const questions = useSelector(state => state.game.questions);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const pullPlayerResults = async () => {
      try {
        const resp = await fetchPlayerResult(playerId)
        setResults(resp);
        setLoading(false);
      } catch (e) {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    pullPlayerResults();
  }, [])
  return { loading, results, questions }
}
const PlayerPerformance = () => {
  const { loading, results, questions } = usePlayerPerformanceState();
  const scores = zip(results, questions).map(v => {
    const [result, question] = v;
    return calculatePlayerScore(result, question)
  })
  return (
    <div>
      <PageHeader title={`Your results: ${sum(scores).toFixed(1)}`} />
      {loading
        ? <CircularProgress />
        : <PlayerPerformanceContent results={results} questions={questions}/>}
    </div>
  )
}

const PlayerPerformanceContent = (props) => {
  return (
    <Grid container justify='center'>
      <GridItem>
        <AnswersTable results={props.results} questions={props.questions}/>
      </GridItem>
    </Grid>
  )
}

const GridItem = (props) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} md={6} xl={4}>
      <Paper className={classes.chartContainer}>
        {props.children}
      </Paper>
    </Grid>
  )
}

GridItem.propTypes = {
  children: PropTypes.node
}

PlayerPerformance.propTypes = {
  results: PropTypes.array
}

PlayerPerformanceContent.propTypes = {
  results: PropTypes.array,
  questions: PropTypes.array,
}

export default PlayerPerformance;
