import { useEffect, useState } from 'react';
import { useAuthProvider, useLogin, useNotify, Notification } from 'react-admin';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { withStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
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

function LoginPage(props) {
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();
  // const authProvider = useAuthProvider();

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = e => {
      e.preventDefault();
      login({ email, password }).catch(() =>
          notify('Invalid email or password')
      );
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (e) {
      notify('Invalid email or password');
    }
    setIsLoading(false);
  }

  useEffect(() => {
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
      setSchoolName(res.schoolName);
    })
    .catch((e) => {
      console.log(e);
    });
  }, []);


  const { classes } = props;
  return (
    <div className={classes.main}>
      <form onSubmit={submit}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="headline" component="h2">
              Connexion
            </Typography>
            <Typography variant="subheading" gutterBottom>
              {schoolName || "Aucune école ne correspond à cette url"}
            </Typography>
            {schoolName && <div>
              <TextField onChange={onEmailChange} name="login" className={classes.textField} type="email" placeholder="Email" value={email} required />
              <br />
              <TextField onChange={onPasswordChange} name="password" className={classes.textField} type="password" placeholder="Password" value={password} required />
              <br />
              <br />
              {isLoading
                ? <CircularProgress className={classes.progress} />
                : <Button variant="contained" color="primary" className={classes.button} type="submit">
                Login
                </Button>
              }
              {schoolName && <div>
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
      {false && <div className={classes.credits}>
        <Typography gutterBottom component="p" variant="body1" className={classes.p}>
          Photo by Nahil Naseer on Unsplash
        </Typography>
      </div>}
      <Notification />
    </div>
  );
};

const StyledLogin = withStyles(styles)(LoginPage);

export default StyledLogin;
