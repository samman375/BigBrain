import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper'
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ResultsHeader from './ResultsHeader';
import AnswersBreakdownChart from './charts/AnswersBreakdownChart';
import { fetchSessionResults, fetchSessionStatus } from '../../client';
import { useParams, useRouteMatch, Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, makeStyles } from '@material-ui/core';
import AverageResponseTimeChart from './charts/AverageResponseTime';
import PlayerRanking from './charts/PlayerRanking';
import ResultsTable from './ResultsTable'

const useStyles = makeStyles(theme => ({
  resultsContainer: {
    padding: theme.spacing(6, 0)
  },
  chartContainer: {
    padding: theme.spacing(3, 2, 0),
    margin: theme.spacing(4, 0)
  },
  gridContainer: {
    padding: theme.spacing(0, 4)
  },
  tableContainer: {
    margin: theme.spacing(4, 0),
    padding: theme.spacing(3, 0, 0)
  }
}));

const ResultsView = () => {
  const { sessionId } = useParams();
  const classes = useStyles();
  const [results, setResults] = useState(null);
  const [questions, setQuestions] = useState(null);
  const token = useSelector(state => state.user.token);

  useEffect(() => {
    const getSessionResults = async () => {
      const resp = await fetchSessionResults(token, sessionId)
      const statusResp = await fetchSessionStatus(token, sessionId);
      setResults(resp);
      setQuestions(statusResp.results.questions)
    };
    getSessionResults();
  }, []);

  return (
    <div>
      <ResultsHeader />
      <Container align='center' className={classes.resultsContainer} maxWidth='xl'>
        {!(results && questions)
          ? <CircularProgress />
          : <Grid
              container
              justify='center'
              alignItems='stretch'
              spacing={4}
              className={classes.gridContainer}
            >
             <ChartContainer>
                <AnswersBreakdownChart results={results}/>
              </ChartContainer>
              <ChartContainer>
                <AverageResponseTimeChart results={results} />
              </ChartContainer>
              <Grid item xs={12} xl={4} >
                <Paper className={classes.tableContainer}>
                  <PlayerRanking results={results} questions={questions}/>
                </Paper>
              </Grid>
            </Grid>
        }
      </Container>
    </div>
  )
}

const ChartContainer = (props) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} md={6} xl={4}>
      <Paper className={classes.chartContainer}>
        {props.children}
      </Paper>
    </Grid>
  );
};

ChartContainer.propTypes = {
  children: PropTypes.node
};

const ResultsRoute = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:sessionId`}>
        <ResultsView />
      </Route>
      <Route exact path={`${path}/`}>
        <ResultsTable />
      </Route>
    </Switch>
  )
}
export default ResultsRoute;
