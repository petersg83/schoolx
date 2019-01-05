import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';


document.body.style.margin = "0px";

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'url(beach.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  card: {
    minWidth: 300,
    maxWidth: 450,
    display: 'flex',
    flex: 1,
    margin: 'auto',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: '20vh'
  },
  cardContent: {
    margin: '5px',
    width: '100%'
  },
  textField: {
    width: '100%',
    marginTop: '0.8em'
  },
  p: {
    position: 'relative',
    left: '-50%',
    color: 'white'
  },
  credits: {
    position: 'absolute',
    bottom: '0px',
    left: '50%'
  }
};

const DumbInAndOutAccessPage = (props) => {
  const classes = props.classes;
  return (
    <div className={classes.main}>
      <form onSubmit={props.onSubmit}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="headline" component="h2">
              Accès entrées/sorties
            </Typography>
            <Typography variant="subheading" gutterBottom>
              {props.schoolName || "Aucune école ne correspond à cette url"}
            </Typography>
            {props.schoolName && <div>
              <TextField
                onChange={e => props.onCodeChange(e.target.value)}
                value={props.code}
                className={classes.textField}
                type="password"
                placeholder="Code"
                error={!!props.errors.code}
                helperText={props.errors.code}
                required
              />
              <br />
              <br />
              {props.showLoading
                ? <CircularProgress className={classes.progress} />
                : <Button variant="contained" color="primary" className={classes.button} type="submit">
                Accéder
                </Button>
              }
            </div>}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default withStyles(styles)(DumbInAndOutAccessPage);
