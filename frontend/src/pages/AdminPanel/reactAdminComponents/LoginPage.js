import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLogin, Notification } from 'react-admin';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

document.body.style.margin = "0px";

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'url(background_plants.jpg)',
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

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      showLoading: false
    };
  }
  onEmailChange = (e) => {
    this.setState({ login: e.target.value })
  }

  onPasswordChange = (e) => {
    this.setState({ password: e.target.value })
  }

  submit = (e) => {
    e.preventDefault();
    // gather your data/credentials here
    const credentials = {
      login: this.state.login,
      password: this.state.password
    };

    // Dispatch the userLogin action (injected by connect)
    this.props.userLogin(credentials);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.admin.loading && !prevState.showLoading) {
      return { loadingStart: new Date(), showLoading: true }
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { admin: { loading: prevLoading } } = prevProps;
    const { admin: { loading } } = this.props;
    // Loadng has stopped
    if (prevLoading && !loading ) {
      const loadingTime = moment.duration(this.state.loadingStart - new Date());
      const remainingTime = loadingTime.asMilliseconds() > 500 ? 0 : 500 - loadingTime.asMilliseconds();
      setTimeout(() => {
        this.setState({ showLoading: false });
      }, remainingTime)
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.main}>
        <form onSubmit={this.submit}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="headline" component="h2">
                Login
              </Typography>
              <TextField onChange={this.onEmailChange} name="login" className={classes.textField} type="email" placeholder="Email" required />
              <br />
              <TextField onChange={this.onPasswordChange} name="password" className={classes.textField} type="password" placeholder="Password" required />
              <br />
              <br />
              {this.state.showLoading
                ? <CircularProgress className={classes.progress} />
                : <Button variant="contained" color="primary" className={classes.button} type="submit">
                  Login
                  </Button>
              }
            </CardContent>
          </Card>
        </form>
        <div className={classes.credits}>
          <Typography gutterBottom component="p" variant="body1" className={classes.p}>
            Photo by Nahil Naseer on Unsplash
          </Typography>
        </div>
        <Notification />
      </div>
    );
  }
};

const StyledLogin = withStyles(styles)(LoginPage);

export default connect(state => ({
  admin: state.admin
}), { userLogin })(StyledLogin);