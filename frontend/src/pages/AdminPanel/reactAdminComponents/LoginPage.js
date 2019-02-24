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
import config from '../../../config';

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
  },
  inandoutLink: {
    marginTop: '20px',
  },
  link: {
    color: '#3f51b5',
    textDecoration: 'none',
  },
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      showLoading: false,
      schoolName: '',
    };
    this.timeouts = [];
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
      username: this.state.login,
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

  componentDidMount() {
    fetch(`${config.apiEndpoint}/getSchoolName`, {
      headers: new Headers({
        "access-control-allow-origin": config.domainName ? `*.${config.domainName}` : '*',
      }),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error('Aucune école trouvée pour cette url');
      }
    })
    .then((res) => {
      this.setState({ schoolName: res.schoolName });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  componentWillUnmount() {
    this.timeouts.forEach((to) => clearTimeout(to));
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { admin: { loading: prevLoading } } = prevProps;
    const { admin: { loading } } = this.props;
    // Loadng has stopped
    if (prevLoading && !loading) {
      const loadingTime = moment.duration(this.state.loadingStart - new Date());
      const remainingTime = loadingTime.asMilliseconds() > 500 ? 0 : 500 - loadingTime.asMilliseconds();
      this.timeouts.push(setTimeout(() => { this.setState({ showLoading: false }) }, remainingTime));
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
                Connexion
              </Typography>
              <Typography variant="subheading" gutterBottom>
                {this.state.schoolName || "Aucune école ne correspond à cette url"}
              </Typography>
              {this.state.schoolName && <div>
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
                {this.state.schoolName && <div>
                  <Typography className={classes.inandoutLink}>
                    <a href="/#/inandout" className={classes.link}>
                      Page d'entrées/sorties
                    </a>
                  </Typography>
                </div>}
              </div>}
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
