import React from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Modal from 'react-modal';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { PacmanLoader } from 'react-spinners';
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

const modalStyle = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: 'auto',
    width: '400px',
  }
};

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
        <Grid key={member.id} onClick={() => props.onClickOnTile(member.id)} style={{ cursor: 'pointer', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', KhtmlUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', userSelect: 'none' }} item>
          <Paper className={props.classes.paper} style={{ backgroundColor: tileBackgroundColor }}>
            <div style={{ textAlign: 'center' }}>
              <img alt={member.firstName} style={{ maxWidth: '170px', maxHeight: '200px', borderRadius: '4px 4px 0 0' }} src={`${config.apiEndpoint}/public/${member.avatarPath ? `avatars/${member.avatarPath}` : 'default/defaultPic.png'}`} />
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
    } else if (props.memberInModal && props.memberInModal.memberState === 'toBeArrived') {
      inAndOutButton = <MuiThemeProvider theme={theme}>
        <Button variant="contained" color="primary" size="large" onClick={props.memberInModalEnters}>
          Entrer
        </Button>
      </MuiThemeProvider>;
    } else if (props.memberInModal && props.memberInModal.memberState === 'arrived') {
      inAndOutButton = <MuiThemeProvider theme={theme}>
        <Button variant="contained" color="secondary" size="large" onClick={props.memberInModalLeaves}>
          Sortir définitivement
        </Button>
      </MuiThemeProvider>;
    } else if (props.memberInModal && props.memberInModal.memberState === 'inHoliday') {
      inAndOutButton = <Typography variant='body1' style={{ marginBottom: '50px' }}>
         {props.memberInModal.firstName} est en congé aujourd'hui
       </Typography>
    } else if (props.memberInModal && props.memberInModal.memberState === 'isOff') {
      inAndOutButton = <Typography variant='body1' style={{ marginBottom: '50px' }}>
         {props.memberInModal.firstName} est en jour off aujourd'hui
       </Typography>
    }

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
      <Modal
        isOpen={props.isModalOpen}
        onRequestClose={props.onExitTile}
        style={modalStyle}
        contentLabel="inAndOutSubmit"
        overlayClassName="Overlay"
      >
        {props.isModalOpen && <div>
          <Typography variant='headline' style={{ textAlign: 'center', paddingBottom: '10px' }} gutterBottom>
            {`${props.memberInModal.firstName} ${props.memberInModal.lastName}`}
          </Typography>
          <div style={{ display: 'flex' }}>
            <img alt={props.memberInModal.firstName} style={{ maxWidth: '170px', maxHeight: '200px', borderRadius: '4px' }} src={`${config.apiEndpoint}/public/${props.memberInModal.avatarPath ? `avatars/${props.memberInModal.avatarPath}` : 'default/defaultPic.png'}`} />
            <div style={{ textAlign: 'center', paddingTop: '20px', paddingLeft: '20px', width: '100%' }}>
              <Typography variant='title' gutterBottom>
                {props.time.format('HH:mm:ss')}
              </Typography>
              <div style={{ marginTop: '20px' }} >
                {memberTime}
                {inAndOutButton}
              </div>
            </div>
          </div>
        </div>}
      </Modal>
    </div>;
  }

  return content;
};

export default withStyles(styles)(DumbInAndOutPage);
