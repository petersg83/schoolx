import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import red from '@material-ui/core/colors/red';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    width: '215px',
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
});

const DumbCancelSubscriptionForm = (props) => <div>
  <Typography style={{ marginTop: '20px' }} variant="title" gutterBottom>Mettre fin à votre abonnement</Typography>
  <Typography>
    Quand vous le voulez vous pouvez mettre fin à votre abonnement, vous serez remboursé des jours d'abonnement restants.<br />
  </Typography>
  <FormControl className={props.classes.formControl}>
    <Button type="submit" className={props.classes.button} variant="contained" color="primary" onClick={props.onEndSubcriptionClick}>
      {!props.loading && "Arrêter l'abonnement"}
      {props.loading && <CircularProgress size={24} />}
    </Button>
  </FormControl>
  <Dialog
    open={props.isEndingModalOpen}
    onClose={props.onExitEndingModal}
  >
    <DialogContent>
      <Typography variant='subheading' style={{ textAlign: 'center', paddingBottom: '1.5rem' }} gutterBottom>
        Mettre fin à votre abonnement ClickIn aujourd'hui ?
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <Button variant="contained" color="secondary" size="small" onClick={props.onValidateEndingClick}>
        Oui
      </Button>
      <Button size="small" onClick={props.onExitEndingModal}>
        Annuler
      </Button>
      </div>
    </DialogContent>
  </Dialog>
</div>

export default withStyles(styles)(DumbCancelSubscriptionForm);
