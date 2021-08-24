import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'
import React from 'react';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  container: {
    background: theme.palette.background.paper,
    padding: theme.spacing(6, 0),
    maxWidth: '100%'
  }
}));
const ResultsHeader = () => {
  const classes = useStyles()
  return (
  <Container align='center' className={classes.container}>
    <Typography component='h1' variant='h2'>
      Quiz Results
    </Typography>
  </Container>
  )
}

export default ResultsHeader;
