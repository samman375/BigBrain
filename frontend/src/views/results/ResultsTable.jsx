import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Container from '@material-ui/core/Container';
import { makeStyles, Table } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { getQuizList } from '../../client';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions
  from '@material-ui/core/TablePagination/TablePaginationActions';
import TableFooter from '@material-ui/core/TableFooter';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    margin: theme.spacing(2, 0)
  }
}));

const useQuestionTableState = () => {
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token = useSelector(state => state.user.token);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const resp = await getQuizList(token);
        const rowsBuffer = [];
        for (const quiz of resp.quizzes) {
          quiz.oldSessions.forEach((session) => {
            rowsBuffer.push({ name: quiz.name, sessionId: session })
          })
        }
        setRows(rowsBuffer)
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' })
      }
    }
    fetchQuizzes();
  }, [])
  const onPageChange = (_, newPage) => {
    setPage(newPage);
  }
  const onChangeRowsPerPage = (ev) => {
    setRowsPerPage(parseInt(ev.target.value, 10))
    setPage(0)
  }
  return { rows, page, rowsPerPage, onPageChange, onChangeRowsPerPage };
}

const ResultsTable = () => {
  const classes = useStyles();
  const {
    rows,
    page,
    rowsPerPage,
    onPageChange,
    onChangeRowsPerPage
  } = useQuestionTableState();
  return (
    <>
      <PageHeader title='Past Results'/>
      <Container maxWidth='md'>
        {!rows
          ? <CircularProgress />
          : <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quiz Name</TableCell>
                <TableCell>Session ID</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page, page + rowsPerPage).map(row =>
                <TableRow key={`session-${row.sessionId}`}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.sessionId}</TableCell>
                  <TableCell>
                    <Link
                      href={`#/results/${row.sessionId}`}
                    >
                      View Result
                    </Link>
                  </TableCell>
                </TableRow>)}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={rows.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  onChangePage={onPageChange}
                  onChangeRowsPerPage={onChangeRowsPerPage}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>}
      </Container>
    </>
  )
};

export default ResultsTable;
