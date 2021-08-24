import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, Typography } from '@material-ui/core'
import { calculatePlayerScore } from '../../../helpers';
import TableFooter from '@material-ui/core/TableFooter';
import { zip } from 'lodash';

const useStyles = makeStyles(theme => ({
  [theme.breakpoints.up('xl')]: {
    chart: {
      height: '400px',
      width: '100%'
    }
  },
  heading: {
    paddingLeft: theme.spacing(2)
  }
}))

/**
 * @param {object[]} results
 * @param {object[]} questions
 */
const reduceResults = (results, questions) => {
  const rows = [];
  for (const player of results.slice(0, 5)) {
    const score = zip(player.answers, questions).reduce((acc, curr) => {
      const [answer, question] = curr;
      acc += calculatePlayerScore(answer, question)
      return acc;
    }, 0)
    rows.push({ name: player.name, score: score })
    rows.sort((a, b) => b.score - a.score)
  }

  return rows
}

const PlayerRanking = (props) => {
  const [tableData, setTableData] = useState([]);
  const classes = useStyles()
  useEffect(() => {
    const createTableData = (results) => {
      const data = reduceResults(results);
      setTableData(data);
    }
    createTableData(props.results);
  }, [])
  return (
    <div className={classes.chart}>
    <Typography align='justify' variant='h6' className={classes.heading}>
      Players Ranking
    </Typography>
      <TableContainer>
        <Table aria-label='player-ranking-table'>
          <TableHead>
            <TableRow>
              <TableCell>Player name</TableCell>
              <TableCell>Player score*</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, idx) => (
              <TableRow key={`tr-${idx}`}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} align={'right'}>
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
    </div>
  )
}

PlayerRanking.propTypes = {
  results: PropTypes.array,
  questions: PropTypes.array
}

export default PlayerRanking;
