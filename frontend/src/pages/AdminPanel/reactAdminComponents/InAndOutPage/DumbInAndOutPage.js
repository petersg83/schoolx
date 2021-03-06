import React from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { PacmanLoader } from 'react-spinners';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import config from '../../../../config';

const styles = theme => ({
  root: {
    marginBottom: '100px',
  },
  paper: {
    height: 250,
    width: 170,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: red,
  },
});

const DumbInAndOutPage = (props) => {
  let content = null;

  if (!props.firstLoadDone) {
    content = <div style={{
      height: window.innerHeight,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <PacmanLoader color="#2196f3" />
    </div>;
  } else if (!props.isSchoolOpenToday) {
    content = <div style={{
      height: window.innerHeight,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography variant='title'>L'école est fermée aujourd'hui ({moment().format('dddd DD/MM/YYYY')})</Typography>
    </div>;
  } else {
    const memberTiles = [];
    props.members.forEach(member => {
      let tileBackgroundColor = 'white';
      switch (member.memberState) {
        case 'isOff':
        case 'inHoliday':
          tileBackgroundColor = 'grey';
          break;
        case 'arrived':
          tileBackgroundColor = '#4caf50';
          break;
        case 'left':
          tileBackgroundColor = '#ff1744';
          break;
        case 'toBeArrived':
        default:
          tileBackgroundColor = 'white';
      }

      memberTiles.push(
        <Grid key={member.id} onClick={() => props.onClickOnTile(member.id)} style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }} item>
          <Paper className={props.classes.paper} style={{ backgroundColor: tileBackgroundColor }}>
            <div style={{ textAlign: 'center' }}>
              <img alt={member.firstName} style={{ width: '170px', height: '200px', borderRadius: '4px 4px 0 0' }} src={`${config.apiEndpoint}/public/${member.avatarPath ? `avatars/${member.avatarPath}` : 'default/defaultPic.png'}`} />
              <div>
                <Typography variant='subheading'>{member.firstName}</Typography>
                {member.memberTimeText && <Typography variant='caption' gutterBottom>{member.memberTimeText}</Typography>}
              </div>
            </div>
          </Paper>
        </Grid>
      );
    });

    const memberTime = props.memberInModal &&
      props.memberInModal.memberTimeText &&
      (props.memberInModal.memberState === 'left' ||
      props.memberInModal.memberState === 'toBeArrived' ||
      props.memberInModal.memberState === 'arrived')
      ? <Typography variant='subheading' style={{ paddingBottom: '20px' }}>
          {props.memberInModal.memberTimeText}
        </Typography>
      : <span style={{ height: '44px', display: 'block' }} />;

    let inAndOutButton = null;
    if (props.memberInModal && props.memberInModal.memberState === 'left') {
      inAndOutButton = <Typography variant='body1' style={{ marginBottom: '50px' }}>
         Horaires déjà entrés pour aujourd'hui
       </Typography>
    } else if (props.memberInModal && ['toBeArrived', 'isOff'].includes(props.memberInModal.memberState)) {
      inAndOutButton = <MuiThemeProvider theme={theme}>
        <Button variant="contained" color="primary" size="large" onClick={props.memberInModalEnters}>
          Entrer
        </Button>
      </MuiThemeProvider>;
    } else if (props.memberInModal && ['arrived', 'isOff'].includes(props.memberInModal.memberState)) {
      inAndOutButton = <MuiThemeProvider theme={theme}>
        <Button variant="contained" color="secondary" size="large" onClick={props.memberInModalLeaves}>
          Sortir définitivement
        </Button>
      </MuiThemeProvider>;
    } else if (props.memberInModal && props.memberInModal.memberState === 'inHoliday') {
      inAndOutButton = <Typography variant='body1' style={{ marginBottom: '50px' }}>
         {props.memberInModal.firstName} est en congé aujourd'hui
       </Typography>
    }
    //  else if (props.memberInModal && props.memberInModal.memberState === 'isOff') {
    //   inAndOutButton = <Typography variant='body1' style={{ marginBottom: '50px' }}>
    //      {props.memberInModal.firstName} est en jour off aujourd'hui
    //    </Typography>
    // }

    content = <div>
    <Typography variant='title' style={{ marginTop: '20px', textAlign: 'center' }}>
       {props.todaySettings && props.todaySettings.schoolName}
     </Typography>
     <Typography variant='caption' style={{ marginTop: '5px', textAlign: 'center' }}>
        {props.time.format('dddd DD/MM/YYYY')} | {props.todaySettings && props.todaySettings.openAt} → {props.todaySettings && props.todaySettings.closeAt}
      </Typography>
      <Typography variant='subheading' style={{ marginTop: '5px', marginBottom: '20px', textAlign: 'center' }}>
         {props.time.format('HH:mm:ss')}
       </Typography>
      <Grid container justify="center" className={props.classes.root} spacing={16}>
        {memberTiles}
      </Grid>
      {props.memberInModal && <Dialog
        open={props.isModalOpen}
        onClose={props.onExitTile}
      >
        <DialogContent>
          <Typography variant='headline' style={{ textAlign: 'center', paddingBottom: '10px' }} gutterBottom>
            {`${props.memberInModal ? props.memberInModal.firstName : ''} ${props.memberInModal ? props.memberInModal.lastName : ''}`}
          </Typography>
          <div style={{ display: 'flex' }}>
            <img alt={props.memberInModal ? props.memberInModal.firstName : ''} style={{ width: '170px', height: '200px', borderRadius: '4px' }} src={`${config.apiEndpoint}/public/${props.memberInModal && props.memberInModal.avatarPath ? `avatars/${props.memberInModal.avatarPath}` : 'default/defaultPic.png'}`} />
            <div style={{ textAlign: 'center', padding: '20px 20px 0 20px', width: '100%' }}>
              <Typography variant='title' gutterBottom>
                {props.time.format('HH:mm:ss')}
              </Typography>
              <div style={{ marginTop: '20px' }} >
                {memberTime}
                {inAndOutButton}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>}
    </div>;
  }

  return content;
};

export default withStyles(styles)(DumbInAndOutPage);
