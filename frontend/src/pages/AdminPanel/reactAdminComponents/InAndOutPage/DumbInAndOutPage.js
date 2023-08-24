import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import Button from '@mui/material/Button';
import moment from 'moment';
import { PacmanLoader } from 'react-spinners';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import config from '../../../../config';

const styles = {
  root: {
    paddingBottom: '100px',
  },
  paper: {
    height: 255,
    width: 170,
  },
};

const theme = createTheme({
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
      <Typography variant='h6'>L'école est fermée aujourd'hui ({moment().format('dddd DD/MM/YYYY')})</Typography>
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
        <Grid key={member.id} onClick={() => props.onClickOnTile(member.id)} sx={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }} item>
          <Paper className={props.classes.paper} sx={{ backgroundColor: tileBackgroundColor }}>
            <div style={{ textAlign: 'center' }}>
              <img alt={member.firstName} style={{ width: '170px', height: '200px', borderRadius: '4px 4px 0 0' }} src={`${config.apiEndpoint}/public/${member.avatarPath ? `avatars/${member.avatarPath}` : 'default/defaultPic.png'}`} />
              <div>
                <Typography variant='subtitle1' sx={{ fontWeight: 500, lineHeight: 1.2 }}>{member.firstName}</Typography>
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
      ? <Typography variant='subtitle2' sx={{ paddingBottom: '20px' }}>
          {props.memberInModal.memberTimeText}
        </Typography>
      : <span style={{ height: '44px', display: 'block' }} />;

    let inAndOutButton = null;
    if (props.memberInModal && props.memberInModal.memberState === 'left') {
      inAndOutButton = <Typography variant='body1' sx={{ marginBottom: '50px' }}>
         Horaires déjà entrés pour aujourd'hui
       </Typography>
    } else if (props.memberInModal && ['toBeArrived', 'isOff'].includes(props.memberInModal.memberState)) {
      inAndOutButton = <ThemeProvider theme={theme}>
        <Button variant="contained" color="primary" size="large" onClick={props.memberInModalEnters}>
          Entrer
        </Button>
      </ThemeProvider>;
    } else if (props.memberInModal && ['arrived', 'isOff'].includes(props.memberInModal.memberState)) {
      inAndOutButton = <ThemeProvider theme={theme}>
        <Button variant="contained" color="secondary" size="large" onClick={props.memberInModalLeaves}>
          Sortir définitivement
        </Button>
      </ThemeProvider>;
    } else if (props.memberInModal && props.memberInModal.memberState === 'inHoliday') {
      inAndOutButton = <Typography variant='body1' sx={{ marginBottom: '50px' }}>
         {props.memberInModal.firstName} est en congé aujourd'hui
       </Typography>
    }

    content = <div style={{ textAlign: 'center' }}>
      <Typography variant='h4' sx={{ paddingTop: '20px' }}>
        {props.todaySettings && props.todaySettings.schoolName}
      </Typography>
      <Typography variant='caption' sx={{ marginTop: '5px' }}>
          {props.time.format('dddd DD/MM/YYYY')} | {props.todaySettings && props.todaySettings.openAt} → {props.todaySettings && props.todaySettings.closeAt}
        </Typography>
        <Typography variant='h5' sx={{ marginTop: '5px', marginBottom: '20px' }}>
          {props.time.format('HH:mm:ss')}
        </Typography>
        <Grid container justifyContent="center" className={props.classes.root} spacing={2}>
          {memberTiles}
        </Grid>
        {props.memberInModal && <Dialog
          open={props.isModalOpen}
          onClose={props.onExitTile}
        >
          <DialogContent>
            <Typography variant='h5' sx={{ textAlign: 'center', paddingBottom: '10px' }} gutterBottom>
              {`${props.memberInModal ? props.memberInModal.firstName : ''} ${props.memberInModal ? props.memberInModal.lastName : ''}`}
            </Typography>
            <div style={{ display: 'flex' }}>
              <img alt={props.memberInModal ? props.memberInModal.firstName : ''} style={{ width: '170px', height: '200px', borderRadius: '4px' }} src={`${config.apiEndpoint}/public/${props.memberInModal && props.memberInModal.avatarPath ? `avatars/${props.memberInModal.avatarPath}` : 'default/defaultPic.png'}`} />
              <div style={{ textAlign: 'center', padding: '20px 20px 0 20px', width: '100%' }}>
                <Typography variant='h6' gutterBottom>
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
