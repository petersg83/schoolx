import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    marginTop: '100px',
    marginBottom: '100px',
  },
  paper: {
    height: 200,
    width: 150,
  },
});

const DumbIntAndOutPage = (props) => {

  return (
    <Grid container justify="center" className={props.classes.root} spacing={16}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(value => (
        <Grid key={value} item>
          <Paper className={props.classes.paper}>
            <p>je suis le membre</p>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default withStyles(styles)(DumbIntAndOutPage);
