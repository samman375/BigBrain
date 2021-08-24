import React from 'react';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    width: '100%'
  },
}));

const PageHeader = (props) => {
  const classes = useStyles();
  return (
     <div className={classes.heroContent}>
      <Container maxWidth="sm" align='center'>
        <Typography component="h1" variant="h2" color="textPrimary" gutterBottom>
         {props.title}
        </Typography>
        {props.subTitle && props.subTitle}
      </Container>
    </div>
  )
}

PageHeader.propTypes = {
  subTitle: PropTypes.node,
  title: PropTypes.string
}

export default PageHeader;
