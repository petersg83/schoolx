import React from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Modal from 'react-modal';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import config from '../../../../config';

const styles = theme => ({
  root: {
    marginTop: '100px',
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

const DumbIntAndOutPage = (props) => {
  const memberTiles = props.members.map(member => (
    <Grid key={member.id} onClick={() => props.onClickOnTile(member.id)} style={{ cursor: 'pointer' }} item>
      <Paper className={props.classes.paper} style={{
        backgroundColor: member.memberState === 'toBeArrived'
          ? 'white'
          :  member.memberState === 'arrived'
            ? '#4caf50'
            : '#ff1744',
        color: member.memberState === 'left' ? 'white' : 'black',
      }} >
        <div style={{ textAlign: 'center' }}>
          <img alt={member.firstName} style={{ maxWidth: '170px', maxHeight: '200px', borderRadius: '4px 4px 0 0' }} src={`${config.apiEndpoint}/public/${member.avatarPath ? `avatars/${member.avatarPath}` : 'default/defaultPic.png'}`} />
          <Typography variant='subheading'>{member.firstName}</Typography>
          <Typography variant='caption' gutterBottom>{member.memberTimeText}</Typography>
        </div>
      </Paper>
    </Grid>
  ));

  const memberTime = props.memberInModal && props.memberInModal.memberTimeText
    ? <Typography variant='subheading' style={{ paddingBottom: '20px' }}>
        {props.memberInModal.memberTimeText}
      </Typography>
    : <span style={{ height: '44px', display: 'block' }} />;

  let inAndOutButton = null;
  if (props.memberInModal && props.memberInModal.memberState === 'left') {
    inAndOutButton = <Typography variant='body1' style={{ marginBottom: '50px' }}>
       Horaires déjà entrés pour aujourd'hui
     </Typography>
  } else if (props.memberInModal) {
    inAndOutButton = <MuiThemeProvider theme={theme}>
      <Button variant="contained" color={props.memberInModal.memberState === 'toBeArrived' ? 'primary' : 'secondary'} size="large">
        {props.memberInModal.memberState === 'toBeArrived' ? 'Entrer' : 'Sortir définitivement'}
      </Button>
    </MuiThemeProvider>;
  }

  return (
    <div>
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
    </div>
  );
};

export default withStyles(styles)(DumbIntAndOutPage);
