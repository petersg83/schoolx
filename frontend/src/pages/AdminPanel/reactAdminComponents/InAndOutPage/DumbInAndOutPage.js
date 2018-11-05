import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import config from '../../../../config';

const styles = theme => ({
  root: {
    marginTop: '100px',
    marginBottom: '100px',
  },
  paper: {
    height: 230,
    width: 150,
  },
});

const DumbIntAndOutPage = (props) => {

  const memberTiles = props.members.map(member => (
    <Grid key={member.id} item>
      <Paper className={props.classes.paper}>
        <div style={{ textAlign: 'center' }}>
          <img alt={member.firstName} style={{ maxWidth: '150px', maxHeight: '200px', borderRadius: '4px 4px 0 0' }} src={`${config.apiEndpoint}/public/${member.avatarPath ? `avatars/${member.avatarPath}` : 'default/defaultPic.png'}`} />
          <Typography variant='subheading' gutterBottom>{member.firstName}</Typography>
        </div>
      </Paper>
    </Grid>
  ));

  return (
    <Grid container justify="center" className={props.classes.root} spacing={16}>
      {memberTiles}
    </Grid>
  );
};

export default withStyles(styles)(DumbIntAndOutPage);
