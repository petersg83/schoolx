import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 450,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 5}px ${theme.spacing.unit * 3}px`,
    margin: `${theme.spacing.unit * 8}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 0}px`,
  },
});

const DumbAfterSubscription = (props) => {
  const { classes } = props;

  let gifLink = '';
  let titleText = '';
  let contentText = '';

  if (props.state === 'success') {
    gifLink = 'https://i.giphy.com/media/XbxZ41fWLeRECPsGIJ/giphy.webp';
    titleText = 'Paiement validé avec succès !';
    contentText = <span>
      Merci pour le soutien que vous apportez à ce projet :)<br />
      En espérant que vous allez continuer à apprécier l'application !<br />
      <br />
      A bientôt,<br />
      Pierre
    </span>;
  } else if (props.state === 'cancelled') {
    gifLink = 'https://i.giphy.com/media/6b9VPgyqFFCN2wVqFD/giphy.webp';
    titleText = 'Paiement annulé !';
    contentText = <span>
      Vous avez rencontré un soucis ? N'hésitez pas à me contacter à contact@pierre-noel.fr :)<br />
      Vous ne voulez pas vous abonner ? Pas de soucis :)<br />
      <br />
      A bientôt,<br />
      Pierre
    </span>;
  }

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Typography component="h1" variant="title">
          {titleText}
        </Typography>
        <img alt="thankyou" style={{ maxWidth: "300px", maxHeight: "250px", marginTop: '20px' }} src={gifLink} />
        <Typography style={{ marginTop: '30px' }}>
          {contentText}
        </Typography>
        <Button variant="contained" href="/#/subscription" color="primary" size="medium" className={classes.button}>
          Retourner à l'application
        </Button>
      </Paper>
    </main>
  );
}

DumbAfterSubscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DumbAfterSubscription);
